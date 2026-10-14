import { ImageResponse } from "next/og";

/** Shared 1200×630 social-share card used by the home and About pages. */
export function renderOg({ line1, line2, footerLeft, footerRight }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0d1411",
          color: "#f2eee5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="23" stroke="#f2eee5" strokeWidth="1.5" />
            <path d="M24 9 14 38M24 9l10 29" stroke="#f2eee5" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M18.4 28h11.2" stroke="#ff5a1f" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx="24" cy="9" r="2.6" fill="#ff5a1f" />
          </svg>
          <div style={{ fontSize: 30, letterSpacing: 6, fontWeight: 700 }}>AXIOM TUTORING</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 108, lineHeight: 1, letterSpacing: -3, display: "flex" }}>{line1}</div>
          <div style={{ fontSize: 108, lineHeight: 1.05, letterSpacing: -3, color: "#ff5a1f", display: "flex" }}>
            {line2}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 28, color: "#a9b4ac" }}>
          <span>{footerLeft}</span>
          <span>{footerRight}</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
