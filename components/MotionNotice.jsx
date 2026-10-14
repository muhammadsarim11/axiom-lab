"use client";

import { useEffect, useState } from "react";

/**
 * Shown only to visitors whose device asks for reduced motion (so the site is calm by default).
 * One click turns the full animated experience on; the choice is remembered in this browser.
 */
export default function MotionNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const animated = document.documentElement.classList.contains("has-motion");
      let dismissed = false;
      try {
        dismissed = window.sessionStorage.getItem("motion-notice") === "dismissed";
      } catch {
        /* storage unavailable */
      }
      setVisible(reduced && !animated && !dismissed);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!visible) return null;

  const enable = () => {
    try {
      window.localStorage.setItem("motion", "on");
    } catch {
      /* storage unavailable */
    }
    window.location.reload();
  };
  const dismiss = () => {
    try {
      window.sessionStorage.setItem("motion-notice", "dismissed");
    } catch {
      /* storage unavailable */
    }
    setVisible(false);
  };

  return (
    <div className="motion-notice" role="region" aria-label="Animation settings">
      <p>Animations are reduced because your device asks for less motion.</p>
      <button type="button" className="mn-on" onClick={enable}>
        Turn on animations
      </button>
      <button type="button" className="mn-close" onClick={dismiss} aria-label="Dismiss this message">
        ×
      </button>
    </div>
  );
}
