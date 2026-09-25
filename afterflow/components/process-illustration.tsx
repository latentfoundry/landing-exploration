import type { CSSProperties } from "react";

const descriptions = [
  "Initiatives ranked by potential, with the strongest selected.",
  "Build and test an automation, then deploy it into production.",
  "Compare forecast and observed improvement to inform the next rollout.",
];

function FindWhatWorks() {
  return <>
    <g className="process-chart-guides"><path d="M260 120H566M260 200H566M260 280H566" /></g>
    <path className="process-chart-alternative" d="M258 280C328 272 349 230 407 220S503 196 562 186" />
    <path className="process-chart-alternative" d="M258 280C328 278 359 252 407 250S503 234 562 224" />
    <path className="process-chart-area" d="M258 280C328 268 354 215 407 201S505 148 562 128V280Z" />
    <path className="process-chart-selected process-draw" pathLength="1" d="M258 280C328 268 354 215 407 201S505 148 562 128" />
    <circle className="process-chart-point process-arrive" cx="562" cy="128" r="5" />
    {[
      { rank: "1", name: "Initiative B", y: 42, width: 166 },
      { rank: "2", name: "Initiative C", y: 126, width: 116 },
      { rank: "3", name: "Initiative A", y: 210, width: 72 },
    ].map((initiative, index) => <g
      key={initiative.name}
      className={"process-scenario" + (index === 0 ? " process-scenario-chosen" : "")}
      style={{ "--plate-delay": index * .15 + "s" } as CSSProperties}
    >
      <rect x={index === 0 ? 20 : 34} y={initiative.y} width={index === 0 ? 280 : 256} height="72" rx="4" />
      <text className="process-rank" x="49" y={initiative.y + 39}>{initiative.rank}</text>
      <text x="83" y={initiative.y + 34}>{initiative.name}</text>
      <path className="process-rank-track" d={"M83 " + (initiative.y + 52) + "h166"} />
      <path className="process-rank-bar" pathLength="1" d={"M83 " + (initiative.y + 52) + "h" + initiative.width} />
      {index === 0 && <path className="process-scenario-check" d="m264 71 6 6 11-13" />}
    </g>)}
    <g className="process-forecast-card process-arrive">
      <rect x="312" y="28" width="264" height="92" rx="4" />
      <text className="process-metric" x="330" y="76">+32%</text>
      <text className="process-metric-label" x="330" y="106">Projected gain</text>
    </g>
    <text className="process-annotation" x="28" y="329">Ranked by potential</text>
  </>;
}

function PutItToWork() {
  return <>
    <text className="process-build-title" x="28" y="52">Build &amp; test</text>
    <text className="process-build-title" x="379" y="52">Production</text>
    <rect className="process-build-frame" x="24" y="80" width="238" height="210" rx="4" />
    <g className="process-build-components">
      <path className="process-build-connections" d="M83 153H133M169 153H203M151 171V209H221V171" />
      <rect className="process-build-input" x="47" y="135" width="36" height="36" rx="3" />
      <rect className="process-build-code" x="133" y="135" width="36" height="36" rx="3" />
      <path className="process-code-glyph" d="m145 147-6 6 6 6m12-12 6 6-6 6" />
      <rect className="process-build-action" x="203" y="135" width="36" height="36" rx="3" />
      <path className="process-action-glyph" d="M212 153h18m-6-6 6 6-6 6" />
      <path className="process-build-control" d="m151 197 12 12-12 12-12-12Z" />
    </g>
    <g className="process-build-tested">
      <path d="m46 255 6 6 12-14" pathLength="1" />
      <text x="76" y="263">Tests passed</text>
    </g>
    <text className="process-deploy-label" x="320" y="161" textAnchor="middle">Deploy</text>
    <path className="process-deploy-guide" d="M274 188H364" />
    <path className="process-deploy-route" pathLength="1" d="M274 188H364" />
    <path className="process-deploy-arrow" d="m354 179 10 9-10 9" />
    <g className="process-production">
      <rect className="process-production-frame" x="379" y="80" width="197" height="210" rx="4" />
      <g className="process-production-system">
        <path className="process-production-connections" d="M428 151H461M489 151H524M475 165V203H538V165" />
        <rect x="400" y="137" width="28" height="28" rx="3" />
        <rect className="process-production-core" x="461" y="137" width="28" height="28" rx="3" />
        <rect x="524" y="137" width="28" height="28" rx="3" />
        <path d="m475 194 9 9-9 9-9-9Z" />
      </g>
      <g className="process-production-live">
        <circle cx="409" cy="256" r="4" />
        <text x="428" y="263">Live</text>
      </g>
    </g>
  </>;
}

function LearnFromResults() {
  return <>
    <g className="process-chart-guides"><path d="M38 200H562M38 280H562" /></g>
    <path className="process-results-boundary" d="M320 56V284" />
    <path className="process-results-forecast" d="M42 280C130 272 198 199 320 152S468 88 562 65" />
    <path className="process-results-observed process-draw" pathLength="1" d="M42 280C90 280 112 263 144 246S184 250 213 219S279 190 320 168" />
    <path className="process-results-area" d="M320 168C414 168 484 131 562 108V280H320Z" />
    <path className="process-chart-selected process-results-revised process-draw" pathLength="1" d="M320 168C414 168 484 131 562 108" />
    <circle className="process-results-now" cx="320" cy="168" r="5" />
    <circle className="process-chart-point process-arrive" cx="562" cy="108" r="5" />
    <text className="process-results-next" x="562" y="236" textAnchor="end">Updated forecast</text>
    <g className="process-results-card">
      <rect x="24" y="24" width="268" height="120" rx="4" />
      <text className="process-metric-label" x="42" y="51">Improvement</text>
      <path className="process-metric-divider" d="M159 65V125" />
      <text className="process-result-metric" x="42" y="98">+32%</text>
      <text className="process-result-metric process-result-actual" x="177" y="98">+28%</text>
      <text className="process-metric-label" x="42" y="126">Forecast</text>
      <text className="process-metric-label" x="177" y="126">Observed</text>
    </g>
    <text className="process-annotation" x="562" y="329" textAnchor="end">Next rollout</text>
  </>;
}

export function ProcessIllustration({ step }: { step: number }) {
  return <figure className="process-plate" data-reveal="image" data-reveal-threshold="0.24">
    <svg className="process-illustration editorial-art-plate" viewBox="0 0 600 350" fill="none" role="img" aria-label={descriptions[step]}>
      <rect className="process-plate-surface" width="600" height="350" rx="5" />
      {step === 0 && <FindWhatWorks />}
      {step === 1 && <PutItToWork />}
      {step === 2 && <LearnFromResults />}
    </svg>
  </figure>;
}
