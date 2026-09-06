# hexly.ai

Bilingual personal project directory and logo gallery, preserving current artwork and evidenced color palettes.
Profile: ts-worker-web. Direction: [docs/01-overview.md](docs/01-overview.md). Frameworks must not rewrite this file.

## Sources of Truth

This file is the project contract; hooks, CI, and configuration enforce it. Keep them aligned without weakening quality gates.

| Fact | Where |
|---|---|
| Human docs | [README.md](README.md), [docs/README.md](docs/README.md) |
| Catalogue | `src/data/projects.json`; public `nocoo/nocoo` profile and recorded repository evidence |
| Identity rules | [docs/02-identity-rules.md](docs/02-identity-rules.md), generated `docs/profiles/`; [logo family studies](docs/06-logo-family.md) in `artwork/logo-family/` |
| Version | Root `package.json` as `X.Y.Z`; display `vX.Y.Z`; build emits version and Git revision at `/api/live` |
| Enforcement | `.husky/`, `scripts/gates.ts`, `.github/workflows/ci.yml`, test configs |
| Secrets | GitHub Actions secrets; local `.env*` and `.dev.vars*` are gitignored; never track values |
| Accidents | [Retrospective.md](Retrospective.md); machine rules stay in global `AGENTS.md` and `rules/` |

## Project Invariants

- Serve the Vite build through Workers Static Assets. There is no application server, database, authentication, or runtime GitHub dependency; `/api/live` is a static build artifact.
- Preserve English/Chinese, light/dark, desktop/mobile, keyboard access, preference persistence, and shareable navigation state in both directory and gallery views.
- Every project needs a stable slug, title, bilingual descriptions, emoji, verified links, logo provenance, and evidenced foreground/background colors. Follow the identity rules; do not infer websites or invent palettes.
- Keep original logo bytes and SHA-256 provenance in `public/logos/originals/`. Emoji identities live separately in `public/logos/emoji/`. Derivatives must preserve artwork proportions and colors.
- Synchronize catalogue changes with the GitHub profile using the workflow skill `zhengli-update-github-readme` (`../workflow/agents/skills/zhengli-update-github-readme/SKILL.md`). Keep backups, palettes, source revisions, and generated profiles consistent.
- Preserve the current identity baseline. Animal-family studies with `gpt-image-2` live in `artwork/logo-family/`; retain raw outputs, prompts, references, and finishing versions. Candidates require review at artwork, app-icon, sidebar, and favicon sizes before promotion.

## Stack / Layout

| Component | Choice |
|---|---|
| Client | React 19, Vite 8, TypeScript 7 strict |
| Toolchain | Bun 1.4.0, exact dependencies and frozen `bun.lock`; CI Node.js 26.7.0 |
| Hosting | Cloudflare Worker `hexly-ai`, static assets only |
| Quality | Biome; Vitest L1; Playwright HTTP L2 and Chromium L3; OSV + Gitleaks |

```text
src/data/          catalogue, bilingual copy, version
src/model/         filtering, preferences, navigation, types
src/App.tsx        browser state and view orchestration
src/components/    accessible React views
src/styles/        design tokens and view styles
public/logos/      original backups, emoji identities, WebP derivatives
scripts/           asset/profile generators, verification, gates, release
tests/             unit/, http/, browser/
docs/              numbered guides, profiles/, sources/, deployment/
artwork/           versioned logo studies, references, raw outputs, finishing
```

Keep model logic independent of React and browser globals. Browser effects belong in `App.tsx` or view components; keep views thin.

## Commands

```bash
bun run dev
bun run typecheck
bun run lint
bun run build
bun run test:coverage
bun run test:http
bun run test:browser
bun run check:security
bun run assets:build && bun run docs:profiles && bun run assets:check
bun run release -- --dry-run
```

Run the asset/profile generation sequence after intentional catalogue or artwork changes; ordinary builds use checked-in assets. Read [docs/05-release.md](docs/05-release.md) before publishing.

## Verification

`enforced` means a script, hook, or CI check exists; `manual` requires review. See [docs/03-quality.md](docs/03-quality.md) for coverage scope and browser limitations.

| Dimension / change | Contract | Status | Evidence |
|---|---|---|---|
| L1 logic | At least 90% statements, branches, functions, and lines for models, isolation, and release policy | enforced | Pre-commit and CI `test:coverage`; `vitest.config.ts` |
| L2 HTTP | Built document, assets, headers, downloads, and release metadata through local Workers HTTP | enforced | Pre-push and CI `test:http`; `playwright.http.config.ts` |
| L3 UI | Desktop/mobile journeys, both languages/themes, gallery, accessibility | enforced | CI `test:browser`; `playwright.config.ts` |
| G1 static | TypeScript strict and Biome with zero errors or warnings | enforced | Pre-commit `check:static`; CI typecheck/lint |
| G2 security | OSV locked dependencies and Gitleaks; missing tools fail | enforced | Pre-push `check:security`; CI; pre-commit staged secret scan |
| D1 isolation | Loopback servers, separate state, no storage or remote bindings | enforced | `check:isolation`, `scripts/isolation.ts`, Playwright configs |
| Assets / build | Source checksums, WebP sizes, Vite build, Wrangler dry run | enforced | CI `assets:check`, L2/L3 build, `deploy:check` |
| Content / docs | Profile synchronization, provenance, numbered docs when behavior changes | manual | Review catalogue changes against identity rules and source evidence |

Pre-commit runs G1 + L1 + staged secret scanning; pre-push runs L2 + G2. Checks never auto-fix. Do not bypass hooks or commit skipped/focused tests; Playwright enforces `forbidOnly`.
Current hooks check working-tree code, without index snapshots or stdin-ref-range validation; only the commit secret scan targets staged content. Review the staged diff explicitly.

## Resources / Isolation

| Purpose | Port | Runtime state / access |
|---|---|---|
| Vite dev | 7048 | `https://index.dev.hexly.ai` through Caddy to loopback |
| L2 HTTP | 17048 | `.wrangler/http`; inspector 18048 |
| L3 browser | 27048 | `.wrangler/browser`; inspector 28048 |
| Workers preview | 37048 | `.wrangler/preview`; inspector 38048 |

D1 denotes test isolation, not a database requirement. Tests use `--env test --local`, own their servers, and never reuse dev servers. Production/preview commands explicitly select `--env ""`. Runbook: [docs/04-development.md](docs/04-development.md).

## Operations / Release

- Entry: `bun run release` or `bun run release -- patch|minor|major|X.Y.Z` from clean `main`, with GitHub write access. Dry run is read-only. Version policy and recovery: [docs/05-release.md](docs/05-release.md).
- The release script updates version/changelog, pushes `main`, waits for that commit's successful quality and Deploy jobs, verifies production, then creates an annotated tag and GitHub Release. Published tags are immutable.
- `Quality & Deploy` automatically deploys trusted `main` after all gates. Use this path for routine publication; manual `bun run deploy` also exists. Actions secrets: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
- Production: `https://hexly.ai`; preview: `https://hexly-ai.nocoo.workers.dev` (`noindex`). `bun run verify:production` verifies version/revision, document, compiled assets, and original logo. Keep apex migration/rollback details in the deployment runbook.

## Retrospective

Record accident narratives in [Retrospective.md](Retrospective.md), recurring project rules here, cross-project lessons in nmem/global rules, and deterministic safeguards in tests or hooks.

- Keep frozen lockfile validation in version-only releases; temporary registry configuration must not rewrite dependency sources.
- Confirm the Deploy job's final success and public verification before reporting publication complete.
