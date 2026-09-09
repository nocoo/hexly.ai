# InfoSpace toolbar resource fix

## Confirmed cause

The PNG artwork is present and valid. In the supplied Xcode build, Xcode combines `ToolbarMark.png` and `ToolbarMark@2x.png` into `Contents/Resources/ToolbarMark.tiff`; SwiftPM preserves the two loose PNGs.

A standalone, offscreen SwiftUI `ImageRenderer` probe against both real bundles reproduced the missing mark. `Image(decorative: "ToolbarMark", bundle: bundle)` rendered a 44 × 44 image with zero nontransparent pixels in both modes. Adding the TIFF extension did not fix that path.

`bundle.image(forResource: NSImage.Name("ToolbarMark"))` correctly resolved both formats and loaded both 22 × 22 and 44 × 44 representations at a common 22 pt logical size. `Image(nsImage:)` rendered 918 nontransparent pixels at 2x in both modes. Loading only the 22 px PNG explicitly would lose the Retina representation; the AppKit bundle loader preserves it.

## Source fix

- `App/AppResources.swift`: cache the AppKit-loaded toolbar NSImage on the main actor.
- `App/WorkspaceToolbar.swift`: render that NSImage with original colors and mark it decorative for accessibility; retain the existing outer 22 pt frame and parent “Info Space” accessible label.

No resource configuration, brand artwork, README, version, SDK source or existing inspection logic was changed in this fix. No commit or push was performed.

## Focused probe

- Probe source: `/tmp/infospace-toolbar-probe-20260909-z057v2ig/ResourceProbe.swift`
- Compiled executable: `/tmp/infospace-toolbar-probe-20260909-z057v2ig/resource-probe`
- Full real-bundle findings: `/tmp/infospace-toolbar-probe-20260909-z057v2ig/before/report.json`
- Named SwiftUI and loaded NSImage renderings: `/tmp/infospace-toolbar-probe-20260909-z057v2ig/before/*.png`
- Render comparison: `/tmp/infospace-toolbar-probe-20260909-z057v2ig/comparison.json`

The probe uses an application with activation policy `.prohibited`, creates no native window and does not interact with the desktop. It verifies actual decoded and rendered pixels, not only successful compilation.

## Source snapshot and earlier failures

A clean source snapshot including this fix is at `/tmp/infospace-toolbar-fix-20260909-nraltl8j/source`. Its manifest records hashes for all 77 source files. Existing source checks, an independent Xcode build and sequential native inspections for Xcode/SwiftPM all completed there; the owner’s source caches and existing processes are not used.

The earlier 31/36 report has one failed GitHub activation and a failed initial note edit with diagnostic `not-NSTextView`; the other three note failures depend on that initial edit. This indicates the editor did not become first responder in that run. The available earlier report does not prove why; desktop interference remains a possibility, not an established cause.

## Reproduce the offscreen comparison

```sh
DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer swiftc \
  -swift-version 6 -warnings-as-errors \
  /tmp/infospace-toolbar-probe-20260909-z057v2ig/ResourceProbe.swift \
  -o /tmp/infospace-toolbar-probe-20260909-z057v2ig/resource-probe

/tmp/infospace-toolbar-probe-20260909-z057v2ig/resource-probe \
  /var/folders/hh/5b1tphh13wbg8hj9jj_bxbqr0000gn/T/infospace-logo-check-20260909-nxff9z3z/.build/xcode/Build/Products/Debug/InfoSpace.app \
  /var/folders/hh/5b1tphh13wbg8hj9jj_bxbqr0000gn/T/infospace-logo-check-20260909-nxff9z3z/.build/arm64-apple-macosx/debug/InfoSpace_InfoSpaceApp.bundle \
  /tmp/infospace-toolbar-probe-20260909-z057v2ig/reproduction
```

Choose a new output path for each replay. Both AppKit-rendered PNGs in the recorded comparison have SHA-256 `7df1b7d14c23b78c01c55ef826604863d812af4a10b54ab4eb1079c85cf3aeba`.

## Completed verification

| Stage | Actual result | Elapsed |
| --- | --- | --- |
| `./scripts/check.sh` | Exit 0; strict lint/format, 51 Swift tests, examples and SwiftPM Release build passed | 18.358 s |
| `./scripts/build.sh -quiet` | Exit 0; native Xcode Debug app built | 17.385 s |
| Xcode `scripts/verify-ui.py` | Exit 0; 36/36 checks, 15/15 captures | 24.070 s |
| SwiftPM Debug binary with `--inspect=…` | Exit 0; 36/36 checks, 15/15 captures | 24.475 s |

All commands used process-local `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer`, with no change to global Xcode selection. Logs and per-stage command/timing records are in `/tmp/infospace-toolbar-fix-20260909-nraltl8j/logs/`. SwiftPM inspection uses the small dedicated-process runner `/tmp/infospace-toolbar-fix-20260909-nraltl8j/inspect-swiftpm.py`; it invokes the app's unchanged existing inspection implementation and terminates only its own child.

Actual native baseline screenshots were visually reviewed in both modes. The transparent colored mark is visible at the existing 22 pt toolbar size beside “Info Space”; title, native traffic lights and layout controls retain their positions. These are full running-app window captures, not only the offscreen probe:

- `/tmp/infospace-toolbar-fix-20260909-nraltl8j/inspection-xcode/01-baseline.png`
- `/tmp/infospace-toolbar-fix-20260909-nraltl8j/inspection-swiftpm/01-baseline.png`

Both native runs successfully opened the intercepted GitHub action and inserted the expected Chinese note through `NSTextView`; all dependent state-preservation checks passed. No event/focus inspection code was changed. This clears the current run but does not establish the cause of the earlier input failures.

`postflight.json` confirms that the two source files still match the verified snapshot, the owned inspection processes have exited and global `xcode-select` remains `/Library/Developer/CommandLineTools`. The focused two-file diff from the supplied pre-fix source is saved as `/tmp/infospace-toolbar-fix-20260909-nraltl8j/toolbar-fix.patch`. No owner process was closed; no root source build cache or branding/docs file was modified by this fix.

Native inspection remains in-process native-event coverage rather than system Accessibility E2E. This fix has not been committed or pushed. The current workspace carries the earlier root-owned adoption changes as well as these two corrected source files.
