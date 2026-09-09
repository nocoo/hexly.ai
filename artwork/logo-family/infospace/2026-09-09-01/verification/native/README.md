# Native adoption verification

Root reviewed the source diff, exact masters, decoded consumers, AppKit comparison and actual Xcode/SwiftPM window captures. The adopted source is [`82f629ed42`](https://github.com/nocoo/infospace/commit/82f629ed42b6ec89dac0e0c79e2a63dec88ecacf), pushed to `main` without changing version `0.1.0`.

## Toolbar repair

The initial `Image(decorative:bundle:)` implementation reserved the expected space but rendered no image. The [offscreen probe](resource-probe/ResourceProbe.swift) reproduced zero nontransparent pixels for the named SwiftUI image against both real build bundles. AppKit's `Bundle.image(forResource:)` preserved the 22/44 px representations and `Image(nsImage:)` rendered 918 nontransparent pixels at 2x in each build. [The comparison](resource-probe/comparison.json) and [complete measurements](resource-probe/renderings/report.json) preserve the results.

Xcode combines the PNG pair into `Contents/Resources/ToolbarMark.tiff`; SwiftPM retains the PNG pair in `InfoSpace_InfoSpaceApp.bundle`. The corrected loader resolves both. The original colors, transparent background, 22 pt frame and parent accessibility label remain intact.

## Actual window checks

| Build | Native checks | Captures | Root visual review |
| --- | --- | --- | --- |
| Xcode Debug app | [36/36](xcode/report.json) | 15/15 | [Toolbar and full window](xcode/01-baseline.png) |
| SwiftPM Debug executable | [36/36](swiftpm/report.json) | 15/15 | [Toolbar and full window](swiftpm/01-baseline.png) |

Strict lint/format, all 51 core tests, compiled consumer examples, SwiftPM Release build and Xcode Debug build passed in a fresh source snapshot. The per-stage JSON files record commands, exit codes and timings. Root verified source-code hashes against that snapshot before committing. The README screenshot is copied from the passing Xcode baseline.

The [pre-fix report](before-toolbar-fix/report.json) had 31/36 passing checks. Its first note edit never acquired an `NSTextView`, causing three dependent note-state failures, and its GitHub action failed. The available evidence does not establish the earlier focus failure's cause. All five checks passed in both final runs with unchanged inspection logic. The separate toolbar-rendering defect was reproduced independently of desktop focus.

All desktop inspection processes exited. [Postflight evidence](postflight.json) verifies the source snapshot and unchanged global Xcode selection. Commands used per-process `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer`; existing app processes were not closed. Root subsequently rebuilt the normal source checkout so its local demo includes the fix.

These checks send native events to a dedicated application's own window and capture it using ScreenCaptureKit. They are not system Accessibility E2E tests or notarized-distribution checks. [The agent's complete handoff](agent-review.md) records its state before root's commit and push.
