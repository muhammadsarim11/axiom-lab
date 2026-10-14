"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Projectile arc as a quadratic Bézier: x is linear in t, so t doubles as physical time.
const P0 = [70, 380];
const P1 = [260, -160];
const P2 = [450, 380];
const bezier = (t) => [
  (1 - t) ** 2 * P0[0] + 2 * (1 - t) * t * P1[0] + t * t * P2[0],
  (1 - t) ** 2 * P0[1] + 2 * (1 - t) * t * P1[1] + t * t * P2[1],
];
const strobe = [0.125, 0.25, 0.375, 0.625, 0.75, 0.875].map(bezier);

function webglAvailable() {
  try {
    const gl = document.createElement("canvas").getContext("webgl2") || document.createElement("canvas").getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
}

/**
 * The hero drawing sheet. With WebGL it shows an interactive 3D projectile diagram (lib/scenes.js,
 * "hero"); the SVG below is the fallback for browsers without WebGL or if the 3D code fails to load,
 * and the markup search engines and no-JS visitors get.
 */
export default function HeroArt() {
  const scope = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const root = scope.current;
    const plot = root.querySelector(".art-plot");
    const sceneEl = sceneRef.current;
    const animate = document.documentElement.classList.contains("has-motion");
    let disposed = false;
    let disposeScene = null;
    let ctx = null;

    // 2D fallback: the same story told with a drawn SVG
    const playSvg = () => {
      if (!animate) return;
      ctx = gsap.context(() => {
        const ball = root.querySelector(".ball");
        const moveBall = (t) => {
          const [x, y] = bezier(t);
          ball.setAttribute("cx", x.toFixed(1));
          ball.setAttribute("cy", y.toFixed(1));
        };
        moveBall(0);

        const pos = { t: 0 };
        gsap
          .timeline({ defaults: { ease: "power2.inOut" }, delay: 0.5 })
          .fromTo(".axis", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.9, stagger: 0.1 })
          .fromTo(".scribble", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5, stagger: 0.25 }, "-=0.3")
          .fromTo(".lbl-confusion", { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=1")
          .to(".scribble", { opacity: 0.1, duration: 0.8, ease: "power1.out" }, "+=0.5")
          .to(".lbl-confusion", { opacity: 0, duration: 0.5 }, "<")
          .fromTo(".arc", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.5 }, "-=0.3")
          .fromTo(".dim", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, stagger: 0.1 }, "-=0.6")
          .fromTo(".note", { opacity: 0 }, { opacity: 1, duration: 0.6, stagger: 0.07 }, "-=0.6")
          .fromTo(ball, { attr: { r: 0 } }, { attr: { r: 7 }, duration: 0.4, ease: "back.out(2)" }, "-=0.2")
          .add(
            gsap.to(pos, {
              t: 1,
              duration: 2.4,
              ease: "none",
              repeat: -1,
              repeatDelay: 1.2,
              onUpdate: () => moveBall(pos.t),
            }),
          );
      }, root);
    };

    if (!webglAvailable()) {
      playSvg();
    } else {
      plot.classList.add("is-3d-pending");
      import("@/lib/scenes")
        .then(({ mountScene }) => {
          if (disposed) return;
          disposeScene = mountScene(sceneEl, "hero", { animate });
          sceneEl.setAttribute("role", "img");
          sceneEl.setAttribute(
            "aria-label",
            "Interactive 3D diagram of projectile motion: a tangled line resolving into a clean arc. Drag to rotate.",
          );
          plot.querySelector("svg")?.setAttribute("aria-hidden", "true");
          plot.classList.add("has-3d");
          plot.classList.remove("is-3d-pending");
        })
        .catch(() => {
          if (disposed) return;
          plot.classList.remove("is-3d-pending");
          playSvg();
        });
    }

    return () => {
      disposed = true;
      disposeScene?.();
      ctx?.revert();
      plot.classList.remove("has-3d", "is-3d-pending");
    };
  }, []);

  return (
    <figure className="hero-art" ref={scope}>
      <div className="sheet">
        <span className="crop crop-tl" aria-hidden="true" />
        <span className="crop crop-tr" aria-hidden="true" />
        <span className="crop crop-bl" aria-hidden="true" />
        <span className="crop crop-br" aria-hidden="true" />

        <div className="art-plot">
          <svg viewBox="0 0 520 450" role="img" aria-labelledby="hero-art-title">
            <title id="hero-art-title">
              A tangled line resolving into a clean projectile arc: confusion becoming confidence.
            </title>

            {/* axes */}
            <path className="axis draw" pathLength="1" d="M52 380H492" />
            <path className="axis draw" pathLength="1" d="M52 380V24" />
            <path className="axis draw" pathLength="1" d="M484 374 492 380 484 386M46 32 52 24 58 32" />
            <g className="note" aria-hidden="true">
              <text x="496" y="400" className="art-text">x</text>
              <text x="30" y="26" className="art-text">y</text>
            </g>

            {/* confusion */}
            <path
              className="scribble draw"
              pathLength="1"
              d="M80 340C60 290 150 310 130 250S70 200 140 180 230 230 200 140 120 90 210 70 300 130 270 60 360 30 350 110 290 170 370 180 420 110 410 200 350 260 440 250"
            />
            <path
              className="scribble draw"
              pathLength="1"
              d="M100 120C160 40 230 60 190 120S110 180 170 210 280 160 250 250 160 300 230 330 330 290 300 220 380 160 440 190"
            />
            <text className="lbl-confusion art-label" x="84" y="52">CONFUSION</text>

            {/* confidence */}
            <path className="arc draw" pathLength="1" d="M70 380Q260-160 450 380" />
            {strobe.map(([x, y]) => (
              <circle className="note art-strobe" key={x} cx={x.toFixed(1)} cy={y.toFixed(1)} r="3.5" />
            ))}

            {/* dimensions */}
            <path className="dim draw" pathLength="1" d="M260 110V380" />
            <path className="dim draw" pathLength="1" d="M70 410H450M70 402v16M450 402v16" />
            <path className="dim draw" pathLength="1" d="M70 380 106.5 276.2M97.8 285.8 106.5 276.2 107.2 289.2" />
            <path className="dim draw" pathLength="1" d="M116 380A46 46 0 0 0 85.3 336.6" />
            <g className="note" aria-hidden="true">
              <circle cx="260" cy="110" r="5" className="art-ring" />
              <text x="268" y="256" className="art-text">h</text>
              <text x="256" y="434" className="art-text">R</text>
              <text x="114" y="266" className="art-text">v₀</text>
              <text x="124" y="364" className="art-text">θ</text>
              <text x="260" y="86" className="art-label art-label-signal" textAnchor="middle">CONFIDENCE</text>
            </g>

            <circle className="ball" cx="70" cy="380" r="7" />
          </svg>
          <div className="scene3d" ref={sceneRef} />
        </div>

        <dl className="title-block">
          <div><dt>TITLE</dt><dd>Confusion → Confidence</dd></div>
          <div><dt>DRG NO.</dt><dd>AX-001</dd></div>
          <div><dt>SCALE</dt><dd>1 : 1</dd></div>
          <div><dt>DRAWN</dt><dd>S. M. ALI</dd></div>
        </dl>
      </div>
    </figure>
  );
}
