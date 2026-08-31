# Afterflow landing page

A concise, single-page product story for Afterflow: a decision and simulation layer for operational change.

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

Set `NEXT_PUBLIC_SITE_URL` to the public origin in deployment. Canonical URLs, social images, `robots.txt`, and `sitemap.xml` use it. The GitHub Pages workflow sets it to `https://afterflow.dev`; local development falls back to `http://localhost:3000`.

## Where to edit

- `app/page.tsx` — landing-page structure and copy
- `components/cinematic-hero.tsx` — hero reveal and scroll-linked world scene
- `components/transformation-scroll.tsx` — sticky three-chapter mechanism and disclosed product concepts
- `components/consulting-comparison.tsx` — animated consulting-versus-Afterflow comparison
- `content/insights.ts` — article metadata and content
- `app/globals.css` — visual system and responsive behaviour
- `PRODUCT.md` — product and audience context
- `DESIGN.md` — design-system rationale and extension rules

The interface uses an Animated Button adapted from Vengeance UI. The operational concept surfaces, causal diagrams, and progressive focus reveals are purpose-built for Afterflow. Copied component licensing is recorded in `THIRD_PARTY_NOTICES.md`.

## Quality checks

```bash
pnpm lint
pnpm build
```

`pnpm build` creates the static GitHub Pages artifact in `out/`. The deployment workflow is stored at the repository root in `.github/workflows/deploy-pages.yml`; the custom domain is managed in GitHub's Pages settings, not with a `CNAME` file.

After deployment, confirm that canonical and Open Graph URLs use the public domain, then submit `/sitemap.xml` in Google Search Console and Bing Webmaster Tools. Validate article structured data with Google's Rich Results Test or Schema.org Validator.
