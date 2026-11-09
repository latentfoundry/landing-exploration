// RehearsalBench page behaviour, mounted by components/rehearsal-bench.tsx. Everything here is an
// enhancement: the page reads completely without it. mount() returns a cleanup function.
import {mountStory} from './story.js';

export function mount(root) {
  const cleanups = [];
  const listen = (target, type, handler, options) => { target.addEventListener(type, handler, options); cleanups.push(() => target.removeEventListener(type, handler, options)); };
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');

  // Particle stories. If the renderer can't start, the static diagrams fade in instead.
  root.querySelectorAll('.particle-story').forEach(story => {
    try { cleanups.push(mountStory(story)); }
    catch (error) { story.classList.add('cinema-fallback'); console.error('Particle story unavailable', error); }
  });

  // Leaderboard sorting. Ranked models re-order; partial and baseline rows stay below.
  const body = root.querySelector('.lb-ranked'), table = root.querySelector('.leaderboard');
  const buttons = [...root.querySelectorAll('.lb-controls button')];
  const order = {save: (a, b) => b.dataset.save - a.dataset.save, acc: (a, b) => b.dataset.acc - a.dataset.acc, cost: (a, b) => a.dataset.cost - b.dataset.cost};
  buttons.forEach(btn => listen(btn, 'click', () => {
    const rows = [...body.rows], first = new Map(rows.map(r => [r, r.getBoundingClientRect().top]));
    rows.sort(order[btn.dataset.sort]).forEach((r, i) => { r.querySelector('.lb-rank').textContent = i + 1; body.append(r); });
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    table.dataset.sort = btn.dataset.sort;
    if (reduced.matches) return;
    rows.forEach(r => { const dy = first.get(r) - r.getBoundingClientRect().top; if (dy) r.animate([{transform: `translateY(${dy}px)`}, {transform: 'none'}], {duration: 520, easing: 'cubic-bezier(.16,1,.3,1)'}); });
  }));

  // Bars and dots grow in once, when their figure first scrolls into view.
  const grow = [...root.querySelectorAll('.leaderboard, .missed, .h2h, .scatter, .ranks')];
  if (!reduced.matches && 'IntersectionObserver' in window) {
    grow.forEach(el => { if (el.getBoundingClientRect().top > innerHeight) el.classList.add('pre-reveal'); });
    const io = new IntersectionObserver(entries => entries.forEach(({isIntersecting, target}) => {
      if (!isIntersecting) return; io.unobserve(target);
      requestAnimationFrame(() => target.classList.replace('pre-reveal', 'revealed'));
    }), {threshold: .25});
    grow.forEach(el => io.observe(el));
    cleanups.push(() => io.disconnect());
  }

  // Rank chart: hovering a model highlights its line on both sides.
  const ranks = root.querySelector('.rk-plot');
  if (ranks) {
    const parts = model => ranks.querySelectorAll(`[data-model="${CSS.escape(model)}"]`);
    listen(ranks, 'pointerover', e => { const m = e.target.closest('[data-model]')?.dataset.model; if (!m) return; ranks.classList.add('focus'); parts(m).forEach(p => p.classList.add('on')); });
    listen(ranks, 'pointerout', e => { const m = e.target.closest('[data-model]')?.dataset.model; if (!m) return; ranks.classList.remove('focus'); parts(m).forEach(p => p.classList.remove('on')); });
  }

  return () => cleanups.reverse().forEach(cleanup => cleanup());
}
