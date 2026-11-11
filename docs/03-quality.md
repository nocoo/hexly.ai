# System0 quality system

Twelve fixed slots, one required check. The canonical slot definitions live in the
`system0-quality` skill (v1.3.0); this repository implements them natively in
[`quality-slots.yml`](../.github/workflows/quality-slots.yml) with a local `Z1: Gate`, so
`ci.yml` only delegates and branch protection needs `quality / Z1: Gate`.

| Slot | Command | Checked object | Stage | Measured | Status |
| --- | --- | --- | --- | ---: | --- |
| S1 Types | `bun run typecheck` | Browser, Worker and Video Kit TypeScript 7 lanes | pre-commit, CI | 2.2s / 22s | impl |
| S2 Lint | `bun run lint` | Biome, check-only, zero errors and warnings | pre-commit, CI | 0.4s / 17s | impl |
| S3 Workflow | actionlint 1.7.12, immutable `nocoo/base-ci` refs, yamllint 1.38.0 | `.github/workflows/` | CI | 9s | impl |
| G1 Secrets | `gitleaks protect --staged`; `gitleaks dir`/`git --log-opts`; CI `detect --no-git` | Staged content, pushed tree plus new commits, CI checkout | pre-commit, pre-push, CI | 0.0s / 3.7s / 8s | impl |
| G2 Dependencies | `osv-scanner scan source --lockfile bun.lock` | Lockfile of the verified revision | pre-push, CI | 1.2s / 7s | impl |
| B1 Build | `bun run build` + `bun run deploy:check` | Real bundle and Wrangler dry run | pre-push, CI | 1.5s / 17s | impl |
| L1 Unit | `bun run check:focus` + `bun run test:coverage` | Model, Worker status logic, gate helpers; four 95% thresholds | pre-commit, CI | 3.8s / 24s | impl |
| L2 Runtime | none | No dedicated Workers runtime suite; the D1 binding runs inside L1 via `getPlatformProxy` | — | — | na |
| L3 Integration | `bun run assets:prepare-test` + `bun run test:http` | Built Worker over real HTTP on an owned per-run D1 | pre-push, CI | 18.7s / 118s | impl |
| L4 E2E | `bun run assets:prepare-test` + `bun run test:browser` | 84 Chromium journeys, desktop and touch | pre-push, CI | 62.1s / 246s | impl |
| P1 Package | none | Nothing is published; root and Video Kit are private | — | — | na |
| Z1 Gate | local validator over `needs` | Declarations vs executed jobs, SHA equality, blocking jobs | CI | 4s | impl |

Coverage: Vitest enforces 95% for statements, branches, functions and lines over
`src/model/**`, `worker/status.ts`, `scripts/{gate-refs,gate-runtime,isolation,release-model,test-focus,test-focus-files}.ts`.
The exact figures move with every commit — the current tree measures 98.37 / 95.22 /
98.91 / 99.31 from 314 tests — and each CI run publishes its own report as the
`unit-coverage` artifact, which is the number to quote for a given revision. Component
views and static catalogue data are not in the denominator; L3/L4 exercise them instead.
`tests/assets` and `verify-assets.ts` hold the byte checks, because L1 must never read
hydrated materials or the CDN.
`scripts/gate-workspace.ts` stays outside the denominator: it is Git and filesystem
orchestration (snapshots, links, installs), covered by the hooks themselves, by the
`workspacePackages` canary and by the injected-failure runs below rather than by unit
assertions.

## Git gates

Both hooks are thin: `.husky/pre-commit` and `.husky/pre-push` call
`bun run gate:commit` / `gate:push`, which run `scripts/gates.ts`. One implementation for
hook and manual use; every phase runs in its own process group with a timeout that kills
the group and fails the gate.

pre-commit verifies the **Git index**, not the working copy: `assets:check-tracked`
(`git ls-files`), `gitleaks protect --staged`, `git checkout-index` into a temporary
directory, then the focus guard, `typecheck`, `lint`, and `test:coverage` inside that
snapshot. An unstaged fix cannot hide a staged defect.

pre-push reads Git's stdin ref list. Deleted refs (`0…0`) skip the source checks; each
distinct local OID is exported with `git archive` and verified as a tree, so the object
that is actually pushed is what gets tested, not the working copy. A remote OID that the
clone does not have blocks the push instead of scanning nothing: run `git fetch` and push
again. Budgets apply per verified object — one index for pre-commit, one pushed commit for
pre-push — and each phase is capped by what is left of it. Hydrated Git-ignored
materials are symlinked into the snapshot (they are immutable R2 bytes, never commit
content), and the build receives `RELEASE_REVISION` because the snapshot has no Git
metadata.

The toolchain check runs against the target manifest (index or pushed commit), so a
commit that raises `packageManager` or `engines` fails until that toolchain is installed.
Reusing the installed `node_modules` additionally requires target `package.json`,
`bun.lock` and `packages/video-kit/package.json` equal to the installed copies; otherwise
the gate installs the target lockfile in isolation. Workspace packages always resolve to
the snapshot's own sources — `node_modules/@hexly/video-kit` points at
`<snapshot>/packages/video-kit` — so uncommitted Video Kit code cannot reach a gate.

Known limitation: manifest equality does not prove the installed tree still matches the
lockfile, because `bun install --dry-run` always prints a resolution list. Edit a lockfile
by hand without installing and the reuse path can verify a dependency graph nobody
installed. Installed-state verification is a todo, not a claim.

Failure evidence: a failing stage keeps `.test-results/` and `coverage/` under
`.wrangler/gate-evidence/<timestamp>-<sha>` and prints the path before the snapshot is
removed.

Measured on macOS arm64, Bun 1.4.4, Node 26.13.0:

| Stage | Budget | Cold | Warm | Split |
| --- | --- | ---: | ---: | --- |
| pre-commit | 30s target, 60s limit | 8.8s | 8.3s | tracked 0.0s, G1 0.0s, focus 0.0s, S1 2.2s, S2 0.4s, L1 3.8s |
| pre-push | 150s target, 300s limit | — | 87.2s | prepare 1.7s, checks 84.4s, cleanup 1.1s |

pre-push check split: G2 1.4s, G1 tree 3.7s, G1 new commits 0.0s, fixture bytes 2.2s,
isolation 0.0s, B1 build 0.6s, B1 dry run 2.0s, L3 15.7s, L4 58.8s. Every phase timeout is
capped by the stage budget, so a hung phase fails the stage instead of exceeding it. Cold
means the Vite/Vitest caches were removed; the index snapshot always starts with empty Vite
caches, so the two readings differ by filesystem warmth only.

Install restores Husky. Checks never auto-fix; never bypass either hook.

## CI

`ci.yml` is a single caller job (`quality`, no `name:`) for
`quality-slots.yml`. The workflow declares `SLOT_STATUS` inline; `Z1: Gate` parses
`needs`, rejects a missing or unknown slot, an invalid status, an `na`/`todo` without a
reason, an `impl` slot that did not succeed, any tested SHA that differs from
`github.sha`, and a blocking job (`Catalogue and media verification`) that did not run or
reported another SHA. It then writes the slot table with per-job durations and the CI
wall clock against the 300s/600s budgets.

`L2: Runtime` and `P1: Package` keep their canonical names and are skipped through
`vars.ENABLE_L2_RUNTIME` / `vars.ENABLE_P1_PACKAGE`; flipping a variable without adding
the real suite fails Z1.

The catalogue and media job is outside the slots but inside Z1's `needs`. It owns
`assets:check-tracked`, `assets:prepare-test`, `verify-assets.ts`, `social:check`,
`video:check` and `test:assets`. L1 never hydrates materials or reads `h.no.mt`; a fetch
guard and a static access scan enforce that.

L3 and L4 restore `.wrangler/asset-cache` through `actions/cache`, keyed by
`docs/assets/inventory.json` and `scripts/prepare-test-assets.ts`. Hydration still
verifies every cached object's SHA-256, so the cache is a network optimization, never
evidence. `assets:prepare-test` runs once per E2E job; `verify` runs it once locally.

Playwright writes `.test-results/<lane>/report.json` on every outcome, so
`l3-integration-evidence` and `l4-e2e-evidence` upload traces, screenshots and the report
after green and red runs alike.

Measured CI run [43043457690](https://github.com/nocoo/hexly.ai/actions/runs/43043457690)
at `55e2d72d`: wall 262s, queue 2s, critical path `L4: E2E` 246s. Five green runs with a
healthy Chromium install measured 241s, 259s, 262s, 266s and 303s. Two runs with an
unreachable Ubuntu mirror measured 513s and 890s, and one run failed both attempts for
that reason (Z1 blocked it). The lane now installs the browser only, because the hosted
image already provides the libraries. Inside the E2E jobs the fixture cache restore costs
21–39s and the Chromium download 9–17s depending on cache state; the latency is dominated
by `assets:prepare-test` plus 84 journeys. `quality / Z1: Gate` takes 3–4s. The parallel
byte verification in `assets:prepare-test` cut the local check from 5.1s to 2.1s.

This replaced the shared `quality.yml` design, which measured 538s and 938s on 2026-11-10
because every slot reinstalled dependencies and rehydrated fixtures without a cache.

Branch protection: ruleset `main quality gate` (id 27031290) requires the check
`quality / Z1: Gate` from GitHub Actions on the default branch, with
`strict_required_status_checks_policy: false`. The repository admin role keeps
`bypass_mode: always`, so the documented direct-push-to-main workflow continues to work
while every other actor and every PR is gated.

## Failure injection

Injected into a `git archive` snapshot of a verified commit, one defect per slot, run
with the repository toolchain:

| Slot | Injected defect | Exit | Evidence |
| --- | --- | ---: | --- |
| S1 | `const broken: number = "text"` | 1 | `TS2322: Type 'string' is not assignable to type 'number'` |
| S2 | unformatted object literal | 1 | `biome check`: `Found 1 error` |
| G1 | GitHub token in a tracked text file | 1 | `gitleaks dir`: `leaks found: 2` |
| G2 | `lodash@4.17.20` in the lockfile | 1 | `Total 1 package affected by 4 known vulnerabilities` |
| B1 | plugin throwing in `buildStart` | 1 | `Build failed`, `injected build failure` |
| L3 | HTTP journey expecting status 599 | 1 | `✘ tests/http/site.spec.ts` |
| L4 | browser journey expecting a missing path | 1 | `✘ … injected › fails` |

Additional proofs: hiding `gitleaks` from `PATH` fails the hook and the G1 phase
(`could not start`); a phase exceeding its timeout is killed and rejected
(`tests/unit/gate-runtime.test.ts`); the Z1 validator rejects a failing slot, a skipped
`impl` slot, an enabled `na` slot, a foreign tested SHA, a `todo` without a reason, and a
blocking job that did not run; with the working tree deliberately broken, `gate:push`
still passed on a clean pushed commit and the same broken tree failed locally (exit 1).

## Isolation boundary

D1 in this document means test isolation, not the Cloudflare product. Required harnesses
create a unique `hexly-test-*` directory, reject inherited `CLOUDFLARE_*`/`R2_*`/`AWS_*`
credentials, write a test-only Wrangler configuration, create and verify a `_test_marker`
(`env=test`, unique run id) before migrations, seeding and cleanup, and run in an owned
process group. Failed or unverified state is retained for inspection. `bun run
check:isolation` rejects remote bindings, routes, live probes and production database ids.

## Port boundaries

| Purpose | Port |
| --- | ---: |
| Vite development | 7048 |
| L3 Workers HTTP | 17048 |
| L4 browser | 27048 |
| Manual Worker preview | 37048 |

Each lane owns its persistence directory (`.wrangler/dev`, `.wrangler/http`,
`.wrangler/browser`, `.wrangler/preview`) and its own server lifecycle; runners never
reuse an existing server. Test Workers poll the immutable fixture trees with a one-second
base interval, because native watchers exceeded 10,000 descriptors on macOS.

## Release

`release.yml` proves the source run first: `release-source` (base-ci v2026.13) requires
the successful `quality / Z1: Gate` check on the proven SHA, then
`deploy-worker.yml` re-proves the run, applies D1 migrations, deploys and verifies both
`hexly.ai` and `status.hexly.ai`. The reusable deploy workflow at this SHA still pins an
older `release-source` composite that ignores the quality check, which is why the
repository runs the proof itself. Manual CI dispatch also reads both origins without
deploying; a manual dispatch that skips deployment is not deployment evidence.

## Not selected

`L2 Runtime` and `P1 Package` are the only unimplemented slots, both `na`. Everything
listed as `impl` runs in CI on every push to main and every pull request. The site has no
authentication surface, no published package and no long-lived worker runtime suite, so
no further slot applies.
