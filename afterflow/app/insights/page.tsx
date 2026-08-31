import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { insights } from "@/content/insights";
import { siteConfig } from "@/lib/site";

const description =
  "Evidence-led notes on simulation, rollout design and how AI changes teams, workflows and customer outcomes.";

export const metadata: Metadata = {
  title: "Insights",
  description,
  alternates: {
    canonical: "/insights",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Insights on operational AI — Afterflow",
    description,
    url: "/insights",
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
    title: "Insights on operational AI — Afterflow",
    description,
    images: [
      {
        url: "/opengraph-image.png",
        alt: "Afterflow — Your sandbox for operational decisions.",
      },
    ],
  },
};

export default function InsightsPage() {
  return (
    <>
      <a className="skip-link" href="#insights-content">
        Skip to content
      </a>
      <SiteHeader />
      <main className="editorial-index" id="insights-content">
        <div className="shell editorial-index__inner">
          <header>
            <Link href="/">Afterflow</Link>
            <h1>Insights on operational AI.</h1>
            <p>{description}</p>
          </header>

          <div className="editorial-list">
            {insights.map((insight) => (
              <Link href={`/insights/${insight.slug}`} key={insight.slug}>
                <span>{insight.type}</span>
                <h2>
                  {insight.titleEmphasis ? <em>{insight.title}</em> : insight.title}
                </h2>
                <p>{insight.excerpt}</p>
                <small>{insight.published} · {insight.readTime}</small>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
