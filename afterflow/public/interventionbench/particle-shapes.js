// Original illustrative geometry. No benchmark trajectories or private inputs.
// Every formation is a pure function of (scene, index, count, time) so the live
// canvas and the static fallback diagrams draw from the same authored source.
export const ink = {field: '#6d7268', ink: '#1f221d', accent: '#2f5040'};
export const SCENES = 8;
const tau = Math.PI * 2, golden = 2.39996323;
const frac = x => x - Math.floor(x);
const noise = i => frac(Math.sin(i * 127.1 + 311.7) * 43758.5453);
const smooth = t => t * t * (3 - 2 * t);

// A future branch: one origin, many outcomes. Shared by the "one future" and
// "futures" scenes so the unseen branches of the first become the second.
function branch(k, K, s, x0, x1, reach, t = 0) {
  const spread = (k / (K - 1) - .5) * 2 + (noise(k + 41) - .5) * .05;
  const e = Math.pow(smooth(s), 1.25);
  return [x0 + (x1 - x0) * s,
    spread * reach * e + Math.sin(s * 7 + k * 1.7 + t * .6) * .022 * s,
    (noise(k + 7) - .5) * .9 * e];
}
const hubs = [[-.22, -.16], [.18, -.2], [.27, .12], [-.04, .26], [-.3, .14], [.04, -.02], [.36, -.08]];
const links = [[0, 5], [5, 1], [1, 6], [6, 2], [2, 3], [3, 4], [4, 0], [5, 3], [5, 2]];

// Per-index random seeds are fixed, so compute them once per particle count.
const seedCache = new Map();
function seedsFor(n) {
  let s = seedCache.get(n);
  if (!s) { s = {u: new Float32Array(n), v: new Float32Array(n), w: new Float32Array(n)};
    for (let i = 0; i < n; i++) { s.u[i] = noise(i + 1); s.v[i] = noise(i + 113); s.w[i] = noise(i + 307); } seedCache.set(n, s); }
  return s;
}
export function formation(scene, i, n, t = 0) {
  const S = seedsFor(n), u = S.u[i], v = S.v[i], w = S.w[i];
  let x = 0, y = 0, z = 0, a = .5, h = 0;
  if (scene === 0) { // A field of possible change: a quiet plane with three worlds rising from it.
    const cols = Math.ceil(Math.sqrt(n * 1.55)), rows = Math.ceil(n / cols), c = i % cols, r = Math.floor(i / cols);
    x = (c / (cols - 1) - .5) * 3.9; z = (r / (rows - 1) - .5) * 2.5;
    const d = Math.hypot(x, z);
    y = .5 + Math.sin(d * 5.2 - t * 1.1) * .028 * Math.min(1, d);
    a = .34;
    for (const [px, pz] of [[.12, -.45], [.9, .22], [1.45, -.62]]) {
      const q = Math.hypot(x - px, z - pz);
      if (q < .34) { y -= Math.cos(q / .34 * Math.PI / 2) * .17 * (1 + Math.sin(t * .8 + px) * .08); a = .9; h = 1; }
    }
  } else if (scene === 1) { // One lived future, its unseen alternatives barely there.
    const s = frac(v + t * .035);
    if (u < .42) { x = -1.75 + 1.4 * s; y = Math.sin((x + .35) * 2.1) * .03; z = 0; a = .85; h = 1; }
    else if (u < .66) { [x, y, z] = branch(22, 48, s, -.35, 1.7, .62, t); y *= .5; a = .9; h = 1; }
    else { [x, y, z] = branch(Math.floor(w * 48), 48, s, -.35, 1.7, .62, t); a = .17; }
  } else if (scene === 2) { // Three organisations: a floor, teams at hubs, work flowing between them.
    const g = i % 3, cx = (g - 1) * 1.08;
    if (u < .5) { const j = Math.floor(i / 3), m = Math.ceil(n / 3) * .5, r = .44 * Math.sqrt((j % m) / m), th = j * golden;
      x = cx + Math.cos(th) * r; z = Math.sin(th) * r; y = 0; a = .32; }
    else if (u < .8) { const k = Math.floor(v * hubs.length), hb = hubs[(k + g * 2) % hubs.length], rr = .055 * Math.cbrt(w);
      const th = w * tau * 7, ph = Math.acos(2 * noise(i + 9) - 1);
      x = cx + hb[0] + Math.sin(ph) * Math.cos(th) * rr; z = hb[1] + Math.sin(ph) * Math.sin(th) * rr; y = -.07 - Math.cos(ph) * rr * 1.6; a = .92; h = 1; }
    else { const [p, q] = links[Math.floor(v * links.length)], A = hubs[(p + g * 2) % hubs.length], B = hubs[(q + g * 2) % hubs.length], s = frac(w + t * .16);
      x = cx + A[0] + (B[0] - A[0]) * s; z = A[1] + (B[1] - A[1]) * s; y = -.07 - Math.sin(s * Math.PI) * .09; a = .85; h = 2; }
  } else if (scene === 3) { // Partial records: fanned sheets with gaps where evidence is missing.
    const k = i % 6, j = Math.floor(i / 6), row = j % 15, col = Math.floor(j / 15) % 22;
    const sx = (k - 2.5) * .36, sy = (k % 2 ? .1 : -.1), sz = (2.5 - k) * .09, rot = (k - 2.5) * .07;
    const lx = (col / 21 - .5) * .3, ly = (row / 14 - .5) * .44;
    x = sx + lx * Math.cos(rot) - ly * Math.sin(rot); y = sy + lx * Math.sin(rot) + ly * Math.cos(rot); z = sz;
    const lineLen = .35 + noise(row * 13 + k * 7) * .65, hole = noise(Math.floor(row / 3) * 5 + Math.floor(col / 6) * 17 + k * 31) < .24;
    a = hole ? .05 : (row % 3 === 0 && col / 21 < lineLen ? .9 : .3); h = !hole && row % 3 === 0 && col / 21 < lineLen ? 1 : 0;
    if (hole && u < .5) { y -= frac(u * 9 + t * .05) * .5; a = .14 * (1 - frac(u * 9 + t * .05)); }
  } else if (scene === 4) { // 108 attempts: three worlds, six setups, six tries each.
    const o = i % 108, g = Math.floor(o / 36), col = Math.floor(o % 36 / 6), row = o % 6, j = Math.floor(i / 108);
    const m = Math.ceil(n / 108), yy = 1 - 2 * (j + .5) / m, rr = Math.sqrt(1 - yy * yy), r = .036;
    x = (g - 1) * .98 + (col - 2.5) * .138 + Math.cos(j * golden + t * .5) * rr * r; y = (row - 2.5) * .138 + yy * r; z = Math.sin(j * golden + t * .5) * rr * r;
    a = .82; h = col < 3 ? 1 : 2;
  } else if (scene === 5) { // One change at the core; its forecast range around it; the world beyond.
    if (u < .24) { const p = Math.cbrt(w) * .17, th = v * tau, ph = Math.acos(2 * noise(i + 5) - 1);
      x = Math.sin(ph) * Math.cos(th) * p; y = Math.cos(ph) * p; z = Math.sin(ph) * Math.sin(th) * p; a = .95; h = 1; }
    else if (u < .4) { const th = v * tau + t * .25, r = .33 + (w - .5) * .07;
      x = Math.cos(th) * r; y = Math.sin(th) * r * .92; z = (noise(i + 3) - .5) * .05; a = .85; h = 2; }
    else { const yy = 1 - 2 * w, rr = Math.sqrt(1 - yy * yy), th = i * golden + t * .05, r = .78 + (v - .5) * .05;
      x = Math.cos(th) * rr * r; y = yy * r; z = Math.sin(th) * rr * r; a = .3; }
  } else if (scene === 6) { // Every future branch now lived, streaming outward.
    const k = Math.floor(u * 72), s = frac(v + t * .05);
    [x, y, z] = branch(k, 72, s, -1.25, 1.65, .9, t); a = .5; if (k % 12 === 3) { a = .92; h = 1; }
  } else { // The oracle: a knowing sphere ringed by its search.
    if (u < .62) { const yy = 1 - 2 * (i + .5) / n, rr = Math.sqrt(1 - yy * yy), th = i * golden + t * .08;
      x = Math.cos(th) * rr * .6; y = yy * .6; z = Math.sin(th) * rr * .6; a = .42; }
    else if (u < .78) { const m = Math.floor(v * 6), th = w * tau, ax = m * Math.PI / 6 + t * .08;
      x = Math.cos(th) * Math.cos(ax) * .61; z = Math.cos(th) * Math.sin(ax) * .61; y = Math.sin(th) * .61; a = .8; h = 1; }
    else { const ring = u < .89 ? 0 : 1, th = w * tau + t * (ring ? -.12 : .1), r = ring ? .95 : .82, tl = ring ? .5 : -.35;
      x = Math.cos(th) * r; y = Math.sin(th) * r * Math.sin(tl) * .5; z = Math.sin(th) * r * Math.cos(tl); a = .78; h = 2; }
  }
  return {x, y, z, a, h};
}

// Fine strokes that make structure legible: lived paths, unseen branches, work links, orbits.
export function strokes(scene, t = 0) {
  const out = [], line = (pts, alpha, h) => out.push({pts, alpha, h});
  const path = (f, steps = 48) => Array.from({length: steps + 1}, (_, s) => f(s / steps));
  if (scene === 1) {
    line(path(s => { const x = -1.75 + 1.4 * s; return [x, Math.sin((x + .35) * 2.1) * .03, 0]; }), .55, 1);
    line(path(s => { const p = branch(22, 48, s, -.35, 1.7, .62, t); return [p[0], p[1] * .5, p[2]]; }), .55, 1);
    for (let k = 0; k < 48; k += 2) line(path(s => branch(k, 48, s, -.35, 1.7, .62, t)), .075, 0);
  } else if (scene === 2) {
    for (let g = 0; g < 3; g++) for (const [p, q] of links) { const A = hubs[(p + g * 2) % hubs.length], B = hubs[(q + g * 2) % hubs.length], cx = (g - 1) * 1.08;
      line(path(s => [cx + A[0] + (B[0] - A[0]) * s, -.07 - Math.sin(s * Math.PI) * .09, A[1] + (B[1] - A[1]) * s], 12), .22, 2); }
  } else if (scene === 6) {
    for (let k = 0; k < 72; k++) line(path(s => branch(k, 72, s, -1.25, 1.65, .9, t)), k % 12 === 3 ? .4 : .07, k % 12 === 3 ? 1 : 0);
  } else if (scene === 7) {
    for (const ring of [0, 1]) { const r = ring ? .95 : .82, tl = ring ? .5 : -.35;
      line(path(s => { const th = s * tau; return [Math.cos(th) * r, Math.sin(th) * r * Math.sin(tl) * .5, Math.sin(th) * r * Math.cos(tl)]; }, 96), .3, 2); }
  }
  return out;
}

// Camera per scene: yaw, pitch and a perspective distance.
export const cameras = [
  {turn: -.12, tilt: -.78}, {turn: 0, tilt: -.1}, {turn: .08, tilt: -.62}, {turn: .38, tilt: -.16},
  {turn: .12, tilt: -.1}, {turn: .3, tilt: -.25}, {turn: .2, tilt: -.18}, {turn: .3, tilt: -.22}];
export function project(p, turn = 0, tilt = 0, dist = 4) {
  const x = p.x * Math.cos(turn) + p.z * Math.sin(turn), z1 = -p.x * Math.sin(turn) + p.z * Math.cos(turn);
  const y = p.y * Math.cos(tilt) - z1 * Math.sin(tilt), z = p.y * Math.sin(tilt) + z1 * Math.cos(tilt);
  const s = dist / (dist - z);
  return {x: x * s, y: y * s, z, s};
}

// Static diagram for no-JavaScript, reduced-motion and print readers.
export function staticScene(scene, n = 1500) {
  const cam = cameras[scene], scale = scene === 0 ? 205 : scene === 4 ? 250 : 290, cy = scene === 0 ? 250 : 310;
  const colour = h => [ink.field, ink.ink, ink.accent][h];
  const pt = p => { const q = project(p, cam.turn, cam.tilt); return [450 + q.x * scale, cy + q.y * scale, q]; };
  let body = '';
  for (const s of strokes(scene)) body += `<polyline points="${s.pts.map(([x, y, z]) => pt({x, y, z}).slice(0, 2).map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${colour(s.h)}" stroke-opacity="${s.alpha}" stroke-width="1"/>`;
  const dots = Array.from({length: n}, (_, i) => formation(scene, i, n)).map(p => ({p, q: pt(p)})).sort((a, b) => a.q[2].z - b.q[2].z);
  const groups = [[], [], []];
  for (const {p, q} of dots) groups[p.h].push(`<circle cx="${Math.round(q[0])}" cy="${Math.round(q[1])}" r="${(1.5 * q[2].s).toFixed(1)}" opacity="${p.a.toFixed(1)}"/>`);
  groups.forEach((g, h) => { if (g.length) body += `<g fill="${colour(h)}">${g.join('')}</g>`; });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620">${body}</svg>`;
}
