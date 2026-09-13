# 🦉 Owl

## Profile

- Repository: [nocoo/owl](https://github.com/nocoo/owl)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: tools
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A macOS menu bar lookout that spots unusual patterns in your system logs.
- Chinese: 守在 macOS 菜单栏里的观察员，从系统日志中发现异常信号。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `e1c69addb656e8907a8828001e1f5c103f3b9fbf`

## Project goal

Inspect Mac system metrics and processes from the menu bar, and detect recurring crashes, resource pressure, sleep problems, and device anomalies locally.

在菜单栏查看 Mac 系统指标与进程，在本机发现反复崩溃、资源压力、睡眠和设备异常。

- [中文 README](https://github.com/nocoo/owl/blob/main/README.md) · [English README](https://github.com/nocoo/owl/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/owl/tree/e1c69addb656e8907a8828001e1f5c103f3b9fbf)
- Source files: [`Package.swift`](https://github.com/nocoo/owl/blob/e1c69addb656e8907a8828001e1f5c103f3b9fbf/Package.swift), [`Sources/Owl/OwlApp.swift`](https://github.com/nocoo/owl/blob/e1c69addb656e8907a8828001e1f5c103f3b9fbf/Sources/Owl/OwlApp.swift), [`Sources/Owl/OwlEngine.swift`](https://github.com/nocoo/owl/blob/e1c69addb656e8907a8828001e1f5c103f3b9fbf/Sources/Owl/OwlEngine.swift), [`Sources/Owl/OwlNotifications.swift`](https://github.com/nocoo/owl/blob/e1c69addb656e8907a8828001e1f5c103f3b9fbf/Sources/Owl/OwlNotifications.swift), [`Sources/OwlCore/Patterns/PatternCatalog.swift`](https://github.com/nocoo/owl/blob/e1c69addb656e8907a8828001e1f5c103f3b9fbf/Sources/OwlCore/Patterns/PatternCatalog.swift), [`Sources/OwlCore/Patterns/MetricsCatalog.swift`](https://github.com/nocoo/owl/blob/e1c69addb656e8907a8828001e1f5c103f3b9fbf/Sources/OwlCore/Patterns/MetricsCatalog.swift), [`Sources/OwlCore/Services/SystemMetricsPoller.swift`](https://github.com/nocoo/owl/blob/e1c69addb656e8907a8828001e1f5c103f3b9fbf/Sources/OwlCore/Services/SystemMetricsPoller.swift), [`Sources/OwlCore/Services/HIDTemperatureProvider.swift`](https://github.com/nocoo/owl/blob/e1c69addb656e8907a8828001e1f5c103f3b9fbf/Sources/OwlCore/Services/HIDTemperatureProvider.swift), [`Sources/OwlCore/Pipeline/AlertStateManager.swift`](https://github.com/nocoo/owl/blob/e1c69addb656e8907a8828001e1f5c103f3b9fbf/Sources/OwlCore/Pipeline/AlertStateManager.swift), [`Sources/OwlCore/Settings/AppSettings.swift`](https://github.com/nocoo/owl/blob/e1c69addb656e8907a8828001e1f5c103f3b9fbf/Sources/OwlCore/Settings/AppSettings.swift), [`scripts/build.sh`](https://github.com/nocoo/owl/blob/e1c69addb656e8907a8828001e1f5c103f3b9fbf/scripts/build.sh)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Swift / Swift Concurrency | Local collection and detection logic | 本地采集与检测逻辑 |
| SwiftUI / AppKit | Menu bar, metrics and settings UI | 菜单栏、指标与设置界面 |
| macOS Unified Logging | System event stream | 系统事件日志流 |
| IOKit / Mach / libproc | Hardware and process metrics | 硬件与进程指标 |
| Objective-C / IOHID | Apple Silicon thermal sensors | Apple Silicon 温度传感器 |
| UserDefaults | Local preferences | 本地偏好设置 |
| Swift Testing | Unit and pipeline integration tests | 单元与检测管道集成测试 |

## Current logo

![Owl source identity](https://h.no.mt/projects/owl/identity/v1.0.0/owl-160-ea74818683bf.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Compact tawny owl holding one multicolored feather
- [Source](https://github.com/nocoo/owl/blob/e1c69addb656e8907a8828001e1f5c103f3b9fbf/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/owl/identity/v1.0.0/owl-family-2026-09-07-01-01-c0a00da0eaad.png)
- Original dimensions: 2048 × 2048
- Original size: 2973160 bytes
- SHA-256: `c0a00da0eaadabc6ca5d88210ccbcbbbcedc6cb6465f0976980c30f9e6e7e0a8`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#93816a` | Native owl 6638f897f718, sampled sRGB pixel (1030, 752); artwork/logo-family/owl/2026-09-07-01/palette.json |
| background | `transparent` | Preserved project artwork, transparent background |
| accent | `#e5cfab` | Native owl 6638f897f718, sampled sRGB pixel (1214, 844); artwork/logo-family/owl/2026-09-07-01/palette.json |
| accent | `#cd8523` | Native owl 6638f897f718, sampled sRGB pixel (1005, 598); artwork/logo-family/owl/2026-09-07-01/palette.json |
| accent | `#dc8470` | Native owl 6638f897f718, sampled sRGB pixel (1329, 979); artwork/logo-family/owl/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/owl#brand).
- [Light lockup](https://h.no.mt/brands/owl/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/owl/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/owl/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/owl/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/owl/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/owl/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Compact tawny owl holding one multicolored feather.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥44px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 44px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Owl refined preview](https://h.no.mt/logos/family/owl/2026-09-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `01`
- Refined subject: Compact tawny owl holding one multicolored feather
- Site path: `/projects/owl#brand`; [local gallery](https://index.dev.hexly.ai/projects/owl#brand)
- [Static review HTML](../../artwork/logo-family/owl/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/owl/2026-09-07-01)
- [Transparent foreground](https://h.no.mt/logos/family/owl/2026-09-07-01/01/transparent.png); SHA-256: `c0a00da0eaadabc6ca5d88210ccbcbbbcedc6cb6465f0976980c30f9e6e7e0a8`
- [Square icon](https://h.no.mt/logos/family/owl/2026-09-07-01/01/icon.png), [rounded icon](https://h.no.mt/logos/family/owl/2026-09-07-01/01/rounded.png), [white version](https://h.no.mt/logos/family/owl/2026-09-07-01/01/white.png)
- [Untouched generation](https://h.no.mt/logos/family/owl/2026-09-07-01/01/raw.png), [exact prompt](https://h.no.mt/logos/family/owl/2026-09-07-01/01/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/owl/2026-09-07-01/01/manifest.json)
- [Previous original](https://h.no.mt/shared/site/v1.0.0/owl-f579214edd88.png), copied from [its immutable source](https://github.com/nocoo/owl/blob/73c292ea59ed8ccaf8dfd1e6d1d57f80e8be7ed3/owl.png)
- Previous SHA-256: `f579214edd8876dacaa55d27c35c3598d3f809e651e4d3537d6d228823b5f413`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#5f6684` | Selected Owl presentation, 2026-09-07-01/01; background.base in archived settings.json |
| primary | `#93816a` | Native owl 6638f897f718, sampled sRGB pixel (1030, 752); artwork/logo-family/owl/2026-09-07-01/palette.json |
| accent | `#e5cfab` | Native owl 6638f897f718, sampled sRGB pixel (1214, 844); artwork/logo-family/owl/2026-09-07-01/palette.json |
| accent | `#cd8523` | Native owl 6638f897f718, sampled sRGB pixel (1005, 598); artwork/logo-family/owl/2026-09-07-01/palette.json |
| accent | `#dc8470` | Native owl 6638f897f718, sampled sRGB pixel (1329, 979); artwork/logo-family/owl/2026-09-07-01/palette.json |
| accent | `#844c6e` | Native owl 6638f897f718, sampled sRGB pixel (1691, 931); artwork/logo-family/owl/2026-09-07-01/palette.json |

### A feather caught mid-turn

A compact whole owl tilts its head, with both eyes, folded wings and every talon visible. One feather extends from the beak into the surrounding space.

完整的小猫头鹰微微侧头，双眼、折叠双翼和脚爪清晰可见。一根羽毛从喙边伸向留白。

### Tawny, cream, amber

Broad neutral facets organize the plumage. Cream facial discs and amber eyes preserve recognition; the feather is the only multicolored accessory.

大块中性色切面组织羽毛，奶油色面盘与琥珀眼睛保持辨识度，羽毛是唯一的多彩配件。

### A quiet night aperture

Interrupted crescent steps and offset notches form a smoky-blue observatory field. The pattern stays distinct from feather stripes and light orbits.

中断的弧形台阶与错位缺口构成烟蓝色夜间窗口，几何形态与羽毛条纹和光线轨道不同。

Small-size observation: The complete bird and feather have at least 193.5 px of rounded-edge clearance. The native popover uses a transparent 22 pt mark; macOS app icons use a separate rounded tile with a platform inset. Browser specimens demonstrate the identity at small sizes.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
