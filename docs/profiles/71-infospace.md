# 🗂️ Info Space

## Profile

- Repository: [nocoo/infospace](https://github.com/nocoo/infospace)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: tools
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: Native SwiftUI workspace SDK with resizable grids and customizable information panels
- Chinese: 原生 SwiftUI 工作区 SDK，支持可调整的网格和自定义信息面板
- Profile section: Recent Projects
- Profile revision: `e3e92cf41ced9400940b18904f1c97453f3b5903`
- Repository revision inspected: `0d25de0f63e20979fd81c1c295e5bc84132efb3a`

## Project goal

Give macOS app developers a reusable SwiftUI workspace for arranging their own content in resizable panels. The SDK handles grid geometry, snapping and panel identity; the included demo shows the interactions with sample content kept only for the current session.

为 macOS 应用开发者提供可复用的 SwiftUI 工作区，把自己的内容放进可调整大小的面板。SDK 处理网格几何、吸附与面板身份；附带演示应用展示这些交互，示例内容仅在本次运行中保留。

- [中文 README](https://github.com/nocoo/infospace/blob/main/README.md) · [English README](https://github.com/nocoo/infospace/blob/main/docs/README.en.md)
- Verified: 2026-09-09; [source revision](https://github.com/nocoo/infospace/tree/0d25de0f63e20979fd81c1c295e5bc84132efb3a)
- Source files: [`Package.swift`](https://github.com/nocoo/infospace/blob/0d25de0f63e20979fd81c1c295e5bc84132efb3a/Package.swift), [`project.yml`](https://github.com/nocoo/infospace/blob/0d25de0f63e20979fd81c1c295e5bc84132efb3a/project.yml), [`Sources/InfoSpaceCore/InfoSpaceModel.swift`](https://github.com/nocoo/infospace/blob/0d25de0f63e20979fd81c1c295e5bc84132efb3a/Sources/InfoSpaceCore/InfoSpaceModel.swift), [`Sources/InfoSpaceUI/InfoSpaceCanvas.swift`](https://github.com/nocoo/infospace/blob/0d25de0f63e20979fd81c1c295e5bc84132efb3a/Sources/InfoSpaceUI/InfoSpaceCanvas.swift), [`Sources/InfoSpaceUI/InfoSpaceWindow.swift`](https://github.com/nocoo/infospace/blob/0d25de0f63e20979fd81c1c295e5bc84132efb3a/Sources/InfoSpaceUI/InfoSpaceWindow.swift), [`Sources/InfoSpaceUI/NativeWindowAttachment.swift`](https://github.com/nocoo/infospace/blob/0d25de0f63e20979fd81c1c295e5bc84132efb3a/Sources/InfoSpaceUI/NativeWindowAttachment.swift), [`Sources/InfoSpaceUI/InfoSpaceWorkspace.swift`](https://github.com/nocoo/infospace/blob/0d25de0f63e20979fd81c1c295e5bc84132efb3a/Sources/InfoSpaceUI/InfoSpaceWorkspace.swift), [`App/DemoPanelContent.swift`](https://github.com/nocoo/infospace/blob/0d25de0f63e20979fd81c1c295e5bc84132efb3a/App/DemoPanelContent.swift), [`scripts/check.sh`](https://github.com/nocoo/infospace/blob/0d25de0f63e20979fd81c1c295e5bc84132efb3a/scripts/check.sh)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Swift | SDK and demo implementation with strict concurrency | SDK 与演示应用，启用严格并发检查 |
| SwiftUI | Reusable canvas, panels and workspace controls | 可复用画布、面板与工作区控件 |
| AppKit | Native macOS window integration | macOS 原生窗口集成 |
| Observation | Observable layout and panel state | 可观察的布局与面板状态 |
| Swift Package Manager | Core/UI libraries and compiled SDK examples | Core/UI 库与 SDK 示例编译 |
| XcodeGen | Generate the native demo app project | 生成原生演示应用工程 |
| Swift Testing | Layout, identity and geometry tests | 布局、身份与几何测试 |

## Current logo

![Info Space source identity](../../public/logos/display/infospace-160.webp)

- Type: Original project artwork, copied without modification
- Subject: Four colored information panels in a rounded grid
- [Source](https://github.com/nocoo/infospace/blob/0d25de0f63e20979fd81c1c295e5bc84132efb3a/logo.svg): `logo.svg`
- [Preserved asset](../../public/logos/originals/infospace.svg)
- Original dimensions: 128 × 128
- Original size: 503 bytes
- SHA-256: `7540789c41a74c8553af6fe38b23aa3784753259038ff93dc8e7797f17582d03`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#ffffff` | Sources/InfoSpaceUI/InfoSpaceStyle.swift: InfoSpaceTheme.dark.accent = .white |
| background | `#13161c` | Sources/InfoSpaceUI/InfoSpaceStyle.swift: InfoSpaceTheme.dark.background, sRGB (0.075, 0.085, 0.11), rounded to 8-bit channels |
| accent | `#94a3ff` | logo.svg at 0d25de0f63e20979fd81c1c295e5bc84132efb3a: indigo panel fill |
| accent | `#75c2ab` | logo.svg at 0d25de0f63e20979fd81c1c295e5bc84132efb3a: green panel fill |
| accent | `#e69970` | logo.svg at 0d25de0f63e20979fd81c1c295e5bc84132efb3a: terracotta panel fill |
| accent | `#ba96e3` | logo.svg at 0d25de0f63e20979fd81c1c295e5bc84132efb3a: lilac panel fill |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Future family notes

Keep the current source mark and its provenance. For a future study, choose a recognizable physical object from the tool's actual function and follow the owner's material and composition direction. An animal or fragmented drawing is not required.

Keep the complete object uniformly inset from the actual rounded outline, with backgrounds, projected shadows and any external emission separate from the transparent foreground. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. No new logo is generated in phase one.
