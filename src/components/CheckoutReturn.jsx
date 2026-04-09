import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';

export function PayoutSuccess() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');

  return (
    <div className="payout-card">
      <p className="eyebrow">Checkout</p>
      <h2>Payment received</h2>
      <p className="detail-desc">
        Thanks for shopping with LuxMarket. You will get a receipt from Stripe by email when the payment
        clears.
      </p>
      {sessionId && (
        <p className="text-muted small mb-4">
          Reference: <code>{sessionId}</code>
        </p>
      )}
      <Button as={Link} to="/" variant="dark" className="pill-btn">
        Back to shop
      </Button>
    </div>
  );
}

export function PayoutCancel() {
  return (
    <div className="payout-card">
      <p className="eyebrow">Checkout</p>
      <h2>Payment canceled</h2>
      <p className="detail-desc">
        No charge was made. Your cart is still saved in this browser session — you can try again whenever you
        are ready.
      </p>
      <div className="d-flex flex-wrap gap-2">
        <Button as={Link} to="/cart" variant="dark" className="pill-btn">
          Return to cart
        </Button>
        <Button as={Link} to="/" variant="outline-dark" className="pill-btn">
          Keep browsing
        </Button>
      </div>
    </div>
  );
}
