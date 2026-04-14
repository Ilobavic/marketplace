import React, { useEffect } from 'react';
import { useState } from 'react';
import { Button } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';

const configuredApiBase = import.meta.env.VITE_API_BASE_URL?.trim() ?? '';
const apiBase = configuredApiBase ? configuredApiBase.replace(/\/$/, '') : '';

export function PayoutSuccess({ onClearCart }) {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id');
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!sessionId) {
      setStatus('invalid');
      return;
    }
    const controller = new AbortController();

    const verifySession = async () => {
      try {
        const res = await fetch(
          `${apiBase}/api/checkout/session-status?session_id=${encodeURIComponent(sessionId)}`,
          { signal: controller.signal }
        );
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          throw new Error(data.detail || 'Unable to verify checkout session');
        }
        if (data.status === 'paid') {
          onClearCart?.();
          setStatus('paid');
          return;
        }
        setStatus('unpaid');
      } catch (e) {
        if (controller.signal.aborted) return;
        setStatus('error');
        setError(e instanceof Error ? e.message : 'Unable to verify checkout session');
      }
    };

    verifySession();
    return () => controller.abort();
  }, [onClearCart, sessionId]);

  return (
    <div className="payout-card">
      <p className="eyebrow">Checkout</p>
      {status === 'checking' && <h2>Verifying payment...</h2>}
      {status === 'paid' && <h2>Payment received</h2>}
      {status === 'unpaid' && <h2>Payment pending</h2>}
      {(status === 'invalid' || status === 'error') && <h2>Unable to confirm payment</h2>}
      {status === 'paid' && (
        <p className="detail-desc">
          Thanks for shopping with LuxMarket. Your payment was verified and your receipt is on the way.
        </p>
      )}
      {status === 'checking' && (
        <p className="detail-desc">Please wait while we confirm your checkout status with Stripe.</p>
      )}
      {status === 'unpaid' && (
        <p className="detail-desc">Your payment has not been marked as paid yet. You can return to cart and retry.</p>
      )}
      {(status === 'invalid' || status === 'error') && (
        <p className="detail-desc">
          We could not verify this session. {error ? `Details: ${error}` : 'Please contact support if you were charged.'}
        </p>
      )}
      {sessionId && (
        <p className="text-muted small mb-4">
          Reference: <code>{sessionId}</code>
        </p>
      )}
      <div className="d-flex flex-wrap gap-2">
        <Button as={Link} to={status === 'paid' ? '/' : '/cart'} variant="dark" className="pill-btn">
          {status === 'paid' ? 'Back to shop' : 'Return to cart'}
        </Button>
        {status !== 'paid' && (
          <Button as={Link} to="/" variant="outline-dark" className="pill-btn">
            Keep browsing
          </Button>
        )}
      </div>
    </div>
  );
}

export function PayoutCancel() {
  return (
    <div className="payout-card">
      <p className="eyebrow">Checkout</p>
      <h2>Payment canceled</h2>
      <p className="detail-desc">
        No charge was made. Your cart is still saved on this device - you can try again whenever you are ready.
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
