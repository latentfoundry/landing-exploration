import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ResearchEvidence } from "@/components/research-evidence";
import { insights } from "@/content/insights";
import { absoluteUrl, serializeJsonLd, siteConfig } from "@/lib/site";

const description =
  "Research on modelling your business, choosing the right AI initiatives and learning from every rollout.";

export const metadata: Metadata = {
  title: "Insights on operational AI",
  description,
  alternates: {
    canonical: "/insights/",
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Insights on operational AI — Afterflow",
    description,
    url: "/insights/",
    images: [siteConfig.socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights on operational AI — Afterflow",
    description,
    images: [siteConfig.socialImage],
  },
};

export default function InsightsPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": absoluteUrl("/insights/#webpage"),
    url: absoluteUrl("/insights/"),
    name: "Insights on operational AI",
    description,
    inLanguage: "en",
    isPartOf: { "@id": absoluteUrl("/#website") },
    publisher: { "@id": absoluteUrl("/#organization") },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: insights.map((insight, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: insight.title,
        url: absoluteUrl(`/insights/${insight.slug}/`),
      })),
    },
  };

  return (
    <>
      <a className="skip-link" href="#insights-content">
        Skip to content
      </a>
      <SiteHeader />
      <main className="editorial-index" id="insights-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionJsonLd) }}
        />
        <div className="shell editorial-index__inner">
          <header data-header-stick>
            <Link href="/#top">Back to home</Link>
            <h1>Insights on operational AI.</h1>
            <p>{description}</p>
          </header>

          <div className="editorial-list">
            {insights.map((insight) => (
              <Link href={`/insights/${insight.slug}/`} key={insight.slug}>
                <span>{insight.type}</span>
                <h2>
                  {insight.titleEmphasis ? <em>{insight.title}</em> : insight.title}
                </h2>
                <p>{insight.excerpt}</p>
                <small><time dateTime={insight.publishedIso}>{insight.published}</time> · {insight.readTime}</small>
              </Link>
            ))}
          </div>
          <section className="insights-research" aria-labelledby="research-heading">
            <h2 id="research-heading">Research behind our approach.</h2>
            <ResearchEvidence />
          </section>
        </div>
      </main>
      <SiteFooter topHref="#insights-content" />
    </>
  );
}
