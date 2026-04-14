import sys
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi.testclient import TestClient


ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import main  # noqa: E402


class ApiSmokeTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(main.app)
        main.init_webhook_db()

    def test_health_endpoint(self):
        response = self.client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        self.assertIn("ok", response.json())

    def test_create_checkout_session_uses_catalog_prices(self):
        payload = {"items": [{"id": 1, "quantity": 2}]}
        fake_session = type("Session", (), {"url": "https://stripe.test/session", "id": "cs_test_123"})()

        with patch.object(main.stripe.checkout.Session, "create", return_value=fake_session) as mocked_create:
            main.stripe.api_key = "sk_test_mock"
            response = self.client.post("/api/checkout/create-session", json=payload)

        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertEqual(body["id"], "cs_test_123")
        self.assertIn("url", body)

        kwargs = mocked_create.call_args.kwargs
        line_items = kwargs["line_items"]
        self.assertEqual(line_items[0]["quantity"], 2)
        # Product id=1 in catalog is NGN 180000 -> 18000000 kobo
        self.assertEqual(line_items[0]["price_data"]["unit_amount"], 18000000)

    def test_webhook_duplicate_event_is_ignored(self):
        main.WEBHOOK_SECRET = "whsec_mock"
        event = {
            "id": "evt_test_duplicate",
            "type": "checkout.session.completed",
            "data": {"object": {"id": "cs_test", "payment_status": "paid"}},
        }
        headers = {"stripe-signature": "mocked-signature"}

        with patch.object(main.stripe.Webhook, "construct_event", return_value=event):
            first = self.client.post("/api/webhooks/stripe", data=b"{}", headers=headers)
            second = self.client.post("/api/webhooks/stripe", data=b"{}", headers=headers)

        self.assertEqual(first.status_code, 200)
        self.assertEqual(second.status_code, 200)
        self.assertEqual(second.json().get("duplicate"), True)


if __name__ == "__main__":
    unittest.main()
