# Afterflow

This repository contains the current Afterflow landing site in [`afterflow/`](afterflow/). It is a statically exported Next.js application deployed to GitHub Pages at [afterflow.dev](https://afterflow.dev).

## Local development

```bash
cd afterflow
pnpm install
pnpm dev
```

## Production checks

```bash
cd afterflow
NEXT_PUBLIC_SITE_URL=https://afterflow.dev pnpm lint
NEXT_PUBLIC_SITE_URL=https://afterflow.dev pnpm build
```

The root deployment workflow publishes `afterflow/out` whenever site or workflow files change on `main`. The `afterflow.dev` custom domain is configured in GitHub Pages settings rather than through a `CNAME` file.
