import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { interventionBench, researchDescription } from "@/content/research";
import { absoluteUrl, serializeJsonLd, siteConfig } from "@/lib/site";
import "./research.css";

export const metadata: Metadata = {
  title: "Research",
  description: researchDescription,
  alternates: { canonical: "/research/" },
  openGraph: {
    type: "website", siteName: siteConfig.name, title: "Research — Afterflow",
    description: researchDescription, url: "/research/", images: [siteConfig.socialImage],
  },
  twitter: {
    card: "summary_large_image", title: "Research — Afterflow",
    description: researchDescription, images: [siteConfig.socialImage],
  },
};

export default function ResearchPage() {
  const collection = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    "@id": absoluteUrl("/research/#webpage"), url: absoluteUrl("/research/"),
    name: "Research", description: researchDescription, inLanguage: "en",
    isPartOf: { "@id": absoluteUrl("/#website") },
    publisher: { "@id": absoluteUrl("/#organization") },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [{ "@type": "ListItem", position: 1, name: interventionBench.title, url: absoluteUrl(interventionBench.href) }],
    },
  };
  return (
    <>
      <a className="skip-link" href="#research-content">Skip to content</a>
      <SiteHeader />
      <main className="research-index shell" id="research-content">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(collection) }} />
        <header className="research-intro" data-header-stick>
          <h1>Research</h1>
          <p>{researchDescription}</p>
        </header>
        <div className="research-features">
          {/* The shared scroll provider resets this visit; Next's fragment scroll can target the article footer. */}
          <Link className="research-feature" href={interventionBench.href} scroll={false} aria-labelledby="interventionbench-title">
            <div className="research-feature__image">
              <Image src="/interventionbench/scenes/scene-6.svg" alt="" width={900} height={620} priority />
              <span className="research-feature__overlay" aria-hidden="true">View</span>
            </div>
            <div className="research-feature__heading">
              <h2 id="interventionbench-title">{interventionBench.title}</h2>
            </div>
            <p>{interventionBench.description}</p>
            <time dateTime={interventionBench.publishedIso}>{interventionBench.published}</time>
          </Link>
        </div>
      </main>
      <SiteFooter topHref="#research-content" />
    </>
  );
}
