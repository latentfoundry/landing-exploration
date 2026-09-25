import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CinematicHero } from "@/components/cinematic-hero";
import { EngineExperience } from "@/components/engine-experience";
import { AudienceBenefits } from "@/components/audience-benefits";
import { ProcessIllustration } from "@/components/process-illustration";
import { CompanyVision } from "@/components/company-vision";
import { ExperienceLogo } from "@/components/experience-logo";
import { SiteHeader } from "@/components/site-header";
import AnimatedButton from "@/components/ui/animated-button";
import { ArrowUpRight } from "@/components/ui/arrow-up-right";
import { FocusRevealController } from "@/components/ui/focus-reveal";
import { CascadeText } from "@/components/ui/cascade-text";
import { absoluteUrl, serializeJsonLd, siteConfig } from "@/lib/site";
import "@/components/editorial-art.css";
import "@/components/engine-scroll.css";
import "@/components/engine-art.css";

export const metadata: Metadata = { alternates: { canonical: "/" } };
const contactUrl = "https://calendly.com/mika-afterflow/afterflow-intro";
const processSteps = [
  { title: "Find what works.", copy: "Model your workflows, test possible changes and compare their cost, impact and expected return." },
  { title: "Put it to work.", copy: "Our engineers build, test and deploy the solution with your team." },
  { title: "Learn from the results.", copy: "Compare the forecast with real results. Update your company model before the next decision." },
];
const faqs = [
  {
    question: "How is Afterflow different from a consultancy?",
    core: true,
    answer: "Our trained engine helps you choose the right initiatives and move them through stakeholder approvals faster. Your business knowledge stays in the model, so every project builds on the last.",
  },
  {
    question: "Why not just use ChatGPT or Claude?",
    answer: "Afterflow adds a validated simulation engine and a model of your business. You can test proposed changes against your operating constraints, trace the assumptions and compare the forecast with real results.",
  },
  {
    question: "What data do we need to get started?",
    core: true,
    answer: "A conversation and a few examples can be enough for an initial consultation. From there, we identify the documents, workflow data and permissions needed for your use case.",
  },
  {
    question: "How quickly can we get something working?",
    core: true,
    answer: "We start with a focused demonstration. Then we agree a production timeline around your use case, integrations and approvals.",
  },
  {
    question: "What do we actually receive?",
    core: true,
    answer: "A digital twin of your business, a business case with stakeholder approval materials, and a working AI solution. We build, test and deploy with your team, then measure the results.",
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
    answer: "We record predictions before rollout, compare them with what actually happens and update your model. Each initiative adds knowledge that helps us identify and evaluate the next.",
  },
  {
    question: "How do you handle data security and governance?",
    core: true,
    answer: "We never use your data to train Afterflow without your explicit permission. All accumulated knowledge and learnings stay yours, within your own environment. We work with approved read-only access, record-level permissions and private deployment, including behind your firewall.",
  },
  {
    question: "Could we build this ourselves?",
    answer: "Yes. Afterflow also helps you test whether it’s the right investment, then connects your assumptions, simulations and actual results. Your team gets that learning system without having to build and maintain it.",
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
        <FocusRevealController />
        <CinematicHero />

        <section className="introduction-section" id="introduction" aria-label="What Afterflow does">
          <div className="shell">
            <p className="introduction-copy" data-reveal="letters" data-reveal-threshold="0.36" data-reveal-duration="1800">
              <span className="sr-only">Afterflow simulates your business, builds the right AI solution, and learns from every rollout.</span>
              <span className="introduction-line"><CascadeText text="Afterflow simulates your business," /></span>
              <span className="introduction-line"><CascadeText text="builds the right AI solution," offset={30} /></span>
              <span className="introduction-line"><CascadeText text="and learns from every rollout." offset={53} /></span>
            </p>
          </div>
        </section>

        <section className="process-section section-space" id="product" aria-labelledby="product-heading">
          <div className="shell">
            <div className="process-intro" data-reveal="letters"><h2 id="product-heading" aria-label="How it works."><CascadeText text="How it works." /></h2></div>
            <ol className="process-steps" role="list">{processSteps.map((step, index) => (
              <li key={step.title}>
                <div className="process-step-content" data-reveal="surface" data-reveal-threshold="0.12">
                  <span className="process-step-number" aria-hidden="true">0{index + 1}.</span>
                  <h3>{step.title}</h3>
                  <div className="process-artwork"><ProcessIllustration step={index} /></div>
                  <p>{step.copy}</p>
                </div>
              </li>
            ))}</ol>
          </div>
        </section>

        <section className="audience-section" id="who-its-for" aria-labelledby="audience-heading">
          <div className="shell">
            <div className="delivery-promise" data-reveal="letters"><h2 id="audience-heading" aria-label="Prototype in a day. Production in weeks."><CascadeText text="Prototype in a day." /><br /><CascadeText text="Production in" offset={16} /> <em><CascadeText text="weeks." offset={28} /></em></h2></div>
            <div className="audience-layout" data-reveal="surface"><AudienceBenefits /></div>
          </div>
        </section>

        <section className="flywheel-section section-space" id="flywheel" aria-labelledby="flywheel-heading">
          <div className="shell">
            <div className="section-intro" data-reveal="focus"><h2 id="flywheel-heading">Rehearse your <em>next move.</em></h2><p className="simulation-payoff">Test what a change could deliver.<br />Before your business depends on it.</p></div>
            <EngineExperience />
          </div>
        </section>

        <section className="vision-section section-space" id="engine" aria-labelledby="vision-heading">
          <div className="shell product-vision">
            <div className="vision-copy" data-reveal="focus"><h2 id="vision-heading">A company that knows<br /> how to <em>improve itself.</em></h2></div>
            <CompanyVision />
            <p className="vision-description" data-reveal="focus">We’re building a self-improving simulation engine for discovering, testing and implementing operational improvements.</p>
          </div>
        </section>

        <section className="credibility-section" id="company" aria-labelledby="company-heading">
          <div className="shell">
            <div className="team-chapter">
              <div className="section-intro" data-reveal="focus"><h2 id="company-heading">Engineers who’ve<br />shipped at scale.</h2></div>
              <div className="team-experience" data-reveal="surface">
                <ul aria-label="Previous experience of the team, not customers or endorsements">
                  <li><ExperienceLogo company="apple" name="Apple" /></li>
                  <li><ExperienceLogo company="uber" name="Uber" /></li>
                  <li><ExperienceLogo company="bhp" name="BHP" /></li>
                  <li><ExperienceLogo company="atlassian" name="Atlassian" /></li>
                  <li><ExperienceLogo company="mistral" name="Mistral" /></li>
                </ul>
              </div>
              <p className="team-description" data-reveal="focus">Our team has delivered <strong>production AI</strong> and enterprise transformations across <em>Fortune 500 and ASX-listed</em> organisations.</p>
            </div>
            <div className="credibility-details">
              <article id="evidence"><div data-reveal="focus"><h3>Research behind the engine.</h3><p>Trained on historical transformations and rollouts. Tested by comparing what we predict with what happens.</p><Link className="text-link" href="/insights/">Explore our research <ArrowUpRight /></Link></div></article>
              <article id="trust"><div data-reveal="focus" data-reveal-delay="120"><h3>Controls agreed before rollout.</h3><p>We agree on data access, controls and approvals with your team. Decisions, assumptions and results stay on record for review.</p></div></article>
            </div>
          </div>
        </section>

        <section className="faq-section section-space" id="faq" aria-labelledby="faq-heading">
          <div className="shell faq-layout">
            <h2 id="faq-heading" data-reveal="focus">FAQs.</h2>
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
          <div className="shell" data-reveal="letters"><h2 id="contact-heading" aria-label="Start with one problem."><CascadeText text="Start with" /> <em><CascadeText text="one" offset={9} /></em><br /><CascadeText text="problem." offset={12} /></h2><AnimatedButton as="a" href={contactUrl} target="_blank" rel="noreferrer">Book a demo <ArrowUpRight /></AnimatedButton></div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="shell footer-top">
          <div className="footer-identity">
            <Link className="footer-brand" href="/#top"><span className="brand-mark"><Image src="/brand-mark.svg" alt="" width={29} height={25} /></span>Afterflow</Link>
            <p>Make your company<br />better at getting better.</p>
          </div>
          <nav aria-label="Footer navigation"><a href="#product">Product</a><Link href="/insights/">Research</Link><a href="#trust">Trust & governance</a><a href="#company">Company</a></nav>
          <div className="footer-contact"><p>Every improvement starts with a conversation.</p><a className="text-link" href={contactUrl} target="_blank" rel="noreferrer">Let’s talk <ArrowUpRight /></a></div>
        </div>
        <div className="shell footer-bottom"><small>© 2026 Afterflow Inc.</small><a href="#top">Back to top <svg viewBox="0 0 12 16" fill="none" aria-hidden="true"><path d="M6 15V1m-5 5 5-5 5 5" stroke="currentColor" strokeWidth="1" /></svg></a></div>
      </footer>
    </>
  );
}
