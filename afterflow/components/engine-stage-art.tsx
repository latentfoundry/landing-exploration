import { memo, type CSSProperties } from "react";
import { CompanyModelArt } from "@/components/company-model-art";

const descriptions = [
  "An illustrative company context graph focuses on a response workflow and its connected team, knowledge, systems and decisions.",
  "Many possible futures fan out from one starting point. One scenario is selected in bronze.",
  "Connected software modules: Connect, Control, Automate and Deploy.",
  "Illustrative forecast and observed results inform a revised forecast.",
];
const modules = [
  { x: 174, y: 82, dx: -48, dy: -40, path: "M22 35H63V114H132", label: "Connect" },
  { x: 322, y: 82, dx: 48, dy: -40, path: "M0 114H67V36H110", label: "Control" },
  { x: 174, y: 230, dx: -48, dy: 40, path: "M132 34H63V108H22", label: "Automate" },
  { x: 322, y: 230, dx: 48, dy: 40, path: "M0 34H67V108H110", label: "Deploy" },
];
const futures = Array.from({ length: 85 }, (_, index) => {
  const bend = (15 + index * 4.6).toFixed(1);
  const end = (40 + index * 4.2).toFixed(1);
  return {
    path: `M42 316C180 316 144 ${bend} 346 ${bend}S497 ${end} 603 ${end}`,
    end,
    delay: `${index * .005}s`,
  };
});
const selectedFuture = futures[24];

// The stage wrapper owns visibility and animation. Its state changes should not
// rebuild the static SVG trees, especially the company context graph.
export const EngineStageArt = memo(function EngineStageArt({ stage }: { stage: number }) {
  return (
    <div className="engine-art stage-art" data-stage={stage}>
      <svg viewBox={stage === 2 ? "90 0 460 440" : "0 0 640 440"} fill="none" role="img" aria-label={descriptions[stage]}>
        {stage === 0 && <g className="stage-model"><CompanyModelArt /></g>}
        {stage === 1 && <g className="stage-futures">
          {futures.map((future, index) => <path
            className="stage-future"
            key={index}
            pathLength="1"
            d={future.path}
            style={{ "--art-delay": future.delay } as CSSProperties}
          />)}
          <path className="stage-future-selected" pathLength="1" d={selectedFuture.path} />
          <circle className="stage-future-origin" cx="42" cy="316" r="6" />
          <circle className="stage-future-point" cx="603" cy={selectedFuture.end} r="7" />
          <circle className="stage-future-halo" cx="603" cy={selectedFuture.end} r="17" />
        </g>}
        {stage === 2 && <g className="stage-build">
          <path className="stage-build-guide" d="M118 54H510M118 394H510M146 26V422M482 26V422" />
          {modules.map((module, i) => <g key={module.label} transform={`translate(${module.x} ${module.y})`}>
            <g className="stage-build-module" style={{ "--assemble-x": `${module.dx}px`, "--assemble-y": `${module.dy}px`, "--art-delay": `${i * .12}s` } as CSSProperties}>
              <rect width="132" height="132" rx="4" />
              <text x="19" y="27">{module.label}</text>
              <path d={module.path} />
              <circle cx={i % 2 ? 110 : 22} cy={i < 2 ? 36 : 108} r="4" />
            </g>
          </g>)}
          <path className="stage-build-join" pathLength="1" d="M306 196H322M314 196V264M306 264H322" />
          <path className="stage-build-release" pathLength="1" d="M432 338H535" />
          <circle className="stage-build-output" cx="535" cy="338" r="7" />
        </g>}
        {stage === 3 && <g className="stage-learn">
          <path className="stage-learn-baseline" d="M38 364H608" />
          <path className="stage-learn-horizon" d="M352 51V364" />
          <path className="stage-learn-prediction" d="M42 333C139 302 179 197 259 156S421 89 600 56" />
          <path className="stage-learn-actual" pathLength="1" d="M42 333C89 331 109 311 134 297S174 314 204 274S240 287 276 250S312 242 352 225" />
          {Array.from({ length: 27 }, (_, i) => <path className="stage-learn-possibility" key={i}
            d={`M352 225C428 225 490 ${107 + i * 5.2} 600 ${72 + i * 5.2}`} />)}
          <path className="stage-learn-revised" pathLength="1" d="M352 225C428 225 490 174.6 600 139.6" />
          <circle className="stage-learn-now" cx="352" cy="225" r="8" />
          <circle className="stage-learn-next" cx="600" cy="139.6" r="6" />
          <text className="stage-art-label" x="42" y="401">Observed</text>
          <text className="stage-art-label" x="600" y="401" textAnchor="end">Revised forecast</text>
          <text className="stage-art-label stage-learn-original-label" x="598" y="34" textAnchor="end">Original forecast</text>
        </g>}
      </svg>
    </div>
  );
});
