# 🧭 Deca

## Profile

- Repository: [nocoo/deca](https://github.com/nocoo/deca)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: ai
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A local-first Mac gateway that brings AI agents to Discord, the terminal, and HTTP.
- Chinese: 优先在本地运行的 Mac AI 智能体网关，连接 Discord、终端与 HTTP。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `1f41b41255b7184c307cb13693e94a6f45bbb9e1`

## Project goal

Use a locally hosted personal agent through Discord, a terminal, or HTTP to work with files, commands, remembered context, and scheduled tasks.

通过 Discord、终端或 HTTP 使用本机运行的个人 Agent，处理文件、命令、已有记忆和定时任务。

- [中文 README](https://github.com/nocoo/deca/blob/main/README.md) · [English README](https://github.com/nocoo/deca/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/deca/tree/37911d4cdf1c242c50c5d48d890a0e041c486d8b)
- Source files: [`package.json`](https://github.com/nocoo/deca/blob/37911d4cdf1c242c50c5d48d890a0e041c486d8b/package.json), [`packages/gateway/cli.ts`](https://github.com/nocoo/deca/blob/37911d4cdf1c242c50c5d48d890a0e041c486d8b/packages/gateway/cli.ts), [`packages/gateway/serve.ts`](https://github.com/nocoo/deca/blob/37911d4cdf1c242c50c5d48d890a0e041c486d8b/packages/gateway/serve.ts), [`packages/gateway/src/gateway.ts`](https://github.com/nocoo/deca/blob/37911d4cdf1c242c50c5d48d890a0e041c486d8b/packages/gateway/src/gateway.ts), [`packages/gateway/src/adapter.ts`](https://github.com/nocoo/deca/blob/37911d4cdf1c242c50c5d48d890a0e041c486d8b/packages/gateway/src/adapter.ts), [`packages/agent/src/core/agent.ts`](https://github.com/nocoo/deca/blob/37911d4cdf1c242c50c5d48d890a0e041c486d8b/packages/agent/src/core/agent.ts), [`packages/agent/src/core/session.ts`](https://github.com/nocoo/deca/blob/37911d4cdf1c242c50c5d48d890a0e041c486d8b/packages/agent/src/core/session.ts), [`packages/agent/src/core/memory.ts`](https://github.com/nocoo/deca/blob/37911d4cdf1c242c50c5d48d890a0e041c486d8b/packages/agent/src/core/memory.ts), [`packages/agent/src/tools/builtin.ts`](https://github.com/nocoo/deca/blob/37911d4cdf1c242c50c5d48d890a0e041c486d8b/packages/agent/src/tools/builtin.ts), [`packages/storage/src/provider.ts`](https://github.com/nocoo/deca/blob/37911d4cdf1c242c50c5d48d890a0e041c486d8b/packages/storage/src/provider.ts), [`packages/storage/src/types.ts`](https://github.com/nocoo/deca/blob/37911d4cdf1c242c50c5d48d890a0e041c486d8b/packages/storage/src/types.ts), [`packages/http/src/server.ts`](https://github.com/nocoo/deca/blob/37911d4cdf1c242c50c5d48d890a0e041c486d8b/packages/http/src/server.ts)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Bun / TypeScript | Local agent and workspaces | 本地 Agent 与工作区 |
| Anthropic SDK | Model calls and tool protocol | 模型调用与工具协议 |
| Hono | HTTP channel | HTTP 通道 |
| discord.js | Discord bot channel | Discord 机器人通道 |
| p-queue | Gateway request dispatch | Gateway 请求调度 |
| JSONL / JSON / Markdown | Sessions, configuration and context files | 会话、配置与上下文文件 |

## Current logo

![Deca source identity](../../public/logos/display/deca-160.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: A midnight teal rotary desk telephone
- [Source](https://github.com/nocoo/deca/blob/1f41b41255b7184c307cb13693e94a6f45bbb9e1/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/deca-family-2026-09-07-01-01.png)
- Original dimensions: 2048 × 2048
- Original size: 3665035 bytes
- SHA-256: `329bb7b41d8eac9909d35cba76f04a0e2786a702f328f2e7ccf7e8dbde478262`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#1c323c` | Native deca 5be6d36eea83, sampled sRGB pixel (1240, 1212); artwork/logo-family/deca/2026-09-07-01/palette.json |
| background | `#c2ced6` | Adopted Deca presentation, 2026-09-07-01/01; background.base in archived settings.json |
| accent | `#decca0` | Native deca 5be6d36eea83, sampled sRGB pixel (1097, 1096); artwork/logo-family/deca/2026-09-07-01/palette.json |
| accent | `#827159` | Native deca 5be6d36eea83, sampled sRGB pixel (1579, 763); artwork/logo-family/deca/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/deca#brand).
- [Light lockup](../../public/brands/deca/v1.0.0/lockup-light.png), [dark lockup](../../public/brands/deca/v1.0.0/lockup-dark.png), [favicon](../../public/brands/deca/v1.0.0/favicon.ico).
- [Complete usage and integration guide](../../public/brands/deca/v1.0.0/guide.md), [standalone specimens](../../public/brands/deca/v1.0.0/review.html), [all exports and SHA-256](../../public/brands/deca/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Midnight teal rotary desk telephone.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥63px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 63px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Deca refined preview](../../public/logos/family/deca/2026-09-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `01`
- Refined subject: A midnight teal rotary desk telephone
- Site path: `/projects/deca#brand`; [local gallery](https://index.dev.hexly.ai/projects/deca#brand)
- [Static review HTML](../../artwork/logo-family/deca/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/deca/2026-09-07-01)
- [Transparent foreground](../../public/logos/family/deca/2026-09-07-01/01/transparent.png); SHA-256: `329bb7b41d8eac9909d35cba76f04a0e2786a702f328f2e7ccf7e8dbde478262`
- [Square icon](../../public/logos/family/deca/2026-09-07-01/01/icon.png), [rounded icon](../../public/logos/family/deca/2026-09-07-01/01/rounded.png), [white version](../../public/logos/family/deca/2026-09-07-01/01/white.png)
- [Untouched generation](../../public/logos/family/deca/2026-09-07-01/01/raw.png), [exact prompt](../../public/logos/family/deca/2026-09-07-01/01/prompt.txt), [public asset checksums](../../public/logos/family/deca/2026-09-07-01/01/manifest.json)
- [Previous original](../../public/logos/emoji/deca.png), copied from [its immutable source](https://github.com/nocoo/nocoo/blob/9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6/README.md)
- Previous SHA-256: `ef59f1bbd11d6a19cc223a6857ca5b4cb56567de1b225677f45331fb3895eb69`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#c2ced6` | Adopted Deca presentation, 2026-09-07-01/01; background.base in archived settings.json |
| primary | `#1c323c` | Native deca 5be6d36eea83, sampled sRGB pixel (1240, 1212); artwork/logo-family/deca/2026-09-07-01/palette.json |
| accent | `#decca0` | Native deca 5be6d36eea83, sampled sRGB pixel (1097, 1096); artwork/logo-family/deca/2026-09-07-01/palette.json |
| accent | `#827159` | Native deca 5be6d36eea83, sampled sRGB pixel (1579, 763); artwork/logo-family/deca/2026-09-07-01/palette.json |

### The receiver settles

A complete receiver rests on a broad rotary telephone, with a short coil gathered closely to the body. The familiar physical device represents a local agent gateway and its channels.

完整听筒落在宽阔转盘电话上，短卷线紧靠机身；熟悉的实体设备呼应本地 Agent 网关及多种通信通道。

### Midnight Bakelite

Deep teal Bakelite, an ivory rotary dial and fine brass seams make a calm premium object. The cable-loop background is removed while real dark dial recesses stay intact.

深青蓝胶木、象牙色转盘与黄铜细接缝构成沉稳实物。线圈环内去除背景，转盘真实暗部凹孔保留。

### Switchboard paths

Three rounded switchboard routing paths with discrete paired terminals in cool blue-gray paper. The field, grain and contact shadow are independent of transparent app marks.

蓝灰纸面上的三条圆润总机接线与成对终端。 底色、颗粒与接触阴影均独立于透明应用标记。

Small-size observation: At 128/64 px, the receiver silhouette and ivory rotary dial remain clear. At 32/24/16 px, the compact silhouette and dominant colors carry recognition; fine material detail, printed marks and background lines naturally merge.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
