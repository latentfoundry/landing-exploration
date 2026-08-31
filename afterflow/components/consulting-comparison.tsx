const comparisonRows = [
  {
    criterion: "Iteration",
    consulting: {
      lead: "New engagement",
      detail: "Interviews, prioritisation and value cases are scoped again for each project.",
    },
    afterflow: {
      lead: "Ready to rerun",
      detail: "Re-score initiatives across your portfolio as the evidence changes.",
      mark: "time",
    },
  },
  {
    criterion: "Cost",
    consulting: {
      lead: "Scope grows",
      detail: "More initiatives add project time and budget.",
    },
    afterflow: {
      lead: "One evidence base",
      detail: "Compare initiatives without rebuilding the evidence each time.",
      mark: "evidence",
    },
  },
  {
    criterion: "Ownership",
    consulting: {
      lead: "Planned handover",
      detail: "Reuse depends on deliberate knowledge transfer.",
    },
    afterflow: {
      lead: "Stays with you",
      detail: "Evidence, assumptions and outcomes start the next run.",
      mark: "ownership",
    },
  },
] as const;

type SignalMarkKind = (typeof comparisonRows)[number]["afterflow"]["mark"];

function SignalMark({ kind }: { kind: SignalMarkKind }) {
  return (
    <span
      className={`comparison-cell__mark comparison-cell__mark--${kind}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 20 20">
        {kind === "time" ? (
          <>
            <circle cx="10" cy="10" r="6.25" />
            <path d="M10 6.5v3.9l2.7 1.7" />
          </>
        ) : null}
        {kind === "evidence" ? (
          <>
            <path d="m10 4.2 6 3-6 3-6-3 6-3Z" />
            <path d="m4 10 6 3 6-3M4 12.9l6 3 6-3" />
          </>
        ) : null}
        {kind === "ownership" ? (
          <>
            <circle cx="7.1" cy="10" r="3.1" />
            <path d="M10.2 10H16M13.3 10v2M15.5 10v1.6" />
          </>
        ) : null}
      </svg>
    </span>
  );
}

export function ConsultingComparison() {
  return (
    <div
      className="comparison-frame"
      data-reveal="surface"
      data-reveal-duration={1200}
      data-reveal-threshold={0.12}
    >
      <span className="comparison-frame__signal" aria-hidden="true" />

      <table
        className="comparison-table"
        aria-describedby="comparison-intro"
        role="table"
      >
        <caption className="sr-only">
          How an Afterflow decision system compares with a consulting engagement.
        </caption>
        <colgroup>
          <col className="comparison-table__criterion" />
          <col className="comparison-table__consulting" />
          <col className="comparison-table__afterflow" />
        </colgroup>
        <thead role="rowgroup">
          <tr role="row">
            <th scope="col" role="columnheader">
              <span className="comparison-content">What matters</span>
            </th>
            <th scope="col" role="columnheader">
              <span className="comparison-content">Consulting engagement</span>
            </th>
            <th className="is-afterflow" scope="col" role="columnheader">
              <span className="comparison-content comparison-table__brand">
                <i aria-hidden="true" />
                Afterflow
              </span>
            </th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {comparisonRows.map((row) => (
            <tr role="row" key={row.criterion}>
              <th scope="row" role="rowheader">
                <span className="comparison-content comparison-table__row-label">
                  {row.criterion}
                </span>
              </th>
              <td data-column="Consulting engagement" role="cell">
                <div className="comparison-content comparison-cell">
                  <strong>{row.consulting.lead}</strong>
                  <span>{row.consulting.detail}</span>
                </div>
              </td>
              <td className="is-afterflow" data-column="Afterflow" role="cell">
                <div className="comparison-content comparison-cell comparison-cell--afterflow">
                  <SignalMark kind={row.afterflow.mark} />
                  <span>
                    <strong>{row.afterflow.lead}</strong>
                    <span>{row.afterflow.detail}</span>
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="comparison-outcome">
        <span className="comparison-content comparison-outcome__label">
          Time to decision
        </span>
        <div className="comparison-content comparison-outcome__shift">
          <span>Months</span>
          <svg viewBox="0 0 72 14" aria-hidden="true">
            <path d="M1 7h64M60 2l5 5-5 5" />
          </svg>
          <strong>Days</strong>
        </div>
        <p className="comparison-content">
          The next decision starts with everything already learned.
        </p>
      </div>
    </div>
  );
}
