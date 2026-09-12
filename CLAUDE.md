# hexly.ai

Bilingual project directory, preserved logo gallery, public service status, and reusable Video Kit.
Profile: ts-worker-web. Direction: [docs/01-overview.md](docs/01-overview.md). Frameworks must not rewrite this file.

## Sources of Truth

This file is the project contract; hooks, CI, and configuration enforce it. Keep them aligned without weakening quality gates.

| Fact | Where |
|---|---|
| Human docs | [README.md](README.md), [docs/README.md](docs/README.md) |
| Catalogue | `src/data/projects/`; public `nocoo/nocoo` profile and recorded repository evidence |
| Project media / routes | Optional `Project.media` in the same catalogue; [routes and media boundary](docs/17-project-media.md) |
| Identity rules | [docs/02-identity-rules.md](docs/02-identity-rules.md), generated `docs/profiles/`; [logo family studies](docs/06-logo-family.md) in `artwork/logo-family/` |
| Version | Root `package.json` as `X.Y.Z`; display `vX.Y.Z`; build emits version and Git revision at `/api/live` |
| Status | `src/model/status.ts`, `worker/status.ts`, [storage and scheduling](docs/11-status-monitoring.md) |
| Video Kit | `packages/video-kit/`, `src/data/videos.json`, [family and publication rules](docs/16-video-kit.md) |
| Enforcement | `.husky/`, `scripts/gates.ts`, `.github/workflows/ci.yml`, test configs |
| Secrets | GitHub Actions secrets; local `.env*` and `.dev.vars*` are gitignored; never track values |
| Accidents | [Retrospective.md](Retrospective.md); machine rules stay in global `AGENTS.md` and `rules/` |

## Project Invariants

- Serve the Vite build through the existing Worker and Static Assets. `/api/live` and `/api/share` remain build artifacts. The gateway also runs status Cron and reads D1; there is no authentication or runtime GitHub dependency.
- The catalogue is the monitor list: only non-archived independent HTTPS websites, at their origin plus `/api/live`. Exclude store/distribution links. D1 `hexly-status` uses `STATUS_DB`; Cron runs every five minutes. Each write deletes checks older than seven days, reads apply the same cutoff, and `(project_id, slot)` prevents duplicates.
- Visitors only read observations. Missing/stale checks remain unknown; HTML fallbacks, redirects, and login pages are never healthy. Local mock data is labeled and must never seed production.
- Status timestamps, hourly buckets, retention, and availability calculations remain UTC. Display times in the browser's current time zone by default; the top selector remembers an explicit choice, and Local follows the browser. Use `Intl` for date-specific offsets and daylight-saving transitions.
- Preserve English/Chinese, light/dark, desktop/mobile, keyboard access, preference persistence, and shareable navigation. Main navigation is Projects / Templates / Status (项目 / 模板 / 状态); retain Play / Journal / Résumé / Portfolio as the related-site links.
- `/templates` adapts the existing catalogue once for five content layouts, five independent openings, five independent endings and Video/Deck views. Both film themes use the actual site light/dark palettes; canvas theme is independent of the surrounding site theme. Preserve composition choices in navigation and exported v2 configuration. Keep the official Hexly mark/wordmark, licensed fonts, paper/ink/terracotta tokens, red-dot restraint and shared motion primitives. Deck and reduced motion show settled states; previews start paused.
- Shared template code belongs in `packages/video-kit`; project-specific scripts, voices, scenes, production logs and finished films belong to their consumer. Consumers pin a published Git SHA. The package is private, not an npm release. Preserve concurrent handoffs and stop on unknown writes.
- The video manifest is metadata only. Cards and previews use the same client composition; do not return obsolete sample movies, posters or deck downloads to `public/video-assets`. `video:check` verifies the 5/5/5 manifest, both themes, licensed asset hashes and the absence of rendered media. Keep frames, decks, movies and renderer caches outside public assets. Brand assets keep their separate immutable version when their bytes are unchanged.
- `/` is the project catalogue, `/logos` its secondary image wall, and `/projects/<project>` the detail. Details contain introduction, optional media, overview, then the complete `#brand` archive. Old `/logos/<project>` links redirect to that brand anchor; `/videos` and its paths redirect to `/templates`, retaining query parameters. Use the shared `src/model/routes.ts`; do not redirect logo asset directories. Keep generated sitemap, HTML snapshots, JSON-LD, canonical/share records, `llms.txt`, and runtime metadata on canonical routes.
- Brand browsing keeps the `#brand` section aligned when changing projects or languages. Hash navigation uses native smooth scrolling and respects reduced motion; do not override it with instant scrolling. Keep logo/wordmark descenders visible and long headings within the viewport. Verify the full gallery browser suite after changing its layout.
- Finished recordings belong to optional `media.videos` on their project's existing JSON, never one copy per template. Render a poster before user-initiated native playback; include actual captions when available. Screenshot-only projects work without a video. Omit the section, badge and filter when there is no relevant media. New large recordings use a separately configured media origin; do not add them to Git or Static Assets. The `media.hexly.ai` integration is currently a local code boundary, not a provisioned R2 service.
- All hides repositories marked `archived`; existing product categories and direct archived-project routes remain accessible. Directory cards no longer show a Refined badge; redraw status belongs in the brand archive.
- Default catalogue order is animals, templates, games, then tools. Animals sort by descending stars, using total default-branch commits when both have zero stars; `src/data/project-order.json` records the snapshot and series. A–Z sorts matching names alphabetically. Omit hexly.ai itself from the directory; preserve its brand record separately in `src/data/site-identity.json`.
- Every project needs a stable slug, title, bilingual descriptions, emoji, verified links, logo provenance, and evidenced foreground/background colors. Follow the identity rules; do not infer websites or invent palettes.
- Keep existing high-resolution logos, screenshots, source artwork, paths and SHA-256 provenance in Git and Static Assets; do not migrate or rewrite that history for the new media structure. Original logos remain in `public/logos/originals/`, emoji identities in `public/logos/emoji/`. Derivatives must preserve artwork proportions and colors.
- For an authorized project rename, update its catalogue ID and route while preserving the numbered profile. Locate historical artwork through `family.root`; preserve archive paths, export names, original bytes and checksums. Redirect former page URLs with Static Assets `_redirects`.
- Synchronize catalogue changes with the GitHub profile using the workflow skill `zhengli-update-github-readme` (`../workflow/agents/skills/zhengli-update-github-readme/SKILL.md`). Keep backups, palettes, source revisions, and generated profiles consistent.
- Preserve the current identity baseline. Animal-family studies with `gpt-image-2` live in `artwork/logo-family/`; retain raw outputs, prompts, references, and finishing versions. Candidates require review at artwork, app-icon, sidebar, and favicon sizes before promotion.
- Immediately show each new Image 2 result for raw-image confirmation, unless the owner explicitly delegates acceptance for a named batch. Record the exact waiver and agent inspection without claiming owner review of unseen bytes. Require an approved `raw-review.json` for those exact bytes before extraction, compositing, derivatives, or catalogue integration. Every animal needs visible connected facets and one interest point outside its main mass; every project's background needs distinct motif geometry.
- Every finished study has static review HTML and a complete site comparison. Keep `family.status` and its separate foreground truthful to source adoption; `project.logo` remains source provenance. Presentation reference boards appear only in static HTML and Git. Background-only passes preserve exact transparent/white bytes.
- Follow [the logo usage SOP](docs/07-logo-usage-sop.md): large README presentations may use backgrounds; sidebar and browser marks use transparent foregrounds without extra masking. Verify actual consumers and distinguish local adoption from publication.

## Stack / Layout

| Component | Choice |
|---|---|
| Client | React 19, Vite 8, TypeScript 7 strict |
| Toolchain | Bun 1.4.0, exact dependencies and frozen `bun.lock`; browser CI and deployment pin Node.js 26.7.0 |
| Hosting | Worker `hexly-ai`, Static Assets, Cron, and D1 `hexly-status`; apex/www/status custom domains |
| Quality | Biome; Vitest L1; Playwright HTTP L2 and Chromium L3; OSV + Gitleaks |

```text
src/data/          catalogue, bilingual copy, version
src/model/         filtering, preferences, navigation, status, types
src/App.tsx        browser state and view orchestration
src/components/    accessible React views
src/styles/        design tokens and view styles
public/logos/      original backups, emoji identities, WebP derivatives
packages/video-kit/ 5/5/5 composable designs, shared brand/motion, v2 schema, player, renderer
worker/            gateway, scheduled probes, D1 status queries
migrations/        D1 schema
scripts/           local mock D1, asset/profile generators, verification, gates, release
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
bun run gate:commit
bun run build
bun run test:coverage
bun run test:http
bun run test:browser
bun run check:security
bun run assets:build && bun run docs:profiles && bun run assets:check
bun run release -- --dry-run
bun run video:dev
bun run video:studio
bun run video:render -- --project pew --template showcase --theme dark --opening stack --ending split --mode deck
bun run video:review
bun run video:check
```

Run the asset/profile generation sequence after intentional catalogue or artwork changes; ordinary builds use checked-in assets. Read [docs/05-release.md](docs/05-release.md) before publishing.

Video exports require Chrome/Chromium and FFmpeg. Real PPTX/PDF contain image-backed pages, with editable native PPTX speaker notes. See the [kit README](packages/video-kit/README.md) for schema/API, export commands, dependency/brand licenses and the reproducible PptxGenJS dependency pruning. Never suppress its known dependency advisory instead of removing the unused vulnerable code.

## Verification

`enforced` means a script, hook, or CI check exists; `manual` requires review. See [docs/03-quality.md](docs/03-quality.md) for coverage scope and browser limitations.

| Dimension / change | Contract | Status | Evidence |
|---|---|---|---|
| L1 logic | At least 90% statements, branches, functions, and lines for models, isolation, and release policy | enforced | Pre-commit `test:changed`; CI `test:coverage`; `vitest.config.ts` |
| L2 HTTP | Built document, assets, headers, downloads, and release metadata through local Workers HTTP | enforced | Pre-push and CI `test:http`; `playwright.http.config.ts` |
| L3 UI | Desktop/mobile journeys, both languages/themes, gallery, accessibility | enforced | CI `test:browser`; `playwright.config.ts` |
| G1 static | TypeScript strict and Biome with zero errors or warnings | enforced | Pre-commit `lint:staged`; CI full typecheck/lint |
| G2 security | OSV locked dependencies and Gitleaks; missing tools fail | enforced | Pre-push `check:security`; CI |
| D1 isolation | Local-only SQLite D1, fake IDs, separate state, no public probes or remote bindings | enforced | `check:isolation`, `scripts/isolation.ts`, Playwright configs |
| Assets / build | Source checksums, WebP sizes, Vite build, Wrangler dry run | enforced | CI `assets:check`, L2/L3 build, `deploy:check` |
| Content / docs | Profile synchronization, provenance, numbered docs when behavior changes | manual | Review catalogue changes against identity rules and source evidence |

Pre-commit runs only staged-file Biome and affected unit tests, concurrently and without coverage. Vitest selects tests from staged, unstaged, and untracked Git changes; configuration/dependency changes and inputs read outside the import graph trigger all unit tests. Documentation/artwork-only changes with no related tests pass without running the suite. Full typecheck, lint, coverage, isolation, security, and integration/browser checks remain in CI; pre-push runs L2 + G2.
Checks never auto-fix. Do not bypass hooks or commit skipped/focused tests; Playwright enforces `forbidOnly`. Hooks read working-tree content, without index snapshots or stdin-ref-range validation. Review the staged diff explicitly.

## Resources / Isolation

| Purpose | Port | Runtime state / access |
|---|---|---|
| Vite dev | 7048 | `https://index.dev.hexly.ai` through Caddy to loopback |
| Dev Worker | 37048 | `.wrangler/dev`; inspector 38048; SQLite D1 demo data |
| L2 HTTP | 17048 | `.wrangler/http`; inspector 18048 |
| L3 browser | 27048 | `.wrangler/browser`; inspector 28048 |
| Workers preview | 37048 | `.wrangler/preview`; inspector 38048 |

`bun run dev` builds the target manifest, migrates/seeds local SQLite D1, and starts both servers; review `/status`. Demo records refresh every five minutes. Restart after catalogue changes. Tests use `--env test --local`; dev/preview use `--env dev --local`. Fake database IDs, separate persistence paths, and disabled live probes keep all local environments isolated. Production commands select `--env ""`. Worker types are generated into ignored `.wrangler/types.d.ts` and checked separately from browser DOM types. Runbook: [docs/04-development.md](docs/04-development.md).

## Operations / Release

- Entry: `bun run release` or `bun run release -- patch|minor|major|X.Y.Z` from clean `main`, with GitHub write access. Dry run is read-only. Version policy and recovery: [docs/05-release.md](docs/05-release.md).
- The release script updates version/changelog, pushes `main`, waits for that commit's successful quality and Deploy jobs, verifies production, then creates an annotated tag and GitHub Release. Published tags are immutable.
- `ci.yml` (`CI`) runs all gates. Its successful trusted `main` run triggers `release.yml` (`Release`), which applies D1 migrations and deploys that source SHA. The release helper matches `Deploy CI <source-run-id>` and requires `Deploy / Deploy Worker` success. Use this path for routine publication; manual `bun run deploy` follows the same migration order. Actions secrets: `CLOUDFLARE_API_TOKEN` (already has D1 access), `CLOUDFLARE_ACCOUNT_ID`.
- Production: `https://hexly.ai` and `https://status.hexly.ai`; preview: `https://hexly-ai.nocoo.workers.dev` (`noindex`). `bun run verify:production` checks version/revision, document, status page and live D1 feed, compiled assets, and original logo. Keep routing and rollback details in the runbook.

## Adding a project: complete the whole path

Use the shared `zhengli-update-github-readme` skill. A new project is complete
when its source repository, GitHub profile, hexly catalogue, identity/provenance,
project documentation, public website, and status coverage agree.

1. Inspect the source README, actual logo/theme, Git status, and release path.
   Preserve unrelated work and never publish someone else's unpushed commits.
2. For a public site, provide an unauthenticated, uncached `GET /api/live` with
   JSON `status: "ok"` and the current top-level `version`. Existing `name` or
   `component` conventions may remain. Dynamic services check core dependencies
   and return an appropriate failure status; static sites generate their health
   JSON during the production build. Verify production, not just Vite dev.
3. Update the source repository description and `nocoo/nocoo` profile entry,
   retaining established emoji and section/order conventions. Record the profile
   revision before citing it in catalogue provenance.
4. Add the project JSON and index entry, archive its actual artwork and palette
   evidence, and run `assets:build`, `docs:profiles`, and `assets:check`. Use the
   logo skill when identity creation or promotion is in scope.
5. Validate and publish the source and this site within the user's authorization.
   A health-only correction uses Z+1. After the next Cron run, verify the exact
   endpoint and current result at `status.hexly.ai`; disclose real failures.

Desktop apps and libraries without a website do not need a synthetic endpoint.
Do not create a separate D1 monitor entry, deploy a second status Worker, or
require a running browser to keep monitoring alive.

## Retrospective

Record accident narratives in [Retrospective.md](Retrospective.md), recurring project rules here, cross-project lessons in nmem/global rules, and deterministic safeguards in tests or hooks.

- Keep frozen lockfile validation in version-only releases; temporary registry configuration must not rewrite dependency sources.
- Confirm the Deploy job's final success and public verification before reporting publication complete.
- Keep the pinned browser job required by Deploy alongside the shared quality workflow; preserve its failure diagnostics and traces.
- Temporary-repository tests must remove repository-local Git environment variables inherited from hooks; a different working directory alone does not isolate a linked worktree.
