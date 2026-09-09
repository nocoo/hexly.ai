# InfoSpace onboarding

## Scope and source baseline

On 2026-09-09 the owner requested a local run check, a README review against the shared template, a new catalogue entry at the start of the tools group, and a refined physical-object logo. The logo must use continuous materials: no animal and no fragmented drawing.

All repositories were clean on `main` when inspected. `git pull --ff-only origin main` succeeded before changes.

| Repository | Inspected revision | Purpose |
| --- | --- | --- |
| `nocoo/infospace` | `0d25de0f63e20979fd81c1c295e5bc84132efb3a` | SDK, demo, README, original SVG and theme evidence |
| `nocoo/hexly.ai` | `0221e4973dd66af3b17ebc42961f0321ead3be4e` | Catalogue and existing physical-object identities |
| `nocoo/nocoo` | `47d39a7882e16a17d62b9a4207b81480ba5afedd` | Existing InfoSpace profile entry and description |

GitHub metadata confirms a public, non-fork, non-archived repository with `main` as its default branch. No project website is configured. Catalogue navigation should open the repository; neither a presumed domain nor the local demo is a website.

## Product findings

InfoSpace is a native macOS workspace SDK and demonstration app. It supplies reusable layout and SwiftUI components so a host app can place its own information views in adjustable panels. It is not a hosted information service.

| Finding | Source |
| --- | --- |
| Swift 6.3 tools, macOS 26+, Core/UI libraries and an executable | `Package.swift` |
| Grid geometry, stable panel identities and observable layout state | `Sources/InfoSpaceCore/` |
| Draggable dividers, snapping, panel controls and customizable content | `Sources/InfoSpaceUI/InfoSpaceCanvas.swift`, `SpacePanel.swift`, `SpaceResizeHandle.swift` |
| Host-provided workspace regions, toolbar and footer | `InfoSpaceWorkspace.swift`, `InfoSpaceToolbar.swift`, `InfoSpaceFooter.swift` |
| Native window integration | `InfoSpaceWindow.swift`, `NativeWindowAttachment.swift` |
| Four kinds of sample content; note and task edits held in SwiftUI state | `App/DemoPanelContent.swift` |
| A dark demo, adjustable grid and native menu shortcuts | `App/InfoSpaceApp.swift`, `App/WorkspaceView.swift` |
| Core tests, compiled integration examples and native inspection script | `Tests/InfoSpaceCoreTests/`, `Examples/`, `scripts/check.sh`, `scripts/verify-ui.py` |

`package.json` stores version and release metadata. Bun and Node.js are not application dependencies and do not belong in the product stack.

The demo has no persistence across launches. Its sample inbox, progress and schedule are demonstration content, not connected services. Screenshot freezing during divider drag is not implemented. Public copy must retain these boundaries.

## README review

Both language versions already exist, including a root Chinese README and `docs/README.en.md`. The current root logo is a small four-panel SVG, not a finished physical-object identity.

Required adjustments against [the shared template](readme-refresh/template.md):

- Use the standard sequence: What it does, Features, Usage, Development, Tests, Stack, Documentation and License.
- Keep the language link near the title. There is no verified website to precede it.
- Move installation and shortcuts into Usage, and useful directory information into Development.
- Remove the hardcoded passing-test badge and counts from the README.
- Keep the actual commands for static checks, core tests, compiled examples and native UI inspection, with the necessary toolchain and GUI prerequisites.
- Keep quality-policy, benchmark implementation and release-process detail out of the README. Do not describe 6DQ there.
- Preserve equivalent facts, commands and relative links in both languages.

## Local verification

Verification passed against a clean archive of the inspected commit in a fresh temporary directory. The existing checkout's `.build/`, `.swiftpm/`, `.local/` and generated Xcode project were not used or changed. The complete [runtime review](research/infospace-2026-09-09/runtime.md) records the toolchain, commands, results and limits.

| Check | Status |
| --- | --- |
| Xcode, Swift, XcodeGen and SwiftLint availability | Xcode 26.6, Swift 6.3.3, XcodeGen 2.46.0, SwiftLint 0.65.1 |
| `./scripts/check.sh` | Passed: strict lint, 51 core tests, example compilation and SwiftPM Release build |
| `./scripts/build.sh -quiet` | Passed: native Debug application bundle |
| `python3 scripts/verify-ui.py --output <fresh-directory>` | Passed: 36 checks and 15 window captures |
| Native app launch | Passed as part of the dedicated inspection process |

Native inspection launched and closed its own demonstration window; the two existing app instances were left running. It uses events addressed to its own window, not system Accessibility end-to-end automation. Root reviewed the baseline and minimum-track screenshots and confirmed that narrow panels condense while the large panel keeps its content. The site's existing Vite server remains available at `https://index.dev.hexly.ai`.

## Catalogue and profile plan

Insert `infospace` immediately before `signoff-now` in the catalogue index. The existing sorter already places animals, templates and games first, then preserves the input order for the tools. This places InfoSpace first in that final group without changing the popularity snapshot or the relative order of any existing project. The profile generator matches existing filenames by stable ID, so the insertion does not renumber them. Use category `tools`, the existing `🗂️` emoji, the evidenced repository link, bilingual product facts and a verified overview.

The GitHub profile already contained InfoSpace in Recent Projects. Commit `e3e92cf41ced9400940b18904f1c97453f3b5903` moves only that entry immediately before `signoff.now`, preserving its text, every other line and the Games section in its current position. The commit is pushed and recorded in the new catalogue entry. The [profile snapshot](sources/nocoo-readme-2026-09-09-infospace.json) records the targeted comparison.

Preserve `logo.svg` byte-for-byte in the original-artwork archive. A future approved bitmap uses a new source filename and commit; do not rewrite the original SVG's history. A pending image must not be labeled adopted or published.

## Logo direction and execution

The proposed object is a compact desktop information tray with sliding dividers: a deep-indigo metal frame, four uneven bays with a few colored paper cards, and a small tactile adjustment handle. The movable partition represents resizing; the contained cards represent host-provided information. Broad, quiet surfaces and a readable silhouette should work at small sizes.

Reference the real app for its four-panel relationship and muted indigo, green, terracotta and lilac palette. Reference the existing Signoff counter for believable metal, careful edges and restrained product lighting. The collection's presentation boards inform later paper texture and framing. Do not copy another project's subject or motif.

The separate presentation will use a cool paper field with offset panel outlines and short alignment ticks. Its exact colors are design proposals until an accepted image is sampled. The actual demo background is `Color(red: 0.075, green: 0.085, blue: 0.11)` in `InfoSpaceTheme.dark`; its controls use a white accent. Keep application tokens separate from artwork samples.

The [study brief](../artwork/logo-family/infospace/2026-09-09-01/brief.md) and [exact prompt](../artwork/logo-family/infospace/2026-09-09-01/prompt.txt) were prepared before generation. On 2026-09-09 the owner explicitly authorized the workflow skill's Azure GPT Image 2 route and asked for the untouched result to be opened in Google Chrome for confirmation before replacement. This supersedes the earlier pending API-route question. No prior batch waiver applies to InfoSpace.

Generate one native source, immediately show its untouched bytes and open that exact PNG in Chrome. Wait for the owner's decision on the image before extraction, background composition, icon exports or catalogue use. After approval, create the transparent source, presentation masters, ten export sizes, full static and site reviews, and actual macOS app icon consumers.

## Delivery checklist

1. Complete the local verification and record actual outcomes.
2. Review and apply matching Chinese and English README edits.
3. Prepare catalogue metadata, ordering and profile synchronization.
4. Generate and obtain the required raw-image decision.
5. Finish and review the accepted logo at artwork, app-icon and small-icon sizes.
6. Adopt the source logo, verify native consumers and record immutable provenance.
7. Run asset/profile generators and required site checks; review all diffs.
8. Complete authorized commits and pushes after a fresh pull; distinguish source pushes from site deployment in the delivery record.

No repository version change is part of this addition. The hexly.ai `v0.5.0` release tag predates InfoSpace; this catalogue addition follows the normal `main` publication path without a new release tag.

## Publication dependency repair

The first push of the catalogue commit `df9b86012d43076f9a461ee8ac92ef050ca36155` was stopped by the required security gate. All 61 HTTP checks passed, but OSV found [GHSA-rgj7-g3m4-5g8c](https://osv.dev/GHSA-rgj7-g3m4-5g8c), published on 2026-09-08. The site remained at its previous remote and production revision during this failure.

The root development dependency was already Sharp 0.35.4. The vulnerable copy came from `wrangler@4.129.0 → miniflare@5.20260903.0-alpha → sharp@0.35.2`. An exact root override now makes the whole graph use 0.35.4, and Bun regenerated the lockfile without the old Sharp package and its native binaries. The existing Wrangler patch and all gate commands remain unchanged.

An ordinary install left the obsolete nested package in the local generated installation directory. That one unreferenced package was moved to a temporary backup, and a frozen install then verified the final graph. Both root and Miniflare resolution now point to Sharp 0.35.4 with libvips 8.18.6 and libheif 1.23.2. A native PNG conversion passed. TypeScript, full lint, isolation, OSV (210 locked packages, no issues) and Gitleaks also passed before retrying publication.

## Baseline publication before logo adoption

- The README revision is published in `nocoo/infospace` at `86efacf28592243b9c7e12a2837d975eb190521f`; [its CI passed](https://github.com/nocoo/infospace/actions/runs/34299084163). The code and version remain at the inspected baseline.
- The profile order is published at `e3e92cf41ced9400940b18904f1c97453f3b5903`.
- The local site catalogue contains InfoSpace with its preserved source SVG, goal and seven stack badges. Asset generation, profile generation, TypeScript, full lint and all 92 existing unit tests passed.
- Asset verification passed for all 70 source checksums, 420 derivatives, 54 historical public archives and 92 finishing passes. No unrelated artwork or project profile changed.
- The [local browser review](research/infospace-2026-09-09/browser/report.json) passed all eight desktop/mobile, light/dark and English/Chinese overview combinations. It checked all seven badge labels and translated roles, both README links, zero horizontal overflow, the actual 50-card order, tools filtering, navigation and refresh. Root inspected the desktop English and 320 px dark Chinese captures. No browser page errors occurred.
- The first [site CI run](https://github.com/nocoo/hexly.ai/actions/runs/34300143663) passed unit, static, security and HTTP gates. Its browser suite passed 160 of 162 checks; the two failures exposed a stale alphabetical-order expectation that placed the new unrefined InfoSpace entry after Zhe. The existing browser assertion now checks the complete active list in name order, matching the documented behavior and existing unit test. [Failure analysis](research/infospace-2026-09-09/ci-review.md) records the evidence. Deploy was skipped for that run.
- Site revision `6813c9d1e30fd649f05d08ee294e1441544ec0a5` is published. All quality jobs, the complete browser suite and Deploy passed in [Quality & Deploy 34300696343](https://github.com/nocoo/hexly.ai/actions/runs/34300696343). `bun run verify:production` verified the public version, revision, document, compiled assets and original logo.
- The separate [production browser review](research/infospace-2026-09-09/production/report.json) passed all eight desktop/mobile, light/dark and English/Chinese overview combinations plus four navigation/order groups: 12 checks, 70 total projects, 50 active projects and no page errors. It confirmed InfoSpace between DreamRO and signoff.now, first in tools. Root inspected the desktop English and mobile Chinese captures. That deployment uses the preserved SVG and is the pre-logo baseline. The [publication record](research/infospace-2026-09-09/publication.json) keeps the exact source, profile and deployment revisions.

## Approved artwork and source replacement

The owner approved the exact displayed PNG and authorized the full replacement and Hexly publication. The native 2048 × 2048 image, request metadata and exact decision are archived in the [InfoSpace study](../artwork/logo-family/infospace/2026-09-09-01/). There was one image request and no retry. Selected finishing `01` supplies a transparent master, independent square/rounded presentations, a pure-white version, ten export sizes, edge previews and a complete static review.

The [artwork verification](../artwork/logo-family/infospace/2026-09-09-01/verification/artwork.json) confirms unchanged RGB in all 1,899,220 fully opaque pixels, a transparent outer border, 195.5 px clearance against the actual rounded outline and zero clipping. The measured extraction preserves neutral metal reflections while removing the exterior floor shadow. Rejected extraction probes remain archived.

The source receives the exact three masters, rounded README headers, transparent 22/44 px toolbar marks and an inset native Dock icon. [Source asset verification](../artwork/logo-family/infospace/2026-09-09-01/verification/source-assets.json) checks hashes, dimensions, alpha, README targets and all ten decoded ICNS entries. The old SVG is preserved. These resources belong only to the demo executable, so SDK library consumers remain independent of the demo's brand.

The owner reported that the Dock icon appeared while the toolbar logo remained blank. Root reproduced the missing toolbar in a native screenshot. File-presence checks had passed, but they did not prove rendering. The corrected AppKit bundle lookup resolves both Xcode TIFF and SwiftPM PNG resources, and both real windows now show the 22 pt transparent mark. Each final native inspection passed 36/36 checks with 15 captures. The initial failed inspection, offscreen pixel comparison and actual window evidence are retained in the [native verification archive](../artwork/logo-family/infospace/2026-09-09-01/verification/native/README.md). Source adoption is pushed at [`82f629ed42`](https://github.com/nocoo/infospace/commit/82f629ed42b6ec89dac0e0c79e2a63dec88ecacf), including the refreshed README screenshot. The source version remains `0.1.0`.

## Accepted site verification and publication

The source commit's [CI passed](https://github.com/nocoo/infospace/actions/runs/34304157654). The catalogue now records that exact source revision, the new transparent PNG and adopted material-family status, while preserving the previous SVG. The source's existing goal and seven technology badges retain their inspected code baseline.

The final [browser review](research/infospace-2026-09-09/logo-browser/README.md) passed 72/72 checks across desktop/mobile, light/dark, both site languages, three presentations, actual downloads, clipboard values, navigation and transparent small marks. All six final source snapshots match the files being published. A shared Palette fix deduplicates identical descriptors and gives remaining swatches distinct React keys; the affected directory and palette checks passed with zero current warnings. Default order remains DreamRO → InfoSpace → signoff.now. The tools filter also includes animal projects and is a separate order.

Asset/profile generation, asset integrity, TypeScript, full Biome and isolation checks passed. The asset archive now verifies 70 source checksums, 420 derivatives, 55 current/historical public archives and 93 frozen finishing passes. The 92 unit tests passed with all coverage dimensions above 98%; normal commit, push and CI gates remain enabled.

The owner accepted the visuals, logs and automated checks and explicitly authorized publication and both repository pushes. Hexly follows the automatic `main` deployment workflow; [publication.json](research/infospace-2026-09-09/publication.json) distinguishes the earlier SVG deployment from the new logo rollout. Versions remain InfoSpace `0.1.0` and Hexly `0.5.0`.
