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

## 2026-09-14: A public R2 path triggered secret scanning

CI `34794991731` stopped the v0.12.3 candidate at `679543c4c86cd6cbf6ed4566733ca2c908866647` when Gitleaks reported `generic-api-key` on the unchanged public font-license key `brands/dogfight/v1.0.0/space-grotesk-ofl.txt`. The matched value was only the public directory `brands/dogfight/`. A public GET returned the expected OFL document and SHA-256 `18a4de52385f6b988782639d5d0cc1326e5a8c2de9a7f01d7b20d9aedcc60943`. Scanning a clean Git archive reproduced the CI finding; the local Git-history scan had passed.

The exception now requires both that exact non-secret match and the inventory path, and applies only to `generic-api-key`. Gitleaks 8.30.1 then passed the clean snapshot, still detected a synthetic credential inside the same inventory, and still detected the reported fragment on stdin outside that path. The default rules, other files, historical assets and published bytes remain unchanged. Check whole-tree scanning as well as Git history when investigating an inventory false positive; do not exempt the inventory wholesale.

The v0.12.4 candidate `3caaa394c9b4ca248baa4692f3cbac75b83fa33c`
reproduced the same issue in CI `34798454011`, this time matching the public
directory fragment `brands/meowth/v` in the inventory's key field. It resolves
to 61 existing inventory records; none is a credential. A clean Git archive
reproduced the directory-scan result with the same pinned Gitleaks 8.30.1.

The exception now recognizes the `key` field's public `brands/<project>/`
namespace, still restricted by `AND` to this inventory and `generic-api-key`.
This handles truncated directory-scan matches without adding a project name
after each inventory expansion. The complete tracked snapshot passes. Two
synthetic credential fields (`key` and `api_key`) inside the inventory are still
detected, and the identical inventory copied outside the allowed file path
still produces a finding. No brand bytes, asset records or other scan rules
changed; the failed candidate remains untagged.

## 2026-09-20: Global social export changed immutable local materials

Rio onboarding ran the documented `assets:build` command. Its global social-card
renderer regenerated 76 previously published JPEGs with different local bytes.
The immutable inventory guard rejected the first changed source before any
upload. Generated copies were retained under the ignored `.video-work/` folder;
all 76 originals were restored from checksummed cache/CDN objects and verified
against the existing inventory. No published object or previous receipt changed.
Only Rio's new card and identity materials enter this onboarding inventory.
For later onboarding, preserve published social bytes before the global export
and compare every existing hash before recording new material.

## 2026-09-20: Rio's public Access audience triggered secret scanning

The first v1.0.0 pre-push gate flagged `ACCESS_AUD` in Rio's archived Wrangler
source configuration as `generic-api-key`, before any site push or deployment.
Rio passes this identifier to `jose.jwtVerify` as the required JWT audience; it
is not a signing key, service token or credential. Cloudflare's
[JWT validation documentation](https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/)
also uses the application AUD tag as the audience-validation parameter.

The exception requires the exact snapshot path, field, complete identifier,
line and rule together. It preserves scanning for other values in that file
and for the same value outside the evidence path. Positive and negative
synthetic checks verify those boundaries; the unchanged source snapshot and
all published materials remain intact. No hook or default scanner rule is
disabled.

## 2026-09-22: Archive status exposed active-only test assumptions

Archiving Hermes on Herdr changed the active catalogue count and its default
navigation category. Initial validation updated unit expectations but missed
an HTTP count and a browser journey that searched only the active directory.
The push gate caught the HTTP assertion; CI caught the desktop and mobile
browser cases before deployment. The remaining 422 browser cases passed.

The archive change preserves historical identity snapshots and all materials.
The browser journey now checks that archived projects are absent from All,
opens Archived, and exercises the same complete brand archive. Future archive
changes should check catalogue counts, navigation and active-only browser
entry points together before starting the full release pipeline.

## 2026-09-24 — Verify API logo variants against published inventory

The first identity API projection assumed every archived brand package contained
a 1024px transparent PNG. The build's inventory guard rejected three nonexistent
paths before publication. These packages already have a 1024px transparent WebP
and native foreground assets, so the API now uses the shared PNG sizes through
512px and returns those existing larger files separately.

A naming convention is not evidence that an immutable export exists. Keep the
build-time inventory check for every returned logo URL, and verify dimensions
and alpha behavior against real bytes in HTTP tests. No artwork or R2 object
was changed to fill the missing sizes.

The browser accessibility check also caught a bounded JSON preview rendered as
a non-focusable preformatted block. Native read-only textareas now provide
keyboard scrolling and selection for both JSON and integration prompts, without
suppressing static accessibility rules. Keep the expanded preview in Axe checks.

The full gallery journey then caught a layout regression: inserting the
asynchronously loaded API preview before the brand archive moved the brand
anchor after keyboard project navigation. The API section now follows the
complete brand archive, preserving its established anchor position. Keep
asynchronous integration content downstream of existing stable navigation
targets and retain the desktop/mobile anchor-alignment journey.

## 2026-09-25 — Overdirected bird portraits obscured the heads

The first Falcon and Kite requests specified broad chests, shoulder/wing mass,
camera analogies, frame entry, species colors and literal fan/ribbon accessories.
Both outputs followed enough of those directions to look superficially coherent,
but their bodies dominated. The owner rejected both for insufficient off-center
composition and weak distinction between bird identities.

The prompt tried to solve anatomy and product metaphors before establishing the
head and negative-space relationship. A slightly shifted full bust did not
satisfy the requested asymmetry. The initial agent inspection focused too much
on facets, accessories and edge clearance instead of the main visual hierarchy.

Preserve both rejected native images and decisions. The corrected requests name
the species, head close-up, strong asymmetry, multicolor and connected flat facets,
leaving camera, gesture and accent to the model. Presentation boards lead the
reference order; Frogie supplies drawing language only. Judge the returned
head/space balance and species recognition before beginning technical finishing.

## 2026-09-25 — Validate image layouts and complete assets before gates

A temporary edge diagnostic treated a decoded mask as one channel without checking
its layout, producing an oversized diagnostic log. It was corrected to extract
the alpha-mask channel explicitly and assert dimensions; no source bytes changed.

The onboarding tests and first commit attempt started while the catalogue-wide
asset generator was still writing previews. Missing inventory entries caused
expected integration failures, while concurrent image work also exhausted the
five-second finishing-test budget. Both runs were stopped and their logs retained.
Complete generation and inventory first, then run gates against that stable state.
A rejected hook is not a reason to bypass it.

The existing full `assets:build` command also regenerated historical social cards
with different bytes. The immutable inventory correctly rejected `public/og.jpg`.
Only the two new project cards are needed. Restore all prior social cards from
their checksummed published objects, then inventory new assets. A generator's
success is not evidence that its output may replace a published asset.

The full suite's default worker count caused the native image fixture to exceed
five seconds even though its isolated run finished in about one second. Capping
Vitest at four workers preserves every test and timeout while avoiding excessive
parallel image subprocesses; the complete 441-test coverage run then passed.
The subsequent onboarding commit reproduced the timeout under shared-machine
load above 50, even with one worker. Reducing Vitest parallelism alone did not
resolve external load; the original assertions and five-second budget remain.
Limiting native image concurrency with `VIPS_CONCURRENCY=1` passed the isolated
fixture in a 2.54-second Vitest run. This bounds libvips work without changing
image outputs, test selection or deadlines.

The owner also caught missing API icons in the local preview. API JSON correctly
contains public CDN URLs, but the view bypassed the local asset resolver. Route
its preview images and links through the same resolver, including an explicit
CDN-to-hydrated-path mapping in development only. Keep the JSON and production
addresses intact. A regression test covers both development and production,
and the repeated 22-scenario browser review found no image or request errors.

The 438-case browser run also slowed under shared-machine load: 214 cases passed,
four unrelated cases reached their 30-second download/media/API deadlines, and
the remainder were interrupted rather than reported as passing. All four failed
cases passed unchanged with one worker in 29.5 seconds total. Required full
browser validation moves to the exact-revision CI release gate, with no increased
timeouts, skipped assertions or deployment before that gate succeeds.


## 2026-09-25 — Test asset selection must follow source snapshots

The first reduced fixture selection retained public materials, brand/texture
sources and the two Snail pixel-test originals, but missed Coffee's archived
`input/public/icon-512.png`. The unchanged current-asset verifier rejected the
missing file through the catalogue's verified source snapshot. The selector now
includes every current snapshot's `files[].archive` dependency, rather than
adding a Coffee-specific exception or restoring the entire finishing history.
Current identity checks remain routine; historical finishing audits remain
available through `assets:check`. The corrected current checker and all 441
unchanged unit tests passed in the isolated checkout.


## 2026-09-25 — Verify test fixtures and device boundaries during pruning

The first complete verification exposed a missing screenshot-upload source in the reduced hydration set. The browser test reads `docs/screenshots/directory-light.png` directly even though it is not a public asset. Restore this existing inventory entry with its original checksum; do not substitute another upload fixture. Review direct filesystem reads alongside public URL dependencies when selecting hydration sources.

The new shared touch fixture also accidentally changed every inherited iPhone 13 viewport from 390px to 320px. Restore the baseline device viewport and retain explicit 320px tests. The narrower Diorama screenshot-caption accessibility finding remains a separate product follow-up: its scrollable text needs keyboard access and inclusion in modal focus traversal. The Pi texture timeout showed a scheduling stall during Axe result aggregation, not evidence of a failed download; keep its assertions and timeout unchanged and validate again.


## 2026-09-27 — Local texture reviews must resolve local materials

The resumed bird texture batch exposed a gap in the local material preview: catalogue views resolved unpublished textures locally, but standalone archived review HTML retained absolute CDN URLs. Route only browser review responses through the shared asset resolver in explicit local mode. Preserve the archived HTML on disk and byte-identical raw downloads, and keep normal production/test delivery on the CDN. The local browser check now covers both surfaces and verifies raw PNG and HTML bytes.

The first TLS reconnect adapter replaced `http.client.HTTPSConnection` globally. Python's constructor uses that global in `super(HTTPSConnection, self)`, causing a local TypeError before any network request. Stop the runner, preserve all failed attempts and the exact adapter source, and inject a custom `HTTPSHandler` instead. Instantiate and run an unauthenticated connectivity probe before the paid workflow. Retry only transient errors inside `connect`, never a sent generation request.

The next adapter called `HTTPConnection.close()` between handshakes, which reset the request state after headers had been prepared. A subsequent request could be sent but `getresponse()` raised `ResponseNotReady`; those outcomes remain unknown and may be billable. Close only the socket during pre-send reconnects. A fake-socket test must cover the entire POST and response, including a failed first handshake, and prove that the request is sent exactly once; a constructor or unauthenticated happy-path probe alone is insufficient.

During final local validation of this batch, the required `assets:build` command regenerated 76 inventoried social JPEGs with different hashes. Inventory and test-fixture checks correctly refused them before publication. Preserve the new renderings outside the archive, then restore the exact old bytes from the verified SHA-addressed local cache. A texture-only task must compare all regenerated materials against the inventory before accepting them; successful rendering does not authorize replacing immutable social images.

## 2026-09-27 — Material texture coverage

The first material-texture batch encoded a quiet left 55% and a narrow right-hand motif group, then treated paper palette and shallow relief as sufficient evidence of series consistency. The owner rejected the coverage: the new textures did not visually inhabit the square. Several retries made the error worse by shrinking motifs into tiny isolated marks. Compare spatial coverage independently from color and detail before scaling a visual batch. Use three representative material motifs, show complete old/new canvases at equal size, and let the owner confirm distribution before wider generation. The new pilot explicitly places worked texture in every quadrant and distributes its breathing spaces throughout the square; the previous originals and decisions remain preserved.

During pilot adoption, the new approval records retained detailed agent observations but omitted the established top-level `inspection` fields. The project-texture tests rejected the incomplete evidence. Add the actual full-canvas, no-crop and no-repeat inspection facts before export, and validate the first pack before scaling. Only the unpublished pilot review records and manifest hashes were corrected; native image bytes remained unchanged.

The local rollout harness initially searched for the `signoff-now` route slug, but the catalogue displays and indexes `signoff.now`. The card lookup timed out before inspecting that project. Use the recorded display title for the search interaction and retain the canonical ID for the card selector and project route; the corrected 30-case group passed without a product-code change.

The full-square rollout increased the complete HTTP/browser asset fixture trees enough for Wrangler's native watchers to break macOS subprocess startup. The visible esbuild `EBADF` was a secondary failure while formatting the original error; tracing every failed spawn revealed Workerd failed first, with 10,363 open descriptors and 11,307 active FSWatcher handles. Switching Node versions and disabling esbuild worker threads did not help. A targeted run with Chokidar polling passed all 36 HTTP tests. The test-only Worker environment now uses one-second polling, preserving every fixture and assertion while daily development retains native watching. Diagnose the first failing subprocess and resource counts before treating a logger stack as the root cause.

## 2026-09-27 — Textured icon selectors and fixtures

The new continuous-corner assets needed the unframed image container so CSS would
not add a second mask or shadow. An audit caught that card, logo-wall and status
responsive dimensions were attached only to the old tile class. The change now
shares the layout selectors with composed icons while leaving decorative shadows
on the old class. Desktop, 390 px and 320 px layout checks cover both themes.
Existing browser fixtures also pinned old family/favicon URLs and expected large
transparent foreground areas. Those checks now select the current icon package
and require transparent corners plus an opaque textured center; separate original
foreground tests remain. Update consumer selectors and semantic pixel assertions
together when changing an approved presentation, not only the image URL.

The first production-only review harness compared local `/icons/<id>/` paths
with the CDN's `/projects/<id>/icons/` keys and rejected a correctly deployed
image. Derive the expected production URL from the inventory and media origin,
then verify the decoded image; local path success is not a production URL check.
The corrected run passed all 120 page cases. A separate transient API connection
reset was handled with bounded retries around the complete JSON response; content
and checksum assertions remained unchanged, and all 60 API checks passed.

The cleanup revision's CI run 36309454096 hit the existing ten-minute job limit.
Cold hydration of 8,611 fixture paths took 342.9 seconds with eight downloads;
all 450 unit tests and 36 HTTP tests passed before cancellation during browser
checks. Increase fixture download concurrency to 16 using the existing bounded
pool. The largest selected object is 7.3 MB, and this path only reads CDN objects.
Keep every fixture, checksum, assertion and timeout; verify the complete replacement
CI run before tagging instead of extending the budget or skipping browser checks.

## 2026-09-27 — Screenshot inventory started before export completion

The Xray screenshot import was still exporting derivatives when inventory was
started. The first scan recorded only ten of the expected fifteen new files.
No upload or deployment occurred. After both processes exited, inventory was
rebuilt and checked against all five completed receipts. A yielded process is
still running: require its successful exit before starting dependent inventory,
profile generation, validation or publication, and compare the expected file
count before proceeding.

The intake audit also exceeded Node's default synchronous subprocess output
buffer while reading the existing multi-megabyte inventory through `git show`.
Use an explicit bounded buffer sized for that known metadata file, or stream it
to disk; do not let a diagnostic exception dump the inventory into tool output.

## 2026-09-30 — Browser checks started before fixture hydration finished

During the CI audit, a focused browser check started while the clean clone was
still downloading its fixtures. Worker startup failed with a missing inventory
file before any test ran. The build itself does not guarantee test-source
hydration. Wait for the hydration process to exit successfully before starting
HTTP or browser consumers; a growing cache or a successful build is insufficient.
Rerun the affected check only after the preparation dependency completes.

The clean clone used `blob:none`. Its first Gitleaks history walk triggered lazy
object fetches and Git reported a commit-graph/object-database inconsistency.
The scan exited nonzero despite reporting no leaks in its incomplete 57-commit
sample. Refetch all reachable objects in this clone with `--refetch --no-filter`
and commit-graph reads/writes disabled for that fetch, then repeat the complete
scan. Never treat a partial scan's “no leaks” line as a passing security gate.

## 2026-09-30 — Custom CI run name rejected by the release guard

CI run 36643793109 passed all checks, but Release 36644475932 rejected its source
before checkout, migrations or deployment. Adding a descriptive `run-name` changed
the Actions run API's `name` from `CI` to `CI push <sha>`. The pinned shared
release-source action compares that field with the expected workflow name.
Remove the unnecessary run-name instead of weakening source verification. Keep
the canonical name and use API event, SHA and run ID fields for audit labels.
Inspect the pinned guard's actual input contract before changing workflow names.

## 2026-09-30 — Incomplete lock entry triggered broad dependency resolution

While repairing the newly disclosed fast-uri advisory, deleting its lock entry
before installation caused Bun to resolve unrelated transitive dependencies and
write mirror tarball URLs with weaker metadata digests. The broad diff was caught
before commit or push. Stop that validation attempt, restore every unchanged lock
entry from HEAD, replace only the fast-uri version and independently verified
SHA-512, and reinstall with `--frozen-lockfile`. Review the complete lock diff
before starting verification; a targeted intent does not constrain a package
manager's re-resolution of an incomplete lockfile.

## 2026-10-03 — Verify a clean installation after Bun patch preparation

While porting the local Wrangler proxy patch to 4.145.0, the editable package created by `bun patch` remained a real directory after patch commit. Incremental frozen installation did not restore its isolated-linker dependency layout, and Wrangler type generation failed to resolve esbuild. The owned installation was preserved outside the checkout and rebuilt from the unchanged frozen lock. Dependency patch acceptance must include a clean frozen installation, runtime dependency resolution and the installed-bundle regression tests; success of patch generation alone is insufficient.

## 2026-10-03 — Validate deployment pins during dependency upgrades

Dependency PR #17 updated the Wrangler manifest, lock and local proxy patch to 4.145.0 but missed the explicit 4.129.0 input in the release workflow. Local checks, independent reviews and PR CI passed; post-merge deployment run 37087123703 then rejected the installed version in Locate locked Wrangler, before migrations or deployment. The duty reopened #16 and paused the next project to fix the pin through a separate reviewed PR. A release contract test now compares the workflow input with both the root manifest and installed package. It first failed on the real 4.129.0 versus 4.145.0 mismatch, then passed after the pin correction. Future dependency review must search deployment consumers as well as manifests, and post-merge CD remains part of acceptance; PR green alone did not prove successful delivery.

## 2026-10-08 — Test ownership and accessibility popup coupling

Archive manifests were walked independently by asset verification, unit tests
and HTTP tests, while shared browser controls repeated project/device/theme
matrices. This accumulated cost without independent failure coverage. Keep
catalogue-wide checksums in asset verification, policy/provenance in unit tests,
representative transport in HTTP and user behavior in browser journeys.

During cleanup, axe's page scan completed but its blank result page stalled in
`axeConfigure`. This reproduced with one worker, so more retries or a larger
timeout would not address the lifecycle coupling. Use the existing axe-core
engine directly in the page and reject unexpected frames; preserve all default
rules. Verify the installed frozen dependency graph before measuring tests: the
initial node_modules still contained older versions than bun.lock.

## 2026-10-08 — Remove ownership of Wrangler internals

The project maintained a version-specific development-proxy patch and tests that
parsed and evaluated its installed bundle. A duplicate workflow pin then needed
another equality test to keep configuration synchronized. These checks tested
our workaround rather than the product. Delete the patch and vendor tests; use
compatible package ranges, one frozen resolution and the existing project deploy
script. Keep migration-before-deploy and trusted revision guards. Upstream issue
15451 is still open; removal is not a claim that every upstream transport defect
has been fixed. Validate the unmodified public toolchain without adding retries.

The unmodified-toolchain run passed HTTP and 71/72 browser checks. The remaining
failure was reading the background opener immediately after opening an external
tab: Chromium closed its protocol session. Close the verified popup and restore
the opener to the foreground before asserting its unchanged URL. Keep native
middle-click navigation and the unchanged-page assertion; do not retry the test.

## 2026-10-08 — Verify tab semantics beyond isolated components

Splitting project details into tabs initially gave the brand container and its
specimen region the same accessible name. An isolated specimen scan passed,
but the full Xray page scan correctly rejected duplicate landmarks. Keep region
names distinct and scan the assembled page, not only its children.

The new sticky tabs also changed the scroll boundary. Retaining the old brand
scroll margin left a gap between the carousel and tabs instead of positioning
the tabs at their sticky threshold. Align top-level panel edges without an extra
margin; retain section offsets inside panels. Update navigation tests to the
actual product contract: picking another project opens its introduction, so an
API check must explicitly reopen Integration. Do not keep hidden eager API
requests or the old page structure merely to satisfy obsolete assertions.

## 2026-10-08 — Avoid orphan-process timing in unit gates

The release pre-commit gate hit EPERM in a test that intentionally orphaned a
SIGTERM-resistant descendant. Both focused and full changed-test reruns passed,
so a persistent permissions failure was not established. The fixture coupled a
unit assertion to OS orphan reaping and process-group signal timing. Replace it
with a deterministic signal-protocol check: clean an exited leader's group,
escalate to SIGKILL, accept only ESRCH, and propagate EPERM. Keep real Worker
lifecycle cleanup in HTTP/browser verification. Do not suppress permission
errors, bypass hooks, or add retries to make this fixture pass.

## 2026-10-08 — Preserve completed icons when archiving projects

Archiving Pika exposed a catalogue validator that rejected existing presentation
icons on archived projects, contradicting the maintenance contract to preserve
completed materials. Allow retained icons while keeping their path and geometry
checks. Generation plans must exclude the current archived catalogue rather than
hard-code one archived project. Move active monitoring fixtures off retired
projects and run the normal hooks before publication.

## 2026-10-09 - Calibrate near-white extraction before adoption

Sleepy's first extraction ate pale paper ridges. Raising the threshold retained
matte specks, and a broad protection polygon captured white background. All three
diagnostic passes remain immutable. The selected fourth pass uses measured
exterior-connected threshold 243 without component deletion or a protection
polygon, checked on dark and light. Do not treat a plausible mask as verified:
inspect pale material boundaries and every detached region before source adoption.

## 2026-10-09 - Validate texture records before immutable publication

The first Sleepy/Rhino texture packs were uploaded before the complete unit and
asset checks finished. Tests then rejected missing explicit inspection fields,
and the asset verifier incorrectly expected an icon's authored family background
to change when an independent texture pack was selected. Preserve already
published v1.0.0 bytes; export corrected review metadata as v1.0.1 and select it
only after validation. Resolve icon background provenance by its recorded source
method, not a newer independent decorative surface. Complete local validation
before publishing any new immutable package; never repair it by overwriting R2.

## 2026-10-10 - Keep unmodified source SVG archives inert

Zoo's intake copied its exact favicon SVG into the workbench as an active SVG.
The normal commit hook correctly rejected its missing accessible title. Adding
a title would invalidate source-byte provenance. Keep the unchanged source as
an inert `.svg.txt` archive with its original path and checksum instead; apply
accessible markup to actual new application assets, not preserved originals.
Check the archive's lint scope before staging and never bypass the hook or
exclude all source SVGs to accommodate one historical file.
