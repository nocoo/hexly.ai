# Six-dimensional quality system

Run `bun run verify` after installing dependencies, full Chromium, OSV and Gitleaks. Local and CI use this same command with a 600-second total deadline. CI has one 10-minute job, including installation. Each verification stage prints its elapsed time and propagates failures.

The 2026-09-25 test audit consolidates repeated project matrices by behavior. Catalogue-wide identity, provenance and metadata checks remain independent of representative UI journeys. This audit does not certify the planned unified L1 or D1 requirements.

| Dimension | Contract | Command | When |
| --- | --- | --- | --- |
| L1 | Unit behavior for catalogue, filtering, preferences, release policy, and test isolation; at least 95% statements, branches, functions, and lines (current Vitest gates remain at 90%; raising them is planned) | `bun run test:changed`; `bun run test:coverage` | Affected tests at pre-commit; full coverage in CI |
| L2 | Real HTTP requests to the built site in the Workers runtime; HTML, assets, and response behavior | `bun run test:http` | Pre-push |
| L3 | Browser journeys for navigation, search, categories, bilingual preferences, themes, gallery, responsive layout, and accessibility | `bun run test:browser` | CI and manual |
| G1 | TypeScript strict mode and Biome recommended rules with zero errors or warnings | `bun run lint:staged`; `bun run check:static` | Staged lint at pre-commit; full checks in CI |
| G2 | OSV dependency audit and Gitleaks secret scanning | `bun run check:security` | Pre-push and CI |
| D1 | Per-run loopback SQLite state, guards before fixture/reset/cleanup, no production bindings or remote services | `bun run check:isolation` | Before integration/browser tests |

The D1 quality dimension denotes test isolation. The status feature also uses a
Cloudflare D1 database, isolated explicitly: development and tests have dedicated
names, fake local database IDs, no routes or Cron triggers, and modes that disable
public probes. `check:isolation` rejects inherited production settings and
unreviewed remote bindings. All CLI fixtures use `--local`.

The required contract is [AGENTS.md](../AGENTS.md). Current HTTP/browser persistence is fixed per lane, and the runner does not enforce a per-run `_test_marker` before all fixture resets and cleanup. Fresh per-run paths and those guards remain planned; existing local-only checks do not certify the entire isolation requirement. No remote `-test` resources are required.

L1 coverage includes executable model logic, release policy, and isolation rules.
Status Worker tests exercise bounded probes with fake HTTP responses and real
Wrangler SQLite D1 with `remoteBindings: false` and `persist: false`. They verify
deduplication, transactional writes, seven-day query cutoffs, cleanup during
failures, and exclusion of removed or changed endpoints. A temporary-repository
test runs the actual release dry-run command and verifies that files and Git refs
stay unchanged. Thin React presentation components, static catalogue data, and
build-tool entry points are not included in the model coverage denominator. L3
validates those views through actual user journeys.

## Commit feedback

`bun run gate:commit` runs these three checks in parallel:

- `assets:check-tracked`: reject material binaries in the Git index, including forced additions. SVG source and the required vendored code archive remain allowed. CI repeats this check before asset hydration.
- `lint:staged`: Biome checks staged paths with zero warnings, without rewriting files. Commits containing only ignored or unsupported files pass when there is nothing to lint.
- `test:changed`: Vitest runs unit tests affected by uncommitted Git changes, without coverage. This includes staged, unstaged, and untracked files. Documentation/artwork changes without related tests do not run the suite.

Package, Vite/Vitest configuration, Bun lock/configuration, and TypeScript configuration changes trigger all unit tests. The release CLI and the directory's original logo also trigger the full suite because tests read them through a subprocess or filesystem rather than an import. These triggers are declared in `vitest.config.ts`.

The material guard reads the Git index; lint and unit tests check working-tree content and do not snapshot partially staged files. Review the staged diff before committing. Full typecheck, lint, coverage, isolation, asset verification, security, and L2/L3 checks remain in CI. Pre-push still runs L2 and G2.

`assets:prepare-test` restores and checks public materials, Video Kit assets, brand/texture source fixtures, current verified source snapshots, the two retained Snail raw images, and the existing screenshot-upload fixture. It validates existing local bytes too. `verify-assets.ts` checks every current project identity, derivative, social image and provenance relation, plus all public versioned manifests and their referenced bytes. Preparation and build each run once in `verify`; HTTP and browser suites reuse that build. Ordinary production builds require no archive hydration.

`bun run assets:check` remains the full archive maintenance command: it hydrates all inventory rows and also includes unpublished historical finishing passes via `verify-assets.ts --history`. Run it when maintaining historical archives. Routine verification does not redownload historical finishing intermediates.

## Repeatability and production boundary

Tests have distinct responsibilities. `verify-assets.ts` checks every current
identity and every public versioned manifest's bytes. Unit tests cover model
branches, trust boundaries and provenance policies; expensive composition/pixel
checks use generated-animal, physical-object, retained-original, supplied-artwork
and raster-texture representatives. HTTP checks validate endpoint methods,
headers, redirects and representative binary/text transport, not a second full
archive checksum walk. Browser checks cover actual interactions, failures,
history, keyboard/focus, bilingual content, themes and responsive layout; shared
controls do not require a Cartesian product of projects, devices and themes.

The browser suite has 72 checks; HTTP has 28. Each route/theme receives one accessibility
scan; changing only an artwork image does not repeat it. Scans run `axe-core`
directly in the current page with its default rules. The scanner rejects frames
instead of silently omitting them. The site has no embedded frames; if that
changes, explicitly extend the scanner's scope. It does not open blank pages to
assemble results, avoiding unrelated popup lifecycle failures. Test retries and
coverage thresholds are unchanged. Historical archive maintenance remains explicit.

CI caches only `.wrangler/asset-cache`, keyed by inventory and fixture selection.
Hydration still verifies every cached object's SHA-256 and every selected source's
size and checksum. A cache miss performs the same bounded CDN downloads. No test
result, database, generated build or renderer cache is reused. The cache is a
network optimization, never evidence that a quality gate passed.

A successful main **push** CI triggers Release, which independently proves the
source run and current main SHA, applies D1 migrations, deploys, and verifies both
`hexly.ai` and `status.hexly.ai`. The production verifier owns bounded propagation
retries; the workflow does not multiply that retry budget.

Manual `CI` dispatch runs the same complete verification and then reads both
production origins, requiring their version and full revision to match the run.
It has read-only repository permissions and no deployment secrets. Release accepts
only push source runs, including its explicit manual source-run input. The
workflow-run notification after a manual CI has a skipped deployment; it is **not**
counted as deployment success. Dispatches have distinct concurrency groups, so
they cannot cancel each other or a main push.

For a repeatability audit, first push the final revision once and wait for its
actual Release and both production checks. Freeze that SHA, then dispatch `ci.yml`
on main ten times **sequentially**, waiting for each complete run. Require distinct
run IDs, attempt 1, the same full SHA, successful verification and production-read
steps, and no failed/cancelled run between them. Record API run/job responses and
URLs under ignored `.wrangler/ci-audit/`. Stop on failure, SHA drift or a wall clock
over 600 seconds; fixes start a new ten-run sequence. Never rerun only a job,
replay a tag, or count an omitted check as passing.

Report creation-to-completion wall clock (including queue/setup/cleanup), job
execution and queue separately. The initial push measurement includes the linked
Release through production verification. The ten dispatch measurements include
both read-only production checks and **exclude Release**, since no deployment is
requested. This proves repeatable CI plus production verification, with one actual
deployment verified separately; it does not claim ten production deployments.

See [the quantified baseline](35-ci-repeatability.md).

## Port boundaries

| Purpose | Port |
| --- | --- |
| Vite development | 7048 |
| L2 Workers HTTP tests | 17048 |
| L3 browser tests | 27048 |
| Manual Workers preview | 37048 |

Test runners apply migrations, seed mock status observations, then start and
terminate their own servers without reusing an existing server. L2 uses
`.wrangler/http` and L3 uses `.wrangler/browser`; local development uses
`.wrangler/dev` and manual Worker preview uses `.wrangler/preview`. Separate ports
and separate SQLite persistence directories keep these environments independent.

Test Workers poll the immutable asset fixture trees with a one-second base interval. Native
watchers exceeded 10,000 open descriptors on macOS after the material-texture
rollout and prevented Workerd from spawning (`EBADF`). The fixture inventory,
server ownership and tests stay complete; daily development keeps native watching.

The unified CI job uses Node.js 26.7.0 and Bun 1.4.0. Browser tests retain three workers, zero retries, and the full Chromium build (`channel: "chromium"`). Install `chromium` without `--only-shell`: the shell previously stalled native popup initialization. New-tab checks wait for navigation and `DOMContentLoaded`.

Status browser tests pin the browser clock to the fixed SQLite demo's latest sample. The project uses unmodified Wrangler through public CLI commands and `getPlatformProxy`; tests do not execute vendor bundles or reproduce development-proxy transport internals. Sanitized diagnostics at `.wrangler/verification.log`, browser traces and screenshots are uploaded on CI failure for seven days.

Deployment still requires a successful CI run for the exact trusted main revision, verified by the shared release-source action. Changing test routing does not change this authorization boundary.

Wrangler 4.145.0 selects Miniflare 5.20260930.0-alpha, whose Sharp declaration remains 0.35.4. The root override pins every Sharp installation to 0.35.5 for [GHSA-wq5f-xc86-pv6w](https://osv.dev/GHSA-wq5f-xc86-pv6w); fixing the older image-decoder advisory alone is insufficient. A separate source-map-js override pins 1.2.2 for [GHSA-68fv-2mgg-jv7q](https://osv.dev/GHSA-68fv-2mgg-jv7q). Root and Video Kit retain Sharp 0.35.5. Frozen installation, runtime HTTP checks and OSV scanning verify the resulting graph without suppressing advisories.

## Completion evidence

Verified locally on 2026-09-06 with Bun 1.4.0 and Node.js 26.7.0.

| Dimension | Result |
| --- | --- |
| L1 | 36 tests passed. Statements 133/133, branches 138/138, functions 29/29, and lines 119/119: 100% in every measured dimension. |
| L2 | 10 tests passed against Workers HTTP. Verified the built document, CSP, cached JS/CSS/fonts, share URLs, preference bootstrap, release metadata, PNG/SVG/emoji download checksums, four WebP sizes, sitemap, and favicon. |
| L3 | 24 browser tests passed in Chromium at desktop and iPhone 13 mobile viewports. Covered search, categories, sort, reset, Chinese content, theme/language persistence, browser history, share links, image decoding, original downloads, palette clipboard actions, unknown selections, and emoji identities. |
| G1 | Strict TypeScript and Biome completed with zero errors or warnings. |
| G2 | OSV scanned 238 locked dependencies with no issues. Gitleaks history and staged-change checks reported no leaks. |
| D1 | Test deployment is disabled; there are no storage or remote bindings. HTTP, browser, and manual-preview runtimes use separate ports and local state directories. |

Automated axe scans reported no WCAG 2.1 A/AA violations in the tested English desktop and Chinese mobile directory/gallery views, in both themes and across all four artwork backgrounds. The checked views have no horizontal page overflow. Browser automation uses Chromium with mobile emulation; it does not establish Safari or Firefox compatibility.

Additional verification:

- All 66 catalogue entries have a profile, bilingual copy, a current identity, palette evidence, and source provenance.
- `bun run assets:check` verified 66 source checksums and 264 WebP derivatives. The collection contains 43 preserved source images and 23 clearly labeled profile emoji identities.
- The production Vite build completed. JavaScript is 338.41 kB (93.44 kB gzip); CSS is 33.88 kB (7.85 kB gzip), with two self-hosted fonts.
- `bun run deploy:check` validated 347 static files using the production configuration and completed without warnings. The production domain is configured as `hexly.ai`.
- `https://index.dev.hexly.ai` returns the application with trusted TLS. Vite's websocket connected successfully through Caddy at the same domain.

These measurements describe the local v0.1.0 validation. GitHub Actions repeats the quality gates before every production deployment; the release script waits for the matching successful run and verifies public metadata before tagging. Published GitHub Releases link to their remote CI/deployment evidence. Existing artwork and emoji identities remain the phase-one baseline for the later logo-family cleanup.

## Owned HTTP and browser test state

The local test runner creates a unique `hexly-test-*` directory, rejects inherited Cloudflare/R2/AWS credentials, and writes a test-only Wrangler configuration with immutable source paths. It creates and checks `_test_marker` (`env=test`, unique `run_id`) before migrations and seed writes. Test processes run in an owned process group; cleanup stops descendants and rechecks the marker and directory owner. Failed or unverified state is retained for inspection. Daily development and preview state are unchanged. Browser tests remain a separate CI acceptance lane.

## CLI compatibility

Wrangler accepts compatible 4.x updates (`^4.145.0`); `bun.lock` records the
validated resolution for reproducible frozen installs. There is no vendor patch,
no workflow version duplicate and no assertion comparing a package range with an
installed exact version. Dependency updates validate public dev, D1, types and
deploy dry-run capabilities through the normal gates.

Release invokes `bun run deploy:worker` from the frozen checkout. That script
applies production D1 migrations before deployment; the shared immutable workflow
still proves the CI source, rejects stale main, serializes publication and scopes
credentials to deployment. Build and dry-run run before credentials are supplied.
This does not migrate the project to cf or change daily local debugging.
