# 🔔 Codo

## Profile

- Repository: [nocoo/codo](https://github.com/nocoo/codo)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: tools
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A quiet macOS notification bridge between your AI agents and your desktop.
- Chinese: 连接 AI 智能体与桌面的 macOS 通知桥梁，支持菜单栏服务和命令行。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a`

## Project goal

Deliver local script and Claude Code events as Mac desktop banners, keep project and session history, and optionally summarize notifications with an AI Guardian.

将本地脚本和 Claude Code 事件显示为 Mac 桌面横幅，保存项目与会话记录，并按需使用 AI Guardian 整理通知。

- [中文 README](https://github.com/nocoo/codo/blob/main/README.md) · [English README](https://github.com/nocoo/codo/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/codo/tree/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a)
- Source files: [`Package.swift`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/Package.swift), [`cli/codo.ts`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/cli/codo.ts), [`guardian/package.json`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/guardian/package.json), [`guardian/classifier.ts`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/guardian/classifier.ts), [`guardian/llm.ts`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/guardian/llm.ts), [`Sources/Codo/AppDelegate.swift`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/Sources/Codo/AppDelegate.swift), [`Sources/Codo/BannerProvider.swift`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/Sources/Codo/BannerProvider.swift), [`Sources/Codo/GuardianPathResolver.swift`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/Sources/Codo/GuardianPathResolver.swift), [`Sources/CodoCore/EventStore.swift`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/Sources/CodoCore/EventStore.swift), [`Sources/CodoCore/GuardianSettings.swift`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/Sources/CodoCore/GuardianSettings.swift), [`hooks/claude-hook.sh`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/hooks/claude-hook.sh), [`scripts/build.sh`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/scripts/build.sh), [`scripts/install.sh`](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/scripts/install.sh)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Swift / SwiftUI | Menu bar app and Dashboard | 菜单栏应用与控制台 |
| AppKit | Custom desktop banners | 桌面自绘横幅 |
| TypeScript / Bun | CLI and Guardian process | 命令行与 Guardian 进程 |
| Unix sockets | Local event delivery | 本地事件传输 |
| SQLite / Keychain | Event storage and API keys | 事件存储与 API key |
| Anthropic / OpenAI SDKs | Optional notification summaries | 可选的通知摘要 |

## Current logo

![Codo source identity](../../public/logos/display/codo-160.webp)

- Type: Original project artwork, copied without modification
- Subject: Vivid faceted hummingbird hovering at one coral bell flower
- [Source](https://github.com/nocoo/codo/blob/c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/codo-family-2026-09-07-01-01.png)
- Original dimensions: 2048 × 2048
- Original size: 1902979 bytes
- SHA-256: `67456a5040ec217dd179bdc54f81f9c71ea44908ea7b25a2e9064e386b2607cf`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#349078` | Native codo 76ffd623644d, sampled sRGB pixel (828, 1414); artwork/logo-family/codo/2026-09-07-01/palette.json |
| background | `transparent` | Preserved project artwork, transparent background |
| accent | `#247185` | Native codo 76ffd623644d, sampled sRGB pixel (663, 1350); artwork/logo-family/codo/2026-09-07-01/palette.json |
| accent | `#764395` | Native codo 76ffd623644d, sampled sRGB pixel (645, 1616); artwork/logo-family/codo/2026-09-07-01/palette.json |
| accent | `#e8675e` | Native codo 76ffd623644d, sampled sRGB pixel (1773, 846); artwork/logo-family/codo/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Refined identity

![Codo refined preview](../../public/logos/family/codo/2026-09-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `01`
- Refined subject: Vivid faceted hummingbird hovering at one coral bell flower
- Site path: `/logos/codo`; [local gallery](https://index.dev.hexly.ai/logos/codo)
- [Static review HTML](../../artwork/logo-family/codo/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/codo/2026-09-07-01)
- [Transparent foreground](../../public/logos/family/codo/2026-09-07-01/01/transparent.png); SHA-256: `67456a5040ec217dd179bdc54f81f9c71ea44908ea7b25a2e9064e386b2607cf`
- [Square icon](../../public/logos/family/codo/2026-09-07-01/01/icon.png), [rounded icon](../../public/logos/family/codo/2026-09-07-01/01/rounded.png), [white version](../../public/logos/family/codo/2026-09-07-01/01/white.png)
- [Untouched generation](../../public/logos/family/codo/2026-09-07-01/01/raw.png), [exact prompt](../../public/logos/family/codo/2026-09-07-01/01/prompt.txt), [public asset checksums](../../public/logos/family/codo/2026-09-07-01/01/manifest.json)
- [Previous original](../../public/logos/originals/codo.png), copied from [its immutable source](https://github.com/nocoo/codo/blob/66df73c4141f3e01a89fd6693f574d1d75fc5e4a/logo.png)
- Previous SHA-256: `d078deff35f8dfc10b8b7192ab3ec8f6603de460ae1a3d3d632731281e62bc74`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#5f8988` | Selected Codo presentation, 2026-09-07-01/01; background.base in archived settings.json |
| primary | `#349078` | Native codo 76ffd623644d, sampled sRGB pixel (828, 1414); artwork/logo-family/codo/2026-09-07-01/palette.json |
| accent | `#247185` | Native codo 76ffd623644d, sampled sRGB pixel (663, 1350); artwork/logo-family/codo/2026-09-07-01/palette.json |
| accent | `#764395` | Native codo 76ffd623644d, sampled sRGB pixel (645, 1616); artwork/logo-family/codo/2026-09-07-01/palette.json |
| accent | `#e8675e` | Native codo 76ffd623644d, sampled sRGB pixel (1773, 846); artwork/logo-family/codo/2026-09-07-01/palette.json |
| accent | `#ddb048` | Native codo 76ffd623644d, sampled sRGB pixel (1121, 1132); artwork/logo-family/codo/2026-09-07-01/palette.json |

### A hover caught in time

A complete hummingbird pauses with its beak at one bell flower. Both wings, the tail and small feet remain visible with generous corner clearance.

完整的小蜂鸟将鸟喙停在一朵钟形花旁，双翼、尾羽和小脚都清晰可见，并为圆角留足空间。

### Emerald, then a flash of color

The owner requested vivid colors: emerald and teal lead, with violet wings, coral and gold on the breast, and one flower beside the beak. Connected facets keep the bird readable.

依照本轮鲜明色彩的要求，以翡翠绿和青色为主，配紫色翼面、珊瑚与金色胸羽及一朵小花。相连切面维持蜂鸟的清晰轮廓。

### Petal pockets

Large unequal petal impressions curl through a muted teal field. Soft grain and a shallow shadow keep the richly colored wings distinct.

大小不一的花瓣压纹弯过柔和青色底纹，细颗粒与浅阴影让丰富翼色保持分明。

Small-size observation: The complete animal and accessory have at least 149.94 px clearance from the actual rounded outline. Ten export sizes preserve one uniform placement. Small app/browser marks use the transparent foreground; fine facets and accessory details simplify at 16 px.

## Further refinements

Keep this asset as the phase-one baseline. A future family version should use a recognizable animal, one principal hue, and restrained multicolored geometric fragments.

Use head portraits for large animals and optionally full-body poses for small animals. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. Preserve this reviewed composition and its archived predecessors.
