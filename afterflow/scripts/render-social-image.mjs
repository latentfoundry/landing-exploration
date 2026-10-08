import assert from "node:assert/strict";
import { readFile, writeFile, rename } from "node:fs/promises";
import { fileURLToPath } from "node:url";

// Re-export the social card with the actual fonts and current site tokens.
// Requires a local Chrome with --remote-debugging-port=9257 (or SOCIAL_BROWSER_URL).
const project = new URL("../", import.meta.url);
const css = await readFile(new URL("app/globals.css", project), "utf8");
const tokens = css.match(/:root\s*\{([^}]+)\}/)?.[1];
assert(tokens, "Site typography tokens are missing");
const dataUrl = async (path, type) => `data:${type};base64,${(await readFile(new URL(path, project))).toString("base64")}`;
const [upright, italic, regular, mark] = await Promise.all([
  dataUrl("assets/fonts/TestTiemposHeadline-Medium-BF66457a509b4ec.otf", "font/otf"),
  dataUrl("assets/fonts/TestTiemposHeadline-MediumItalic-BF66457a50b4260.otf", "font/otf"),
  dataUrl("assets/fonts/TestTiemposHeadline-Regular-BF66457a508e31a.otf", "font/otf"),
  dataUrl("public/brand-mark.svg", "image/svg+xml"),
]);
const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><style>
@font-face { font-family: Tiempos; src: url("${upright}") format("opentype"); font-weight: 500; font-style: normal; }
@font-face { font-family: Tiempos; src: url("${italic}") format("opentype"); font-weight: 500; font-style: italic; }
@font-face { font-family: Tiempos; src: url("${regular}") format("opentype"); font-weight: 400; font-style: normal; }
:root { ${tokens} --font-tiempos: Tiempos; }
* { box-sizing: border-box; }
html, body { width: 1200px; height: 630px; margin: 0; background: var(--paper); color: var(--ink); font-synthesis: none; -webkit-font-smoothing: antialiased; }
main { height: 100%; display: flex; align-items: center; padding: 124px 64px 48px; }
.brand { position: absolute; top: 54px; left: 64px; display: flex; align-items: center; gap: 12px; }
.brand img { width: 29px; height: 25px; }
.brand span { font-family: var(--font-display); font-size: 40px; line-height: 1; letter-spacing: -.015em; font-weight: var(--type-brand-weight); }
h1 { margin: 0; font-family: var(--font-display); font-size: 100px; line-height: var(--type-hero-leading); letter-spacing: var(--type-hero-tracking); font-weight: var(--type-hero-weight); font-kerning: normal; text-align: left; }
.line { display: block; white-space: nowrap; }
em { font-weight: inherit; color: var(--accent); }
</style></head><body><div class="brand"><img src="${mark}" alt=""><span>Afterflow</span></div><main><h1><span class="line">Make your company</span><span class="line"><em>better</em> at getting better.</span></h1></main></body></html>`;

const browserURL = process.env.SOCIAL_BROWSER_URL || "http://127.0.0.1:9257";
const tabResponse = await fetch(`${browserURL}/json/new?about:blank`, { method: "PUT" });
assert(tabResponse.ok, "Could not open a local Chrome rendering tab");
const tab = await tabResponse.json();
const socket = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});
let id = 0;
const pending = new Map();
socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (!message.id) return;
  const request = pending.get(message.id);
  pending.delete(message.id);
  if (message.error) request.reject(new Error(message.error.message));
  else request.resolve(message.result);
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  pending.set(++id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

try {
  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false });
  const result = await send("Runtime.evaluate", {
    expression: `(async () => {
      document.open(); document.write(${JSON.stringify(html)}); document.close();
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.decode()));
      return {
        fonts: [...document.fonts].map(font => ({ family: font.family, style: font.style, status: font.status })),
        text: [...document.querySelectorAll('.brand span, .line, em')].map(element => {
          const range = document.createRange(); range.selectNodeContents(element);
          const rect = range.getBoundingClientRect(), style = getComputedStyle(element);
          return { text: element.textContent, weight: style.fontWeight, style: style.fontStyle, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom };
        })
      };
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
  const check = result.result.value;
  assert(check.fonts.length === 3 && check.fonts.every(font => font.status === "loaded"), "Tiempos fonts did not load");
  for (const text of check.text) {
    assert(text.left >= 64 && text.right <= 1136 && text.top >= 0 && text.bottom <= 630, `Text exceeds safe bounds: ${text.text}`);
  }
  const screenshot = await send("Page.captureScreenshot", { format: "png", clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } });
  const png = Buffer.from(screenshot.data, "base64");
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  const destination = fileURLToPath(new URL("app/opengraph-image.png", project));
  await writeFile(`${destination}.tmp`, png);
  await rename(`${destination}.tmp`, destination);
  console.log(JSON.stringify({ file: destination, width: 1200, height: 630, bytes: png.length, ...check }, null, 2));
} finally {
  socket.close();
  await fetch(`${browserURL}/json/close/${tab.id}`).catch(() => {});
}
