import type { MetadataRoute } from "next";
import { insights } from "@/content/insights";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/insights/") },
    ...insights.map((insight) => ({
      url: absoluteUrl(`/insights/${insight.slug}/`),
    })),
  ];
}
