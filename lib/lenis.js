// Tiny shared handle to the active Lenis instance (created in components/Motion.jsx).
let instance = null;

export const setLenis = (lenis) => {
  instance = lenis;
};
export const getLenis = () => instance;

/**
 * Smooth-scroll to an element (or selector). Falls back to native scrolling without Lenis.
 * The fixed-header clearance comes from `scroll-padding-top` in globals.css, which both Lenis
 * and native scrolling honour, so no extra offset is needed here.
 */
export function scrollToTarget(target, options = {}) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  if (instance) {
    instance.scrollTo(el, { duration: 1.4, ...options });
  } else {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
