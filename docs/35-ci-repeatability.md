# CI repeatability audit — 2026-09-30

## Baseline

Source: clean `nocoo/hexly.ai` main at
`86c90f2c546edac871e96399c717082d181c4ebe`. Both CI and Release were active.
The older divergent checkout was not used or modified.

The latest 60 workflow records contain 29 CI runs (25 success, 2 failure,
2 cancelled) and 31 Release runs (23 success, 1 failure, 7 skipped). These span
older workflow designs and are not a single-version reliability estimate.

Wall clock is API `created_at` through `updated_at` for a completed run.
Job execution is `started_at` through `completed_at`; initial queue is workflow
creation through job start. Times below are seconds and include no inferred
successes from skipped workflows.

| CI run | SHA | CI wall | Queue | Job execution | Linked Release wall | Push through Release |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| [36317687065](https://github.com/nocoo/hexly.ai/actions/runs/36317687065) | `86c90f2` | 381 | 3 | 377 | 37 | 420 |
| [36310197106](https://github.com/nocoo/hexly.ai/actions/runs/36310197106) | `ad65990` | 381 | 3 | 377 | 35 | 419 |
| [36309454096](https://github.com/nocoo/hexly.ai/actions/runs/36309454096) | `d228c4f` | 619, cancelled | 2 | 616 | skipped | not successful |
| [36306795401](https://github.com/nocoo/hexly.ai/actions/runs/36306795401) | `b1f3960` | 469 | 2 | 466 | 31 | 502 |
| [36270162071](https://github.com/nocoo/hexly.ai/actions/runs/36270162071) | `19f5ed6` | 434 | 3 | 430 | 39 | 475 |
| [36085396420](https://github.com/nocoo/hexly.ai/actions/runs/36085396420) | `4b91a6f` | 419 | 3 | 415 | 35 | 457 |

Latest Release [36318034728](https://github.com/nocoo/hexly.ai/actions/runs/36318034728)
ran from 2026-09-27 12:09:07Z to 12:09:44Z. Its Cloudflare deployment job ran for
33 seconds after 3 seconds of initial queue. The paired push CI began at
12:02:44Z: seven minutes includes CI, trigger handoff, deployment and production
verification. GitHub check-runs report successful Complete verification and
Deploy / Deploy Worker; the legacy commit-status API contains no extra contexts.
Production uses the pinned reusable base-ci Cloudflare Worker workflow, not an
additional Railway pipeline. GitHub deployment `6691992777` records success for
this same revision at 12:09:43Z.

| Latest CI stage | Seconds |
| --- | ---: |
| Checkout | 3 |
| JS setup and frozen install | 9 |
| Security scanner setup | 1 |
| Full Chromium installation | 26 |
| Fixture hydration and byte verification | 28.9 |
| Current asset verification | 5.8 |
| Video assets | 0.1 |
| Types / lint / isolation | 5.6 |
| OSV and Gitleaks | 4.4 |
| 450 unit tests and coverage | 41.8 |
| Build and deployment dry run | 2.3 |
| 36 real HTTP tests | 19.8 |
| 99 Chromium browser tests | 222.8 |

The verification command took 331.5 seconds. Browser testing accounts for 67% of
that work; production release is not the main latency source. The cancelled
September 27 run spent 342.9 seconds hydrating 8,611 paths / 5,099 content objects
with the older eight-download setting. Its unit and HTTP checks passed, but the
10-minute job deadline interrupted browser testing. The current baseline already
raised download concurrency to 16. Cache verified immutable objects to avoid
repeating thousands of external requests; retain checksums even on a cache hit.

Historical failures were meaningful:

- [35690313568](https://github.com/nocoo/hexly.ai/actions/runs/35690313568): archived Hermes brand navigation did not expose the expected card. Keep the archived-project browser regression.
- [35430308837](https://github.com/nocoo/hexly.ai/actions/runs/35430308837): mobile status-filter color contrast, 3.42 versus required 4.5. Keep accessibility checks.
- [35225766854](https://github.com/nocoo/hexly.ai/actions/runs/35225766854): deployment source SHA was superseded on main. The release freshness guard correctly rejected the stale revision; keep it.

## Security refresh

The September 30 local scan found ten OSV advisories on the baseline's transitive
`undici 7.29.0`, pinned by Miniflare. Override it to `7.29.1`, verify the downloaded
tarball, preserve registry-neutral lock entries and use a frozen install. OSV
reports no remaining findings. Keep the upstream Wrangler patch and exercise its
real Worker HTTP regressions after this transport dependency change.

## Local validation

After the dependency fix and browser matrix trim, `CI=true bun run verify`
passed in 177.0 seconds on macOS with Bun 1.4.0 and Node 26.9.0: 450 unit tests,
36 Worker HTTP tests and 90 Chromium browser tests. Coverage was 99.54% statements,
98.53% branches, 100% functions and 100% lines. OSV had no findings and Gitleaks
scanned all 389 then-reachable commits without leaks. Typecheck, lint, isolation,
fixture/current-asset checks, Video Kit validation, build and deployment dry run
all passed. `actionlint` validated both workflows. These local measurements do
not count toward the online ten-run requirement; hosted CI pins Node 26.7.0.

## Acceptance protocol

The [quality guide](03-quality.md#repeatability-and-production-boundary) defines
the final-SHA ten-run protocol and separates one real push/deployment from ten
side-effect-free CI plus production-read runs. Store raw API records and the
result table in ignored `.wrangler/ci-audit/`, so recording results does not
change the tested commit. This document records the baseline and procedure,
not a claim that ten runs have already passed.
