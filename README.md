# LuxMarket (React + FastAPI + Stripe)

LuxMarket is a fashion marketplace demo with a React frontend and a Python FastAPI backend that creates Stripe Checkout sessions.

## UI System

- Primary: `#111111`
- Secondary accent: `#C9A227`
- Neutral background/surfaces: `#F7F7F5`, `#FFFFFF`
- Border/text neutrals: `#E5E5E0`, `#2A2A2A`
- Spacing scale: `8/16/24/32/48/64`

Layout follows a commerce-first structure: sticky top nav, 60/40 hero split, trust strip, 3/2/1 product grid, step-like checkout, and compact 3-column footer.

## Stack

- Frontend: React, Vite, React Bootstrap
- Backend: FastAPI, Stripe Python SDK
- Payments: Stripe Checkout + webhook callback

## Prerequisites

- Node.js 20+
- Python 3.10+
- Stripe account and test API keys
- (Optional) Stripe CLI for local webhook testing

## Local Setup

### 1) Install frontend dependencies

```bash
npm install
```

### 2) Setup backend environment

```bash
cd server
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
```

Update `server/.env`:

- `STRIPE_SECRET_KEY=sk_test_...`
- `STRIPE_WEBHOOK_SECRET=whsec_...` (required for webhook endpoint)
- `FRONTEND_URL=http://localhost:5173`

### 3) Start backend

```bash
cd server
.venv\Scripts\activate
uvicorn main:app --reload --port 8000
```

### 4) Start frontend

```bash
npm run dev
```

### 5) Optional: start Stripe webhook forwarding

```bash
stripe listen --forward-to localhost:8000/api/webhooks/stripe
```

Copy the returned signing secret into `STRIPE_WEBHOOK_SECRET`.

## Environment Variables

### Frontend (`.env.local`)

`VITE_API_BASE_URL` is optional in local dev because `vite.config.js` proxies `/api` to `http://127.0.0.1:8000`.

Use it in production deployments where frontend and backend are on different origins:

```bash
VITE_API_BASE_URL=https://your-api-domain.com
```

### Backend (`server/.env`)

- `STRIPE_SECRET_KEY`: Stripe secret API key
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret
- `FRONTEND_URL`: checkout return domain (success/cancel URLs)

## Sanity Checks

- Frontend opens at `http://localhost:5173`
- API health returns OK: `http://127.0.0.1:8000/api/health`
- Checkout verification endpoint works: `http://127.0.0.1:8000/api/checkout/session-status?session_id=...`
- Checkout button redirects to Stripe test checkout
- Success URL returns to `/payout/success?session_id=...` and UI verifies payment status before confirming success.

## Useful Scripts

- `npm run dev` - start frontend dev server
- `npm run lint` - run ESLint
- `npm run test:smoke` - run frontend + backend smoke checks
- `node scripts/dump-catalog.mjs` - regenerate `server/catalog.json` from `src/data.js`

## Security Checklist

- Serve API over HTTPS in production.
- Store Stripe keys in a secret manager, never in source control.
- Restrict CORS to your exact production frontend domain(s).
- Add rate limiting to payment and webhook routes.
- Keep webhook event IDs persisted to prevent duplicate processing.
