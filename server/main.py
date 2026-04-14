"""
LuxMarket checkout API - Stripe Checkout Sessions + webhook handler.

Run (from repo root):
  cd server
  python -m venv .venv
  .venv\\Scripts\\activate   # Windows
  pip install -r requirements.txt
  copy .env.example .env    # then fill keys
  uvicorn main:app --reload --port 8000

Stripe CLI for local webhooks:
  stripe listen --forward-to localhost:8000/api/webhooks/stripe
"""

from __future__ import annotations

import json
import logging
import os
import sqlite3
import time
from pathlib import Path

import stripe
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator, EmailStr

load_dotenv(Path(__file__).resolve().parent / ".env")

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")
WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173").rstrip("/")

CATALOG_PATH = Path(__file__).resolve().parent / "catalog.json"
WEBHOOK_DB_PATH = Path(
    os.environ.get("WEBHOOK_EVENT_DB", Path(__file__).resolve().parent / "webhook_events.db")
)
WEBHOOK_EVENT_TTL_SECONDS = int(os.environ.get("WEBHOOK_EVENT_TTL_SECONDS", str(30 * 24 * 60 * 60)))
logger = logging.getLogger("luxmarket.api")
logging.basicConfig(level=logging.INFO)


def load_catalog() -> dict[int, dict]:
    if not CATALOG_PATH.is_file():
        raise RuntimeError(f"Missing catalog: {CATALOG_PATH}")
    raw = json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
    return {int(p["id"]): {"name": str(p["name"]), "price": int(p["price"])} for p in raw}


CATALOG = load_catalog()


def _is_stripe_exception(exc: BaseException) -> bool:
    mod = getattr(exc.__class__, "__module__", "") or ""
    return mod.startswith("stripe")


def naira_to_stripe_amount(naira: int) -> int:
    """NGN uses kobo; Stripe expects smallest currency unit."""
    return int(naira) * 100


class CartLineIn(BaseModel):
    product_id: int = Field(alias="id")
    quantity: int = Field(ge=1, le=99)

    model_config = {"populate_by_name": True}


class CreateCheckoutBody(BaseModel):
    items: list[CartLineIn]
    customer_email: EmailStr | None = None

    @field_validator("customer_email")
    @classmethod
    def strip_email(cls, v: EmailStr | None) -> EmailStr | None:
        if v is None:
            return None
        s = v.strip()
        return s or None


app = FastAPI(title="LuxMarket API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Stripe-Signature"],
)


@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response: Response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("X-Frame-Options", "DENY")
    return response


def init_webhook_db() -> None:
    WEBHOOK_DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    with sqlite3.connect(WEBHOOK_DB_PATH) as con:
        con.execute(
            """
            CREATE TABLE IF NOT EXISTS processed_events (
                id TEXT PRIMARY KEY,
                received_at INTEGER NOT NULL
            )
            """
        )
        con.execute("CREATE INDEX IF NOT EXISTS idx_processed_events_received_at ON processed_events(received_at)")
        con.commit()


def cleanup_old_webhook_events(now_ts: int) -> None:
    cutoff = now_ts - WEBHOOK_EVENT_TTL_SECONDS
    with sqlite3.connect(WEBHOOK_DB_PATH) as con:
        con.execute("DELETE FROM processed_events WHERE received_at < ?", (cutoff,))
        con.commit()


def mark_webhook_event_seen(event_id: str, now_ts: int) -> bool:
    """
    Returns True when event is newly seen, False when duplicate.
    """
    with sqlite3.connect(WEBHOOK_DB_PATH) as con:
        cur = con.execute(
            "INSERT OR IGNORE INTO processed_events(id, received_at) VALUES(?, ?)",
            (event_id, now_ts),
        )
        con.commit()
        return cur.rowcount == 1


init_webhook_db()


@app.get("/api/health")
def health():
    return {"ok": True, "stripe_configured": bool(stripe.api_key)}


@app.post("/api/checkout/create-session")
def create_checkout_session(body: CreateCheckoutBody):
    if not stripe.api_key:
        raise HTTPException(
            status_code=503,
            detail="Stripe is not configured. Set STRIPE_SECRET_KEY in server/.env",
        )
    if not body.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    line_items: list[dict] = []
    for line in body.items:
        product = CATALOG.get(line.product_id)
        if not product:
            raise HTTPException(status_code=400, detail=f"Unknown product id: {line.product_id}")
        unit = naira_to_stripe_amount(product["price"])
        line_items.append(
            {
                "quantity": line.quantity,
                "price_data": {
                    "currency": "ngn",
                    "unit_amount": unit,
                    "product_data": {
                        "name": product["name"],
                    },
                },
            }
        )

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=line_items,
            success_url=f"{FRONTEND_URL}/payout/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_URL}/payout/cancel",
            customer_email=body.customer_email,
            billing_address_collection="required",
        )
    except Exception as e:
        if _is_stripe_exception(e):
            msg = getattr(e, "user_message", None) or str(e)
            raise HTTPException(status_code=502, detail=msg) from e
        raise

    return {"url": session.url, "id": session.id}


@app.post("/api/webhooks/stripe")
async def stripe_webhook(request: Request):
    if not WEBHOOK_SECRET:
        raise HTTPException(
            status_code=503,
            detail="Webhook secret not set. Add STRIPE_WEBHOOK_SECRET or use Stripe CLI.",
        )
    payload = await request.body()
    sig = request.headers.get("stripe-signature")
    if not sig:
        raise HTTPException(status_code=400, detail="Missing stripe-signature header")

    try:
        event = stripe.Webhook.construct_event(payload=payload, sig_header=sig, secret=WEBHOOK_SECRET)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid payload") from e
    except Exception as e:
        if type(e).__name__ == "SignatureVerificationError":
            raise HTTPException(status_code=400, detail="Invalid signature") from e
        raise

    event_id = event.get("id")
    now_ts = int(time.time())
    if event_id:
        if not mark_webhook_event_seen(event_id, now_ts):
            return {"received": True, "duplicate": True}
        cleanup_old_webhook_events(now_ts)

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        # Extend: mark order paid, send email, etc.
        logger.info(
            "checkout.session.completed id=%s payment_status=%s",
            session.get("id"),
            session.get("payment_status"),
        )

    return {"received": True}
