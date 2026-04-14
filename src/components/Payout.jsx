import React, { useMemo, useState } from 'react';
import { Alert, Button, Form, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';

function resolveApiBase() {
  if (configuredApiBase) {
    return configuredApiBase.replace(/\/$/, '');
  }
  return '';
}

export default function Payout({ cartItems, onBack }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');

  const total = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const formattedTotal = total ? `NGN ${total.toLocaleString()}` : 'NGN 0';
  const apiBase = resolveApiBase();
  const isProdWithoutApiBase = import.meta.env.PROD && !apiBase;

  const handleStripeCheckout = async () => {
    setError('');
    if (!cartItems.length) {
      setError('Your cart is empty. Add something before paying.');
      return;
    }
    setStatus('loading');
    try {
      if (isProdWithoutApiBase) {
        throw new Error(
          'VITE_API_BASE_URL is not configured for production. Set it to your backend origin.'
        );
      }
      const res = await fetch(`${apiBase}/api/checkout/create-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems.map((item) => ({ id: item.id, quantity: item.quantity })),
          customer_email: email.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.detail || res.statusText || 'Checkout failed');
      }
      if (!data.url) {
        throw new Error('No checkout URL returned from server');
      }
      window.location.assign(data.url);
    } catch (e) {
      setStatus('idle');
      setError(e instanceof Error ? e.message : 'Something went wrong');
    }
  };

  if (!cartItems.length) {
    return (
      <div className="payout-card">
        <button type="button" className="link-back" onClick={onBack}>
          &larr; Back to cart
        </button>
        <p className="eyebrow">Checkout</p>
        <h2>Your cart is empty</h2>
        <p className="detail-desc">Add items to your cart before starting Stripe checkout.</p>
        <Button as={Link} to="/" variant="dark" className="pill-btn">
          Browse shop
        </Button>
      </div>
    );
  }

  return (
    <div className="payout-card">
      <button type="button" className="link-back" onClick={onBack}>
        &larr; Back to cart
      </button>
      <div className="payout-grid">
        <div>
          <p className="eyebrow">Checkout</p>
          <h2>Pay with Stripe</h2>
          <p className="detail-desc">
            You will be redirected to Stripe's secure checkout. Totals are confirmed on the server so prices
            match our catalog.
          </p>

          <div className="payout-summary">
            <div>
              <span>Order total</span>
              <strong>{formattedTotal}</strong>
            </div>
            <div>
              <span>Items</span>
              <strong>{cartItems.reduce((n, i) => n + i.quantity, 0)}</strong>
            </div>
          </div>

          <Form className="payout-form">
            <Form.Group className="mb-3">
              <Form.Label>Email (optional)</Form.Label>
              <Form.Control
                type="email"
                placeholder="hello@luxmarket.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <Form.Text className="text-muted">Prefills your receipt on Stripe.</Form.Text>
            </Form.Group>
          </Form>
          {error && (
            <Alert variant="warning" className="mb-3">
              {error}
            </Alert>
          )}
        </div>

        <div className="payout-panel">
          <h4>Secure payment</h4>
          <p className="status-text" aria-live="polite">
            {status === 'loading'
              ? 'Opening Stripe checkout...'
              : 'Ready - we use Stripe Checkout in your browser.'}
          </p>
          {status === 'loading' && (
            <div className="d-flex justify-content-center my-3" aria-hidden="true">
              <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading</span>
              </Spinner>
            </div>
          )}
          <Button
            variant="dark"
            size="lg"
            className="w-100 pill-btn"
            onClick={handleStripeCheckout}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Redirecting...' : 'Continue to Stripe'}
          </Button>
          <small className="status-note d-block mt-2">
            Test cards: see{' '}
            <a href="https://stripe.com/docs/testing" target="_blank" rel="noreferrer">
              Stripe testing docs
            </a>
            .
          </small>
        </div>
      </div>
    </div>
  );
}
