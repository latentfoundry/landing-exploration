# Afterflow website

A statically exported Next.js site for Afterflow's business simulation and AI implementation work. Production: [afterflow.dev](https://afterflow.dev).

## Development

Use Node.js 24 and pnpm 9.15.4, matching CI.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Source map

| Location | Purpose |
| --- | --- |
| `app/page.tsx` | Homepage structure, copy and FAQs |
| `app/layout.tsx` | Fonts, shared metadata and organisation/site structured data |
| `app/globals.css` | Typography, layout and responsive styles |
| `components/` | Navigation, illustrations, carousel, scroll story and shared UI |
| `content/insights.ts` | Article content and publication metadata |
| `app/insights/` | Insights index and article routes |
| `lib/site.ts` | Canonical origin, search metadata and social image descriptor |
| `app/opengraph-image.png` | Current 1200×630 social preview |
| `assets/fonts/` | Five fonts used by `next/font/local` |
| `public/` | Brand mark and favicon assets |
| `scripts/check-export.mjs` | Static export validation used locally and in CI |

[PRODUCT.md](PRODUCT.md) records audience, positioning and evidence boundaries. [DESIGN.md](DESIGN.md) describes the current visual and interaction system. [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) records component attribution; [assets/README.md](assets/README.md) covers font handling and the retained licence.

## Validation and deployment

```bash
pnpm lint
pnpm build
pnpm check:export
```

Build output goes to `out/`. Export validation checks route metadata, structured data, canonical URLs, robots/sitemap, local resources, anchors and favicon assets. Generated build output, local review captures and tooling caches are ignored; commit source changes and `pnpm-lock.yaml` when dependencies change.

The root [GitHub Pages workflow](../.github/workflows/deploy-pages.yml) runs these checks with a frozen lockfile before uploading `out/`. Site or workflow changes on `main` deploy automatically; `workflow_dispatch` also permits a manual run. The custom domain is configured in Pages settings, without a repository `CNAME` file.

## Canonical URLs and search

`lib/site.ts` resolves the origin from `NEXT_PUBLIC_SITE_URL`, then `VERCEL_PROJECT_PRODUCTION_URL`, then `https://afterflow.dev`. Preview-host `VERCEL_URL` is deliberately ignored. Overrides must be HTTP(S) origins without a path, query or credentials. CI explicitly sets the production domain.

Canonical links and sitemap entries use trailing slashes. Structured data describes the organisation, website, homepage service, Insights collection and articles. Article publication dates come from content rather than build time. Keep metadata consistent with visible copy and preserve server-rendered reading content.

After deployment, check public canonical and social URLs, then submit `https://afterflow.dev/sitemap.xml` through the verified Google Search Console and Bing Webmaster Tools properties. Validate structured data with Google's Rich Results Test or Schema.org Validator.
