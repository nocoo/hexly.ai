# Snaky README investigation

## Scope and repository baseline

- Investigation date: 2026-09-08 (Asia/Shanghai).
- Repository: `../snaky`, remote `https://github.com/nocoo/snaky.git`.
- Applicable instructions read: Snaky `CLAUDE.md` and hexly.ai `CLAUDE.md`. No ancestor or nested `AGENTS.md` was found for the edited paths.
- Before investigation: clean `main`, tracking `origin/main`.
- `git pull --ff-only`: **Already up to date**.
- Before/after pull SHA: `5cd0790336d006f65555816fe29869d6e60ed376` (`fix: update vulnerable cli dependencies`). The unchanged pull and local reflog confirm the same baseline.
- Root and CLI package versions: `1.0.6`; this work does not change versions.
- This investigator's allowed edits: Snaky `README.md`, `docs/README.en.md`, and this investigation record. The root agent separately corrected two existing DNS test cases after diagnosing the initial failure; see the follow-up below. No production, agent-instruction, logo, version or release files are being changed.
- Publication: main-agent review and normal hooks completed. A fresh `git pull --ff-only` reported Already up to date before pushing `main`; commits and remote checks are recorded in [validation.md](validation.md).

## Original README structure

Centered logo and title; tagline; npm / CI / platform / Node / fixed test-count / license badges; “这是什么”; features with probe, TUI, execution, configuration and output subsections; install; commands/options; project tree; technology table; development; test layers; design-document links; license.

Retain the existing logo/title and practical command examples. The final [pilot template](template.md) uses eight sections in this order: 这是什么 / What it does, 功能 / Features, 使用 / Usage, 开发 / Development, 测试 / Tests, 技术栈 / Stack, 文档 / Documentation, 许可证 / License. Product-specific details stay under Usage or Development. English lives at `docs/README.en.md`, with relative paths adjusted for that depth. The first draft placed Stack earlier; the final review moved it after Tests and added the explicit introductory heading without removing product content.

## Current facts and evidence

All source paths below refer to [baseline 5cd0790](https://github.com/nocoo/snaky/tree/5cd0790336d006f65555816fe29869d6e60ed376).

| Topic | Verified implementation | Evidence |
| --- | --- | --- |
| Purpose | CLI and native macOS menu bar views of destination egress IPs, HTTP latency and DNS resolver observations for checking VPN/proxy routing. | `packages/cli/src/cli.ts`, `apps/macos/Sources/SnakyCore/UI/PopoverContentView.swift`, `apps/macos/Sources/Snaky/StatusItemController.swift` |
| Routing probes | Cloudflare trace returns IP, country and PoP where supplied; selected HTTP response headers expose an egress IP. | `packages/cli/src/probes/cftrace.ts`, `probes/http-header.ts`, `parsers/cftrace.ts` |
| Built-in targets | 38 split endpoints (30 tier 1, 8 tier 2) plus 6 HTTP ping targets. `--tier 2` includes both tiers. | `packages/cli/src/config/builtins.ts`; counts checked by a local source parser; filtering in `cli.ts` |
| Latency | Repeated HTTP requests with warmup and median calculation. This is HTTP timing, not ICMP ping or bandwidth measurement. | `packages/cli/src/runner/ping-runner.ts`, `probes/http-ping.ts` |
| Outputs | Ink live output in a color-enabled TTY, static tables otherwise, final JSON and NDJSON events. | `cli.ts` (`useLiveTui` / `useNdjson`), `output/live.tsx`, `output/ndjson.ts` |
| Proxy selection | `--proxy` first, then HTTPS/HTTP/ALL proxy environment variables, then macOS system HTTP(S) proxy. `--no-proxy` disables Snaky's explicit proxy selection. HTTP proxy uses Undici `ProxyAgent`; no SOCKS support is established. | `packages/cli/src/proxy.ts` (`detectProxy`, `installProxyAgent`) |
| Configuration | User targets merge with built-ins; add/remove/disable/enable exist. Defaults: split timeout 5 s, ping timeout 3 s, concurrency 10, retries 2, 12 ping rounds, tier 1. Config path is `~/.config/snaky/config.json`. | `config/types.ts`, `config/loader.ts`, `config/mutate.ts`, `cli.ts` |
| DNS request path | HTTP fetches to random subdomains of `d.echo.nocoo.cloud` trigger DNS on the selected HTTP/proxy path; collector result polling reports resolver egress addresses. | `packages/cli/src/dns-leak/detect.ts` (`lookupWithTimeout`, `pollCollector`, `runDnsLeakDetection`) |
| DNS verdict | Explicit `dnsLeak.expectedResolvers` IPv4 addresses/CIDRs take precedence. Otherwise an Echo API key, user geography and successful enrichment for every resolver are required; comparison is mainland-China versus non-mainland-China, not a general country mismatch. Missing evidence returns `inconclusive`. | `dns-leak/detect.ts` (`determineVerdict`), `dns-leak/cidr.ts` |
| Optional IP enrichment | Echo key is read from JSON file `~/.snaky` as `echoApiKey`; it supplies geography/ISP metadata. No key is required for split probes and HTTP latency. | `config/secrets.ts`, `services/echo.ts`, `cli.ts` |
| macOS availability | The application exists and published release v1.0.6 has asset `Snaky-1.0.6.dmg` (5,548,500 bytes). It discovers a separately installed CLI, renders split/connect streams and has a DNS tab. | `gh release view --repo nocoo/snaky --json tagName,isDraft,isPrerelease,url,assets` (non-draft, non-prerelease); `Services/CLIDiscovery.swift`, `Services/CLIBridge.swift`, `ViewModels/AppViewModel.swift`, `ViewModels/DnsLeakViewModel.swift` |
| Platform/build | CLI manifests require Node >= 22, pnpm pinned to 10.34.4. Swift package requires Swift tools 6.0 and macOS >= 14; app UI uses SwiftUI and AppKit. No universal-DMG architecture claim was verified. | root/CLI `package.json`, `apps/macos/Package.swift`, app source imports |
| Technology versions | TypeScript ^6.0.3, Ink ^7.1.0, React ^19.2.7, Undici ^7.29.0, Vitest ^4.1.9, Biome ^2.5.0; tsup bundler. | `packages/cli/package.json`, `packages/cli/tsup.config.ts` |
| Website | No independent website is established. Catalogue has `website: null`; GitHub repository `homepageUrl` is empty. npm and GitHub Releases are distribution links, not a website. | hexly.ai `src/data/projects/snaky.json`; `gh repo view nocoo/snaky --json homepageUrl,url` |

## Stale information to correct

1. Old README describes the macOS app as planned; it is implemented and has a published DMG.
2. Node badge says >= 20 while both manifests require >= 22.
3. TypeScript 5.8 / Ink 5 / React 18 descriptions are behind current manifests. Prefer stable technology names in badges and manifest links over more fixed version claims.
4. “58 built-in endpoints” is no longer accurate; current source has 38 split endpoints and 6 ping targets. Avoid a fixed count in the headline.
5. Old README omits NDJSON streaming, automatic/explicit proxy selection, DNS prerequisites, the optional Echo key, and macOS build/test commands.
6. Fixed “274 passed” badge and 260/14 test counts no longer describe the suite. Remove fixed counts and coverage thresholds from public README.
7. Existing macOS design doc has obsolete direct executable launch guidance. The current build script and `CLAUDE.md` require launching the bundled app through Finder or `open`, so the README gives the current path explicitly.
8. `docs/features/02-dns-leak-detection.md` describes the older `dns.lookup` path and older geography comparison. Treat it as historical design context, with current behavior described in README and source.
9. `apps/macos/scripts/build.sh` comments call the default unsigned, but the code defaults to an Apple Development identity and a maintainer team ID. Do not advertise a generic unsigned packaging command; an appropriate local signing identity is a prerequisite.
10. `--concurrency` controls split-probe orchestration. The ping runner's `runRound` currently uses `Promise.all` without consuming the concurrency option; README does not promise that it limits all requests.
11. `snaky remove` removes custom entries or overrides. An unmodified built-in target cannot be removed; use `disable`. Removing an override lets the built-in resurface. This was checked directly in `config/mutate.ts` and corrected during draft review.

## Commands and verification

| Command | Prerequisite / role | Observation |
| --- | --- | --- |
| `pnpm install --frozen-lockfile` | Node >= 22, pnpm 10.34.4; install exact lockfile | Command verified in CI and manifest; existing dependencies were used for this investigation. |
| `pnpm build` | Installed CLI dependencies; builds `packages/cli/dist` | Passed locally on Node 26.7.0 and pnpm 10.34.4. |
| `node packages/cli/dist/index.js --help --no-proxy` | Built CLI; help only, no target probes | Passed; current commands and flags inspected. |
| `pnpm dev` | Installed dependencies; watch build | Verified in root/CLI scripts, not started. |
| `pnpm test` | CLI unit and local HTTP tests; DNS rejection cases now simulate the fetch error | First run: 312 passed / 2 failed out of 314, both `.invalid` DNS cases at 5 s. After the root agent's targeted test correction: **314/314 passed, 26 files** (root-agent validation). Failure, diagnosis and correction are preserved below. |
| `pnpm build && pnpm test:e2e` | Built CLI; current all-mode schema case can contact configured/built-in network targets and DNS services | **Passed: build plus 14/14 E2E tests, 1 file, 24.29 s**, using the existing root scripts. Run at 17:55:59 Asia/Shanghai on 2026-09-08 after read-only network access was confirmed within scope. No test filtering or gate bypass. Despite the “mock server” heading in `tests/e2e/binary.test.ts`, not all traffic is isolated. |
| `swift build --package-path apps/macos` | macOS, Swift 6 toolchain | Source/manifest checked; no app launch performed. |
| `swift test --package-path apps/macos --skip IntegrationTests` | Full Xcode selected as developer directory | `swift test --help` confirms both flags. Not run: local `xcode-select -p` is `/Library/Developer/CommandLineTools`, and existing hooks document missing Testing.framework in this environment. |
| `swift test --package-path apps/macos --filter IntegrationTests` | Full Xcode, separately installed CLI, reachable network | Test file checked; auto-skips when CLI unavailable. Not run. |
| `bash apps/macos/scripts/build.sh --sign "<local signing identity>"` | macOS tools and a suitable signing identity | Script inspected only; signs and registers the app. Not run. |
| `open apps/macos/build/release/Snaky.app` | Previously bundled app | Correct LaunchServices path verified from script/instructions; not run. |

`pnpm lint` passed (63 files checked, no changes); `pnpm typecheck` passed. Eighteen README CLI command forms were checked directly against the current `parseCliArgs` function without executing target probes. No version bump, signing, application startup, global package install or system configuration mutation was performed.

### DNS test failure, diagnosis and correction

The initial full unit run failed in `packages/cli/src/probes/cftrace.test.ts` (“returns DNS_FAILED for unresolvable host”) and `packages/cli/src/probes/http-ping.test.ts` (“returns -1 for DNS failure”). Both tests used real `.invalid` DNS names and reached the 5-second test timeout. The root agent's DNS investigation found that the local resolver rewrote `.invalid` to `198.18.3.101`, so the tests were exercising the machine's VPN/resolver behavior instead of reliably receiving an `ENOTFOUND` error.

The root agent changed only those two test cases to use `vi.spyOn(globalThis, "fetch").mockRejectedValueOnce(new TypeError("fetch failed", { cause: { code: "ENOTFOUND" } }))`. Original assertions remain, and `finally` restores the spy for each case. The investigator inspected that diff. Production code and the rest of the test suite are unchanged. The root agent reran the complete `pnpm test` suite successfully: 314 tests across 26 files. README now describes simulated DNS failure cases, without including this investigation history in the public usage document.

### Publication prerequisites and hooks reviewed

- `.husky/pre-commit` runs CLI typecheck, lint and unit tests. On hosts with full Xcode selected, it additionally builds Swift with warnings as errors, runs Swift tests and SwiftLint. Its existing developer-directory check omits those Swift checks on this Command Line Tools-only host; no local bypass was added.
- `.husky/pre-push` builds the CLI and runs E2E tests, then checks Gitleaks and OSV when installed. Both tools are present locally at `/opt/homebrew/bin/gitleaks` and `/opt/homebrew/bin/osv-scanner`. It additionally runs Swift integration tests on full-Xcode hosts. The root agent will run the normal publication hooks while committing/pushing; this investigator has not committed or pushed.
- `.github/workflows/ci.yml` uses Node 22, a frozen pnpm install, typecheck, lint, unit tests, build and E2E. Local build/E2E verification used Node 26.7.0 and pnpm 10.34.4; it is not a claim that Node 22 CI has already run for this uncommitted change.
- `xcode-select -p` was checked again and remains `/Library/Developer/CommandLineTools`. Swift tests and the native application were not run; current README states their full-Xcode and installed-CLI prerequisites.
- `LICENSE` was read directly and confirms MIT, copyright 2026 Zheng Li.

## Proposed catalogue copy

- Goal (zh): 让使用 VPN 或代理的用户能集中核对常用站点的出口 IP、连接延迟和 DNS 解析器，判断分流是否符合预期。
- Goal (en): Help VPN and proxy users check destination egress IPs, HTTP latency and DNS resolvers in one place to see whether routing matches their expectations.
- Major technology badges: `TypeScript`, `Node.js`, `React`, `Ink`, `Swift`, `SwiftUI`, `AppKit`.
- Capability boundary for future copy: describes observations and a configured/heuristic DNS verdict; does not guarantee privacy, configure VPN routing, provide a VPN service or measure throughput.

## Pilot progress

- [x] Pull and record a clean baseline.
- [x] Compare README/design docs with CLI and native app source.
- [x] Verify runtime manifests, release availability, commands and network-dependent test caveats.
- [x] Rewrite Chinese README and create matching English README (176 lines each), aligned to the final eight-section pilot template.
- [x] Check relative links, two-language alignment and the final diff. Each README has 11 valid local references, 8 corresponding main sections and 8 balanced fenced blocks. Executable command examples and JSON samples match across languages, JSON samples parse, and all 18 checked CLI forms are accepted by the current parser. No 6DQ copy, fixed test-count badges or coverage thresholds remain. `git diff --check` passed.
- [x] Rebuild and run the existing unfiltered CLI E2E entry: all 14 tests passed. Preserve the initial DNS test failure and root-agent fix/validation record.
- [x] Main-agent review, final pull, required hooks, commit and push. DNS test correction: `a52d79904d5640c365839c021e2ddeb774c5da15`; bilingual README: `5ef57af407bc695ea710ae77eaa59432d6006373`. The full pre-commit CLI checks and pre-push build / E2E / security checks passed; native checks used the hook's existing full-Xcode detection.
