import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { InterventionBench } from "@/components/intervention-bench";
import { interventionBench, interventionBenchSocialImage } from "@/content/research";
import { demoAction } from "@/lib/navigation";
import { absoluteUrl, serializeJsonLd, siteConfig } from "@/lib/site";
import "../interventionbench.css";
import "../interventionbench-afterflow.css";

const title = interventionBench.title;
const url = interventionBench.href;
export const metadata: Metadata = {
  title, description: interventionBench.description,
  alternates: { canonical: url },
  openGraph: {
    type: "article", siteName: siteConfig.name, title: `${title} — Afterflow`,
    description: interventionBench.description, url,
    publishedTime: interventionBench.publishedIso, images: [interventionBenchSocialImage],
  },
  twitter: { card: "summary_large_image", title: `${title} — Afterflow`, description: interventionBench.description, images: [interventionBenchSocialImage] },
};

export default function InterventionBenchPage() {
  const html = readFileSync(resolve("content/interventionbench/overview.html"), "utf8")
    .replaceAll("{{demoHref}}", demoAction.href)
    .replaceAll("{{demoLabel}}", demoAction.label);
  const articleUrl = absoluteUrl(interventionBench.href);
  const article = {
    "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${articleUrl}#article`,
    url: articleUrl, headline: interventionBench.title,
    description: interventionBench.description, datePublished: interventionBench.publishedIso,
    image: absoluteUrl(interventionBenchSocialImage.url),
    inLanguage: "en", author: { "@id": absoluteUrl("/#organization") },
    publisher: { "@id": absoluteUrl("/#organization") },
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    isPartOf: { "@id": absoluteUrl("/#website") },
  };
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(article) }} />
      <InterventionBench html={html} />
      <SiteFooter topHref="#main" />
    </>
  );
}
