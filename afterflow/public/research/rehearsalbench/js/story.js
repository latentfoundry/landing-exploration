// Scroll-driven particle story, adapted from the InterventionBench v0.1 page. One mount per
// `.particle-story`: a WebGL2 field flies particles between scene formations as the reader scrolls;
// Canvas 2D is the fallback renderer; reduced-motion readers keep the static diagrams.
import {formation, strokes, cameras, ink} from './shapes.js';
import {createField} from './field-gl.js';

const reduced = matchMedia('(prefers-reduced-motion:reduce)'), small = matchMedia('(max-width:760px)');
const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), smooth = t => t * t * (3 - 2 * t);
const inOutQuad = t => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
const rng = seed => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };

// Where each formation sits on the stage: [x fraction, y fraction, scale].
function anchor(key, W, H) {
  const m = Math.min;
  if (small.matches) { const up = H < 720 ? .06 : 0;
    return {hero: [.5, .66, W * .42], one: [.5, .3 - up, W * .3], rewind: [.5, .27 - up, W * .3], evidence: [.5, .28 - up, W * .4],
      plan: [.5, .28 - up, W * .46], futures: [.48, .28 - up, W * .3], score: [.5, .27 - up, W * .32]}[key]; }
  if (key === 'hero') return [.5, .6, W * .31];
  if (key === 'one') return [.5, .36, W * .28];
  // Other scenes sit in the free space between the copy column and the chapter rail.
  const gut = W <= 1100 ? 40 : 64, left = Math.max(gut, (W - 1320) / 2) + 540, right = W - 110;
  const half = {rewind: 2.0, evidence: 1.15, plan: .86, futures: 1.8, score: 1.35}[key];
  const cap = {rewind: H * .5, evidence: H * .56, plan: H * .53, futures: H * .42, score: H * .5}[key];
  if (right - left < 380) return [.64, .5, m(cap, W * .3 / half)]; // narrow windows: share space with the blurred copy panel
  return [(left + right) / 2 / W, .5, m(cap, (right - left) / 2 / half * .94)];
}

export function mountStory(story) {
  const cleanups = [];
  const listen = (target, type, handler, options) => { target.addEventListener(type, handler, options); cleanups.push(() => target.removeEventListener(type, handler, options)); };
  const canvas = story.querySelector('.world-canvas'), glCanvas = story.querySelector('.world-gl');
  const ctx = canvas?.getContext('2d');
  if (!ctx) { story.classList.add('cinema-fallback'); return () => {}; }

  const scenes = [...story.querySelectorAll('[data-scene]')], keys = scenes.map(s => s.dataset.scene), K = keys.length;
  const toggle = story.querySelector('.motion-toggle'), navLinks = [...story.querySelectorAll('.scene-nav a')];
  const colours = Object.values(ink);
  let W = 0, H = 0, raf = 0, active = true, last = 0, phase = 0, paused = false, visible = false, N = 0, seeds = null, centres = [], dirty = true;
  const pointer = {x: 0, y: 0, tx: 0, ty: 0}, cursor = {x: -1e4, y: -1e4, tx: -1e4, ty: -1e4};
  const sprites = colours.map(colour => {
    const c = document.createElement('canvas'); c.width = c.height = 24; const g = c.getContext('2d');
    g.fillStyle = colour; g.beginPath(); g.arc(12, 12, 11.5, 0, Math.PI * 2); g.fill(); return c;
  });
  let field = null;
  try { field = glCanvas ? createField(glCanvas, colours) : null; } catch { field = null; }
  if (field) story.classList.add('gl-live'); else glCanvas?.remove();

  const flight = {S: 0, pair: -2};
  let fromPos, fromAttr, toPos, toAttr, path;
  const A = {}, B = {}, P = {x: 0, y: 0, z: 0};

  function camera(i) {
    const c = cameras[keys[i]], [ax, ay, sc] = anchor(keys[i], W, H);
    const turn = c.turn + pointer.x * .12 + (paused ? 0 : Math.sin(phase * .21) * .05), tilt = c.tilt + pointer.y * .06;
    return {ct: Math.cos(turn), st: Math.sin(turn), cp: Math.cos(tilt), sp: Math.sin(tilt), ox: W * ax, oy: H * ay, sc};
  }
  function place(k, p, out) {
    const x = p.x * k.ct + p.z * k.st, z1 = -p.x * k.st + p.z * k.ct;
    const y = p.y * k.cp - z1 * k.sp, z = p.y * k.sp + z1 * k.cp, s = 4 / (4 - z);
    out.x = k.ox + x * s * k.sc; out.y = k.oy + y * s * k.sc; out.s = s;
  }
  function fill(i, t, pos, attr) {
    const k = camera(i), base = small.matches ? 1.25 : 1.7;
    for (let j = 0; j < N; j++) {
      const p = formation(keys[i], j, N, t); place(k, p, A);
      pos[2 * j] = A.x; pos[2 * j + 1] = A.y;
      attr[3 * j] = base * A.s * (p.h ? 1.15 : 1); attr[3 * j + 1] = p.a; attr[3 * j + 2] = p.h;
    }
  }
  // One seeded flight plan per pair, so scrubbing back and forth replays the same motion.
  function plan(pair) {
    const rand = rng(pair * 7919 + 13), Kb = 6 + Math.floor(rand() * 6);
    const bands = Array.from({length: Kb}, () => [(.05 + .9 * rand()) * W, (.06 + .88 * rand()) * H]);
    let cx = 0, cy = 0, n = 0;
    for (let i = 0; i < N; i++) if (toAttr[3 * i + 1] > .05) { cx += toPos[2 * i]; cy += toPos[2 * i + 1]; n++; }
    cx /= n || 1; cy /= n || 1;
    let max = 1; const dist = new Float32Array(N);
    for (let i = 0; i < N; i++) { dist[i] = Math.hypot(toPos[2 * i] - cx, toPos[2 * i + 1] - cy); max = Math.max(max, dist[i]); }
    for (let i = 0; i < N; i++) {
      const b = Math.min(Kb - 1, Math.max(0, Math.floor(fromPos[2 * i] / W * Kb)));
      const sx = (.02 + .96 * rand()) * W, sy = (.03 + .94 * rand()) * H;
      const mx = (fromPos[2 * i] + toPos[2 * i]) / 2, my = (fromPos[2 * i + 1] + toPos[2 * i + 1]) / 2;
      const tx = sx + (bands[b][0] - sx) * .3, ty = sy + (bands[b][1] - sy) * .3;
      path[4 * i] = mx + (tx - mx) * .32; path[4 * i + 1] = my + (ty - my) * .32;
      path[4 * i + 2] = .22 * dist[i] / max + .06 * rand(); path[4 * i + 3] = .66 + .06 * rand();
    }
    field.path(path);
  }
  function measure() { centres = scenes.map(el => { const r = el.getBoundingClientRect(); return r.top + scrollY + r.height / 2; }); }
  function progress() {
    if (K < 2) return 0;
    const c = scrollY + innerHeight * .5; let p = 0;
    for (let i = 0; i < K - 1; i++) if (c >= centres[i]) p = i + clamp((c - centres[i]) / (centres[i + 1] - centres[i]), 0, 1);
    return clamp(p, 0, K - 1);
  }
  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight; const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = field ? (small.matches ? 3780 : 7560) : (small.matches ? 2808 : 4536);
    if (n !== N) { N = n; seeds = new Float32Array(N); for (let i = 0; i < N; i++) seeds[i] = (Math.sin(i * 91.7 + 3.1) * 43758.5453 % 1 + 1) % 1 * .35;
      if (field) { fromPos = new Float32Array(N * 2); fromAttr = new Float32Array(N * 3); toPos = new Float32Array(N * 2); toAttr = new Float32Array(N * 3); path = new Float32Array(N * 4); field.seeds(seeds.map(x => x / .35)); } }
    if (field) { field.resize(W, H, Math.min(devicePixelRatio || 1, 2)); flight.pair = -2; }
    measure(); update(); dirty = true; request();
  }
  let shown = -1;
  function update() {
    if (!active) return;
    const current = Math.round(field ? flight.S : progress());
    if (current !== shown) { shown = current; story.dataset.activeScene = keys[current];
      navLinks.forEach(a => a.toggleAttribute('data-active', a.hash.slice(1) === scenes[current].id)); }
    dirty = true;
  }
  function drawStrokes(i, k, w) {
    if (w <= 0) return;
    for (const line of strokes(keys[i], phase)) {
      ctx.beginPath();
      for (let j = 0; j < line.pts.length; j++) { const q = line.pts[j]; P.x = q[0]; P.y = q[1]; P.z = q[2]; place(k, P, A); j ? ctx.lineTo(A.x, A.y) : ctx.moveTo(A.x, A.y); }
      ctx.strokeStyle = colours[line.h]; ctx.globalAlpha = line.alpha * w; ctx.stroke();
    }
  }
  function render() {
    if (!active || !W) return;
    dirty = false;
    ctx.clearRect(0, 0, W, H); ctx.lineWidth = .8;
    if (field) {
      const a = K > 1 ? Math.min(K - 2, Math.floor(flight.S)) : 0, b = K > 1 ? a + 1 : 0;
      // Each shape holds while its section is read, then flies to the next.
      const T = K > 1 ? clamp((flight.S - a - .17) / .76, 0, 1) : 0, fresh = flight.pair !== a;
      if (fresh || T < 1) { fill(a, phase, fromPos, fromAttr); field.from(fromPos, fromAttr); }
      if (fresh || T > 0) { fill(b, phase, toPos, toAttr); field.to(toPos, toAttr); }
      if (fresh) { flight.pair = a; plan(a); }
      drawStrokes(a, camera(a), clamp(1 - T * 3, 0, 1));
      if (b !== a) drawStrokes(b, camera(b), clamp((T - .82) / .18, 0, 1));
      ctx.globalAlpha = 1;
      field.draw(T, phase, small.matches ? -1e4 : cursor.x, small.matches ? -1e4 : cursor.y);
      return;
    }
    const st = progress(), a = Math.floor(st), b = Math.min(a + 1, K - 1), mix = b === a ? 0 : inOutQuad(st - a);
    const ka = camera(a), kb = b === a ? ka : camera(b);
    drawStrokes(a, ka, clamp(1 - mix * 2.5, 0, 1));
    if (b !== a) drawStrokes(b, kb, clamp((mix - .6) / .4, 0, 1));
    const R = small.matches ? 0 : 120, R2 = R * R, base = small.matches ? 1.15 : 1.4, cx = cursor.x, cy = cursor.y;
    for (let i = 0; i < N; i++) {
      const m = mix <= 0 ? 0 : smooth(clamp((mix - seeds[i]) / .65, 0, 1));
      let x, y, s, al, h;
      if (m < 1) { const p = formation(keys[a], i, N, phase); place(ka, p, A); x = A.x; y = A.y; s = A.s; al = p.a; h = p.h; }
      if (m > 0) { const q = formation(keys[b], i, N, phase); place(kb, q, B);
        if (m < 1) { x += (B.x - x) * m; y += (B.y - y) * m; s += (B.s - s) * m; al += (q.a - al) * m; if (m > .5) h = q.h; }
        else { x = B.x; y = B.y; s = B.s; al = q.a; h = q.h; } }
      if (al < .02) continue;
      if (R) { const dx = x - cx, dy = y - cy, d2 = dx * dx + dy * dy;
        if (d2 < R2) { const d = Math.sqrt(d2) || 1, f = (1 - d / R) ** 2; x += dx / d * f * 18; y += dy / d * f * 18; al = Math.min(1, al + f * .5); } }
      const r = base * s * (h ? 1.15 : 1);
      ctx.globalAlpha = al; ctx.drawImage(sprites[h], x - r, y - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
  }
  function frame(now) {
    raf = 0; if (!active || !visible || document.hidden) return;
    const step = small.matches ? 33 : 16;
    if (paused) { if (dirty) render(); return; }
    if (now - last >= step - 1) { const dt = Math.min(now - last, 50) / 1000; phase += dt; last = now;
      cursor.x += (cursor.tx - cursor.x) * .18; cursor.y += (cursor.ty - cursor.y) * .18;
      pointer.x += (pointer.tx - pointer.x) * .06; pointer.y += (pointer.ty - pointer.y) * .06;
      if (field) { const target = progress(); flight.S += (target - flight.S) * (1 - Math.exp(-dt / .14)); if (Math.abs(target - flight.S) < 1e-4) flight.S = target; update(); }
      render(); }
    raf = requestAnimationFrame(frame);
  }
  function request() { if (!raf && active && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function setup() {
    active = !reduced.matches; if (toggle) toggle.hidden = !active;
    if (active) { resize(); flight.S = progress(); render(); }
    else { cancelAnimationFrame(raf); raf = 0; }
    // Reveal the live field only after its first frame is drawn; CSS fades it in.
    story.classList.toggle('cinema-live', active);
  }
  if (toggle) listen(toggle, 'click', () => {
    paused = !paused; toggle.setAttribute('aria-pressed', String(paused)); toggle.querySelector('span').textContent = paused ? 'Resume motion' : 'Pause motion';
    story.dataset.motionPaused = String(paused); if (paused) { cancelAnimationFrame(raf); raf = 0; render(); } else request();
  });
  listen(story, 'pointermove', e => {
    if (!active || paused || e.pointerType === 'touch') return;
    const r = canvas.getBoundingClientRect(); cursor.tx = e.clientX - r.left; cursor.ty = e.clientY - r.top;
    pointer.tx = e.clientX / innerWidth - .5; pointer.ty = e.clientY / innerHeight - .5;
  }, {passive: true});
  listen(story, 'pointerleave', () => { cursor.tx = cursor.ty = -1e4; });
  listen(window, 'scroll', () => { if (!field) update(); dirty = true; request(); }, {passive: true});
  listen(window, 'resize', resize);
  listen(window, 'load', () => { measure(); update(); request(); });
  if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => { measure(); update(); }); ro.observe(document.body); cleanups.push(() => ro.disconnect()); }
  listen(reduced, 'change', setup);
  listen(document, 'visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else request(); });
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { render(); request(); } else { cancelAnimationFrame(raf); raf = 0; } }, {rootMargin: '200px'});
  io.observe(story); cleanups.push(() => { active = false; io.disconnect(); cancelAnimationFrame(raf); });
  setup();
  return () => cleanups.reverse().forEach(c => c());
}
