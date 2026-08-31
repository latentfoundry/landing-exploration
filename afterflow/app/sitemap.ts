import type { MetadataRoute } from "next";
import { insights } from "@/content/insights";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: absoluteUrl("/insights"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...insights.map((insight) => ({
      url: absoluteUrl(`/insights/${insight.slug}`),
      lastModified: insight.publishedIso,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
