"use client";

import { useEffect, useRef } from "react";

const labels = {
  maths: "Interactive 3D model of a rippling surface, z = f(x, y). Drag to rotate.",
  physics: "Interactive 3D model of Newton's cradle. Drag to rotate.",
  chemistry: "Interactive 3D model of a phenol molecule. Drag to rotate.",
};

/**
 * Lazy 3D scene that sits on top of the 2D line art in `.sc-art`. The 3D code (three.js) is only
 * fetched when the card nears the viewport. It animates when site motion is on; for visitors who
 * asked their device for reduced motion it shows a still model that can still be dragged.
 * Without WebGL the 2D line art simply stays.
 */
export default function Scene3D({ kind }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animate = document.documentElement.classList.contains("has-motion");
    const art = el.parentElement;
    let disposed = false;
    let dispose = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        import("@/lib/scenes")
          .then(({ mountScene }) => {
            if (disposed) return;
            dispose = mountScene(el, kind, { animate });
            el.setAttribute("role", "img");
            el.setAttribute("aria-label", labels[kind]);
            art.querySelector("svg")?.setAttribute("aria-hidden", "true");
            art.classList.add("has-3d");
          })
          .catch(() => {
            /* WebGL unavailable: the 2D line art stays */
          });
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);

    return () => {
      disposed = true;
      observer.disconnect();
      dispose?.();
      art.classList.remove("has-3d");
    };
  }, [kind]);

  return <div className="scene3d" ref={ref} />;
}
