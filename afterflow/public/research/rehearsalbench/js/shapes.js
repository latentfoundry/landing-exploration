// Particle formations for the RehearsalBench page. Original illustrative geometry, adapted from the
// InterventionBench v0.1 page. Every formation is a pure function of (scene, index, count, time), so
// the live canvas and the static fallback diagrams draw from the same source.
//
// Scenes: hero (a field with three versions of one organisation rising from it), one (a single lived
// future), rewind (14 contact centres, calls arriving), evidence (reports with gaps), plan (a change and
// its forecast range), futures (one origin, three versions, many futures), score (forecast ranges meet
// what happened; positions follow the "where every model missed" chart).
export const ink = {field: '#6d7268', ink: '#1f221d', accent: '#2f5040'};
const tau = Math.PI * 2, golden = 2.39996323;
const frac = x => x - Math.floor(x);
const noise = i => frac(Math.sin(i * 127.1 + 311.7) * 43758.5453);
const smooth = t => t * t * (3 - 2 * t);

// A future branch: one origin, many outcomes.
function branch(k, K, s, x0, x1, reach, t = 0) {
  const spread = (k / (K - 1) - .5) * 2 + (noise(k + 41) - .5) * .05;
  const e = Math.pow(smooth(s), 1.25);
  return [x0 + (x1 - x0) * s,
    spread * reach * e + Math.sin(s * 7 + k * 1.7 + t * .6) * .022 * s,
    (noise(k + 7) - .5) * .9 * e];
}
// Three versions of the bank: as described, adverse, favourable. Each bundle of futures fans out from
// the same origin and drifts toward its own version.
const VERSIONS = 3, PER = 24;
function future(k, s, t) {
  const ver = k % VERSIONS, kk = Math.floor(k / VERSIONS);
  const p = branch(kk, PER, s, -1.3, 1.6, .2, t), e = Math.pow(smooth(s), 1.4);
  p[1] += (ver - 1) * .52 * e;
  p[2] += (ver - 1) * .18 * e;
  return p;
}
// Contact-centre layout: 7 x 2 on a floor, five agent desks per centre.
const centre = g => [((g % 7) - 3) * .5, (Math.floor(g / 7) - .5) * .74];
const desk = (g, k) => { const [cx, cz] = centre(g), th = k / 5 * tau + g * .9; return [cx + Math.cos(th) * .1, cz + Math.sin(th) * .1]; };
// Forecast bands and simulated effects, as fractions of each row's axis (from the paper's figure).
export const MISSES = [
  {band: [.1, .357], truth: .386},   // agent assist, handle time
  {band: [.1, .817], truth: .967},   // callback, wait time
  {band: [.767, .967], truth: .167}, // voice agent, repeat contacts
];
const rowX = f => -1.25 + 2.5 * f, rowY = r => (r - 1) * .5;

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
  if (scene === 'hero') { // A quiet field of possible change, three versions of one organisation rising.
    const cols = Math.ceil(Math.sqrt(n * 1.55)), rows = Math.ceil(n / cols), c = i % cols, r = Math.floor(i / cols);
    x = (c / (cols - 1) - .5) * 3.9; z = (r / (rows - 1) - .5) * 2.5;
    const d = Math.hypot(x, z);
    y = .5 + Math.sin(d * 5.2 - t * 1.1) * .028 * Math.min(1, d);
    a = .34;
    for (const [px, pz] of [[.12, -.45], [.9, .22], [1.45, -.62]]) {
      const q = Math.hypot(x - px, z - pz);
      if (q < .34) { y -= Math.cos(q / .34 * Math.PI / 2) * .17 * (1 + Math.sin(t * .8 + px) * .08); a = .9; h = 1; }
    }
  } else if (scene === 'one') { // One lived future, its unseen alternatives barely there.
    const s = frac(v + t * .035);
    if (u < .42) { x = -1.75 + 1.4 * s; y = Math.sin((x + .35) * 2.1) * .03; z = 0; a = .85; h = 1; }
    else if (u < .66) { [x, y, z] = branch(22, 48, s, -.35, 1.7, .62, t); y *= .5; a = .9; h = 1; }
    else { [x, y, z] = branch(Math.floor(w * 48), 48, s, -.35, 1.7, .62, t); a = .17; }
  } else if (scene === 'rewind') { // Fourteen contact centres: a floor, agent desks, calls arriving.
    const g = i % 14, [cx, cz] = centre(g), j = Math.floor(i / 14), m = Math.ceil(n / 14);
    if (u < .46) { const r = .19 * Math.sqrt((j % m) / m), th = j * golden;
      x = cx + Math.cos(th) * r; z = cz + Math.sin(th) * r; y = 0; a = .3; }
    else if (u < .84) { const [hx, hz] = desk(g, Math.floor(v * 5)), rr = .03 * Math.cbrt(w), th = w * tau * 7, ph = Math.acos(2 * noise(i + 9) - 1);
      x = hx + Math.sin(ph) * Math.cos(th) * rr; z = hz + Math.sin(ph) * Math.sin(th) * rr; y = -.04 - Math.cos(ph) * rr * 1.6; a = .92; h = 1; }
    else { // Calls fall in from above and spiral to a desk; a few give up and drift away.
      const s = frac(w + t * .22 + g * .07), [hx, hz] = desk(g, Math.floor(v * 5)), quit = noise(i + 17) < .14;
      if (quit && s > .55) { const q = (s - .55) / .45; x = cx + (hx - cx) * .4 + q * .28 * (noise(i + 23) - .3); z = cz + q * .2; y = -.12 + q * .1; a = .45 * (1 - q); h = 0; }
      else { const e = smooth(s); x = cx + (hx - cx) * e + Math.cos(s * 9 + i) * .015 * (1 - e); z = cz + (hz - cz) * e; y = -.34 + .3 * e; a = .15 + .6 * e; h = 2; }
    }
  } else if (scene === 'evidence') { // Partial records: fanned sheets with gaps where evidence is missing.
    const k = i % 6, j = Math.floor(i / 6), row = j % 15, col = Math.floor(j / 15) % 22;
    const sx = (k - 2.5) * .36, sy = (k % 2 ? .1 : -.1), sz = (2.5 - k) * .09, rot = (k - 2.5) * .07;
    const lx = (col / 21 - .5) * .3, ly = (row / 14 - .5) * .44;
    x = sx + lx * Math.cos(rot) - ly * Math.sin(rot); y = sy + lx * Math.sin(rot) + ly * Math.cos(rot); z = sz;
    const lineLen = .35 + noise(row * 13 + k * 7) * .65, hole = noise(Math.floor(row / 3) * 5 + Math.floor(col / 6) * 17 + k * 31) < .24;
    a = hole ? .05 : (row % 3 === 0 && col / 21 < lineLen ? .9 : .3); h = !hole && row % 3 === 0 && col / 21 < lineLen ? 1 : 0;
    if (hole && u < .5) { y -= frac(u * 9 + t * .05) * .5; a = .14 * (1 - frac(u * 9 + t * .05)); }
  } else if (scene === 'plan') { // One change at the core; its forecast range around it; the world beyond.
    if (u < .24) { const p = Math.cbrt(w) * .17, th = v * tau, ph = Math.acos(2 * noise(i + 5) - 1);
      x = Math.sin(ph) * Math.cos(th) * p; y = Math.cos(ph) * p; z = Math.sin(ph) * Math.sin(th) * p; a = .95; h = 1; }
    else if (u < .4) { const th = v * tau + t * .25, r = .33 + (w - .5) * .07;
      x = Math.cos(th) * r; y = Math.sin(th) * r * .92; z = (noise(i + 3) - .5) * .05; a = .85; h = 2; }
    else { const yy = 1 - 2 * w, rr = Math.sqrt(1 - yy * yy), th = i * golden + t * .05, r = .78 + (v - .5) * .05;
      x = Math.cos(th) * rr * r; y = yy * r; z = Math.sin(th) * rr * r; a = .3; }
  } else if (scene === 'futures') { // Three versions of the bank, every future lived.
    const k = Math.floor(u * VERSIONS * PER), s = frac(v + t * .05);
    [x, y, z] = future(k, s, t); a = .5; if (Math.floor(k / VERSIONS) % 8 === 3) { a = .92; h = 1; }
  } else { // score: three forecast ranges, and where the simulated effect actually landed.
    const r = i % 3, row = MISSES[r], y0 = rowY(r);
    if (u < .16) { x = rowX(v); y = y0; z = 0; a = .26; }
    else if (u < .8) { const f = row.band[0] + (row.band[1] - row.band[0]) * v;
      x = rowX(f); y = y0 + (w - .5) * .1 + Math.sin(t * .9 + f * 9) * .006; z = (noise(i + 4) - .5) * .08; a = .5; h = 0; }
    else { const p = Math.cbrt(w) * .042, th = v * tau + t * .3, ph = Math.acos(2 * noise(i + 5) - 1);
      x = rowX(row.truth) + Math.sin(ph) * Math.cos(th) * p; y = y0 + Math.cos(ph) * p; z = Math.sin(ph) * Math.sin(th) * p; a = .95; h = 2; }
  }
  return {x, y, z, a, h};
}

// Fine strokes that make structure legible.
export function strokes(scene, t = 0) {
  const out = [], line = (pts, alpha, h) => out.push({pts, alpha, h});
  const path = (f, steps = 48) => Array.from({length: steps + 1}, (_, s) => f(s / steps));
  if (scene === 'one') {
    line(path(s => { const x = -1.75 + 1.4 * s; return [x, Math.sin((x + .35) * 2.1) * .03, 0]; }), .55, 1);
    line(path(s => { const p = branch(22, 48, s, -.35, 1.7, .62, t); return [p[0], p[1] * .5, p[2]]; }), .55, 1);
    for (let k = 0; k < 48; k += 2) line(path(s => branch(k, 48, s, -.35, 1.7, .62, t)), .075, 0);
  } else if (scene === 'rewind') {
    for (let g = 0; g < 14; g++) { const [cx, cz] = centre(g);
      line(path(s => [cx + Math.cos(s * tau) * .2, 0, cz + Math.sin(s * tau) * .2], 32), .22, 0); }
  } else if (scene === 'futures') {
    for (let k = 0; k < VERSIONS * PER; k++) { const lit = Math.floor(k / VERSIONS) % 8 === 3;
      line(path(s => future(k, s, t)), lit ? .4 : .06, lit ? 1 : 0); }
  } else if (scene === 'score') {
    MISSES.forEach((row, r) => {
      line([[rowX(0), rowY(r), 0], [rowX(1), rowY(r), 0]], .25, 0);
      line([[rowX(row.band[0]), rowY(r) - .09, 0], [rowX(row.band[0]), rowY(r) + .09, 0]], .4, 0);
      line([[rowX(row.band[1]), rowY(r) - .09, 0], [rowX(row.band[1]), rowY(r) + .09, 0]], .4, 0);
    });
  }
  return out;
}

// Camera per scene: yaw and pitch.
export const cameras = {
  hero: {turn: -.12, tilt: -.78}, one: {turn: 0, tilt: -.1}, rewind: {turn: .06, tilt: -.6},
  evidence: {turn: .38, tilt: -.16}, plan: {turn: .3, tilt: -.25}, futures: {turn: .2, tilt: -.18},
  score: {turn: .14, tilt: -.16}};

export function project(p, turn = 0, tilt = 0, dist = 4) {
  const x = p.x * Math.cos(turn) + p.z * Math.sin(turn), z1 = -p.x * Math.sin(turn) + p.z * Math.cos(turn);
  const y = p.y * Math.cos(tilt) - z1 * Math.sin(tilt), z = p.y * Math.sin(tilt) + z1 * Math.cos(tilt);
  const s = dist / (dist - z);
  return {x: x * s, y: y * s, z, s};
}

// Static diagram for no-JavaScript, reduced-motion and print readers.
export function staticScene(scene, n = 1500) {
  const cam = cameras[scene], scale = scene === 'hero' ? 205 : scene === 'rewind' ? 230 : 290, cy = scene === 'hero' ? 250 : 310;
  const colour = h => [ink.field, ink.ink, ink.accent][h];
  const pt = p => { const q = project(p, cam.turn, cam.tilt); return [450 + q.x * scale, cy + q.y * scale, q]; };
  let body = '';
  for (const s of strokes(scene)) body += `<polyline points="${s.pts.map(([x, y, z]) => pt({x, y, z}).slice(0, 2).map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="${colour(s.h)}" stroke-opacity="${s.alpha}" stroke-width="1"/>`;
  const dots = Array.from({length: n}, (_, i) => formation(scene, i, n)).map(p => ({p, q: pt(p)})).sort((a, b) => a.q[2].z - b.q[2].z);
  const groups = [[], [], []];
  for (const {p, q} of dots) if (p.a > .04) groups[p.h].push(`<circle cx="${Math.round(q[0])}" cy="${Math.round(q[1])}" r="${(1.5 * q[2].s).toFixed(1)}" opacity="${p.a.toFixed(1)}"/>`);
  groups.forEach((g, h) => { if (g.length) body += `<g fill="${colour(h)}">${g.join('')}</g>`; });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 620">${body}</svg>`;
}
