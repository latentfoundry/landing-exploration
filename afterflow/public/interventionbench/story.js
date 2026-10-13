import {createTimeline, animate as animeAnimate, stagger, utils} from './vendor/anime.esm.min.js';
import {formation, strokes, cameras, ink, SCENES} from './particle-shapes.js';
import {createField} from './field-gl.js';
export function mount(root) {
 const cleanups = [];
 const listen = (target, type, handler, options) => {
  target.addEventListener(type, handler, options);
  cleanups.push(() => target.removeEventListener(type, handler, options));
 };
 const document = {
  createElement: (...args) => window.document.createElement(...args),
  querySelector: selector => root.querySelector(selector),
  querySelectorAll: selector => root.querySelectorAll(selector),
  getElementById: id => root.querySelector('[id="' + CSS.escape(id) + '"]'),
  get hidden() { return window.document.hidden; },
  addEventListener: (...args) => window.document.addEventListener(...args),
  removeEventListener: (...args) => window.document.removeEventListener(...args),
 };
 const frames = new Set();
 const requestAnimationFrame = callback => {
  const id = window.requestAnimationFrame(time => { frames.delete(id); callback(time); });
  frames.add(id); return id;
 };
 cleanups.push(() => frames.forEach(id => window.cancelAnimationFrame(id)));
const animate = (...args) => { const animation = animeAnimate(...args); cleanups.push(() => animation.pause()); return animation; };

const story = document.querySelector('.particle-story'), canvas = document.querySelector('#world-canvas');
const ctx = canvas?.getContext('2d');
const reduced = matchMedia('(prefers-reduced-motion:reduce)'), small = matchMedia('(max-width:760px)');
if (!ctx) story?.classList.add('cinema-fallback');

if (ctx) {
  const scenes = [...document.querySelectorAll('[data-scene]')], toggle = document.querySelector('#motion-toggle');
  const navLinks = [...document.querySelectorAll('.scene-nav a')];
  let W = 0, H = 0, dpr = 1, raf = 0, active = true, last = 0, phase = 0, paused = false, visible = true, N = 0, seeds = null, centres = [], dirty = true;
  const state = {scene: 0}, pointer = {x: 0, y: 0, tx: 0, ty: 0}, cursor = {x: -1e4, y: -1e4, tx: -1e4, ty: -1e4};
  // Anime.js owns the morph timing: native scroll seeks one authored timeline across all scenes.
  const morph = createTimeline({autoplay: false});
  for (let s = 1; s < SCENES; s++) morph.add(state, {scene: s, duration: 1000, ease: 'inOutQuad'}, (s - 1) * 1000);
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x)), smooth = t => t * t * (3 - 2 * t);

  // Where each formation sits on the stage, as fractions of the stage and a scale rule.
  const anchor = s => {
    if (small.matches) { const up = H < 720 ? .06 : 0;
      return [[.5, .34 - up, W * .4], [.5, .34 - up, W * .3], [.5, .27 - up, W * .29], [.5, .28 - up, W * .4], [.5, .25 - up, W * .3], [.5, .28 - up, W * .46], [.46, .28 - up, W * .3], [.5, .28 - up, W * .46]][s]; }
    const m = Math.min;
    return [[.5, .56, W * .31], [.5, .38, W * .28], [.5, .565, m(W * .26, H * .7)], [.67, .5, m(W * .235, H * .56)],
      [.67, .5, m(W * .172, H * .66)], [.66, .5, m(W * .28, H * .53)], [.63, .5, m(W * .24, H * .47)], [.67, .48, m(W * .235, H * .44)]][s];
  };
  const sprites = Object.values(ink).map(colour => {
    const c = document.createElement('canvas'); c.width = c.height = 24; const g = c.getContext('2d');
    g.fillStyle = colour; g.beginPath(); g.arc(12, 12, 11.5, 0, Math.PI * 2); g.fill(); return c;
  });
  const colours = Object.values(ink);
  // GPU path: particles fly between formations on their own curves, staggered, with a slight bounce.
  // Without WebGL2 the Canvas 2D morph below remains the renderer.
  const glCanvas = document.querySelector('#world-gl');
  let field = null;
  try { field = glCanvas ? createField(glCanvas, colours) : null; } catch { field = null; }
  if (field) story.classList.add('gl-live'); else glCanvas?.remove();
  // Scroll-scrubbed flight: a smoothed scroll position picks the pair of formations and how far
  // between them we are. Pairs share endpoints, so hand-offs are seamless, and the smoothing gives
  // inertia: a fast flick plays through the in-between shapes instead of freezing them.
  const flight = {S: 0, pair: -2};
  let fromPos, fromAttr, toPos, toAttr, path;
  const rng = seed => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  function fill(scene, t, pos, attr) {
    const k = camera(scene), base = small.matches ? 1.25 : 1.7;
    for (let i = 0; i < N; i++) {
      const p = formation(scene, i, N, t); place(k, p, A);
      pos[2 * i] = A.x; pos[2 * i + 1] = A.y;
      attr[3 * i] = base * A.s * (p.h ? 1.15 : 1); attr[3 * i + 1] = p.a; attr[3 * i + 2] = p.h;
    }
  }
  // One fixed flight plan per pair (seeded), so scrubbing back and forth replays the same motion;
  // particles land centre-out.
  function plan(pair) {
    const rand = rng(pair * 7919 + 13), K = 6 + Math.floor(rand() * 6);
    const bands = Array.from({length: K}, () => [(.05 + .9 * rand()) * W, (.06 + .88 * rand()) * H]);
    let cx = 0, cy = 0, n = 0;
    for (let i = 0; i < N; i++) if (toAttr[3 * i + 1] > .05) { cx += toPos[2 * i]; cy += toPos[2 * i + 1]; n++; }
    cx /= n || 1; cy /= n || 1;
    let max = 1; const dist = new Float32Array(N);
    for (let i = 0; i < N; i++) { dist[i] = Math.hypot(toPos[2 * i] - cx, toPos[2 * i + 1] - cy); max = Math.max(max, dist[i]); }
    for (let i = 0; i < N; i++) {
      const b = Math.min(K - 1, Math.max(0, Math.floor(fromPos[2 * i] / W * K)));
      const sx = (.02 + .96 * rand()) * W, sy = (.03 + .94 * rand()) * H;
      // A gentle swell: each particle bows out from the midpoint of its journey, a third of the
      // way toward a scatter point, so shapes loosen and re-form rather than exploding.
      const mx = (fromPos[2 * i] + toPos[2 * i]) / 2, my = (fromPos[2 * i + 1] + toPos[2 * i + 1]) / 2;
      const tx = sx + (bands[b][0] - sx) * .3, ty = sy + (bands[b][1] - sy) * .3;
      path[4 * i] = mx + (tx - mx) * .32; path[4 * i + 1] = my + (ty - my) * .32;
      path[4 * i + 2] = .22 * dist[i] / max + .06 * rand(); path[4 * i + 3] = .66 + .06 * rand();
    }
    field.path(path);
  }
  function measure() {
    // Scene centres in document coordinates; scroll then needs no layout reads.
    centres = scenes.map(el => { const r = el.getBoundingClientRect(); return r.top + scrollY + r.height / 2; });
  }
  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight; dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = field ? (small.matches ? 3780 : 7560) : (small.matches ? 2808 : 4536);
    if (n !== N) { N = n; seeds = new Float32Array(N); for (let i = 0; i < N; i++) seeds[i] = (Math.sin(i * 91.7 + 3.1) * 43758.5453 % 1 + 1) % 1 * .35;
      if (field) { fromPos = new Float32Array(N * 2); fromAttr = new Float32Array(N * 3); toPos = new Float32Array(N * 2); toAttr = new Float32Array(N * 3); path = new Float32Array(N * 4); field.seeds(seeds.map(x => x / .35)); } }
    if (field) { field.resize(W, H, Math.min(devicePixelRatio || 1, 2)); flight.pair = -2; }
    measure(); update(); request();
  }
  function progress() {
    const centre = scrollY + innerHeight * .5; let p = 0;
    for (let i = 0; i < centres.length - 1; i++) if (centre >= centres[i]) p = i + clamp((centre - centres[i]) / (centres[i + 1] - centres[i]), 0, 1);
    return clamp(p, 0, SCENES - 1);
  }
  let shown = -1;
  function update() {
    if (!active) return;
    let current;
    if (field) { current = Math.round(progress()); }
    else { morph.seek(progress() * 1000); current = Math.round(state.scene); }
    if (current !== shown) { shown = current; story.dataset.activeScene = String(current);
      navLinks.forEach(a => a.toggleAttribute('data-active', scenes.findIndex(s => s.id === a.hash.slice(1)) === current)); }
    dirty = true;
  }

  // Per-frame camera for a scene: trigonometry and anchors computed once, not per particle.
  function camera(scene) {
    const c = cameras[scene], [ax, ay, sc] = anchor(scene);
    const turn = c.turn + pointer.x * .12 + (paused ? 0 : Math.sin(phase * .21) * .05), tilt = c.tilt + pointer.y * .06;
    return {ct: Math.cos(turn), st: Math.sin(turn), cp: Math.cos(tilt), sp: Math.sin(tilt), ox: W * ax, oy: H * ay, sc};
  }
  function place(k, p, out) {
    const x = p.x * k.ct + p.z * k.st, z1 = -p.x * k.st + p.z * k.ct;
    const y = p.y * k.cp - z1 * k.sp, z = p.y * k.sp + z1 * k.cp, s = 4 / (4 - z);
    out.x = k.ox + x * s * k.sc; out.y = k.oy + y * s * k.sc; out.s = s;
  }
  const A = {}, B = {}, P = {x: 0, y: 0, z: 0};
  // Each formation is projected through its own camera, then the two screen positions are blended
  // per particle with a seeded delay, so a change ripples through the field instead of cross-fading.
  function render() {
    if (!active || !W) return;
    dirty = false;
    ctx.clearRect(0, 0, W, H);
    if (field) {
      const a = Math.min(SCENES - 2, Math.floor(flight.S)), b = a + 1;
      // Each shape holds while its section is read (first 17% of the scroll to the next), then flies.
      const T = clamp((flight.S - a - .17) / .76, 0, 1), fresh = flight.pair !== a;
      // Only formations that can be seen are recomputed; a new pair needs both to plan its flight.
      if (fresh || T < 1) { fill(a, phase, fromPos, fromAttr); field.from(fromPos, fromAttr); }
      if (fresh || T > 0) { fill(b, phase, toPos, toAttr); field.to(toPos, toAttr); }
      if (fresh) { flight.pair = a; plan(a); }
      ctx.lineWidth = .8;
      for (const [sc, w] of [[a, clamp(1 - T * 3, 0, 1)], [b, clamp((T - .82) / .18, 0, 1)]]) {
        if (w <= 0) continue;
        const k = camera(sc);
        for (const line of strokes(sc, phase)) {
          ctx.beginPath();
          for (let j = 0; j < line.pts.length; j++) { const q = line.pts[j]; P.x = q[0]; P.y = q[1]; P.z = q[2]; place(k, P, A); j ? ctx.lineTo(A.x, A.y) : ctx.moveTo(A.x, A.y); }
          ctx.strokeStyle = colours[line.h]; ctx.globalAlpha = line.alpha * w; ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
      field.draw(T, phase, small.matches ? -1e4 : cursor.x, small.matches ? -1e4 : cursor.y);
      return;
    }
    const a = Math.floor(state.scene), b = Math.min(a + 1, SCENES - 1), mix = state.scene - a, t = phase;
    const ka = camera(a), kb = b === a ? ka : camera(b);
    // Structural strokes fade out early and in late so lines never detach from moving points.
    ctx.lineWidth = .8;
    for (const [s, k, w] of [[a, ka, clamp(1 - mix * 2.5, 0, 1)], [b, kb, b === a ? 0 : clamp((mix - .6) / .4, 0, 1)]]) {
      if (w <= 0) continue;
      for (const line of strokes(s, t)) {
        ctx.beginPath();
        for (let j = 0; j < line.pts.length; j++) { const q = line.pts[j]; P.x = q[0]; P.y = q[1]; P.z = q[2]; place(k, P, A); j ? ctx.lineTo(A.x, A.y) : ctx.moveTo(A.x, A.y); }
        ctx.strokeStyle = colours[line.h]; ctx.globalAlpha = line.alpha * w; ctx.stroke();
      }
    }
    const R = small.matches ? 0 : 120, R2 = R * R, base = small.matches ? 1.15 : 1.4, cx = cursor.x, cy = cursor.y;
    for (let i = 0; i < N; i++) {
      const m = mix <= 0 ? 0 : smooth(clamp((mix - seeds[i]) / .65, 0, 1));
      let x, y, s, al, h;
      if (m < 1) { const p = formation(a, i, N, t); place(ka, p, A); x = A.x; y = A.y; s = A.s; al = p.a; h = p.h; }
      if (m > 0) { const q = formation(b, i, N, t); place(kb, q, B);
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
      if (field) { const target = progress(); flight.S += (target - flight.S) * (1 - Math.exp(-dt / .14)); if (Math.abs(target - flight.S) < 1e-4) flight.S = target; }
      render(); }
    raf = requestAnimationFrame(frame);
  }
  function request() { if (!raf && active && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } }
  function setup() {
    active = !reduced.matches; toggle.hidden = !active;
    // The server-rendered layout is already final. Reveal the live field only
    // after its first frame is drawn; CSS fades in the finished field.
    if (active) { resize(); render(); }
    else { cancelAnimationFrame(raf); raf = 0; morph.seek(0); }
    story.classList.toggle('cinema-live', active);
  }
  listen(toggle, 'click', () => {
    paused = !paused; toggle.setAttribute('aria-pressed', String(paused)); toggle.querySelector('span').textContent = paused ? 'Resume motion' : 'Pause motion';
    story.dataset.motionPaused = String(paused); if (paused) { cancelAnimationFrame(raf); raf = 0; render(); } else { request(); }
  });
  listen(story, 'pointermove', e => {
    if (!active || paused || e.pointerType === 'touch') return;
    const r = canvas.getBoundingClientRect(); cursor.tx = e.clientX - r.left; cursor.ty = e.clientY - r.top;
    pointer.tx = e.clientX / innerWidth - .5; pointer.ty = e.clientY / innerHeight - .5;
  }, {passive: true});
  listen(story, 'pointerleave', () => { cursor.tx = cursor.ty = -1e4; });
  // Scroll only seeks the timeline; drawing happens once per animation frame.
  listen(window, 'scroll', () => { update(); request(); }, {passive: true});
  listen(window, 'resize', resize); listen(window, 'load', () => { measure(); update(); request(); });
  if ('ResizeObserver' in window) { const observer = new ResizeObserver(() => { measure(); update(); }); observer.observe(document.querySelector('.story-scenes')); cleanups.push(() => observer.disconnect()); }
  listen(reduced, 'change', setup);
  listen(document, 'visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else request(); });
  const storyObserver = new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { render(); request(); } else { cancelAnimationFrame(raf); raf = 0; } }, {rootMargin: '600px'}); storyObserver.observe(story); cleanups.push(() => { active = false; storyObserver.disconnect(); cancelAnimationFrame(raf); morph.pause(); });
  setup();
}

// Results: each ranked dot travels out from "current" to where it landed. Final positions are
// already in the HTML, so nothing is hidden if this never runs.
const strips = [...document.querySelectorAll('.world-strip')].filter(s => s.getBoundingClientRect().top > innerHeight);
if (strips.length && !reduced.matches && 'IntersectionObserver' in window) {
  strips.forEach(strip => utils.set(strip.querySelectorAll('.strip-pos'), {translateX: strip.dataset.zero + '%'}));
  const io = new IntersectionObserver(entries => entries.forEach(({isIntersecting, target}) => {
    if (!isIntersecting) return;
    io.unobserve(target);
    animate(target.querySelectorAll('.strip-pos'), {translateX: el => el.dataset.to + '%', duration: 1400, delay: stagger(90, {start: 150}), ease: 'outExpo'});
  }), {threshold: .35});
  strips.forEach(s => io.observe(s)); cleanups.push(() => io.disconnect());
}

// Shared Afterflow Lenis handles wheel input and anchor links on every route.
// The particle timeline follows the resulting scroll position.

return () => cleanups.reverse().forEach(cleanup => cleanup());
}
