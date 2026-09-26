import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve("out");
const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || "https://afterflow.dev";
const origin = new URL(/^https?:\/\//i.test(configuredOrigin) ? configuredOrigin : `https://${configuredOrigin}`);
const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const pages = new Map();

function exportPath(pathname) {
  const path = resolve(root, `.${decodeURIComponent(pathname)}`);
  assert(path === root || path.startsWith(`${root}/`), "Asset path must remain inside export");
  return existsSync(path) && statSync(path).isDirectory() ? resolve(path, "index.html") : path;
}

function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], match[2].replaceAll("&amp;", "&")]));
}

for (const address of urls) {
  const url = new URL(address);
  assert.equal(url.origin, origin.origin, "Sitemap must use the public origin");
  assert(url.pathname.endsWith("/"), "Page URLs must match trailing-slash exports");
  const html = readFileSync(exportPath(url.pathname), "utf8");
  pages.set(url.pathname, html);
  const metadata = [...html.matchAll(/<(?:link|meta)\b[^>]+>/g)].map((match) => attributes(match[0]));
  assert.equal(metadata.find((tag) => tag.rel === "canonical")?.href, address);
  assert.equal(metadata.find((tag) => tag.property === "og:url")?.content, address);
  assert(metadata.find((tag) => tag.name === "description")?.content, "Each route needs a description");
  assert(!metadata.some((tag) => tag.name === "robots" && tag.content?.includes("noindex")));
  assert.equal((html.match(/<h1\b/g) || []).length, 1, "Each route needs one primary heading");
  const graphs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((match) => { const value = JSON.parse(match[1]); return value["@graph"] || [value]; });
  assert(graphs.some((node) => node["@type"] === "Organization"));
  assert(graphs.some((node) => node["@type"] === (url.pathname === "/" ? "WebPage" : url.pathname === "/insights/" ? "CollectionPage" : "BlogPosting")));
  assert(!html.includes("direction-contract"), "Design notes must not ship in page markup");
  const primaryNavigation = html.match(/<nav class="site-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1];
  assert(primaryNavigation, `${url.pathname}: shared primary navigation is missing`);
  assert.equal(primaryNavigation.replace(/<[^>]+>/g, ""), "ProductResearchCompany", `${url.pathname}: primary navigation has drifted`);
  assert(html.includes('class="site-footer"'), `${url.pathname}: shared footer is missing`);
  assert(html.includes("Book a demo"), `${url.pathname}: current demo CTA is missing`);
  assert(/Make your company<br\s*\/?\s*>better at getting better\./.test(html), `${url.pathname}: current footer positioning is missing`);
  assert(!/Book a simulation|Your sandbox for operational decisions/i.test(html), `${url.pathname}: retired positioning is still published`);
}

for (const [pathname, html] of pages) {
  for (const match of html.matchAll(/<(?:a|link|img|script|image)\b[^>]+>/g)) {
    const tag = attributes(match[0]);
    const reference = tag.href || tag.src;
    if (!reference || reference.startsWith("data:")) continue;
    const url = new URL(reference, new URL(pathname, origin));
    if (url.origin !== origin.origin) continue;
    assert(existsSync(exportPath(url.pathname)), `${pathname}: missing local resource ${reference}`);
    if (url.hash && pages.has(url.pathname)) {
      assert(pages.get(url.pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${pathname}: broken anchor ${reference}`);
    }
  }
}

const robots = readFileSync(resolve(root, "robots.txt"), "utf8");
assert(robots.includes("User-Agent: *") && robots.includes("Allow: /"));
assert(robots.includes(`Sitemap: ${origin.origin}/sitemap.xml`));
assert(!existsSync(resolve(root, "fonts")), "Original font collections must not be published");
const manifest = JSON.parse(readFileSync(resolve(root, "favicon/manifest.json"), "utf8"));
for (const icon of manifest.icons) {
  assert(existsSync(exportPath(new URL(icon.src, new URL("/favicon/manifest.json", origin)).pathname)));
}
console.log(`Checked ${pages.size} exported pages: shared navigation and positioning, metadata, structured data, crawl access, local links and assets.`);
