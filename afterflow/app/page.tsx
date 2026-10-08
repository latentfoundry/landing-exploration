import type { Metadata } from "next";
import { CinematicHero } from "@/components/cinematic-hero";
import { EngineExperience } from "@/components/engine-experience";
import { AudienceBenefits } from "@/components/audience-benefits";
import { ProcessIllustration } from "@/components/process-illustration";
import { CompanyVision } from "@/components/company-vision";
import { ExperienceLogo } from "@/components/experience-logo";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { demoAction } from "@/lib/navigation";
import AnimatedButton from "@/components/ui/animated-button";
import { ArrowUpRight } from "@/components/ui/arrow-up-right";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import { AnimatedGroup } from "@/components/motion-primitives/animated-group";
import { LineHoverLink } from "@/components/ui/line-hover-link";
import { absoluteUrl, serializeJsonLd, siteConfig } from "@/lib/site";
import "@/components/editorial-art.css";
import "@/components/engine-scroll.css";
import "@/components/engine-art.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };
const processSteps = [
  { title: "Find what works.", copy: "Model your workflows, test possible changes and compare their cost, impact and expected return." },
  { title: "Put it to work.", copy: "The engine turns the chosen plan into working software. Our engineers support integration, testing and rollout." },
  { title: "Learn from the results.", copy: "Compare the forecast with real results. Update your company model before the next decision." },
];
const faqs = [
  {
    question: "How is Afterflow different from a consultancy?",
    core: true,
    answer: "Afterflow’s engine keeps learning beyond the project. Every improvement is forecast, measured and fed back into your company model, so each one builds on the last.",
  },
  {
    question: "Why not just use ChatGPT or Claude?",
    answer: "Afterflow adds a validated simulation engine and a model of your business. You can test proposed changes against your operating constraints, trace the assumptions and compare the forecast with real results.",
  },
  {
    question: "What data do we need to get started?",
    core: true,
    answer: "A conversation and a few examples can be enough for an initial assessment. From there, we identify the documents, workflow data and permissions needed for your use case.",
  },
  {
    question: "How quickly can we get something working?",
    core: true,
    answer: "For a focused use case, we aim for a working prototype in a day and production in weeks. Timing depends on scope, access, integrations and approvals.",
  },
  {
    question: "What do we actually receive?",
    core: true,
    answer: "A digital twin of your business, a business case with stakeholder approval materials, a working AI solution, and a record of forecast versus actual results after rollout.",
  },
  {
    question: "How do you measure accuracy?",
    answer: <>We test against historical cases and real outcomes. In our historical benchmarks, Afterflow achieved <strong>nearly 3× the causal-chain reconstruction score</strong> of the frontier models tested. This measures how well it recovered what led to what.</>,
  },
  {
    question: "Why should we trust the results?",
    answer: "Every result traces back to evidence, operating rules or clearly labelled assumptions. You can see what supports a conclusion, where the uncertainty lies and what still needs testing.",
  },
  {
    question: "How do you avoid just fitting past results?",
    answer: "We use regularisation to limit unnecessary complexity in the model. This reduces the risk of memorising quirks in historical data and helps it learn patterns that hold beyond the original examples.",
  },
  {
    question: "How does Afterflow improve over time?",
    answer: "Each rollout adds evidence about your teams, systems and adoption patterns. The engine uses this to refine its forecasts and identify which initiatives are worth testing next.",
  },
  {
    question: "How do you handle data security and governance?",
    core: true,
    answer: "We never use your data to train Afterflow without your explicit permission. All accumulated knowledge and learnings stay yours, within your own environment. We work with approved read-only access, record-level permissions and private deployment, including behind your firewall.",
  },
  {
    question: "Could we build this ourselves?",
    answer: "Yes. Afterflow can help you test whether building your own learning system is the right investment. It connects your assumptions, simulations and actual results, giving your team that system without having to build and maintain it.",
  },
];

function DisclosureIcon() {
  return <svg className="disclosure-icon" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 10h12M10 4v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>;
}

function FaqItem({ item }: { item: (typeof faqs)[number] }) {
  return (
    <details className="faq-item">
      <summary>{item.question}<DisclosureIcon /></summary>
      <div className="faq-answer"><p>{item.answer}</p></div>
    </details>
  );
}

export default function Home() {
  const pageJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": absoluteUrl("/#webpage"),
        url: absoluteUrl("/"),
        name: siteConfig.title,
        description: siteConfig.description,
        inLanguage: "en",
        isPartOf: { "@id": absoluteUrl("/#website") },
        mainEntity: { "@id": absoluteUrl("/#service") },
      },
      {
        "@type": "Service",
        "@id": absoluteUrl("/#service"),
        name: "Business simulation and AI implementation",
        description: siteConfig.description,
        url: absoluteUrl("/"),
        provider: { "@id": absoluteUrl("/#organization") },
      },
    ],
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <SiteHeader />
      <main id="main-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(pageJsonLd) }} />
        <CinematicHero />

        <section className="introduction-section" id="introduction" aria-label="What Afterflow does">
          <div className="shell">
            <TextEffect className="introduction-copy" per="line" preset="slide" duration={0.75}>
              {"Afterflow simulates your business,\nbuilds the right AI solution,\nand learns from every rollout."}
            </TextEffect>
          </div>
        </section>

        <section className="process-section section-space" id="product" aria-labelledby="product-heading">
          <div className="shell">
            <div className="process-intro"><TextEffect as="h2" id="product-heading" per="char">How it works.</TextEffect></div>
            <ol className="process-steps" role="list">{processSteps.map((step, index) => (
              <li key={step.title}>
                <div className="process-step-content">
                  <span className="process-step-number" aria-hidden="true">0{index + 1}.</span>
                  <h3>{step.title}</h3>
                  <div className="process-artwork"><ProcessIllustration step={index} /></div>
                  <AnimatedGroup as="p" animateChildren={false}>{step.copy}</AnimatedGroup>
                </div>
              </li>
            ))}</ol>
          </div>
        </section>

        <section className="audience-section" id="who-its-for" aria-labelledby="audience-heading">
          <div className="shell">
            <div className="delivery-promise"><TextEffect as="h2" id="audience-heading" per="char" preset="slide" emphasis="weeks.">{"Prototype in a day.\nProduction in weeks."}</TextEffect></div>
            <div className="audience-layout"><AudienceBenefits /></div>
          </div>
        </section>

        <section className="flywheel-section section-space" id="flywheel" aria-labelledby="flywheel-heading">
          <div className="shell">
            <div className="section-intro"><h2 id="flywheel-heading">Rehearse your <em>next move.</em></h2><p className="simulation-payoff">Test what a change could deliver.<br />Before your business depends on it.</p></div>
            <EngineExperience />
          </div>
        </section>

        <section className="vision-section section-space" id="engine" aria-labelledby="vision-heading">
          <div className="shell product-vision">
            <div className="vision-copy"><TextEffect as="h2" id="vision-heading" per="char" preset="fade-in-blur" emphasis="improve itself.">{"A company that knows\nhow to improve itself."}</TextEffect></div>
            <CompanyVision />
            <p className="vision-description">We’re building a self-improving simulation engine your team can use to discover, test and implement operational improvements.</p>
          </div>
        </section>

        <section className="credibility-section" id="company" aria-labelledby="company-heading">
          <div className="shell">
            <div className="team-chapter">
              <div className="section-intro"><h2 id="company-heading">Previously at</h2></div>
              <div className="team-experience">
                <AnimatedGroup as="ul" asChild="li" preset="slide" stagger={0.07} aria-label="Previous experience of the team, not customers or endorsements">
                  <ExperienceLogo company="apple" name="Apple" />
                  <ExperienceLogo company="uber" name="Uber" />
                  <ExperienceLogo company="bhp" name="BHP" />
                  <ExperienceLogo company="atlassian" name="Atlassian" />
                </AnimatedGroup>
              </div>
              <p className="team-description">Our team has delivered <strong>production AI</strong> and enterprise transformations across <em>Fortune 500 and ASX-listed</em> organisations.</p>
            </div>
            <AnimatedGroup className="credibility-details" asChild="article" stagger={0.1}>
              <div id="evidence"><h3>Research behind the engine.</h3><p>Trained on historical transformations and rollouts. Tested by comparing what we predict with what happens.</p><LineHoverLink className="text-link" href="/insights/" icon={<ArrowUpRight />}>Explore our research</LineHoverLink></div>
              <div id="trust"><h3>Controls agreed before rollout.</h3><p>We agree on data access, controls and approvals with your team. Decisions, assumptions and results stay on record for review.</p></div>
            </AnimatedGroup>
          </div>
        </section>

        <section className="faq-section section-space" id="faq" aria-labelledby="faq-heading">
          <div className="shell faq-layout">
            <h2 id="faq-heading">FAQs.</h2>
            <div className="faq-list">
              {faqs.filter(item => item.core).map(item => <FaqItem key={item.question} item={item} />)}
              <details className="faq-more">
                <summary className="faq-more__toggle">
                  <span className="faq-more__show">View more questions</span>
                  <span className="faq-more__hide">View fewer questions</span>
                  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </summary>
                <div className="faq-more__questions">
                  {faqs.filter(item => !item.core).map(item => <FaqItem key={item.question} item={item} />)}
                </div>
              </details>
            </div>
          </div>
        </section>

        <section className="final-scene" id="contact" aria-labelledby="contact-heading">
          <div className="shell">
            <TextEffect as="h2" id="contact-heading" per="char" emphasis="one" preset="slide">{"Start with one\nproblem."}</TextEffect>
            <AnimatedGroup animateChildren={false} delay={0.5} duration={0.4}><AnimatedButton as="a" href={demoAction.href} target="_blank" rel="noreferrer">{demoAction.label} <ArrowUpRight /></AnimatedButton></AnimatedGroup>
          </div>
        </section>
      </main>
      <SiteFooter topHref="#top" />
    </>
  );
}
