"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/** Thin page-progress bar fixed to the top of the viewport. */
export default function ScrollProgress() {
  const bar = useRef(null);

  useEffect(() => {
    const el = bar.current;
    const setProgress = gsap.quickTo(el, "scaleX", { duration: 0.4, ease: "power3.out" });
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={bar} />
    </div>
  );
}
