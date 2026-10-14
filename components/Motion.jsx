"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { setLenis } from "@/lib/lenis";

/*
 * Site-wide motion: Lenis smooth scrolling wired into GSAP ScrollTrigger, plus
 * attribute-driven animations so most sections can stay server components:
 *
 *   data-hero-line / data-hero-fade   intro sequence on load
 *   data-split                        heading line-mask reveal (SplitText)
 *   data-reveal / data-reveal-group   fade-up (single element / staggered children)
 *   data-scrub                        words light up as you scroll
 *   data-draw                         SVG ".draw" strokes draw in, ".fade" nodes fade in
 *   data-parallax="0.1"               vertical parallax
 *   data-marquee                      infinite ticker: scroll-velocity boost, slows on hover
 *   data-magnetic / .btn-lg           buttons lean toward the cursor (fine pointers only)
 *   data-tilt                         3D tilt following the cursor
 *   data-spot                         cursor-following glow (CSS reads --mx / --my)
 *   data-stack-card                   sticky cards that scale back as the next one covers them
 *   data-step                         toggles .is-active while centred in the viewport
 *
 * Everything is skipped when the user prefers reduced motion (the "has-motion" class set by
 * the inline script in layout.jsx is never added, so content simply shows).
 */
export default function Motion() {
  const pathname = usePathname();

  // 1. Smooth scrolling (once for the whole app)
  useEffect(() => {
    if (!document.documentElement.classList.contains("has-motion")) return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    setLenis(lenis);
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // 2. Page animations (re-run on every route change)
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("has-motion")) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);

    let ctx;
    let cancelled = false;
    const cleanups = [];
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const init = () => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const q = gsap.utils.toArray;

        // Hero intro: eyebrow rule draws, its labels rise out of a mask, then the headline and the rest
        const heroLines = q("[data-hero-line]");
        if (heroLines.length) {
          const intro = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.1 });
          const rule = q("[data-eb-rule]");
          const labels = q("[data-eb-text]");
          if (rule.length) {
            intro.fromTo(
              rule,
              { scaleX: 0, opacity: 1, transformOrigin: "0% 50%" },
              { scaleX: 1, duration: 1.1, ease: "power3.inOut" },
            );
          }
          if (labels.length) {
            intro.fromTo(labels, { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.9, stagger: 0.12 }, rule.length ? "-=0.75" : 0);
          }
          intro
            .fromTo(heroLines, { yPercent: 115, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.3, stagger: 0.12 }, "-=0.6")
            .fromTo("[data-hero-fade]", { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.09 }, "-=0.85");
        }

        // Heading line-mask reveals
        q("[data-split]").forEach((el) => {
          SplitText.create(el, {
            type: "lines",
            mask: "lines",
            autoSplit: true,
            onSplit(self) {
              gsap.set(el, { autoAlpha: 1 });
              return gsap.from(self.lines, {
                yPercent: 110,
                duration: 1.1,
                ease: "power4.out",
                stagger: 0.09,
                scrollTrigger: { trigger: el, start: "top 88%", once: true },
              });
            },
          });
        });

        // Fade-ups
        q("[data-reveal]").forEach((el) => {
          gsap.fromTo(
            el,
            { y: 36, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              delay: Number(el.dataset.revealDelay || 0),
              // drop the leftover inline transform so CSS :hover transforms keep working
              clearProps: "transform",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            },
          );
        });
        q("[data-reveal-group]").forEach((group) => {
          gsap.fromTo(
            group.children,
            { y: 44, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              stagger: 0.12,
              clearProps: "transform",
              scrollTrigger: { trigger: group, start: "top 86%", once: true },
            },
          );
        });

        // Scroll-scrubbed statement
        q("[data-scrub]").forEach((el) => {
          const split = SplitText.create(el, { type: "words" });
          gsap.set(el, { autoAlpha: 1 });
          gsap.fromTo(
            split.words,
            { opacity: 0.14 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 55%", scrub: 0.6 },
            },
          );
        });

        // SVG line drawing
        q("[data-draw]").forEach((svg) => {
          const trigger = { trigger: svg, start: "top 82%", once: true };
          gsap.fromTo(
            svg.querySelectorAll(".draw"),
            { strokeDashoffset: 1 },
            { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", stagger: 0.14, scrollTrigger: trigger },
          );
          gsap.fromTo(
            svg.querySelectorAll(".fade"),
            { opacity: 0 },
            { opacity: 1, duration: 0.9, ease: "power1.out", stagger: 0.1, delay: 0.6, scrollTrigger: trigger },
          );
        });

        // Parallax
        q("[data-parallax]").forEach((el) => {
          const speed = Number(el.dataset.parallax) || 0.1;
          gsap.fromTo(
            el,
            { yPercent: -speed * 100 },
            {
              yPercent: speed * 100,
              ease: "none",
              scrollTrigger: { trigger: el.parentElement || el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });

        // Sticky stacked cards (desktop only: they stack statically on small screens)
        gsap.matchMedia().add("(min-width: 901px)", () => {
          const cards = q("[data-stack-card]");
          cards.forEach((card, i) => {
            const next = cards[i + 1];
            if (!next) return;
            gsap.to(card, {
              scale: 0.93,
              ease: "none",
              transformOrigin: "50% 0%",
              scrollTrigger: { trigger: next, start: "top 90%", end: "top 22%", scrub: true },
            });
          });
        });

        // Active step highlighting
        q("[data-step]").forEach((step) => {
          ScrollTrigger.create({
            trigger: step,
            start: "top 62%",
            end: "bottom 62%",
            toggleClass: { targets: step, className: "is-active" },
          });
        });

        // Marquee: always drifting, faster (and reversing) with scroll velocity, slows on hover
        q("[data-marquee]").forEach((track) => {
          const loop = gsap.to(track, { xPercent: -50, duration: 85, ease: "none", repeat: -1 });
          let base = 1;
          let settleTimer;
          const settle = (scale = base) => gsap.to(loop, { timeScale: scale, duration: 0.7, overwrite: true });
          ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate(self) {
              const v = self.getVelocity() / 1000;
              if (Math.abs(v) < 0.05) return;
              const boost = 1 + Math.min(Math.abs(v), 12) * 0.7;
              gsap.to(loop, { timeScale: (v < 0 ? -1 : 1) * boost * base, duration: 0.3, overwrite: true });
              clearTimeout(settleTimer);
              settleTimer = setTimeout(() => settle(), 180);
            },
          });
          const marquee = track.parentElement;
          if (finePointer) {
            const slow = () => {
              base = 0.12;
              settle();
            };
            const resume = () => {
              base = 1;
              settle();
            };
            marquee.addEventListener("pointerenter", slow);
            marquee.addEventListener("pointerleave", resume);
            cleanups.push(() => {
              marquee.removeEventListener("pointerenter", slow);
              marquee.removeEventListener("pointerleave", resume);
            });
          }
          cleanups.push(() => clearTimeout(settleTimer));
        });

        // Magnetic buttons: they lean toward the cursor
        if (finePointer) {
          q(".btn-lg:not(.form-submit), .header-cta, [data-magnetic]").forEach((button) => {
            const moveX = gsap.quickTo(button, "x", { duration: 0.5, ease: "power3.out" });
            const moveY = gsap.quickTo(button, "y", { duration: 0.5, ease: "power3.out" });
            const onMove = (event) => {
              const r = button.getBoundingClientRect();
              moveX((event.clientX - (r.left + r.width / 2)) * 0.22);
              moveY((event.clientY - (r.top + r.height / 2)) * 0.32);
            };
            const onLeave = () => {
              moveX(0);
              moveY(0);
            };
            button.addEventListener("pointermove", onMove);
            button.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              button.removeEventListener("pointermove", onMove);
              button.removeEventListener("pointerleave", onLeave);
            });
          });

          // 3D tilt following the cursor
          q("[data-tilt]").forEach((el) => {
            gsap.set(el, { transformPerspective: 900 });
            const tiltX = gsap.quickTo(el, "rotationX", { duration: 0.7, ease: "power3.out" });
            const tiltY = gsap.quickTo(el, "rotationY", { duration: 0.7, ease: "power3.out" });
            const onMove = (event) => {
              const r = el.getBoundingClientRect();
              tiltY(((event.clientX - r.left) / r.width - 0.5) * 12);
              tiltX(-((event.clientY - r.top) / r.height - 0.5) * 12);
            };
            const onLeave = () => {
              tiltX(0);
              tiltY(0);
            };
            el.addEventListener("pointermove", onMove);
            el.addEventListener("pointerleave", onLeave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", onMove);
              el.removeEventListener("pointerleave", onLeave);
            });
          });
        }
      });

      root.dataset.motion = "ready";
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };

    document.fonts.ready.then(init);

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
      ctx?.revert();
    };
  }, [pathname]);

  // 3. Cursor spotlight on cards marked [data-spot] (updates --mx / --my for the CSS glow)
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains("has-motion")) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (event) => {
      const card = event.target.closest?.("[data-spot]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${event.clientX - r.left}px`);
      card.style.setProperty("--my", `${event.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
