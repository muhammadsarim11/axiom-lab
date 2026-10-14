// Interactive 3D scenes for the subject cards. Imported on demand from components/Scene3D.jsx,
// so three.js never ships with the initial page load.
//
//   maths      a rippling z = f(x, y) surface drawn as a wire mesh, with a point tracing it
//   physics    Newton's cradle (momentum and energy conservation)
//   chemistry  a phenol molecule in ball-and-stick form
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

const UP = new THREE.Vector3(0, 1, 0);
const scratch = new THREE.Vector3();
const V = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);

/** Stretch a unit-height cylinder between two points. */
function place(mesh, a, b) {
  scratch.subVectors(b, a);
  const length = scratch.length() || 1e-6;
  mesh.position.copy(a).addScaledVector(scratch, 0.5);
  mesh.scale.set(1, length, 1);
  mesh.quaternion.setFromUnitVectors(UP, scratch.multiplyScalar(1 / length));
}
const cylinder = (radius, material, radial = 10) =>
  new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, 1, radial), material);
const smooth = (k) => {
  const c = Math.min(1, Math.max(0, k));
  return c * c * (3 - 2 * c);
};

/* ------------------------------------------------------------------ maths */
function buildMaths({ ink, accent, bg }) {
  const root = new THREE.Group();
  const half = 3.4;
  const lines = 28;
  const samples = 56;
  const base = -1.35;
  const height = (x, z, t) =>
    0.72 * Math.sin(1.1 * x + t) * Math.cos(1.1 * z) + 0.26 * Math.cos(0.7 * (x - z) - 0.8 * t);

  // Grid lines along x and along z, as one LineSegments object.
  const segs = [];
  for (let a = 0; a <= lines; a++) {
    const c = -half + (2 * half * a) / lines;
    for (let s = 0; s < samples; s++) {
      const u0 = -half + (2 * half * s) / samples;
      const u1 = -half + (2 * half * (s + 1)) / samples;
      segs.push(u0, c, u1, c, c, u0, c, u1);
    }
  }
  const segCount = segs.length / 4;
  const positions = new Float32Array(segCount * 6);
  const colors = new Float32Array(segCount * 6);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const surface = new THREE.LineSegments(geometry, new THREE.LineBasicMaterial({ vertexColors: true }));
  surface.frustumCulled = false;
  root.add(surface);

  const low = bg.clone().lerp(ink, 0.8);
  const tint = new THREE.Color();
  const shade = (h, p) => {
    tint.copy(low).lerp(accent, smooth((h + 0.45) / 1.4));
    colors[p] = tint.r;
    colors[p + 1] = tint.g;
    colors[p + 2] = tint.b;
  };

  // Base outline and axes
  const lineMat = (opacity) => new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity });
  root.add(
    new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints([V(-half, base, -half), V(half, base, -half), V(half, base, half), V(-half, base, half)]),
      lineMat(0.3),
    ),
  );
  const o = V(-half - 0.35, base, -half - 0.35);
  root.add(
    new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints([o, V(half + 0.6, base, o.z), o, V(o.x, base, half + 0.6), o, V(o.x, base + 3, o.z)]),
      lineMat(0.7),
    ),
  );
  const coneMat = new THREE.MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.7 });
  const cone = (pos, rx, rz) => {
    const m = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.26, 14), coneMat);
    m.position.copy(pos);
    m.rotation.set(rx, 0, rz);
    root.add(m);
  };
  cone(V(half + 0.6, base, o.z), 0, -Math.PI / 2);
  cone(V(o.x, base, half + 0.6), Math.PI / 2, 0);
  cone(V(o.x, base + 3, o.z), 0, 0);

  // A point travelling over the surface, with its trail, a drop line and a shadow ring.
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), new THREE.MeshBasicMaterial({ color: accent }));
  const dropGeo = new THREE.BufferGeometry().setFromPoints([V(), V()]);
  const drop = new THREE.Line(dropGeo, new THREE.LineBasicMaterial({ color: accent, transparent: true, opacity: 0.55 }));
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(0.14, 0.2, 32),
    new THREE.MeshBasicMaterial({ color: accent, side: THREE.DoubleSide, transparent: true, opacity: 0.85 }),
  );
  ring.rotation.x = -Math.PI / 2;
  const trailN = 90;
  const trailPos = new Float32Array(trailN * 3);
  const trailCol = new Float32Array(trailN * 3);
  const trailGeo = new THREE.BufferGeometry();
  trailGeo.setAttribute("position", new THREE.BufferAttribute(trailPos, 3));
  trailGeo.setAttribute("color", new THREE.BufferAttribute(trailCol, 3));
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ vertexColors: true }));
  trail.frustumCulled = false;
  const history = [];
  root.add(dot, drop, ring, trail);

  const update = (t) => {
    for (let i = 0, p = 0; i < segCount; i++, p += 6) {
      const k = i * 4;
      const h0 = height(segs[k], segs[k + 1], t);
      const h1 = height(segs[k + 2], segs[k + 3], t);
      positions[p] = segs[k];
      positions[p + 1] = h0;
      positions[p + 2] = segs[k + 1];
      positions[p + 3] = segs[k + 2];
      positions[p + 4] = h1;
      positions[p + 5] = segs[k + 3];
      shade(h0, p);
      shade(h1, p + 3);
    }
    geometry.attributes.position.needsUpdate = true;
    geometry.attributes.color.needsUpdate = true;

    const x = 2.4 * Math.cos(0.5 * t);
    const z = 1.9 * Math.sin(0.75 * t + 1);
    const y = height(x, z, t) + 0.06;
    dot.position.set(x, y, z);
    ring.position.set(x, base + 0.01, z);
    dropGeo.attributes.position.setXYZ(0, x, y, z);
    dropGeo.attributes.position.setXYZ(1, x, base, z);
    dropGeo.attributes.position.needsUpdate = true;

    history.push(x, y, z);
    if (history.length > trailN * 3) history.splice(0, 3);
    const n = history.length / 3;
    for (let i = 0; i < trailN; i++) {
      const s = Math.min(i, n - 1) * 3;
      trailPos[i * 3] = history[s] ?? x;
      trailPos[i * 3 + 1] = history[s + 1] ?? y;
      trailPos[i * 3 + 2] = history[s + 2] ?? z;
      tint.copy(bg).lerp(accent, (i / (trailN - 1)) ** 1.4);
      trailCol[i * 3] = tint.r;
      trailCol[i * 3 + 1] = tint.g;
      trailCol[i * 3 + 2] = tint.b;
    }
    trailGeo.attributes.position.needsUpdate = true;
    trailGeo.attributes.color.needsUpdate = true;
  };

  return { root, update, spin: 0.16, stillTime: 1.4, stillYaw: 0.6, camera: { position: [0, 4.6, 10.4], target: [0, -0.1, 0] } };
}

/* ---------------------------------------------------------------- physics */
function buildPhysics({ scene, ink, accent }) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(3, 6, 6);
  scene.add(key);
  const warm = new THREE.DirectionalLight(accent, 2);
  warm.position.set(-5, 1, -3);
  scene.add(warm);

  const root = new THREE.Group();
  const R = 0.5;
  const L = 3.1;
  const pivotY = 2.4;
  const zOff = 0.65;
  const N = 5;

  const ballMat = new THREE.MeshStandardMaterial({ color: 0xe9eeea, metalness: 1, roughness: 0.16 });
  const frameMat = new THREE.MeshStandardMaterial({ color: ink, metalness: 0.2, roughness: 0.55 });
  const stringMat = new THREE.MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.75 });
  const capMat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.35 });

  // Frame: two top rails, four posts, two bottom rails, two end bars.
  const w = 3.3;
  const bottom = -2.1;
  const bar = (a, b, r = 0.034) => {
    const m = cylinder(r, frameMat, 10);
    place(m, a, b);
    root.add(m);
  };
  for (const z of [-zOff, zOff]) {
    bar(V(-w, pivotY, z), V(w, pivotY, z));
    bar(V(-w, bottom, z), V(w, bottom, z));
    for (const x of [-w, w]) {
      bar(V(x, pivotY, z), V(x, bottom, z));
      const cap = new THREE.Mesh(new THREE.SphereGeometry(0.085, 20, 14), capMat);
      cap.position.set(x, pivotY, z);
      root.add(cap);
    }
  }
  for (const x of [-w, w]) {
    bar(V(x, bottom, -zOff), V(x, bottom, zOff));
    bar(V(x, pivotY, -zOff), V(x, pivotY, zOff));
  }

  const ballGeo = new THREE.SphereGeometry(R, 56, 40);
  const balls = [];
  for (let i = 0; i < N; i++) {
    const x = (i - (N - 1) / 2) * 2 * R;
    const mesh = new THREE.Mesh(ballGeo, ballMat);
    const s1 = cylinder(0.013, stringMat, 5);
    const s2 = cylinder(0.013, stringMat, 5);
    root.add(mesh, s1, s2);
    balls.push({ x, mesh, s1, s2, a: V(x, pivotY, -zOff), b: V(x, pivotY, zOff) });
  }

  const period = 2.6;
  const maxAngle = 0.78;
  const update = (t) => {
    const swing = maxAngle * Math.sin((2 * Math.PI * t) / period);
    balls.forEach((ball, i) => {
      // Idealised cradle: the end ball on the side of the swing carries all the motion.
      const angle = i === 0 && swing < 0 ? swing : i === N - 1 && swing > 0 ? swing : 0;
      ball.mesh.position.set(ball.x + L * Math.sin(angle), pivotY - L * Math.cos(angle), 0);
      place(ball.s1, ball.a, ball.mesh.position);
      place(ball.s2, ball.b, ball.mesh.position);
    });
  };
  update(0);

  return {
    root,
    update,
    sway: 0.5,
    stillTime: 0.65, // ball at the top of its swing
    stillYaw: 0.3,
    returns: true,
    pbr: true,
    camera: { position: [0, 0.9, 11.2], target: [0, 0.2, 0] },
  };
}

/* -------------------------------------------------------------- chemistry */
function buildChemistry({ scene, ink, accent }) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const key = new THREE.DirectionalLight(0xffffff, 2.4);
  key.position.set(3, 5, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(accent, 1.6);
  rim.position.set(-4, -2, -3);
  scene.add(rim);

  const root = new THREE.Group();
  const molecule = new THREE.Group();
  root.add(molecule);

  const carbonMat = new THREE.MeshStandardMaterial({ color: ink, roughness: 0.35, metalness: 0.15 });
  const hydrogenMat = new THREE.MeshStandardMaterial({ color: 0xf6f2e9, roughness: 0.45 });
  const oxygenMat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.3, metalness: 0.1 });
  const bondMat = new THREE.MeshStandardMaterial({ color: ink, roughness: 0.5 });
  const lightBondMat = new THREE.MeshStandardMaterial({ color: 0xaeb8b0, roughness: 0.5 });
  const accentBondMat = new THREE.MeshStandardMaterial({ color: accent, roughness: 0.4 });

  const atom = (radius, mat, p) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(radius, 44, 30), mat);
    m.position.copy(p);
    molecule.add(m);
  };
  const bond = (a, b, radius, mat) => {
    const m = cylinder(radius, mat, 16);
    place(m, a, b);
    molecule.add(m);
  };

  const rC = 1.4;
  const carbons = Array.from({ length: 6 }, (_, k) => {
    const a = Math.PI / 2 + (k * Math.PI) / 3;
    return V(rC * Math.cos(a), rC * Math.sin(a), 0);
  });

  carbons.forEach((c, k) => {
    atom(0.36, carbonMat, c);
    const next = carbons[(k + 1) % 6];
    bond(c, next, 0.09, bondMat);
    if (k % 2 === 0) {
      // second bond of the Kekulé double bonds, drawn inside the ring in the accent colour
      const inner = (p) => p.clone().multiplyScalar(0.78);
      const a = inner(c).lerp(inner(next), 0.14);
      const b = inner(next).lerp(inner(c), 0.14);
      bond(a, b, 0.05, accentBondMat);
    }
    const out = c.clone().normalize();
    if (k === 0) {
      const o = out.clone().multiplyScalar(rC + 1.38);
      const h = o.clone().add(V(0.78, 0.5, 0));
      bond(c, o, 0.075, bondMat);
      bond(o, h, 0.06, lightBondMat);
      atom(0.32, oxygenMat, o);
      atom(0.2, hydrogenMat, h);
    } else {
      const h = out.multiplyScalar(rC + 1.08);
      bond(c, h, 0.06, lightBondMat);
      atom(0.2, hydrogenMat, h);
    }
  });

  molecule.rotation.x = -0.95;
  const update = (t) => {
    molecule.position.y = Math.sin(t * 0.9) * 0.12;
  };

  return { root, update, spin: 0.32, stillTime: 0.5, stillYaw: 0.6, pbr: true, camera: { position: [0, 0.4, 9.2], target: [0, 0.1, 0] } };
}

/* ------------------------------------------------- hero: projectile drawing */
// "Confusion to confidence" in 3D: a tangled line fades back as a clean projectile arc is drawn,
// then a ball travels along it. Deliberately light: ~25 simple objects.
function textSprite(text, color, size, family) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const g = canvas.getContext("2d");
  g.font = `600 52px ${family}`;
  g.fillStyle = color;
  g.textAlign = "center";
  g.textBaseline = "middle";
  if ("letterSpacing" in g) g.letterSpacing = "8px";
  g.fillText(text, 256, 66);
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map, transparent: true, depthTest: false, opacity: 0 }));
  sprite.scale.set(size * 4, size, 1);
  return sprite;
}

function buildHero({ scene, ink, accent }) {
  scene.add(new THREE.AmbientLight(0xffffff, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(3, 6, 5);
  scene.add(key);

  const root = new THREE.Group();
  const R = 6;
  const H = 3.2;
  const x0 = -R / 2;
  const arcAt = (u) => V(x0 + R * u, 4 * H * u * (1 - u), 0);
  const ease = (x) => 1 - (1 - x) ** 3;
  const seg = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
  const family = getComputedStyle(document.querySelector(".mono") || document.body).fontFamily;
  const inkCss = ink.getStyle();
  const lineMat = (color, opacity = 0) => new THREE.LineBasicMaterial({ color, transparent: true, opacity });

  // Ground grid and its outline
  const gridPts = [];
  for (let z = -2; z <= 2; z++) gridPts.push(V(-4, 0, z), V(4, 0, z));
  for (let x = -4; x <= 4; x++) gridPts.push(V(x, 0, -2), V(x, 0, 2));
  const gridMat = lineMat(ink);
  root.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(gridPts), gridMat));
  const frameMat = lineMat(ink);
  root.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints([V(-4, 0, -2), V(4, 0, -2), V(4, 0, 2), V(-4, 0, 2)]), frameMat));

  // Axes
  const O = V(x0 - 0.6, 0, 0);
  const axisMat = lineMat(ink);
  root.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([O, V(4.1, 0, 0), O, V(O.x, 4.6, 0)]), axisMat));
  const coneMat = new THREE.MeshBasicMaterial({ color: ink, transparent: true, opacity: 0 });
  const coneGeo = new THREE.ConeGeometry(0.08, 0.28, 12);
  [[V(4.1, 0, 0), -Math.PI / 2], [V(O.x, 4.6, 0), 0]].forEach(([p, rz]) => {
    const m = new THREE.Mesh(coneGeo, coneMat);
    m.position.copy(p);
    m.rotation.z = rz;
    root.add(m);
  });

  // Confusion: a tangled 3D line (deterministic, so it looks the same every visit)
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const tangle = Array.from({ length: 16 }, () => V((rnd() - 0.5) * 7, 0.3 + rnd() * 3.8, (rnd() - 0.5) * 3));
  const scribblePts = new THREE.CatmullRomCurve3(tangle, false, "catmullrom", 0.5).getPoints(420);
  const scribbleGeo = new THREE.BufferGeometry().setFromPoints(scribblePts);
  const scribbleMat = lineMat(0x8a948d, 1);
  root.add(new THREE.Line(scribbleGeo, scribbleMat));

  // Confidence: the clean arc, as a tube so it reads as a solid 3D form
  const arcCurve = new THREE.CatmullRomCurve3(Array.from({ length: 41 }, (_, i) => arcAt(i / 40)));
  const arcGeo = new THREE.TubeGeometry(arcCurve, 96, 0.05, 10, false);
  const arcIndexCount = arcGeo.index.count;
  root.add(new THREE.Mesh(arcGeo, new THREE.MeshStandardMaterial({ color: accent, roughness: 0.45, metalness: 0.05 })));

  // Strobe dots, height and range dimensions, launch vector
  const dotMat = new THREE.MeshBasicMaterial({ color: ink, transparent: true, opacity: 0 });
  const dotGeo = new THREE.SphereGeometry(0.075, 14, 10);
  [0.125, 0.25, 0.375, 0.625, 0.75, 0.875].forEach((u) => {
    const m = new THREE.Mesh(dotGeo, dotMat);
    m.position.copy(arcAt(u));
    root.add(m);
  });
  const dimMat = lineMat(ink);
  const rz = 1.35;
  root.add(
    new THREE.LineSegments(
      new THREE.BufferGeometry().setFromPoints([
        V(0, 0, 0), V(0, H, 0),
        V(x0, 0, rz), V(x0 + R, 0, rz), V(x0, 0, rz - 0.15), V(x0, 0, rz + 0.15), V(x0 + R, 0, rz - 0.15), V(x0 + R, 0, rz + 0.15),
      ]),
      dimMat,
    ),
  );
  const arrow = new THREE.ArrowHelper(V(1, (4 * H) / R, 0).normalize(), V(x0, 0, 0), 1.9, ink, 0.4, 0.2);
  arrow.line.material.transparent = true;
  arrow.cone.material.transparent = true;
  root.add(arrow);

  // Labels
  const label = (text, color, size, x, y, z) => {
    const s = textSprite(text, color, size, family);
    s.position.set(x, y, z);
    root.add(s);
    return s;
  };
  const confusion = label("CONFUSION", "#7d887f", 0.4, -2.4, 4.4, 0);
  const confidence = label("CONFIDENCE", accent.getStyle(), 0.4, 0, H + 0.75, 0);
  const hLabel = label("h", inkCss, 0.62, 0.45, H / 2, 0);
  const rLabel = label("R", inkCss, 0.62, 0, 0, rz + 0.55);

  // The ball and its shadow on the ground
  const ball = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 28, 20),
    new THREE.MeshStandardMaterial({ color: accent, roughness: 0.35, emissive: accent, emissiveIntensity: 0.25 }),
  );
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(0.22, 24),
    new THREE.MeshBasicMaterial({ color: ink, transparent: true, opacity: 0.22, depthWrite: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  root.add(ball, shadow);

  const update = (t) => {
    const grid = ease(seg(t, 0, 0.9));
    gridMat.opacity = 0.2 * grid;
    frameMat.opacity = 0.45 * grid;
    axisMat.opacity = grid;
    coneMat.opacity = grid;

    scribbleGeo.setDrawRange(0, Math.floor(scribblePts.length * ease(seg(t, 0.5, 2.1))));
    scribbleMat.opacity = 1 - 0.88 * ease(seg(t, 2.8, 3.5));
    confusion.material.opacity = ease(seg(t, 1.2, 1.8)) * (1 - ease(seg(t, 2.8, 3.4)));

    arcGeo.setDrawRange(0, Math.floor((arcIndexCount / 6) * ease(seg(t, 3, 4.6))) * 6);
    const detail = ease(seg(t, 4.2, 5));
    dotMat.opacity = detail;
    dimMat.opacity = 0.8 * detail;
    arrow.line.material.opacity = detail;
    arrow.cone.material.opacity = detail;
    confidence.material.opacity = detail;
    hLabel.material.opacity = detail;
    rLabel.material.opacity = detail;

    const live = ease(seg(t, 4.7, 5.1));
    const u = t > 5 ? Math.min(1, ((t - 5) % 3.6) / 2.4) : 0;
    const p = arcAt(u);
    ball.position.copy(p);
    ball.scale.setScalar(live || 0.0001);
    shadow.position.set(p.x, 0.012, 0);
    shadow.scale.setScalar(live * (1 - (0.35 * p.y) / H) || 0.0001);
  };
  update(0);

  return {
    root,
    update,
    sway: 0.42,
    returns: true,
    stillTime: 5.9, // intro finished, ball part-way along the arc
    stillYaw: 0.4,
    camera: { position: [0, 3.3, 12.4], target: [0, 1.9, 0] },
  };
}

const builders = { maths: buildMaths, physics: buildPhysics, chemistry: buildChemistry, hero: buildHero };

/** Nearest ancestor background that is actually painted (cards and the drawing sheet). */
function solidBackground(el) {
  for (let node = el; node; node = node.parentElement) {
    const css = getComputedStyle(node).backgroundColor;
    const parts = (css.match(/rgba?\(([^)]+)\)/)?.[1] ?? "").split(/[,\s/]+/).filter(Boolean);
    if (parts.length >= 3 && (parts[3] === undefined || parseFloat(parts[3]) > 0.01)) return new THREE.Color(css);
  }
  return new THREE.Color(0xf2eee5);
}

/**
 * Mounts a scene inside `container` and returns a dispose function.
 * Throws when WebGL is unavailable so the caller can keep the 2D line art.
 *
 * With `animate: false` (visitors who asked their device for reduced motion) the model is drawn
 * once in a fixed pose and only re-rendered while the visitor drags it.
 */
export function mountScene(container, kind, { animate = true } = {}) {
  const build = builders[kind];
  if (!build) throw new Error(`Unknown scene: ${kind}`);

  const canvas = document.createElement("canvas");
  canvas.className = "scene3d-canvas";
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);

  const card = container.closest(".subject-card") || container.closest(".sheet") || container;
  const ink = new THREE.Color(getComputedStyle(card).color);
  const bg = solidBackground(card);
  const accent = new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue("--signal").trim() || "#ff5a1f");

  const built = build({ scene, ink, accent, bg });
  scene.add(built.root);
  camera.position.set(...built.camera.position);
  camera.lookAt(...built.camera.target);

  let pmrem = null;
  let envMap = null;
  if (built.pbr) {
    pmrem = new THREE.PMREMGenerator(renderer);
    envMap = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envMap.texture;
  }

  container.appendChild(canvas);

  const drag = { active: false, x: 0, y: 0, yaw: 0, pitch: 0, vyaw: 0 };
  let time = built.stillTime ?? 1.2; // the pose used when not animating

  const draw = () => {
    built.update(time, 0);
    const idle = animate ? (built.spin ? time * built.spin : built.sway ? Math.sin(time * 0.5) * built.sway : 0) : built.stillYaw ?? 0.5;
    built.root.rotation.y = idle + drag.yaw;
    built.root.rotation.x = drag.pitch;
    renderer.render(scene, camera);
  };

  const resize = () => {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (!animate) draw();
  };
  resize();
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  // Drag to rotate (vertical page scrolling still works on touch: see touch-action in CSS).
  const onDown = (e) => {
    drag.active = true;
    drag.x = e.clientX;
    drag.y = e.clientY;
    canvas.setPointerCapture?.(e.pointerId);
    canvas.classList.add("is-grabbing");
  };
  const onMove = (e) => {
    if (!drag.active) return;
    const dx = e.clientX - drag.x;
    const dy = e.clientY - drag.y;
    drag.x = e.clientX;
    drag.y = e.clientY;
    drag.vyaw = dx * 0.01;
    drag.yaw += dx * 0.01;
    drag.pitch = Math.max(-0.6, Math.min(0.6, drag.pitch + dy * 0.006));
    if (!animate) draw();
  };
  const onUp = () => {
    drag.active = false;
    canvas.classList.remove("is-grabbing");
  };
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onUp);
  const onContextLost = (e) => e.preventDefault();
  canvas.addEventListener("webglcontextlost", onContextLost);

  // Animated mode: render only while on screen.
  let visible = true;
  let running = false;
  let raf = 0;
  let last = 0;
  let io = null;
  const frame = (now) => {
    if (!visible) {
      running = false;
      return;
    }
    raf = requestAnimationFrame(frame);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;

    if (!drag.active) {
      drag.yaw += drag.vyaw;
      drag.vyaw *= 0.94;
      if (built.returns) {
        drag.yaw *= 0.985;
        drag.pitch *= 0.97;
      }
    }
    draw();
  };
  const start = () => {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };
  if (animate) {
    time = 0;
    io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(container);
    start();
  } else {
    draw();
  }

  return () => {
    visible = false;
    cancelAnimationFrame(raf);
    io?.disconnect();
    resizeObserver.disconnect();
    canvas.removeEventListener("pointerdown", onDown);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerup", onUp);
    canvas.removeEventListener("pointercancel", onUp);
    canvas.removeEventListener("webglcontextlost", onContextLost);
    scene.traverse((object) => {
      object.geometry?.dispose();
      const materials = Array.isArray(object.material) ? object.material : object.material ? [object.material] : [];
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
    });
    envMap?.dispose();
    pmrem?.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  };
}
