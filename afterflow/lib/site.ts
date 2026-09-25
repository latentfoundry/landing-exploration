// Keep the canonical origin stable in local builds and deploy previews.
// The public domain is also configured in .github/workflows/deploy-pages.yml.
const configuredHost =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  "https://afterflow.dev";

const resolvedHost = /^https?:\/\//i.test(configuredHost)
  ? configuredHost
  : `https://${configuredHost}`;

export const siteUrl = new URL(resolvedHost);

if (
  !["https:", "http:"].includes(siteUrl.protocol) ||
  siteUrl.username ||
  siteUrl.password ||
  siteUrl.pathname !== "/" ||
  siteUrl.search ||
  siteUrl.hash
) {
  throw new Error("The configured site URL must be an HTTP(S) origin without a path, query or credentials.");
}

export const siteConfig = {
  name: "Afterflow",
  legalName: "Afterflow Inc.",
  title: "Afterflow — Business simulation & AI transformation",
  description:
    "Afterflow models your business, compares AI initiatives and builds the right solution. Learn from every rollout to make better operational decisions.",
  socialTitle: "Afterflow — Make your company better at getting better",
  socialDescription:
    "Make your company better at getting better. Afterflow simulates your business, builds the right AI solution and learns from every rollout.",
  socialImage: {
    url: "/opengraph-image.png?v=28",
    width: 1200,
    height: 630,
    alt: "Afterflow — Make your company better at getting better.",
  },
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
