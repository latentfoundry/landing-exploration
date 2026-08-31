import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getInsight, insights } from "@/content/insights";
import { absoluteUrl, serializeJsonLd, siteConfig } from "@/lib/site";

type InsightPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return insights.map((insight) => ({ slug: insight.slug }));
}

export async function generateMetadata({ params }: InsightPageProps): Promise<Metadata> {
  const { slug } = await params;
  const insight = getInsight(slug);

  if (!insight) return {};

  const articlePath = `/insights/${insight.slug}`;
  const socialTitle = `${insight.title} — Afterflow`;

  return {
    title: insight.title,
    description: insight.excerpt,
    authors: [{ name: insight.author }],
    alternates: {
      canonical: articlePath,
    },
    openGraph: {
      type: "article",
      siteName: siteConfig.name,
      title: socialTitle,
      description: insight.excerpt,
      url: articlePath,
      publishedTime: insight.publishedIso,
      authors: [insight.author],
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
      title: socialTitle,
      description: insight.excerpt,
      images: [
        {
          url: "/opengraph-image.png",
          alt: "Afterflow — Your sandbox for operational decisions.",
        },
      ],
    },
  };
}

export default async function InsightPage({ params }: InsightPageProps) {
  const { slug } = await params;
  const insight = getInsight(slug);

  if (!insight) notFound();

  const articleUrl = absoluteUrl(`/insights/${insight.slug}`);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    headline: insight.title,
    description: insight.excerpt,
    datePublished: insight.publishedIso,
    inLanguage: "en",
    image: absoluteUrl("/opengraph-image.png"),
    mainEntityOfPage: articleUrl,
    author: {
      "@type": "Person",
      name: insight.author,
      jobTitle: insight.authorRole,
    },
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
  };

  return (
    <>
      <a className="skip-link" href="#article-content">
        Skip to content
      </a>
      <SiteHeader />
      <main className="article-page" id="article-content">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
        />
        <article className="article shell">
          <Link className="article-back" href="/insights">
            Back to insights
          </Link>
          <header>
            <p className="article-byline">
              <strong>
                {insight.author}, {insight.authorRole} ·{" "}
                <time dateTime={insight.publishedIso}>{insight.published}</time>
              </strong>
            </p>
            <h1>
              {insight.titleEmphasis ? <em>{insight.title}</em> : insight.title}
            </h1>
            <p className="article-standfirst">{insight.standfirst}</p>
          </header>
          <div className="article-body">
            {insight.body.map((block, blockIndex) => {
              if (typeof block === "object" && !Array.isArray(block)) {
                return <h2 key={block.heading}>{block.heading}</h2>;
              }

              return (
                <p key={blockIndex}>
                  {typeof block === "string"
                    ? block
                    : block.map((part, partIndex) => {
                        const content = part.emphasis ? <em>{part.text}</em> : part.text;

                        return part.href ? (
                          <a
                            href={part.href}
                            key={partIndex}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {content}
                          </a>
                        ) : (
                          <span key={partIndex}>{content}</span>
                        );
                      })}
                </p>
              );
            })}
          </div>
          <footer>
            <h2>Test the decision before rollout.</h2>
            <a
              href="https://calendly.com/mika-afterflow/afterflow-intro"
              target="_blank"
              rel="noreferrer"
            >
              Book a simulation
            </a>
          </footer>
        </article>
      </main>
    </>
  );
}
