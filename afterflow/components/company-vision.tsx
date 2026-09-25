import type { CSSProperties } from "react";
import "./company-vision.css";

const contours = Array.from({ length: 11 }, (_, index) => ({
  rx: 141 + index * 3.6,
  ry: 96 + index * 2.8,
}));

function quarterArc(rx: number, ry: number, stage: number) {
  const points = [[320, 210 - ry], [320 + rx, 210], [320, 210 + ry], [320 - rx, 210], [320, 210 - ry]];
  const start = points[stage];
  const end = points[stage + 1];
  return `M${start[0]} ${start[1]}A${rx} ${ry} 0 0 1 ${end[0]} ${end[1]}`;
}

const directionMarks = [
  { x: 432.43, y: 132.22, rotate: 34.68 },
  { x: 432.43, y: 287.78, rotate: 145.32 },
  { x: 207.57, y: 287.78, rotate: 214.68 },
  { x: 207.57, y: 132.22, rotate: 325.32 },
];

export function CompanyVision() {
  return (
    <figure className="company-vision-art company-vision-ribbon" data-reveal="image" data-reveal-duration="900">
      <svg viewBox="0 0 640 400" role="img" aria-label="Model, simulate, build and learn: observed results inform the next decision." fill="none">

        <g className="vision-ribbon-guides" aria-hidden="true">
          {contours.map(({ rx, ry }) => <ellipse key={rx} cx="320" cy="210" rx={rx} ry={ry} />)}
        </g>

        {[0, 1, 2, 3].map(stage => (
          <g className={`vision-ribbon-quarter vision-ribbon-quarter--${stage + 1}`} key={stage} aria-hidden="true">
            {contours.map(({ rx, ry }, index) => <path
              key={rx}
              className="vision-ribbon-trace"
              d={quarterArc(rx, ry, stage)}
              pathLength="1"
              style={{ "--ribbon-delay": `${0.16 + stage * 0.72 + index * 0.014}s` } as CSSProperties}
            />)}
          </g>
        ))}

        <g className="vision-ribbon-directions" aria-hidden="true">
          {directionMarks.map(({ x, y, rotate }, index) => <g
            className={index === 3 ? "vision-ribbon-direction-return" : undefined}
            transform={`translate(${x} ${y}) rotate(${rotate})`}
            key={index}
          >
            <path className="vision-ribbon-arrow-clearance" d="m-6-4 6 4-6 4" />
            <path className="vision-ribbon-arrow" d="m-6-4 6 4-6 4" />
          </g>)}
        </g>

        <image className="vision-ribbon-core" href="/brand-mark.svg" x="295" y="188.8" width="50" height="42.4" aria-hidden="true" />
      </svg>

      <div className="vision-ribbon-labels" aria-hidden="true">
        <span className="vision-ribbon-label vision-ribbon-label--model">Model</span>
        <span className="vision-ribbon-label vision-ribbon-label--simulate">Simulate</span>
        <span className="vision-ribbon-label vision-ribbon-label--build">Build</span>
        <span className="vision-ribbon-label vision-ribbon-label--learn">Learn</span>
        <span className="vision-ribbon-evidence">Observed<br />results</span>
      </div>
    </figure>
  );
}
