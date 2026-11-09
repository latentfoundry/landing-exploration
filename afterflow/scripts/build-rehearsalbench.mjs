// Builds the RehearsalBench research page. Run: pnpm build:rehearsalbench
// - Reads content/rehearsalbench/template.html and writes content/rehearsalbench/page.html, which
//   app/research/rehearsalbench/page.tsx renders inside the site header and footer.
// - The leaderboard comes from public/research/rehearsalbench/leaderboard.csv (a copy of
//   afterflowinc/rehearsalbench's file, also offered as a download).
// - Figure data below is copied from the paper (rehearsalbench-paper/paper/rehearsalbench.tex); keep them in step.
// - Static fallback diagrams (public/research/rehearsalbench/scenes/*.svg) are drawn from the same
//   formations as the live particles.
import {readFileSync, writeFileSync} from 'node:fs';
import {staticScene} from '../public/research/rehearsalbench/js/shapes.js';

const project = new URL('../', import.meta.url);
const read = p => readFileSync(new URL(p, project), 'utf8');
const write = (p, s) => writeFileSync(new URL(p, project), s);

// Links. The paper link points to the results repo until the arXiv URL exists.
const LINKS = {
  paper: 'https://github.com/afterflowinc/rehearsalbench',
  repo: 'https://github.com/afterflowinc/rehearsalbench',
};

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const minus = s => String(s).replace(/^-/, '\u2212');
const pct = (lo, hi, v) => ((v - lo) / (hi - lo) * 100).toFixed(2);

// ---- Leaderboard -----------------------------------------------------------------------------
function parseCsv(text) {
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; } else if (c === '"') q = false; else cell += c; }
    else if (c === '"') q = true; else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; } else if (c !== '\r') cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows;
  return body.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}
const board = parseCsv(read('public/research/rehearsalbench/leaderboard.csv'));
const SAVE = [-1, 11], ACC = [0, 100];
const fx = (v, d = 1) => Number(v).toFixed(d);

function track(kind, v, lo, hi, [a, b], label) {
  const z = pct(a, b, Math.max(a, 0)), x = pct(a, b, Math.min(b, Math.max(a, v)));
  const l = pct(a, b, Math.max(a, lo)), r = pct(a, b, Math.min(b, hi));
  const left = Math.min(z, x), width = Math.abs(x - z);
  return `<span class="lb-track lb-${kind}" aria-hidden="true" style="--zero:${z}%">` +
    `<span class="lb-bar" style="left:${left}%;width:${width.toFixed(2)}%"></span>` +
    `<span class="lb-ci" style="left:${l}%;width:${(r - l).toFixed(2)}%"></span></span>` +
    `<span class="lb-num">${label}</span>`;
}
function leaderboardRows() {
  const ranked = board.filter(r => r.rank), partial = board.filter(r => !r.rank && r.model.includes('partial'));
  const base = board.filter(r => !r.rank && r.model.startsWith('Always'));
  const row = (r, i) => {
    const name = r.model.replace(' (partial)', '');
    const save = `${fx(r.cost_saved_pct)}%`, acc = `${Math.round(r.forecast_accuracy_pct)}%`;
    return `<tr style="--i:${i}" data-rank="${r.rank}" data-save="${r.cost_saved_pct}" data-acc="${r.forecast_accuracy_pct}" data-cost="${r.api_cost_per_run_usd}">` +
      `<td class="lb-rank">${r.rank}</td>` +
      `<th scope="row" class="lb-model"><span class="m">${esc(name)}</span><span class="d">${esc(r.developer)}</span></th>` +
      `<td class="lb-cell"><div class="lb-g">${track('save', +r.cost_saved_pct, +r.cost_saved_pct_lo95, +r.cost_saved_pct_hi95, SAVE, minus(save))}<span class="lb-range">${minus(fx(r.cost_saved_pct_lo95))}–${fx(r.cost_saved_pct_hi95)}</span></div></td>` +
      `<td class="lb-cell"><div class="lb-g">${track('acc', +r.forecast_accuracy_pct, +r.forecast_accuracy_pct_lo95, +r.forecast_accuracy_pct_hi95, ACC, acc)}<span class="lb-range">${Math.round(r.forecast_accuracy_pct_lo95)}–${Math.round(r.forecast_accuracy_pct_hi95)}</span></div></td>` +
      `<td class="lb-cost">$${fx(r.api_cost_per_run_usd, 2)}</td></tr>`;
  };
  const other = [
    ...partial.map(r => `<tr class="is-partial"><td class="lb-rank">—</td><th scope="row" class="lb-model"><span class="m">${esc(r.model.replace(' (partial)', ''))}</span><span class="d">${esc(r.developer)} · partial, ${r.valid_runs_pct}% of runs valid</span></th>` +
      `<td class="lb-cell"><div class="lb-g"><span class="lb-num">${minus(fx(r.cost_saved_pct))}%</span><span class="lb-range">${minus(fx(r.cost_saved_pct_lo95))}–${fx(r.cost_saved_pct_hi95)}</span></div></td><td class="lb-cell"><div class="lb-g"><span class="lb-num lb-text">worse than no effect</span></div></td><td class="lb-cost">$${fx(r.api_cost_per_run_usd, 2)}</td></tr>`),
    ...base.map(r => { const nothing = r.model.includes('do nothing');
      return `<tr class="is-baseline"><td class="lb-rank"></td><th scope="row" class="lb-model"><span class="m">${esc(r.model.replace(' (baseline)', ''))}</span><span class="d">Baseline</span></th>` +
      `<td class="lb-cell"><div class="lb-g"><span class="lb-num">${nothing ? '0.0%' : '—'}</span></div></td><td class="lb-cell"><div class="lb-g"><span class="lb-num">${nothing ? '—' : '0%'}</span></div></td><td class="lb-cost"></td></tr>`; }),
  ];
  return {ranked: ranked.map(row).join('\n'), other: other.join('\n')};
}

// ---- Figure: where every model missed (paper, fig:missed) ------------------------------------
const MISSED = [
  {name: 'Agent assist', metric: 'Change in call handling time, seconds', min: -14, max: 0, ticks: [-14, -7, 0], band: [-12.6, -9.0], truth: -8.6, f: v => minus(v.toFixed(1))},
  {name: 'Callbacks', metric: 'Change in wait time, seconds', min: -6, max: 0, ticks: [-6, -3, 0], band: [-5.4, -1.1], truth: -0.2, f: v => minus(v.toFixed(1))},
  {name: 'Voice agent', metric: 'Change in repeat calls, percentage points', min: 0, max: .6, ticks: [0, .3, .6], band: [.46, .58], truth: .10, f: v => v.toFixed(2)},
];
function missedChart() {
  return MISSED.map(r => {
    const P = v => pct(r.min, r.max, v);
    const ticks = r.ticks.map(t => `<span class="mc-tick" style="left:${P(t)}%">${minus(String(t))}</span>`).join('');
    return `<div class="mc-row" role="listitem">
  <div class="mc-label"><strong>${r.name}</strong><span>${r.metric}</span></div>
  <div class="mc-plot">
    <div class="mc-axis"></div>
    <div class="mc-band" style="left:${P(r.band[0])}%;width:${(P(r.band[1]) - P(r.band[0])).toFixed(2)}%"><span>${r.f(r.band[0])} to ${r.f(r.band[1])}</span></div>
    <div class="mc-truth${P(r.truth) > 88 ? ' edge-r' : P(r.truth) < 12 ? ' edge-l' : ''}" style="left:${P(r.truth)}%"><span>${r.f(r.truth)}</span></div>
    ${ticks}
  </div>
  <p class="vh">${r.name}, ${r.metric.toLowerCase()}: models forecast ${r.f(r.band[0])} to ${r.f(r.band[1])}; the simulated effect was ${r.f(r.truth)}.</p>
</div>`;
  }).join('\n');
}

// ---- Figure: cost saved against API cost per run (paper, fig:cost) ---------------------------
const SHORT = {'GPT-6 Astra': 'Astra', 'Claude Sonnet 5.5': 'Sonnet', 'GPT-6.1 Sol': 'Sol', 'Claude Fable 5.1': 'Fable', 'Claude Haiku 5.5': 'Haiku',
  'Qwen3.8 Flash': 'Qwen Flash', 'DeepSeek V4.1 Flash': 'DeepSeek Flash', 'GPT-6 Luna': 'Luna', 'Gemini 3.8 Flash': 'Gemini Flash'};
const LABEL_POS = {Astra: 'r', Sonnet: 't', Sol: 'l', Fable: 'rb', Haiku: 'r', 'Qwen Flash': 'rb', 'DeepSeek Flash': 'l', Luna: 'r', 'Gemini Flash': 'r'};
function costChart() {
  const lx = v => ((Math.log10(v) - Math.log10(.1)) / (Math.log10(25) - Math.log10(.1)) * 100).toFixed(2);
  const ly = v => (100 - (v + .5) / 8.5 * 100).toFixed(2);
  const xt = [[.1, '$0.10'], [.3, '$0.30'], [1, '$1'], [3, '$3'], [10, '$10']].map(([v, l]) => `<span class="sc-xt" style="left:${lx(v)}%"><em>${l}</em></span>`).join('');
  const yt = [0, 2, 4, 6, 8].map(v => `<span class="sc-yt" style="top:${ly(v)}%"><em>${v}%</em></span>`).join('');
  const pts = board.filter(r => r.rank).map(r => {
    const s = SHORT[r.model], key = s === 'Astra' || s === 'Sol';
    return `<span class="sc-pt${key ? ' is-key' : ''} at-${LABEL_POS[s]}" style="left:${lx(+r.api_cost_per_run_usd)}%;top:${ly(+r.cost_saved_pct)}%"><i></i><b>${s}</b></span>`;
  }).join('');
  const rows = board.filter(r => r.rank).map(r => `<tr><th scope="row">${esc(r.model)}</th><td>$${fx(r.api_cost_per_run_usd, 2)}</td><td>${fx(r.cost_saved_pct)}%</td></tr>`).join('');
  return `<div class="sc-plot" aria-hidden="true">${xt}${yt}${pts}</div>
<table class="vh"><caption>Cost per run and running cost saved</caption><tr><th>Model</th><th>Cost per run</th><th>Cost saved</th></tr>${rows}</table>`;
}

// ---- Figure: rank in RehearsalBench vs rank on real changes (paper, fig:ranks) ---------------
const RANKS_IB = ['GPT-6 Astra', 'Claude Sonnet 5.5', 'GPT-6.1 Sol', 'Claude Fable 5.1', 'Muse Spark 1.3', 'Claude Haiku 5.5',
  'DeepSeek V4.1 Flash', 'GPT-6 Luna', 'Qwen3.8 Flash', 'Gemini 3.8 Flash', 'Qwen3.8 27B', 'Gemini 3.5 Flash-Lite'];
const RANKS_REAL = ['GPT-6 Astra', 'GPT-6.1 Sol', 'Muse Spark 1.3', 'Claude Fable 5.1', 'Claude Sonnet 5.5', 'Claude Haiku 5.5',
  'Qwen3.8 Flash', 'DeepSeek V4.1 Flash', 'GPT-6 Luna', 'Qwen3.8 27B', 'Gemini 3.8 Flash', 'Gemini 3.5 Flash-Lite'];
const ADDED = new Set(['Muse Spark 1.3', 'Qwen3.8 27B', 'Gemini 3.5 Flash-Lite']);
function rankChart() {
  const n = RANKS_IB.length, y = i => ((i + .5) / n * 100).toFixed(3);
  const lines = RANKS_IB.map((m, i) => { const j = RANKS_REAL.indexOf(m);
    return `<line x1="0" y1="${y(i)}" x2="100" y2="${y(j)}" class="${ADDED.has(m) ? 'is-new' : ''}" data-model="${esc(m)}"/>`; }).join('');
  const col = list => list.map((m, i) => `<li class="${ADDED.has(m) ? 'is-new' : ''}" data-model="${esc(m)}"><span>${esc(m)}</span><b>${i + 1}</b></li>`).join('');
  const rows = RANKS_IB.map((m, i) => `<tr><th scope="row">${esc(m)}</th><td>${i + 1}</td><td>${RANKS_REAL.indexOf(m) + 1}</td></tr>`).join('');
  return `<div class="rk-plot" aria-hidden="true">
  <div class="rk-head"><span>RehearsalBench</span><span>Real world</span></div>
  <div class="rk-body"><ol class="rk-col rk-left">${col(RANKS_IB)}</ol>
  <svg class="rk-lines" viewBox="0 0 100 100" preserveAspectRatio="none">${lines}</svg>
  <ol class="rk-col rk-right">${col(RANKS_REAL)}</ol></div>
</div>
<table class="vh"><caption>Forecast rank in RehearsalBench and on real changes</caption><tr><th>Model</th><th>RehearsalBench</th><th>Real changes</th></tr>${rows}</table>`;
}

// ---- Figure: head-to-head pairs ordered correctly (paper, section 6.3) -----------------------
const H2H = [
  {name: 'RehearsalBench', v: 89, note: '59 of 66 pairs', key: true},
  {name: 'Output price', v: 67, note: '44 of 66 pairs'},
  {name: 'LMArena', v: 60, note: '33 of 55 pairs'},
];
function h2hChart() {
  return H2H.map(r => `<div class="hh-row${r.key ? ' is-key' : ''}"><span class="hh-name">${r.name}</span>` +
    `<span class="hh-track"><span class="hh-bar" style="width:${r.v}%"></span></span>` +
    `<span class="hh-val"><strong>${r.v}%</strong></span></div>`).join('\n');
}

// ---- Assemble ---------------------------------------------------------------------------------
const lb = leaderboardRows();
const parts = {
  'leaderboard:ranked': lb.ranked, 'leaderboard:other': lb.other,
  'chart:missed': missedChart(), 'chart:cost': costChart(), 'chart:ranks': rankChart(), 'chart:h2h': h2hChart(),
  'link:paper': LINKS.paper, 'link:repo': LINKS.repo,
};
const template = read('content/rehearsalbench/template.html').replace(/^<!--[\s\S]*?-->\n/, '');
const html = template.replace(/\{\{([a-z:0-9]+)\}\}/g, (m, k) => { if (!(k in parts)) throw Error(`Unknown placeholder ${m}`); return parts[k]; });
write('content/rehearsalbench/page.html', html);
for (const key of ['hero', 'one', 'rewind', 'evidence', 'plan', 'futures', 'score']) write(`public/research/rehearsalbench/scenes/${key}.svg`, staticScene(key));
console.log(`page.html: ${(html.length / 1024).toFixed(1)} KB; ${board.length} leaderboard rows; 7 scene diagrams`);
