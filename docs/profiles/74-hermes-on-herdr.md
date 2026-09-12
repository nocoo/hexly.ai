# 🚪 hermes on herdr

## Profile

- Repository: [nocoo/hermes-on-herdr](https://github.com/nocoo/hermes-on-herdr)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: tools
- Archived repository: No; [repository status evidence](../../docs/sources/hermes-on-herdr-2026-09-12.json)
- English: Run Hermes in Herdr with optional monitoring
- Chinese: 在 Herdr 中运行 Hermes，按需打开监控面板
- Profile section: Recent Projects
- Profile revision: `a8474b5831d2725296ecd54947c81dbef88f3435`
- Repository revision inspected: `49b1e011781fbefc7567349862090f7463aaf2f1`

## Project goal

Run a dedicated Hermes Gateway inside Herdr with explicit lifecycle control, persistent pause intent and JSON diagnostics. A compact startup page opens an optional hqtui monitor for multiple Profiles, with live status, CPU and memory trends.

在 Herdr 内运行专用 Hermes Gateway，提供明确的生命周期控制、持久暂停意图与 JSON 诊断。启动时先显示简洁状态页，按需打开 hqtui 面板，查看多个 Profile 的实时状态、CPU 和内存趋势。

- [中文 README](https://github.com/nocoo/hermes-on-herdr/blob/main/README.md) · [English README](https://github.com/nocoo/hermes-on-herdr/blob/main/docs/README.en.md)
- Verified: 2026-09-12; [source revision](https://github.com/nocoo/hermes-on-herdr/tree/49b1e011781fbefc7567349862090f7463aaf2f1)
- Source files: [`README.md`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/README.md), [`docs/README.en.md`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/docs/README.en.md), [`docs/README.md`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/docs/README.md), [`requirements.txt`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/requirements.txt), [`herdr-plugin.toml`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/herdr-plugin.toml), [`src/hermes_gateway_herdr/config.py`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/src/hermes_gateway_herdr/config.py), [`src/hermes_gateway_herdr/cli.py`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/src/hermes_gateway_herdr/cli.py), [`src/hermes_gateway_herdr/controller.py`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/src/hermes_gateway_herdr/controller.py), [`src/hermes_gateway_herdr/supervisor.py`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/src/hermes_gateway_herdr/supervisor.py), [`src/hermes_gateway_herdr/rpc.py`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/src/hermes_gateway_herdr/rpc.py), [`src/hermes_gateway_herdr/dashboard.py`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/src/hermes_gateway_herdr/dashboard.py), [`src/hermes_gateway_herdr/dashboard_view.py`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/src/hermes_gateway_herdr/dashboard_view.py), [`src/hermes_gateway_herdr/monitor.py`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/src/hermes_gateway_herdr/monitor.py), [`vendor/README.md`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/vendor/README.md), [`tests/run.py`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/tests/run.py), [`examples/README.md`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/examples/README.md), [`docs/12-离线实现与验证.md`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/docs/12-离线实现与验证.md), [`docs/13-cherry接入与验证.md`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/docs/13-cherry接入与验证.md), [`docs/14-hqtui监控面板.md`](https://github.com/nocoo/hermes-on-herdr/blob/49b1e011781fbefc7567349862090f7463aaf2f1/docs/14-hqtui监控面板.md)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Python | Controller, pane supervisor and CLI | Controller、pane supervisor 与命令行 |
| hqtui | Optional responsive terminal dashboard and startup status page | 按需打开的自适应终端监控面板与启动状态页 |
| Unix sockets / JSONL | Bounded Herdr and Hermes control exchanges | 有时限的 Herdr 与 Hermes 控制通信 |
| flock / atomic JSON | Singleton locks, persistent intent and request deduplication | 单例锁、持久意图与请求去重 |
| psutil / PyYAML | Process identity, resource sampling and Profile configuration checks | 进程身份、资源采样与专用 Profile 配置预检 |
| Herdr plugin TOML | Development hooks, actions and pane registration | 开发用 hooks、actions 与 pane 注册 |
| unittest | Isolated process, RPC and terminal interaction tests | 隔离的进程、RPC 与终端交互测试 |

## Current logo

![hermes on herdr source identity](../../public/logos/display/hermes-on-herdr-160.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Brushed-brass gateway with an ajar petrol enamel door, ivory terminal inlay and green status lens
- [Source](https://github.com/nocoo/hermes-on-herdr/blob/f14ddf11bf4ac4912830f0a7259fdd8a769e5a41/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/hermes-gateway-herdr-family-2026-09-11-01-01.png)
- Original dimensions: 2048 × 2048
- Original size: 4337945 bytes
- SHA-256: `ba0a4a0a403d4775ce917290dc528884b0ac6666068ed0148f655777f815d719`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#dfe8ec` | Locally adopted hermes-gateway-herdr presentation 2026-09-11-01/01; background.base in archived settings.json |
| primary | `#2c3f52` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1050, 800); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#b08c5e` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1120, 305); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#e9dcc2` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1100, 1230); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#05560b` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1570, 400); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#7899a9` | Designed independent background motif, 30% opacity; artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/finishing/01/settings.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/hermes-on-herdr#brand).
- [Light lockup](../../public/brands/hermes-on-herdr/v1.0.0/lockup-light.png), [dark lockup](../../public/brands/hermes-on-herdr/v1.0.0/lockup-dark.png), [favicon](../../public/brands/hermes-on-herdr/v1.0.0/favicon.ico).
- [Complete usage and integration guide](../../public/brands/hermes-on-herdr/v1.0.0/guide.md), [standalone specimens](../../public/brands/hermes-on-herdr/v1.0.0/review.html), [all exports and SHA-256](../../public/brands/hermes-on-herdr/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Brushed-brass gateway with an ajar petrol enamel door, ivory terminal inlay and green status lens.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥189px wide; lockup ≥199px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 189px，组合至少 199px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![hermes on herdr refined preview](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-11.
- Study `2026-09-11-01`, finishing `01`
- Refined subject: Brushed-brass gateway with an ajar petrol enamel door, ivory terminal inlay and green status lens
- Site path: `/projects/hermes-on-herdr#brand`; [local gallery](https://index.dev.hexly.ai/projects/hermes-on-herdr#brand)
- [Static review HTML](../../artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/hermes-gateway-herdr/2026-09-11-01)
- [Transparent foreground](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/transparent.png); SHA-256: `ba0a4a0a403d4775ce917290dc528884b0ac6666068ed0148f655777f815d719`
- [Square icon](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/icon.png), [rounded icon](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/rounded.png), [white version](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/white.png)
- [Untouched generation](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/raw.png), [exact prompt](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/prompt.txt), [public asset checksums](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/manifest.json)
- [Previous original](../../public/logos/emoji/hermes-gateway-herdr.png), copied from [its immutable source](https://github.com/nocoo/nocoo/blob/4a0c394a79c8f4d24a11f8d9907d5c797e6b7718/README.md)
- Previous SHA-256: `df84f29fc92535512e00cef39272d782a7b9a7f588f104fb85d5383720e6e3a5`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#dfe8ec` | Locally adopted hermes-gateway-herdr presentation 2026-09-11-01/01; background.base in archived settings.json |
| primary | `#2c3f52` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1050, 800); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#b08c5e` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1120, 305); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#e9dcc2` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1100, 1230); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#05560b` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1570, 400); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#7899a9` | Designed independent background motif, 30% opacity; artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/finishing/01/settings.json |

### A door held open

The substantial frame and slightly open door read as one compact gateway. Both hinges, the status lens and complete feet remain visible, with 205.5 px clearance from the rounded outline.

厚实门框与微开的门扉形成紧凑整体。两枚铰链、状态灯和完整支脚均保留，距圆角边界最近为 205.5 px。

### Brass, enamel and a prompt

Brushed brass surrounds petrol-blue enamel with an opaque ivory terminal inlay. The green lens keeps its contained glass highlight; the real opening is transparent and every opaque extracted native pixel retains its RGB.

拉丝黄铜包围深蓝珐琅门面，象牙色终端嵌字保持不透明。绿色镜片保留内部玻璃高光，真实门洞透明，提取后所有不透明原生像素的 RGB 均不变。

### Paired panes and a return route

Unequal pane outlines and one returning route form a shallow relief on pale blue-gray paper. Paper, grain and projected shadow are independent layers; these designed colors do not imply an existing website theme.

大小不同的窗格与一条回程线路在浅蓝灰纸面形成浅浮纹。纸底、颗粒与投影各自独立，这套设计配色不代表已有的网站主题。

Small-size observation: At 128/64 px, the brass frame, enamel door and terminal prompt remain readable. At 32/24/16 px, the door silhouette and brass-blue contrast carry recognition; hinges, lens and inlay detail merge. Sidebar and browser specimens demonstrate scale; the source currently supplies a CLI and development manifest.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
