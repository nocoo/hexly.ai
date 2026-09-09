# InfoSpace runtime and README review

Verified on 2026-09-09 at source revision `0d25de0f63e20979fd81c1c295e5bc84132efb3a`. The Native agent performed the runtime checks, the Services agent reviewed and edited both READMEs, and root reviewed the source evidence, both documents, native report and two representative screenshots.

## Runtime

The unmodified repository scripts ran sequentially in a fresh `git archive` copy of that revision. Each process selected `/Applications/Xcode.app/Contents/Developer` through `DEVELOPER_DIR`; the global Xcode selection and original repository caches were unchanged.

Environment: macOS 26.6.2 arm64, Xcode 26.6, Swift 6.3.3, swift-format 6.3.0, SwiftLint 0.65.1, XcodeGen 2.46.0 and Python 3.14.7.

| Command | Outcome |
| --- | --- |
| `./scripts/check.sh` | Exit 0 in 19.332 seconds: version consistency, strict SwiftLint and swift-format, 51 Swift Testing tests, compiled examples and SwiftPM Release executable |
| `./scripts/build.sh -quiet` | Exit 0 in 12.784 seconds: XcodeGen project and native Debug app |
| `python3 scripts/verify-ui.py --output <fresh-directory>` | Exit 0 in 23.836 seconds: all 36 checks and 15 captures passed |

The Debug bundle is `io.github.nocoo.infospace`, version `0.1.0`, build `1`, minimum macOS `26.0`. No version was modified. The [native report](native-report.json) preserves each check and capture result. Root inspected the baseline and minimum-track screenshots; panel boundaries, toolbar and footer were intact, and small panels condensed rather than overlapping the remaining content.

The native runner posts events only to its own application window and inserts text through that process's `NSTextView`. It captures the same window using ScreenCaptureKit. Some dense-layout fixtures also set the model directly. This is not system Accessibility E2E coverage. The Release result is a SwiftPM build, not a notarized or signed distribution check. Geometry timing in the raw report excludes SwiftUI rendering and is not an application performance claim.

The dedicated process exited normally and the two pre-existing app instances remained running. The site's development server was untouched. One input-method diagnostic appeared in the application log; it did not prevent text editing, successful checks or captures.

The full local evidence remains under `/tmp/infospace-runtime-20260909-b6ab8jt8/`: source archive, environment metadata, command logs, result JSON, native bundle and all 15 screenshots. The raw agent report is `/tmp/infospace-runtime-review.md`.

## README review

Both READMEs use the same eight-section order and matching Swift/Bash examples. Local image and document links, heading anchors, command paths and Bash syntax passed static checks. The root uses Chinese and links to `docs/README.en.md`; the English document links back to the root. No independent website was verified.

The text distinguishes the SDK from its sample inbox, progress and schedule views, and explains the host application's responsibility for persistence. It distinguishes `resizeGrid`, which preserves panel identities and reports insufficient capacity, from the demo's `setDimensions`, which removes out-of-bounds panels and fills empty cells. Root checked these claims against `InfoSpaceModel.swift`, `InfoSpaceModel+Spaces.swift`, `InfoSpaceCanvas.swift` and `App/DemoPanelContent.swift`.

The test sections keep core test, SDK consumer compilation and native inspection commands with their prerequisites. They omit fixed test counts, benchmark claims and quality-policy discussion. Swift Package Manager owns the SDK dependency graph; `package.json` is release metadata only. The SDK has no third-party runtime dependencies.

The review retains the original SVG and existing screenshot until the new logo has passed its required raw-image review. Documentation completion is separate from artwork adoption and site deployment.
