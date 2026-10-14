const items = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Years 7–12",
  "Perth & online worldwide",
  "Conceptual understanding",
  "Real-world problem-solving",
];

function Star() {
  return (
    <svg className="marquee-star" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true" focusable="false">
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17 20.7 7" />
    </svg>
  );
}

function Row({ hidden = false }) {
  return (
    <div className="marquee-row" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <span className="marquee-item" key={item}>
          {item}
          <Star />
        </span>
      ))}
    </div>
  );
}

// Four copies: the track scrolls by half its width (two copies) and loops seamlessly, and stays
// wider than the viewport even on very large screens.
export default function Marquee() {
  return (
    <div className="marquee" role="presentation">
      <div className="marquee-track" data-marquee>
        <Row />
        <Row hidden />
        <Row hidden />
        <Row hidden />
      </div>
    </div>
  );
}
