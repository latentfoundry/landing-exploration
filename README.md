# Afterflow

The Afterflow website is a statically exported Next.js application in [`afterflow/`](afterflow/), published at [afterflow.dev](https://afterflow.dev).

```bash
cd afterflow
pnpm install
pnpm dev
```

Before committing site changes:

```bash
pnpm lint
pnpm build
pnpm check:export
```

The [Pages workflow](.github/workflows/deploy-pages.yml) validates and publishes `afterflow/out/` when site or workflow changes reach `main`. The custom domain is configured in GitHub Pages settings.

See the [application README](afterflow/README.md) for source locations, configuration and deployment checks.
