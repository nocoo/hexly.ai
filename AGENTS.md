# hexly.ai

Bilingual project directory, preserved identity archives, and public service status on Cloudflare Workers + D1 (`hexly-ai`).
Docs: [README](README.md) · [Overview](docs/01-overview.md) · [Maintenance](docs/29-project-maintenance.md) · [Docs Index](docs/README.md) · [Retrospective](Retrospective.md)

## Commands

Root commands use React 19, Vite 8, TS 7 strict, Bun `1.4.4`, Node `>=24` (CI `26.12.1`). Secrets stay in ignored `.env*`/`.dev.vars*` and GitHub Secrets.

```sh
bun install --frozen-lockfile
bun run dev  # index.dev.hexly.ai -> :7048 + Worker :37048
bun run typecheck  # S1: emits .wrangler/types.d.ts; browser+Worker
bun run lint  # S2: Biome check-only, 0 warnings
bun run test:coverage  # L1: >=95% x4, asset-free
bun run assets:prepare-test && bun run test:assets  # test fixtures & bytes
bun run test:http  # L3: isolation + build + Worker HTTP
bun run test:browser  # L4: isolation + build + Chromium (no --only-shell)
bun run build && bun run deploy:check  # B1: bundle + Wrangler dry run
bun run check:security  # G1/G2: Gitleaks + OSV Scanner
bun run gate:commit  # pre-commit (staged index)
bun run gate:push  # pre-push (pushed commits)
bun run verify  # full local sweep (600s; not CI gate)
```

- Maintenance/release: `bun run assets:hydrate`, `assets:check`, `assets:cold-backup`, `social:check`, `check:purity`, `verify:production`, `release -- --dry-run`. Share cards: [social-cards.md](.agents/skills/hexly-r2-media/references/social-cards.md).

## Invariants

- Serve Vite via Worker `hexly-ai` + Static Assets; `/api/live` (`package.json` `X.Y.Z`) and `/api/share` are build outputs. Gateway reads D1 `STATUS_DB` + runs Cron; no auth or runtime GitHub dep.
- Status (`src/model/status.ts`, [Status](docs/11-status-monitoring.md)) probes active HTTPS sites + `lizheng.dev`, `lizheng.me`, `hexly.ai` last (Hexly Logo) at `/api/live`; exclude stores/Worker domains.
- Keep 5-min Cron, 7-day D1 retention, `(project_id, slot)` dedup, UTC math; visitors read only. Missing/stale/redirect/HTML/login replies are never healthy; local demos never seed prod.
- Store one `category` (`ai`, `tools`, `libs`, `everyday`, `design`, `games`, `extensions`) and boolean `archived` (never `archive`); `libs`=Libraries & Infra, `extensions`=Skills & MCP; cards show both.
- Align categories with `nocoo/nocoo` (`system1-github-profile`). Onboarded projects need catalogue/provenance/status here; remind user to finish `system1-github-readme-md`, profile, and `system1-github-agents-md`.
- Original identity bytes/colors/geometry/licenses are authoritative; Hexly styling never redesigns products. Enforce exact-byte raw approval & defaults ([Identity](docs/02-identity-rules.md)).
- Archived projects get basic support only (no enrichment unless named). Keep `src/model/` pure (no React/DOM), effects in views, routes thin.
- Keep canonical routes, discovery metadata, bilingual/theme/keyboard UX, local TZ, and share cards (`src/data/social-cards.json`) aligned ([Maintenance](docs/29-project-maintenance.md)).
- Serve lean Web-First CDN materials (WebP/SVG/ICO/WOFF2/OG JPEG/MP4/screenshots/metadata + small platform PNGs) from R2 `hexlyai` (`h.no.mt`); hydrate via `docs/assets/inventory.json` with SHA-256 deduplication. Never store 2048px raw PNGs, lossless icon WebPs, `archives/sources/`, or superseded versions on R2 or in Git; Worker < 20 MiB ([Assets](docs/21-asset-storage.md)).
- Cold-archive all 2048px original PNG masters, `artwork/` working sources, and retired R2 versions to Google Drive (`architie@gmail.com` → `My Drive/hexly.ai/`, Folder ID `1hUXSAaoZ8bV-p7e93sRFoEHW2qEIXsvx`; future batches → `06-future-cold-backups/`, ID `1JTKowhtSVL4CrbJK_qxhnTEOvSh74oxD`), configured in `src/data/cold-storage.json` via `bun run assets:cold-backup`. Protect external consumers (`nocoo/zeppelin`) registered in `docs/assets/external-consumers.json`.
- Repo purity (`bun run check:purity`): disallow external code/configs/docs in `docs/sources/` and `artwork/`; allow only top-level JSON receipts and approved brand files.
- Releases need authorization via `bun run release` on clean `main` (CI + D1-first Deploy -> prod check -> tag); keep `--frozen-lockfile` so mirrors never rewrite `bun.lock` ([Release](docs/05-release.md)).
- Temp-repo tests must strip `git rev-parse --local-env-vars` (cwd alone fails in linked worktrees). Pause if another writer's file ownership is unclear.

## Quality & Local Gates

Follows `system1-quality`; CI slots & pinned `base-ci` live in [`quality-slots.yml`](.github/workflows/quality-slots.yml) (`quality / Z1: Gate` required on `main`; admin bypass allows direct pushes). Status: `enforced`, `planned`, `manual`, `N/A`.

- **Exceptions / extra**: `L2 Runtime` `N/A` (D1 in L1 via `getPlatformProxy`, HTTP/E2E in L3/L4); `P1 Package` `N/A` (private). Extra blocking job: `catalogue-and-media`.
- **L1 coverage**: 95% ×4 on `src/model/**` (excl. `brand-manifest.ts`, `social-card.ts`), `worker/status.ts`, gate helpers; never hydrates materials or reads `h.no.mt`.
- **Hooks** (`bun run prepare`, `.husky/`): `pre-commit` (`gate:commit`) checks staged index (tracked binaries, `G1`, `check:focus`, `check:purity`, `S1`, `S2`, `L1`).
- **Pre-push** (`gate:push`): `git archive` per stdin OID -> `G2`, `G1`, fixtures, `check:isolation`, `B1`, `L3`, `L4`. Details: [Quality](docs/03-quality.md).

## Resources & Isolation

| Lane    | `127.0.0.1` Port (Inspector) / State      | Boundary                                        |
| ------- | ----------------------------------------- | ----------------------------------------------- |
| Dev     | `7048`/`37048` (`38048`), `.wrangler/dev` | `index.dev.hexly.ai`, `--env dev --local`, demo |
| L3 HTTP | `17048` (`18048`), `hexly-test-*`         | `--env test --local`, fake IDs, no probes       |
| L4 E2E  | `27048` (`28048`), `hexly-test-*`         | Same guard; pinned clock, distinct lane         |
| Preview | `37048` (`38048`), `.wrangler/preview`    | `--env dev --local`; no dev Worker overlap      |
| Prod    | `hexly.ai`, `status.hexly.ai`             | `--env ""`, `workers.dev`/previews off          |

- Harnesses init/verify `_test_marker(env=test)` before reset/cleanup; never deploy remote `-test` resources or expose prod creds/dev state to tests.
- `bun run dev` seeds demo SQLite (5-min refresh) and runs Vite + Worker; restart after catalogue edits. Wrangler types live in `.wrangler/types.d.ts` ([Dev](docs/04-development.md)).

## Retrospective

Record incidents in [Retrospective.md](Retrospective.md); promote recurring rules to `Invariants` and deterministic safeguards to tests/hooks.
