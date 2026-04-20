import React, { useEffect, useMemo, useState } from 'react';

const INTRO_DURATION_MS = 1600;

export default function WelcomeIntro({ onDone }) {
  const [isExiting, setIsExiting] = useState(false);
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      onDone?.();
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setIsExiting(true);
    }, INTRO_DURATION_MS - 280);
    const doneTimer = window.setTimeout(() => {
      onDone?.();
    }, INTRO_DURATION_MS);
    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(doneTimer);
    };
  }, [onDone, prefersReducedMotion]);

  return (
    <div
      className={`welcome-intro ${isExiting ? 'is-exiting' : ''}`}
      role="dialog"
      aria-label="Welcome animation"
      aria-modal="true"
    >
      <div className="intro-noise" aria-hidden="true" />
      <div className="intro-gradient" aria-hidden="true" />
      <button type="button" className="intro-skip" onClick={onDone}>
        Skip
      </button>
      <div className="intro-brand">
        <p>Arrival experience</p>
        <h1>LUXMARKET</h1>
        <span>Curated style. Instant impact.</span>
      </div>
    </div>
  );
}
