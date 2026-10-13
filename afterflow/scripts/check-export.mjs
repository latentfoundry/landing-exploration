import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { relative, resolve } from "node:path";

const root = resolve("out");
const localOnlyNames = new Set([
  "data", "analysis", "audits", "reports", "screenshots", "scratch", "tmp",
  "output", "artifacts", "source-fonts", "node_modules", "coverage",
  "playwright-report", "test-results", ".git", ".github", ".agents",
  ".claude", ".codex", ".impeccable", ".cache", ".pnpm-store",
  "AGENTS.md", "CLAUDE.md", "DESIGN.md", "PRODUCT.md", ".DS_Store",
  "private", "drafts",
]);

// Only the visible benchmark experience, fallbacks and sharing image may ship.
const benchmarkAssets = new Set([
  "story.js", "field-gl.js", "particle-shapes.js", "opengraph-image.png",
  "vendor/anime.esm.min.js", "vendor/anime-LICENSE.txt",
  ...Array.from({ length: 8 }, (_, index) => `scenes/scene-${index}.svg`),
]);

function checkPublishedFiles(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    const publishedPath = relative(root, path);
    assert(
      !localOnlyNames.has(entry.name) && !entry.name.startsWith(".env") && !entry.name.endsWith(".provenance.json"),
      `Local-only file or folder must not be published: ${publishedPath}`,
    );
    if (publishedPath.startsWith("interventionbench/")) {
      const asset = publishedPath.slice("interventionbench/".length);
      assert(entry.isDirectory() ? ["scenes", "vendor"].includes(asset) : benchmarkAssets.has(asset),
        `Unreleased benchmark material must not be published: ${publishedPath}`);
    }
    if (entry.isDirectory() && publishedPath.startsWith("research/interventionbench-v0-1/")) {
      assert.fail(`Unreleased benchmark route must not be published: ${publishedPath}`);
    }
    assert(!entry.isSymbolicLink(), `Export must not contain symlinks: ${relative(root, path)}`);
    if (entry.isDirectory()) checkPublishedFiles(path);
  }
}

checkPublishedFiles(root);
for (const asset of benchmarkAssets) {
  assert(existsSync(resolve(root, "interventionbench", asset)), `Required benchmark page asset is missing: ${asset}`);
}
const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim() || process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() || "https://afterflow.dev";
const origin = new URL(/^https?:\/\//i.test(configuredOrigin) ? configuredOrigin : `https://${configuredOrigin}`);
const sitemap = readFileSync(resolve(root, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const pages = new Map();
for (const [published, source] of [
  ["opengraph-image.png", "app/opengraph-image.png"],
  ["interventionbench/opengraph-image.png", "public/interventionbench/opengraph-image.png"],
]) {
  const socialImage = readFileSync(resolve(root, published));
  assert.equal(socialImage.readUInt32BE(16), 1200, `${published}: must be 1200px wide`);
  assert.equal(socialImage.readUInt32BE(20), 630, `${published}: must be 630px high`);
  assert(socialImage.equals(readFileSync(resolve(source))), `${published}: exported social image is stale`);
}
const socialUrls = new Map();

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
  const ogImage = new URL(metadata.find((tag) => tag.property === "og:image")?.content);
  const twitterImage = new URL(metadata.find((tag) => tag.name === "twitter:image")?.content);
  const expectedImage = url.pathname.startsWith("/research/interventionbench-v0-1/")
    ? "/interventionbench/opengraph-image.png"
    : "/opengraph-image.png";
  for (const image of [ogImage, twitterImage]) {
    assert.equal(image.origin, origin.origin, `${url.pathname}: social image must use the public origin`);
    assert.equal(image.pathname, expectedImage, `${url.pathname}: incorrect social image`);
    assert(image.search, `${url.pathname}: social image needs a cache version`);
  }
  if (!socialUrls.has(expectedImage)) socialUrls.set(expectedImage, twitterImage.href);
  assert.equal(twitterImage.href, socialUrls.get(expectedImage), `${url.pathname}: Twitter image version has drifted`);
  // Next's homepage file convention uses a content hash; other pages use siteConfig.
  if (url.pathname !== "/") assert.equal(ogImage.href, twitterImage.href, `${url.pathname}: Open Graph image version has drifted`);
  assert(metadata.find((tag) => tag.name === "description")?.content, "Each route needs a description");
  assert(!metadata.some((tag) => tag.name === "robots" && tag.content?.includes("noindex")));
  assert.equal((html.match(/<h1\b/g) || []).length, 1, "Each route needs one primary heading");
  const graphs = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
    .flatMap((match) => { const value = JSON.parse(match[1]); return value["@graph"] || [value]; });
  assert(graphs.some((node) => node["@type"] === "Organization"));
  assert(graphs.some((node) => node["@type"] === (url.pathname === "/" ? "WebPage" : url.pathname === "/research/" ? "CollectionPage" : "BlogPosting")));
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
assert(!existsSync(resolve(root, "insights")), "Retired insights routes must not be published");
assert(pages.get("/research/")?.includes("Introducing InterventionBench v0.1"), "Research must list the benchmark announcement");
assert(!pages.get("/research/")?.includes("Research behind our approach"), "Retired research section must not be published");
const benchmark = pages.get("/research/interventionbench-v0-1/");
assert(benchmark?.includes('datetime="2026-10-14"'), "Benchmark announcement must show its publication date");
assert(benchmark?.includes('id="world-canvas"') && benchmark.includes('id="results"'), "Benchmark story and results must be preserved");
const notFound = readFileSync(resolve(root, "404.html"), "utf8");
assert(notFound.includes("Page not found.") && notFound.includes('class="site-header"') && notFound.includes('class="site-footer"'), "404 must use the shared site layout");
assert(notFound.includes("Back to home"), "404 needs a recovery link");
assert(/name="robots" content="[^"]*noindex/.test(notFound), "404 must not be indexed");
assert(robots.includes("User-Agent: *") && robots.includes("Allow: /"));
assert(robots.includes(`Sitemap: ${origin.origin}/sitemap.xml`));
assert(!existsSync(resolve(root, "fonts")), "Original font collections must not be published");
const manifest = JSON.parse(readFileSync(resolve(root, "favicon/manifest.json"), "utf8"));
for (const icon of manifest.icons) {
  assert(existsSync(exportPath(new URL(icon.src, new URL("/favicon/manifest.json", origin)).pathname)));
}
console.log(`Checked ${pages.size} content pages and 404: shared layout, social images, metadata, structured data, crawl access, local links and assets.`);
