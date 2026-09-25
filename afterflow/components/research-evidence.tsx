import { ArrowUpRight } from "@/components/ui/arrow-up-right";

// Independent research context, never a proxy for Afterflow performance claims.
export function ResearchEvidence() {
  return (
    <div className="research-evidence">
      <p className="research-disclosure">Independent research informing our approach. These studies do not evaluate Afterflow.</p>
      <div className="research-findings">
        <article>
          <h3>The organisation shapes the result.</h3>
          <p>In Stanford’s study of 51 successful AI deployments, 77% of the hardest challenges involved change management, data quality and process redesign.</p>
          <a className="text-link" href="https://digitaleconomy.stanford.edu/app/uploads/2026/03/EnterpriseAIPlaybook_PereiraGraylinBrynjolfsson.pdf#page=14" target="_blank" rel="noreferrer">Stanford Digital Economy Lab, 2026 <ArrowUpRight /></a>
          <p className="research-limit">Interview-based findings from successful deployments; not a representative success rate.</p>
        </article>
        <article>
          <h3>Measure the full investment.</h3>
          <p>The Productivity J-Curve shows why new technology needs complementary investment—and why its benefits can take time to appear.</p>
          <a className="text-link" href="https://www.aeaweb.org/articles?id=10.1257/mac.20180386" target="_blank" rel="noreferrer">Brynjolfsson, Rock & Syverson, 2021 <ArrowUpRight /></a>
          <p className="research-limit">Economic research on general-purpose technologies, not an AI delivery benchmark.</p>
        </article>
      </div>
    </div>
  );
}
