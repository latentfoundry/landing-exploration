import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CinematicHero } from "@/components/cinematic-hero";
import { ConsultingComparison } from "@/components/consulting-comparison";
import { SiteHeader } from "@/components/site-header";
import { TransformationScroll } from "@/components/transformation-scroll";
import AnimatedButton from "@/components/ui/animated-button";
import { FocusRevealController } from "@/components/ui/focus-reveal";
import { ExperienceLogo } from "@/components/experience-logo";
import { insights } from "@/content/insights";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.socialDescription,
    url: "/",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Afterflow — Your sandbox for operational decisions.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.socialDescription,
    images: [
      {
        url: "/opengraph-image.png",
        alt: "Afterflow — Your sandbox for operational decisions.",
      },
    ],
  },
};

const experienceMarks = [
  { company: "apple", name: "Apple" },
  { company: "uber", name: "Uber" },
  { company: "bhp", name: "BHP" },
  { company: "atlassian", name: "Atlassian" },
  { company: "mistral", name: "Mistral" },
] as const;

const features = [
  {
    glyph: "layers",
    title: "Organisational world model",
    text: "Represent roles, workflows, systems, queues, customers and constraints in one operational model.",
  },
  {
    glyph: "branch",
    title: "Scenario comparison",
    text: "Test competing initiatives and rollout variants against the same baseline.",
  },
  {
    glyph: "signal",
    title: "Impact propagation",
    text: "Trace how one change moves across teams, handoffs, service levels and customer outcomes.",
  },
  {
    glyph: "aperture",
    title: "Visible assumptions",
    text: "Separate known data, modelled relationships and uncertain inputs before acting.",
  },
  {
    glyph: "compare",
    title: "Predicted versus observed",
    text: "See where the rollout matched the forecast and where the organisation behaved differently.",
  },
  {
    glyph: "loop",
    title: "Compounding learning",
    text: "Use deployment evidence to improve the model and the next decision.",
  },
] as const;

function ArrowUpRight() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 15 15 5M7 5h8v8" />
    </svg>
  );
}

function FocusWords({ children, delay = 0 }: { children: string; delay?: number }) {
  return (
    <span
      data-reveal="focus"
      data-reveal-delay={Math.round(delay * 1000)}
      data-reveal-duration={720}
      data-reveal-threshold={0.12}
    >
      {children}
    </span>
  );
}

function FeatureGlyph({ kind }: { kind: (typeof features)[number]["glyph"] }) {
  if (kind === "layers") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="m5 11 11-6 11 6-11 6L5 11Z" />
        <path d="m5 16 11 6 11-6M5 21l11 6 11-6" />
      </svg>
    );
  }

  if (kind === "branch") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M6 7v18M6 11h9c6 0 5 10 11 10" />
        <circle cx="6" cy="7" r="2" />
        <circle cx="26" cy="21" r="2" />
        <circle cx="6" cy="25" r="2" />
      </svg>
    );
  }

  if (kind === "signal") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M4 22c5-9 9-9 13 0s7 8 11-3" />
        <path d="M4 11h24" />
        <circle cx="17" cy="22" r="2" />
      </svg>
    );
  }

  if (kind === "aperture") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="11" />
        <path d="M16 5 11 16l5 11M27 16 16 11 5 16" />
      </svg>
    );
  }

  if (kind === "compare") {
    return (
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M7 6v20M25 6v20M7 11h10M15 8l3 3-3 3M25 21H15M17 18l-3 3 3 3" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M25 12a10 10 0 1 0 0 8" />
      <path d="m21 8 4 4 4-4M7 20a10 10 0 0 0 18 0" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader />

      <main id="main-content">
        <FocusRevealController />
        <CinematicHero />

        <section className="logo-field" id="proof" aria-labelledby="logo-field-label">
          <div className="shell logo-field__heading">
            <p id="logo-field-label">
              <FocusWords>Prior experience across Afterflow&apos;s team and advisors</FocusWords>
            </p>
          </div>
          <div className="logo-marquee">
            <div className="logo-marquee__track">
              <ul
                className="logo-marquee__set"
                aria-label="Organisations represented in the prior experience of Afterflow's team and advisors"
                role="list"
              >
                {experienceMarks.map((mark, index) => (
                  <li
                    className="logo-mark"
                    data-reveal="surface"
                    data-reveal-delay={index * 70}
                    data-reveal-duration={700}
                    data-reveal-threshold={0.4}
                    key={mark.company}
                  >
                    <ExperienceLogo company={mark.company} name={mark.name} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="shell section-heading section-heading--stacked">
            <h2>
              <FocusWords>How Afterflow</FocusWords>{" "}
              <span><FocusWords delay={0.1}>works.</FocusWords></span>
            </h2>
            <p>
              <FocusWords delay={0.12}>
                Connect operational evidence into a model of roles, workflows, systems and constraints. Test a proposed change, then calibrate it against rollout outcomes.
              </FocusWords>
            </p>
          </div>
          <TransformationScroll />
        </section>

        <section
          className="comparison-section"
          id="why-afterflow"
          aria-labelledby="comparison-heading"
        >
          <div className="shell section-heading">
            <h2 id="comparison-heading">
              <FocusWords>Start the next decision further ahead.</FocusWords>{" "}
              <span><FocusWords delay={0.1}>Keep what you learn.</FocusWords></span>
            </h2>
            <p id="comparison-intro">
              <FocusWords delay={0.12}>
                Afterflow turns one-off analysis into a repeatable decision system for your initiative portfolio.
              </FocusWords>
            </p>
          </div>
          <div className="shell">
            <ConsultingComparison />
          </div>
        </section>

        <section className="features-section" id="features">
          <div className="shell section-heading">
            <h2>
              <FocusWords>Every forecast</FocusWords>{" "}
              <span><FocusWords delay={0.1}>shows its working.</FocusWords></span>
            </h2>
            <p>
              <FocusWords delay={0.12}>
                Assumptions, dependencies and evidence stay attached to every result.
              </FocusWords>
            </p>
          </div>
          <ul className="shell feature-field">
            {features.map((feature, index) => (
              <li
                data-reveal="surface"
                data-reveal-delay={index * 70}
                key={feature.title}
              >
                <FeatureGlyph kind={feature.glyph} />
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="insights-section" id="insights">
          <div className="shell insights-layout">
            <header>
              <h2><FocusWords>Notes from the simulation layer.</FocusWords></h2>
              <Link href="/insights" data-reveal="focus" data-reveal-delay={120}>
                Explore insights <ArrowUpRight />
              </Link>
            </header>
            <div className="insight-rail">
              {insights.map((insight, index) => (
                <Link
                  href={`/insights/${insight.slug}`}
                  data-reveal="row"
                  data-reveal-delay={index * 90}
                  key={insight.slug}
                >
                  <span>{insight.type}</span>
                  <h3>
                    {insight.titleEmphasis ? <em>{insight.title}</em> : insight.title}
                  </h3>
                  <small>{insight.readTime}</small>
                  <ArrowUpRight />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="final-scene" id="contact">
          <div
            className="final-scene__image-wrap"
            data-reveal="image"
            data-reveal-duration={1400}
            data-reveal-threshold={0.08}
          >
            <Image
              className="final-scene__image"
              src="/afterflow-decision-ridge.png"
              alt=""
              fill
              quality={75}
              sizes="100vw"
            />
          </div>
          <div className="final-scene__shade" aria-hidden="true" />
          <div className="final-scene__content">
            <h2><FocusWords>Bring one initiative. See what follows.</FocusWords></h2>
            <p>
              <FocusWords delay={0.12}>
                We&apos;ll map the decision, test the rollout and show where pressure, value and customer impact are likely to land.
              </FocusWords>
            </p>
            <div
              className="final-scene__action-reveal"
              data-reveal="surface"
              data-reveal-delay={220}
            >
              <AnimatedButton
                as="a"
                href="https://calendly.com/mika-afterflow/afterflow-intro"
                target="_blank"
                rel="noreferrer"
                className="signal-button signal-button--large"
              >
                Book a private simulation <ArrowUpRight />
              </AnimatedButton>
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <div className="shell site-footer__inner">
            <a
              className="footer-brand"
              href="#top"
              aria-label="Afterflow, back to top"
              data-reveal="focus"
            >
              <span>
                <Image src="/logo.png" alt="" width={21} height={21} />
              </span>
              Afterflow
            </a>
            <p data-reveal="focus" data-reveal-delay={80}>
              Decision and simulation layer for operational change.
            </p>
            <nav aria-label="Footer navigation" data-reveal="focus" data-reveal-delay={160}>
              <a href="#how-it-works">How it works</a>
              <a href="#why-afterflow">Why Afterflow</a>
              <a href="#features">Features</a>
              <Link href="/insights">Insights</Link>
            </nav>
            <small data-reveal="focus" data-reveal-delay={240}>
              © 2026 Afterflow Inc. All rights reserved.
            </small>
          </div>
        </footer>
      </main>
    </>
  );
}
