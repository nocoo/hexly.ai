# Retrospective

## 2026-09-06: Registry rewrite during release

The first release command used `bun install --lockfile-only` with the machine's temporary npm mirror. Bun rewrote 238 dependency source URLs even though no dependencies changed. The release driver was stopped before tagging, and the original lockfile was restored in a follow-up commit.

The release command now includes `--frozen-lockfile`. A temporary checkout with the package version advanced to `0.2.0` verified that this command succeeds and leaves the lockfile byte-for-byte unchanged under the same mirror configuration. Root package versions are not stored in `bun.lock`; dependency source changes do not belong in a version-only release.

## 2026-09-06: Existing apex DNS blocked custom-domain attachment

Wrangler uploaded the ready Worker but failed to attach `hexly.ai` with error `100117`. Its automatic DNS override did not replace the externally managed Vercel A record. The release stopped before tagging.

The Workers preview was verified first. The exact, backed-up apex A record was then removed and the custom domain attached, preserving the existing MX and TXT records. Public release metadata and asset checks passed after attachment. A CI job entering cleanup does not establish deployment success; check the Deploy job's conclusion and public verification before reporting completion.

## 2026-09-06: Metadata readiness preceded valid CSS

The Frogie gallery deployment returned the expected release metadata, but the immediate production check rejected the compiled CSS response's content type. A later request to the same asset returned `text/css` and the full release verification passed. The failed job did not record the actual type, so the original response and the underlying delivery cause cannot be established.

The verifier now retries the complete release check within its existing bounded retry window, including the document, compiled asset types, and original-logo checksum. Success requires all checks in one attempt. Errors include the actual asset content type, and regression tests cover temporary HTML responses, persistent invalid CSS, stale metadata, and wrong logo bytes. Retries do not relax validation.

## 2026-09-07: A release fixture inherited the parent worktree

Running the full pre-commit suite in a linked worktree exposed a missing Git-environment boundary in the release dry-run test. The fixture changed its working directory but inherited repository-local Git variables from the hook. Its `git init`, local author settings, index, and fixture commit therefore targeted the publication worktree instead of the temporary repository. The test failed before any remote operation.

The fixture commit was preserved on a local recovery branch, the publication branch/index were reset to their preceding revision without discarding working files, and the shared repository's non-bare setting and original author identity were restored. Neither the source artwork nor remote refs changed. The fixture now removes every variable reported by `git rev-parse --local-env-vars` from both Git and release-script subprocesses and asserts its actual Git directory. Running from a hook in a linked worktree verifies this isolation. Logo checkpoint fixtures now supply their presentation configuration and cover both generated and retained-original approval records. Changes to the finisher trigger the unit suite even though it is called through a subprocess.

## 2026-09-07: Browser CI lacked runtime parity and evidence

Two browser runs lost their Wrangler server after startup, but the workflow discarded its diagnostic file. A subsequent instrumented run kept the server alive and passed 97 of 98 tests; its remaining failure checked a new tab's URL before navigation finished. The new-tab test now waits for the expected URL and `DOMContentLoaded` before checking content.

The diagnostics also established that the shared workflow used Node.js 22.23.2, while local development and deployment used 26.7.0. Browser CI now has a separate job that pins the matching runtime and retains failure logs, traces, and screenshots. Deploy depends on both this job and the shared quality workflow. The full browser suite, three workers, zero retries, and all other quality gates remain required.

The pinned-runtime run still failed, but its complete artifact exposed `ProxyController` terminating the server on `Network connection lost.` from a single forwarded request. A truncated upload reproduced the same failure locally. This matches [upstream issue 15451](https://github.com/cloudflare/workers-sdk/issues/15451). The checked-in [Wrangler patch](patches/README.md) adopts the pending upstream fix's distinction between forwarded-fetch failures and response-processing defects; it returns HTTP 502 for the former while preserving the latter's fatal behavior. An HTTP regression now abandons three upload connections and verifies that the server continues serving after each.

## 2026-09-07: Bogo's approved identity was missing from publication

The scoped publication checkout still contained Bogo's original catalogue entry, while the owner's local main retained the approved study `2026-09-07-05`, finishing `04`. Restore that exact entry, original backup, display assets, public finishing, study archive, and generated profile together. When publishing from a separate checkout, carry the selected identity and its complete delivery files together; a local adoption alone does not update the deployed catalogue. The owner requested direct restoration and will review the live result.

## 2026-09-12: Native background-tab event stalled browser CI

Run `34652381938` passed 187 of 188 browser checks, including status time zones. The remaining directory test completed its middle click and fetched `/logos/pew` plus the new page's assets with HTTP 200, but Chromium never delivered the context's `page` event. Waiting for that event before calling `bringToFront()` left the test unable to activate the tab; the trace does not establish Chromium's underlying cause.

The test now uses native Shift + middle click to open the tab in front at creation. It still checks the real link gesture, destination, rendered identity, and unchanged parent URL with the existing timeouts and zero retries. Browser CI and deployment remain required.

## 2026-09-13: Long browser runs exposed proxy disconnects and fixture aging

CI `34722384807` at `6380681fa0caefe4f866bbbe4144554664cccf46` passed its static, unit, HTTP and security jobs. Browser attempt 1 passed 345 of 346 checks; its trace and Wrangler log show a local proxy disconnect returning 502 for the main CSS on the Snail mobile page. One failed-job rerun passed 343 checks: Bat's two Hero requests received the same proxy 502, and two status tests observed the fixed SQLite demo after its newest sample exceeded the real ten-minute freshness window. The page correctly displayed unknown states. The release remained untagged and undeployed.

The local-only proxy patch now retries a still-active `GET` or `HEAD` once for that exact disconnect, retaining HTTP 502 after another failure and never replaying writes, upgrades or canceled requests. Fault-injection tests execute the installed proxy bundle, including actual HTTP failures and response-processing defects. Status browser tests pin their clock to the latest demo sample, and intentional stale fixtures use that clock too. Production freshness rules, D1 records, application code, assets, concurrency, timeouts and the zero-test-retry policy stay unchanged. The original feature and release-preparation commits are preserved; this recovery is an additive tooling/test commit.

## 2026-09-13: Canonical review URLs crossed the material boundary

The first R2 deployment at `3dc05b9a947fe3eb917906d02fc50e4bf9b61cc9` passed CI and its deployment checks. The separate real-CDN browser acceptance caught Snail's standalone review navigating away from the site. Cloudflare Static Assets redirected `review.html` to `review`; the broad versioned-package resolver treated that extensionless document as a material and redirected it to a nonexistent R2 object. Local tests used test-mode assets, so that production routing branch was not exercised by their navigation.

Material resolution now requires a filename extension, preserving extensionless review documents and package directories on the Worker. Gateway regression tests explicitly use production mode and cover the normalized review URLs. Production acceptance must follow the actual HTML redirect chain and download bytes before tagging or starting history reduction. Archived review HTML and published material bytes remain unchanged.

## 2026-09-13: Native popup initialization stalled in headless shell

Both attempts of CI `34732514390` passed 351 browser checks and timed out in the same native directory-navigation test. The retained trace shows the middle-click action completed and `/projects/pew` returned HTTP 200, while Chromium never delivered the context's `page` event. The earlier Shift-middle-click workaround therefore did not reliably initialize the new tab. There was no release tag or history rewrite after these failed runs.

Local probes also reproduced the stall after changing the gesture, separating browser contexts and explicitly activating the native target. Those probes were not adopted. The suite now selects `channel: "chromium"`, the full Chromium build's current headless mode, which [Playwright documents](https://playwright.dev/docs/browsers#chromium-new-headless-mode) separately from its default headless shell. Both binaries are already installed by the existing CI browser step. The original native gesture, test assertions, application navigation, timeouts, parallelism and zero retries are unchanged; no test-only protocol workaround is retained. Failure traces and diagnostic logs remain outside the repository in the migration evidence.

Before resuming release CI, this configuration passed 16 repeated desktop/mobile native-navigation checks and all 352 browser checks locally, plus typecheck and lint.
