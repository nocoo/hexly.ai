# hexly.ai

Bilingual project directory, preserved identity archives, public service status and reusable Video Kit.
Profile: ts-worker-web.
Direction: [overview](docs/01-overview.md). Catalogue, brand and media work must also follow the [maintenance contract](docs/29-project-maintenance.md). Frameworks must not rewrite this file.

## Sources of Truth

This file is the contract; hooks, CI and configuration enforce it. Raise weaker enforcement instead of lowering this contract.

| Fact | Where |
|---|---|
| Human docs | [README.md](README.md), [docs index](docs/README.md) |
| Catalogue / identity | `src/data/projects/`, verified source/profile revisions, [identity rules](docs/02-identity-rules.md), [maintenance details](docs/29-project-maintenance.md) |
| Media / archives | `src/data/media-storage.json`, `docs/assets/inventory.json`, immutable receipts and [asset storage](docs/21-asset-storage.md) |
| Status / Video Kit | `src/model/status.ts`, `worker/status.ts`, `packages/video-kit/`, `src/data/videos.json` |
| Version | Root `package.json` as `X.Y.Z`, display `vX.Y.Z`; build emits version/revision at `/api/live` |
| Enforcement | `.husky/`, `scripts/gates.ts`, CI/release workflows and test configs |
| Secrets / accidents | Ignored `.env*` / `.dev.vars*`, GitHub secrets; [Retrospective.md](Retrospective.md); machine rules in global `AGENTS.md` / `rules/` |

## Project Invariants

- Serve Vite through the existing Worker and Static Assets. `/api/live` and `/api/share` are build artifacts; the gateway also reads status D1 and runs Cron. There is no authentication or runtime GitHub dependency.
- Monitoring uses active independent HTTPS catalogue sites plus the approved `lizheng.dev`, `lizheng.me` and `hexly.ai` entries in `src/model/status.ts`, at origin plus `/api/live`; exclude stores/distribution links and Worker domains. The three additional sites stay last and use the Hexly Logo. Preserve five-minute Cron, seven-day retention, deduplication by project/slot and UTC calculations. Visitors only read observations; missing/stale/redirect/login results must not become healthy. Local demos never seed production.
- Keep canonical project-detail routes, redirects/discovery metadata, bilingual light/dark responsive views, keyboard behavior, browser-local time zones, preference persistence and shareable navigation aligned. Preserve all detailed gallery, screenshot, CTA and Agent-guide rules in the maintenance contract.
- Original identity bytes, geometry, colors, licenses and provenance are authoritative. Hexly campaign styling does not redesign independent products. Exact-byte raw-image approval rules and documented product-type/model defaults remain in force. Archived projects receive basic support and are excluded from enrichment unless explicitly named.
- Independently served materials belong to immutable R2 `hexlyai` / `https://h.no.mt` objects; code/SVG source and receipts stay in Git, working binaries hydrate from inventory. Never add movies/material binaries to Git or deployed assets, merge retired binary history back, or overwrite original/approved versions. Production assets remain below 20 MiB.
- Shared 5/5/5 compositions live in the private Video Kit and consumers pin a published Git SHA. Project scripts/voices/scenes/films belong to consumers. Reuse the five immutable standard outros directly, preserve media receipts and concurrent handoffs, and pause if ownership of another writer's changes is unclear.
- Keep models independent of React/browser globals, effects in App/views and routes thin. Preserve the detailed source-adoption, brand-kit, texture, release and complete-onboarding procedures linked above.

## Stack / Layout

| Component | Choice |
|---|---|
| Runtime / install | React 19, Vite 8, TypeScript 7 strict; Bun ≥1.4.0 with frozen lock, Node ≥24; browser/deploy CI Node 26.7.0 |
| Hosting / state | Worker `hexly-ai`, Static Assets, Cron, D1 `hexly-status` via `STATUS_DB` |
| Static / tests | Biome, Vitest, real Workers HTTP and full Chromium browser journeys, OSV/Gitleaks |
| `src/{data,model,components,styles}/` | Catalogue, domain logic, accessible views and tokens |
| `worker/`, `migrations/`, `scripts/`, `tests/` | Gateway/status, schema, local runners, asset tooling and proof |
| `packages/video-kit/`, `artwork/`, `docs/` | Shared designs, versioned source records, profiles and operational receipts |

## Commands

Run from the root. Integration/browser fixtures need the archived materials: `assets:hydrate` restores checksummed local files from existing R2 objects. Ordinary builds use checked-in metadata/CDN materials. Install full Chromium without `--only-shell`; Gitleaks/OSV are required for security gates.

```bash
bun install --frozen-lockfile
bun run assets:hydrate
bun run typecheck
bun run lint
bun run build
bun run test:coverage
bun run test:http
bun run test:browser
bun run check:security
bun run video:check
```

`typecheck` generates ignored Wrangler binding types and checks browser/Worker/Video Kit lanes. `test:http` / `test:browser` first check isolation and build, then own their local Worker lifecycle. No production token or live service probe is needed. Asset generation, rendering and publication commands are in the maintenance contract; video exports need Chromium/FFmpeg.

## Verification

6DQ = unified L1 (absorbing former G1) + L2/L3 + G2 + D1. Status: `enforced`, `planned`, `manual`, `N/A`.

| Dimension | Required proof | Status | Current enforcement / gap |
|---|---|---|---|
| L1 — complete unified contract | All four coverage metrics ≥95% plus strict static lanes on an installed index-snapshot hook with proven rejection, under 30s | planned | Coverage still gates at 90%, commit selects affected tests without coverage, static lanes run staged/working-tree, and snapshot scope/rejection/timing are unverified. The subcheck rows below describe what is configured today |
| L1 subcheck — logic coverage | Statements, branches, functions and lines each ≥95%; no skipped/focused tests | planned | CI runs coverage, but Vitest still gates at 90% on model/isolation/release logic; commit runs only affected tests without coverage |
| L2 HTTP | Real local HTTP over 100% of API endpoint/method combinations and built documents/assets | planned | Push/CI HTTP suite checks the built Worker; exhaustive method/surface enforcement still needs verification as routes evolve |
| L3 UI | Critical desktop/mobile journeys, languages/themes, gallery and accessibility | enforced | Dedicated required CI Chromium job; browser configs reject focused tests and server reuse |
| L1 subcheck — static lanes (former G1) | Strict types and check-only lint, zero errors/warnings | enforced | Commit staged Biome; CI full browser/Worker/Video Kit types and lint; static lanes run staged/working-tree, so unified L1 is not snapshot-based |
| G2 security | Dependency and secret scans; missing scanner fails | enforced | Push/CI OSV on frozen lock and Gitleaks history; local hook does not select stdin push ranges |
| D1 isolation | Per-run local SQLite, guarded fixtures/reset/cleanup and test marker | planned | Static guards reject remote bindings, routes, live probes and real IDs; HTTP/browser use fixed per-lane directories and lack complete per-run/marker guarantees |
| Assets / build | Checksums, profiles, immutable sources, real bundle and deploy dry run | enforced | CI asset/material guard, L2/L3 build and `deploy:check` |
| Content / release | Provenance, source adoption and deployment proof | manual | Identity/maintenance/release runbooks and maintainer verification |

| Hook | Current behavior | Required follow-up |
|---|---|---|
| pre-commit | Tracked-material guard, staged lint and changed unit tests in parallel; doc-only changes can select no tests | Unified L1 (coverage plus static lanes) on the index snapshot, <30s |
| pre-push | L2 HTTP and G2 in parallel against working-tree files/history | Validate commits named by stdin push refs, <3min |

Install restores Husky. Checks never auto-fix; never bypass commit/branch-push hooks. The owner merged former G1 into L1 on 2026-09-21; the framework keeps the 6DQ name. CI pins shared workflows at `ad43150de3a2be2fa464b5cd2f921dc4fa9f8f0f`. Scope, browser clocks, Wrangler retry patch and failure evidence: [quality guide](docs/03-quality.md).

## Resources / Isolation

| Lane | Ports / directory | Boundary |
|---|---|---|
| Daily Vite / Worker | 7048 / 37048; inspector 38048; `.wrangler/dev` | Caddy `index.dev.hexly.ai`, local demo observations |
| L2 HTTP | 17048; inspector 18048; `.wrangler/http` | `--env test --local`, fake IDs, no live probes |
| L3 browser | 27048; inspector 28048; `.wrangler/browser` | Same local guard; distinct lane, still fixed across runs |
| Manual preview | 37048; inspector 38048; `.wrangler/preview` | `--env dev --local`; do not overlap the daily Worker |

Required harnesses use fresh per-run persistence, assert local/test context before fixtures, initialize `_test_marker(key,value)` with `env=test`, and verify it before reset/cleanup. Never deploy remote `-test` resources. Keep production credentials and daily-dev state out of automated lanes. Local status clocks remain stable during each browser suite.

Daily `bun run dev` builds the target manifest, migrates/seeds local SQLite and starts both servers; demos refresh every five minutes. Restart after catalogue changes. Development/preview use `--env dev --local`; production explicitly selects `--env ""`. Generated binding types live in ignored `.wrangler/types.d.ts`. Details: [local development](docs/04-development.md).

## Operations / Release

Authorized maintainers use `bun run release` from clean `main` (patch/minor/major/explicit version; `-- --dry-run` is read-only). It updates version/changelog, pushes main, waits for matching quality and Deploy jobs, verifies production, then creates the annotated tag/Release. Trusted CI triggers D1 migrations before deployment; normal publication follows that path.
Check `https://hexly.ai` and `https://status.hexly.ai` with `bun run verify:production`; workers.dev and preview URLs remain disabled. Preserve immutable tags and the documented, completed history-reduction maps. Details: [release](docs/05-release.md), [recovery](docs/23-git-history-recovery.md), [maintenance](docs/29-project-maintenance.md).

## Retrospective

Narratives stay in [Retrospective.md](Retrospective.md); recurring rules stay brief, cross-project lessons belong in global rules/nmem and deterministic safeguards in tests/hooks. Keep frozen validation on version-only releases; temporary registry settings must not rewrite lockfile sources. Verify the final Deploy result. Temporary-repository tests must remove inherited repository-local Git environment variables; changing cwd alone does not isolate a linked worktree.
