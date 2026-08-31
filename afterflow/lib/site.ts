const configuredHost =
  process.env.NEXT_PUBLIC_SITE_URL ??
  process.env.VERCEL_PROJECT_PRODUCTION_URL ??
  process.env.VERCEL_URL;

const resolvedHost = configuredHost
  ? configuredHost.startsWith("http")
    ? configuredHost
    : `https://${configuredHost}`
  : "http://localhost:3000";

export const siteUrl = new URL(resolvedHost);

export const siteConfig = {
  name: "Afterflow",
  legalName: "Afterflow Inc.",
  title: "Afterflow — Simulate operational change before you commit",
  description:
    "Afterflow turns operational data into a living model so AI transformation teams can compare initiatives, predict rollout effects and learn from outcomes.",
  socialDescription:
    "Operational simulation for AI transformation teams. Model the effects of change before rollout.",
} as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
