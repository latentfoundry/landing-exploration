import type { MetadataRoute } from "next";
import { interventionBench } from "@/content/research";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/research/") },
    { url: absoluteUrl(interventionBench.href), lastModified: interventionBench.publishedIso },
  ];
}
