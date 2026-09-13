# Six-dimensional quality system

This structure is established before product implementation. Source: nmem `af0daa0f-0a10-4b0b-b328-f2dc32137bdc`, the six-dimensional development quality procedure.

| Dimension | Contract | Command | When |
| --- | --- | --- | --- |
| L1 | Unit behavior for catalogue, filtering, preferences, release policy, and test isolation; at least 90% statements, branches, functions, and lines | `bun run test:changed`; `bun run test:coverage` | Affected tests at pre-commit; full coverage in CI |
| L2 | Real HTTP requests to the built site in the Workers runtime; HTML, assets, and response behavior | `bun run test:http` | Pre-push |
| L3 | Browser journeys for navigation, search, categories, bilingual preferences, themes, gallery, responsive layout, and accessibility | `bun run test:browser` | CI and manual |
| G1 | TypeScript strict mode and Biome recommended rules with zero errors or warnings | `bun run lint:staged`; `bun run check:static` | Staged lint at pre-commit; full checks in CI |
| G2 | OSV dependency audit and Gitleaks secret scanning | `bun run check:security` | Pre-push and CI |
| D1 | Independent loopback test servers, no production resource bindings, and no remote services | `bun run check:isolation` | Before integration/browser tests |

The D1 quality dimension denotes test isolation. The status feature also uses a
Cloudflare D1 database, isolated explicitly: development and tests have dedicated
names, fake local database IDs, no routes or Cron triggers, and modes that disable
public probes. `check:isolation` rejects inherited production settings and
unreviewed remote bindings. All CLI fixtures use `--local`.

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

Browser CI runs in its own job with Node.js 26.7.0, matching local development and deployment. `channel: "chromium"` selects the full Chromium build's current headless mode; install `chromium` without `--only-shell`. The default headless shell stalled native popup initialization during the R2 release, so the original real-link journey now runs in the full browser. Deployment requires both quality and browser jobs to succeed; all journeys retain three workers and zero retries.

The browser job records its Node.js version and writes sanitized Wrangler diagnostics to `.wrangler/browser-ci.log`. On failure, it prints the last 300 log lines, preserves the test command's exit status, and uploads the diagnostics, browser traces, and screenshots for seven days. Inspect this evidence before rerunning a failure that loses the local server. New-tab checks wait for navigation and `DOMContentLoaded` before inspecting the destination.

The [versioned Wrangler patch](../patches/README.md) prevents an abandoned client request from terminating the whole local server. L2 exercises this boundary with truncated upload connections and subsequent health requests. Failed forwards still return an error response, and all normal HTTP and browser assertions remain active.

The root `sharp: 0.35.4` override also applies the image-decoder security fix to Miniflare. Wrangler 4.129.0 depends on Miniflare 5.20260903.0-alpha, which otherwise installs its own vulnerable Sharp 0.35.2 despite the root development dependency already being fixed. The override removes that second copy and its older native binaries from the lockfile; it does not suppress [GHSA-rgj7-g3m4-5g8c](https://osv.dev/GHSA-rgj7-g3m4-5g8c). Remove the override when the pinned upstream chain selects a fixed version on its own, then verify the regenerated lockfile, runtime resolution, HTTP/browser checks and OSV scan.

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
