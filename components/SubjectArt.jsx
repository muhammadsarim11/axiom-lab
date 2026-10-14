// Line-art illustrations for each subject. Elements with ".draw" are drawn in on scroll
// (pathLength="1" normalises dash lengths) and ".fade" nodes fade in afterwards; see Motion.jsx.

const f = (n) => n.toFixed(1);

function MathsArt() {
  // Parabola from (40,250) to (360,250), peak (200,100): y(t) = 250 − 600t + 600t², x = 40 + 320t
  const yAt = (t) => 250 - 600 * t + 600 * t * t;
  let area = `M${f(40 + 320 * 0.53125)} 250`;
  for (let t = 0.53125; t <= 0.8751; t += 0.03125) area += `L${f(40 + 320 * t)} ${f(yAt(t))}`;
  area += `L${f(40 + 320 * 0.875)} 250Z`;

  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="A curve with a tangent line and the area beneath it shaded" data-draw>
      <path className="draw art-axis" pathLength="1" d="M30 250H380M30 250V24" />
      <path className="draw art-line" pathLength="1" d="M40 250Q200-50 360 250" />
      <path className="draw art-accent" pathLength="1" d="M50 203.1 190 71.9" />
      <path className="fade art-area" d={area} />
      <circle className="fade art-dot" cx="120" cy="137.5" r="5" />
      <text className="fade art-text" x="196" y="66">dy/dx</text>
      <text className="fade art-text" x="244" y="236">∫ f(x) dx</text>
      <text className="fade art-text" x="246" y="84">f(x)</text>
    </svg>
  );
}

function PhysicsArt() {
  const wave = (A, lambda, phase = 0) => {
    let d = "";
    for (let x = 30; x <= 380; x += 4) {
      const y = 150 - A * Math.sin((2 * Math.PI * (x - 30)) / lambda + phase);
      d += `${x === 30 ? "M" : "L"}${x} ${f(y)}`;
    }
    return d;
  };
  const sum = () => {
    let d = "";
    for (let x = 30; x <= 380; x += 4) {
      const y =
        150 -
        (50 * Math.sin((2 * Math.PI * (x - 30)) / 160) +
          28 * Math.sin((2 * Math.PI * (x - 30)) / 64 + 0.8));
      d += `${x === 30 ? "M" : "L"}${x} ${f(y)}`;
    }
    return d;
  };

  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="Two waves and their combined superposition, with amplitude and wavelength marked" data-draw>
      <path className="draw art-axis" pathLength="1" d="M30 150H384" />
      <path className="draw art-line" pathLength="1" d={wave(50, 160)} />
      <path className="draw art-muted" pathLength="1" d={wave(28, 64, 0.8)} />
      <path className="draw art-accent" pathLength="1" d={sum()} />
      <path className="draw art-axis" pathLength="1" d="M30 258H190M30 250v16M190 250v16" />
      <path className="draw art-axis" pathLength="1" d="M70 150V100M64 106l6-6 6 6" />
      <text className="fade art-text" x="104" y="252" textAnchor="middle">λ</text>
      <text className="fade art-text" x="80" y="120">A</text>
      <text className="fade art-text" x="312" y="52">y₁ + y₂</text>
    </svg>
  );
}

function ChemistryArt() {
  const cx = 130;
  const cy = 156;
  const R = 70;
  const vertices = Array.from({ length: 6 }, (_, k) => {
    const a = ((-90 + 60 * k) * Math.PI) / 180;
    return [cx + R * Math.cos(a), cy + R * Math.sin(a)];
  });
  const hex = vertices.map(([x, y], i) => `${i ? "L" : "M"}${f(x)} ${f(y)}`).join("") + "Z";
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  const doubles = [0, 2, 4].map((i) => {
    const a = vertices[i];
    const b = vertices[(i + 1) % 6];
    const a2 = lerp(lerp(a, [cx, cy], 0.17), lerp(b, [cx, cy], 0.17), 0.12);
    const b2 = lerp(lerp(b, [cx, cy], 0.17), lerp(a, [cx, cy], 0.17), 0.12);
    return `M${f(a2[0])} ${f(a2[1])}L${f(b2[0])} ${f(b2[1])}`;
  });

  const ax = 300;
  const ay = 156;
  const orbits = [0, 60, 120];
  const electrons = [
    [0, 0.6],
    [60, 2.6],
    [120, 4.4],
  ].map(([deg, theta]) => {
    const r = (deg * Math.PI) / 180;
    const ex = 74 * Math.cos(theta);
    const ey = 26 * Math.sin(theta);
    return [ax + ex * Math.cos(r) - ey * Math.sin(r), ay + ex * Math.sin(r) + ey * Math.cos(r)];
  });

  return (
    <svg viewBox="0 0 400 300" role="img" aria-label="A benzene ring with a hydroxyl group next to an atom with electron orbits" data-draw>
      <path className="draw art-line" pathLength="1" d={hex} />
      <path className="draw art-accent" pathLength="1" d={doubles.join("")} />
      <path className="draw art-line" pathLength="1" d={`M${f(vertices[0][0])} ${f(vertices[0][1])}V58`} />
      <text className="fade art-text" x={cx} y="46" textAnchor="middle">OH</text>
      <text className="fade art-text" x={cx} y="262" textAnchor="middle">C₆H₅OH</text>

      {orbits.map((deg) => (
        <ellipse
          key={deg}
          className="draw art-muted"
          pathLength="1"
          cx={ax}
          cy={ay}
          rx="74"
          ry="26"
          transform={`rotate(${deg} ${ax} ${ay})`}
        />
      ))}
      <circle className="fade art-dot" cx={ax} cy={ay} r="9" />
      {electrons.map(([x, y], i) => (
        <circle key={i} className="fade art-electron" cx={f(x)} cy={f(y)} r="4.5" />
      ))}
    </svg>
  );
}

const art = { maths: MathsArt, physics: PhysicsArt, chemistry: ChemistryArt };

export default function SubjectArt({ id }) {
  const Art = art[id];
  return Art ? <Art /> : null;
}
