# hexly.ai

Bilingual project directory, preserved identity archives, public service status and reusable Video Kit.
Profile: ts-worker-web.
Direction: [overview](docs/01-overview.md). Catalogue, brand and media work must also follow the [maintenance contract](docs/29-project-maintenance.md). Frameworks must not rewrite this file.

## Sources of Truth

This file is the contract; hooks, CI and configuration enforce it. Raise weaker enforcement instead of lowering this contract.

| Fact                 | Where                                                                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Human docs           | [README.md](README.md), [docs index](docs/README.md)                                                                                                                                                     |
| Catalogue / identity | `src/data/projects/`, verified source/profile revisions, [identity rules](docs/02-identity-rules.md), [maintenance details](docs/29-project-maintenance.md)                                              |
| Media / archives     | `src/data/media-storage.json`, `docs/assets/inventory.json`, immutable receipts and [asset storage](docs/21-asset-storage.md)                                                                            |
| Status / Video Kit   | `src/model/status.ts`, `worker/status.ts`, `packages/video-kit/`, `src/data/videos.json`                                                                                                                 |
| Share cards          | `src/data/social-cards.json`, `scripts/create-social.ts`; `/og/<id>-<date>-<hash6>.jpg` published through the R2 skill's [social card runbook](.agents/skills/hexly-r2-media/references/social-cards.md) |
| Version              | Root `package.json` as `X.Y.Z`, display `vX.Y.Z`; build emits version/revision at `/api/live`                                                                                                            |
| Enforcement          | `.husky/`, `scripts/gates.ts`, CI/release workflows and test configs                                                                                                                                     |
| Secrets / accidents  | Ignored `.env*` / `.dev.vars*`, GitHub secrets; [Retrospective.md](Retrospective.md); machine rules in global `AGENTS.md` / `rules/`                                                                     |

## Project Invariants

- Serve Vite through the existing Worker and Static Assets. `/api/live` and `/api/share` are build artifacts; the gateway also reads status D1 and runs Cron. There is no authentication or runtime GitHub dependency.
- Monitoring uses active independent HTTPS catalogue sites plus the approved `lizheng.dev`, `lizheng.me` and `hexly.ai` entries in `src/model/status.ts`, at origin plus `/api/live`; exclude stores/distribution links and Worker domains. The three additional sites stay last and use the Hexly Logo. Preserve five-minute Cron, seven-day retention, deduplication by project/slot and UTC calculations. Visitors only read observations; missing/stale/redirect/login results must not become healthy. Local demos never seed production.
- Catalogued projects carry exactly one product category and one archive flag. Stored `category` values are `ai`, `tools`, `libs`, `everyday`, `design`, `games` and `extensions`; `archived` is the only retirement record and `archive` is a filter view that must never be stored. `libs` mirrors the profile's Libraries & Infrastructure section, `extensions` mirrors Skills & MCP Servers, and cards print the product category with the Archived state instead of replacing the category.
- Keep `hexly.ai` categories and the `nocoo/nocoo` profile sections aligned whenever either surface changes: same project membership, same emoji and English description, same wording for `libs` and `extensions`. A new project needs a profile entry, catalogue membership, documented provenance and monitoring coverage before it counts as onboarded.
- Keep canonical project-detail routes, redirects/discovery metadata, bilingual light/dark responsive views, keyboard behavior, browser-local time zones, preference persistence and shareable navigation aligned. Preserve all detailed gallery, screenshot, CTA and Agent-guide rules in the maintenance contract.
- Original identity bytes, geometry, colors, licenses and provenance are authoritative. Hexly campaign styling does not redesign independent products. Exact-byte raw-image approval rules and documented product-type/model defaults remain in force. Archived projects receive basic support and are excluded from enrichment unless explicitly named.
- Independently served materials belong to immutable R2 `hexlyai` / `https://h.no.mt` objects; code/SVG source and receipts stay in Git, working binaries hydrate from inventory. Never add movies/material binaries to Git or deployed assets, merge retired binary history back, or overwrite original/approved versions. Production assets remain below 20 MiB.
- Shared 5/5/5 compositions live in the private Video Kit and consumers pin a published Git SHA. Project scripts/voices/scenes/films belong to consumers. Reuse the five immutable standard outros directly, preserve media receipts and concurrent handoffs, and pause if ownership of another writer's changes is unclear.
- Keep models independent of React/browser globals, effects in App/views and routes thin. Preserve the detailed source-adoption, brand-kit, texture, release and complete-onboarding procedures linked above.

## Stack / Layout

| Component                                      | Choice                                                                                                          |
| ---------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Runtime / install                              | React 19, Vite 8, TypeScript 7 strict; Bun 1.4.4 (`packageManager`) with frozen lock, Node ≥24; CI Node 26.12.1 |
| Hosting / state                                | Worker `hexly-ai`, Static Assets, Cron, D1 `hexly-status` via `STATUS_DB`                                       |
| Static / tests                                 | Biome, Vitest, real Workers HTTP and full Chromium browser journeys, OSV/Gitleaks                               |
| `src/{data,model,components,styles}/`          | Catalogue, domain logic, accessible views and tokens                                                            |
| `worker/`, `migrations/`, `scripts/`, `tests/` | Gateway/status, schema, local runners, asset tooling and proof                                                  |
| `packages/video-kit/`, `artwork/`, `docs/`     | Shared designs, versioned source records, profiles and operational receipts                                     |

## Commands

Run from the root. The commit and push gates are `bun run gate:commit` and `bun run gate:push` (the hooks call exactly those). `bun run verify` is a local maintenance sweep of every lane within 600 seconds; it is not the CI gate, which is the System0 slot workflow. `assets:hydrate` and `assets:check` remain explicit full-history maintenance commands. Ordinary builds use checked-in metadata/CDN materials. Install full Chromium without `--only-shell`; Gitleaks/OSV are required for security gates.

```bash
bun install --frozen-lockfile
bun run verify

# Focused checks (verify and test:assets hydrate fixtures once)
bun run assets:prepare-test
bun run test:assets
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

System0 slots (skill `system0-quality` v1.3.0), implemented natively in
[`quality-slots.yml`](.github/workflows/quality-slots.yml) with a local `Z1: Gate`. Shared
composites come from base-ci v2026.14 (`9ec93ad0`); the deploy workflow stays on v2026.13
because v2026.14 pins a `release-source` commit that does not exist upstream. Status:
`impl`, `na`. Canonical CI check names are `quality / <ID>: <Name>`.

| Slot            | Command                                                | Checked object                                                   | Stage                    |         Measured | Status |
| --------------- | ------------------------------------------------------ | ---------------------------------------------------------------- | ------------------------ | ---------------: | ------ |
| S1 Types        | `bun run typecheck`                                    | Browser, Worker, Video Kit                                       | pre-commit, CI           |       2.2s / 22s | impl   |
| S2 Lint         | `bun run lint`                                         | Biome, zero errors and warnings                                  | pre-commit, CI           |       0.4s / 17s | impl   |
| S3 Workflow     | actionlint, SHA pins, yamllint                         | `.github/workflows/`                                             | CI                       |               9s | impl   |
| G1 Secrets      | staged scan, pushed tree plus new commits, CI checkout | Secrets                                                          | pre-commit, pre-push, CI | 0.0s / 3.7s / 8s | impl   |
| G2 Dependencies | OSV on the target lockfile                             | Third-party graph                                                | pre-push, CI             |        1.2s / 7s | impl   |
| B1 Build        | `bun run build` + `deploy:check`                       | Bundle and Wrangler dry run                                      | pre-push, CI             |       1.5s / 17s | impl   |
| L1 Unit         | focus guard + `test:coverage`                          | Model, Worker logic, gates; 95% ×4                               | pre-commit, CI           |       3.8s / 24s | impl   |
| L2 Runtime      | —                                                      | No dedicated Workers runtime suite; D1 binding covered inside L1 | —                        |                — | na     |
| L3 Integration  | `assets:prepare-test` + `test:http`                    | Built Worker over real HTTP                                      | pre-push, CI             |     16.7s / 126s | impl   |
| L4 E2E          | `assets:prepare-test` + `test:browser`                 | 84 Chromium journeys                                             | pre-push, CI             |     59.7s / 231s | impl   |
| P1 Package      | —                                                      | Nothing is published                                             | —                        |                — | na     |
| Z1 Gate         | local validator over `needs`                           | Declarations, results, SHA equality                              | CI                       |               4s | impl   |

Coverage enforces 95% for statements, branches, functions and lines over
`src/model/**`, `worker/status.ts` and the gate helpers (314 tests; the `unit-coverage`
artifact of each CI run holds that revision's figures). L1 never hydrates
materials and never reads `h.no.mt`; asset bytes belong to the catalogue job and
`tests/assets`.

| Hook       | Behavior                                                                                                                                           | Measured                                         |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| pre-commit | Git index snapshot: tracked-material guard, staged Gitleaks, focus guard, types, Biome, asset-free coverage                                        | 8.3s warm, 8.8s cold (target 30s)                |
| pre-push   | Git stdin OIDs → `git archive` snapshot per pushed commit: verified fixture bytes, G2, G1 tree plus new commits, isolation, build, dry run, L3, L4 | 95.7s (prepare 1.8s, checks 92.8s, cleanup 1.1s) |

CI wall clock measured 262s at `55e2d72d`; five green runs with a healthy Chromium install sit in a 241–303s band, with a 2s queue and `L4: E2E` on the critical path.
A ruleset requires `quality / Z1: Gate` on the default branch; the repository admin role
bypasses it so direct main pushes stay available. `bun run release` still waits for the CI
run and verifies both production origins. Details and failure-injection evidence:
[quality guide](docs/03-quality.md).

## Resources / Isolation

| Lane                | Ports / directory                                   | Boundary                                             |
| ------------------- | --------------------------------------------------- | ---------------------------------------------------- |
| Daily Vite / Worker | 7048 / 37048; inspector 38048; `.wrangler/dev`      | Caddy `index.dev.hexly.ai`, local demo observations  |
| L3 Integration      | 17048; inspector 18048; unique `hexly-test-*` state | `--env test --local`, fake IDs, no live probes       |
| L4 E2E              | 27048; inspector 28048; unique `hexly-test-*` state | Same local guard; distinct lane and per-run state    |
| Manual preview      | 37048; inspector 38048; `.wrangler/preview`         | `--env dev --local`; do not overlap the daily Worker |

Required harnesses use fresh per-run persistence, assert local/test context before fixtures, initialize `_test_marker(key,value)` with `env=test`, and verify it before reset/cleanup. Never deploy remote `-test` resources. Keep production credentials and daily-dev state out of automated lanes. Local status clocks remain stable during each browser suite.

Daily `bun run dev` builds the target manifest, migrates/seeds local SQLite and starts both servers; demos refresh every five minutes. Restart after catalogue changes. Development/preview use `--env dev --local`; production explicitly selects `--env ""`. Generated binding types live in ignored `.wrangler/types.d.ts`. Details: [local development](docs/04-development.md).

## Operations / Release

Authorized maintainers use `bun run release` from clean `main` (patch/minor/major/explicit version; `-- --dry-run` is read-only). It updates version/changelog, pushes main, waits for matching quality and Deploy jobs, verifies production, then creates the annotated tag/Release. Trusted CI triggers D1 migrations before deployment; normal publication follows that path.
Check `https://hexly.ai` and `https://status.hexly.ai` with `bun run verify:production`; workers.dev and preview URLs remain disabled. Preserve immutable tags and the documented, completed history-reduction maps. Details: [release](docs/05-release.md), [recovery](docs/23-git-history-recovery.md), [maintenance](docs/29-project-maintenance.md).

## Retrospective

Narratives stay in [Retrospective.md](Retrospective.md); recurring rules stay brief, cross-project lessons belong in global rules/nmem and deterministic safeguards in tests/hooks. Keep frozen validation on version-only releases; temporary registry settings must not rewrite lockfile sources. Verify the final Deploy result. Temporary-repository tests must remove inherited repository-local Git environment variables; changing cwd alone does not isolate a linked worktree.
