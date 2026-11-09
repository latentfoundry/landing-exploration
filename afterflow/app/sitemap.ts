import type { MetadataRoute } from "next";
import { rehearsalBench } from "@/content/research";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/") },
    { url: absoluteUrl("/research/") },
    { url: absoluteUrl(rehearsalBench.href), lastModified: rehearsalBench.publishedIso },
  ];
}
