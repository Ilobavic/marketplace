import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function Payout({ total, onBack }) {
  const [status, setStatus] = useState('idle');
  const [reference] = useState(() => `LM-${Math.floor(100000 + Math.random() * 900000)}`);

  const formattedTotal = total ? `NGN ${total.toLocaleString()}` : 'NGN 0';

  const handleConfirm = () => {
    setStatus('processing');
    setTimeout(() => setStatus('confirmed'), 900);
  };

  return (
    <div className="payout-card">
      <button type="button" className="link-back" onClick={onBack}>
        ← Back to cart
      </button>
      <div className="payout-grid">
        <div>
          <p className="eyebrow">Checkout</p>
          <h2>Confirm your payment</h2>
          <p className="detail-desc">
            Use the demo payout to simulate a successful payment. No real charges are made.
          </p>

          <div className="payout-summary">
            <div>
              <span>Order total</span>
              <strong>{formattedTotal}</strong>
            </div>
            <div>
              <span>Reference</span>
              <strong>{reference}</strong>
            </div>
          </div>

          <Form className="payout-form">
            <Form.Group className="mb-3">
              <Form.Label>Card number</Form.Label>
              <Form.Control placeholder="4242 4242 4242 4242" />
            </Form.Group>
            <div className="payout-row">
              <Form.Group>
                <Form.Label>Expiry</Form.Label>
                <Form.Control placeholder="MM/YY" />
              </Form.Group>
              <Form.Group>
                <Form.Label>CVC</Form.Label>
                <Form.Control placeholder="123" />
              </Form.Group>
            </div>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control placeholder="hello@luxmarket.com" type="email" />
            </Form.Group>
          </Form>
        </div>

        <div className="payout-panel">
          <h4>Payment status</h4>
          <p className="status-text" aria-live="polite">
            {status === 'idle' && 'Ready to confirm.'}
            {status === 'processing' && 'Processing your payment...'}
            {status === 'confirmed' && 'Payment confirmed. Receipt sent.'}
          </p>
          {status === 'processing' && <div className="uiverse-loader" aria-hidden="true" />}
          <div className={`status-badge ${status}`}>
            {status === 'confirmed' ? 'Confirmed' : status === 'processing' ? 'Processing' : 'Awaiting confirmation'}
          </div>
          <Button
            variant="dark"
            size="lg"
            className="w-100 pill-btn"
            onClick={handleConfirm}
            disabled={status === 'processing' || status === 'confirmed'}
          >
            {status === 'confirmed' ? 'Payment complete' : 'Confirm payment'}
          </Button>
          <small className="status-note">Demo only — no real transaction.</small>
        </div>
      </div>
    </div>
  );
}
