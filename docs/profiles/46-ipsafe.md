# 🛡️ IPSafe

## Profile

- Repository: [nocoo/ipsafe](https://github.com/nocoo/ipsafe)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: tools
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: Check your network connection before letting a command run.
- Chinese: 在执行命令之前，先确认网络连接符合预期。
- Profile section: CLI Tools
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `d8a28afb9ed85d4f3d1627738415a863f82b3629`

## Project goal

Check that a configured URL returns a successful HTTP response and optionally matches response content before starting a command, with project or user configuration and reusable Node.js APIs.

在启动命令前，确认指定 URL 返回成功响应并按需匹配内容；支持项目或用户配置，以及可复用的 Node.js API。

- [中文 README](https://github.com/nocoo/ipsafe/blob/main/README.md) · [English README](https://github.com/nocoo/ipsafe/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/ipsafe/tree/d8a28afb9ed85d4f3d1627738415a863f82b3629)
- Source files: [`package.json`](https://github.com/nocoo/ipsafe/blob/d8a28afb9ed85d4f3d1627738415a863f82b3629/package.json), [`index.js`](https://github.com/nocoo/ipsafe/blob/d8a28afb9ed85d4f3d1627738415a863f82b3629/index.js), [`bin/ipsafe.js`](https://github.com/nocoo/ipsafe/blob/d8a28afb9ed85d4f3d1627738415a863f82b3629/bin/ipsafe.js), [`lib/ipsafe.js`](https://github.com/nocoo/ipsafe/blob/d8a28afb9ed85d4f3d1627738415a863f82b3629/lib/ipsafe.js), [`lib/check-safe.js`](https://github.com/nocoo/ipsafe/blob/d8a28afb9ed85d4f3d1627738415a863f82b3629/lib/check-safe.js), [`integrations/claude-code.js`](https://github.com/nocoo/ipsafe/blob/d8a28afb9ed85d4f3d1627738415a863f82b3629/integrations/claude-code.js), [`ipsafe.config.json`](https://github.com/nocoo/ipsafe/blob/d8a28afb9ed85d4f3d1627738415a863f82b3629/ipsafe.config.json), [`vitest.config.ts`](https://github.com/nocoo/ipsafe/blob/d8a28afb9ed85d4f3d1627738415a863f82b3629/vitest.config.ts)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| JavaScript / Node.js | CLI and CommonJS API | 命令行与 CommonJS API |
| node:http / node:https | Pre-execution HTTP checks | 执行前 HTTP 检查 |
| node:child_process | Command execution and output | 命令执行与输出 |
| JSON / node:fs | Project and user configuration | 项目与用户配置 |
| Vitest | Unit and simulated CLI tests | 单元与 CLI 模拟测试 |

## Current logo

![IPSafe source identity](https://h.no.mt/projects/ipsafe/identity/v1.0.0/ipsafe-160-fad1a905b228.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: A green network cable tester with a short patch lead
- [Source](https://github.com/nocoo/ipsafe/blob/d8a28afb9ed85d4f3d1627738415a863f82b3629/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/ipsafe/identity/v1.0.0/ipsafe-family-2026-09-07-01-01-1cad3a55e3b0.png)
- Original dimensions: 2048 × 2048
- Original size: 3104822 bytes
- SHA-256: `1cad3a55e3b03e27cc3962351e72026af873120e5dcd0bfb8afe9b5fe65bc75b`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#315040` | Native ipsafe 949f4e0683ee, sampled sRGB pixel (1523, 1416); artwork/logo-family/ipsafe/2026-09-07-01/palette.json |
| background | `#bbd2c7` | Adopted IPSafe presentation, 2026-09-07-01/01; background.base in archived settings.json |
| accent | `#424646` | Native ipsafe 949f4e0683ee, sampled sRGB pixel (1474, 839); artwork/logo-family/ipsafe/2026-09-07-01/palette.json |
| accent | `#dcd1ba` | Native ipsafe 949f4e0683ee, sampled sRGB pixel (926, 316); artwork/logo-family/ipsafe/2026-09-07-01/palette.json |
| accent | `#64de0f` | Native ipsafe 949f4e0683ee, sampled sRGB pixel (1322, 1184); artwork/logo-family/ipsafe/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/ipsafe#brand).
- [Light lockup](https://h.no.mt/brands/ipsafe/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/ipsafe/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/ipsafe/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/ipsafe/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/ipsafe/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/ipsafe/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Green network cable tester with a short patch lead.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥75px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 75px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![IPSafe refined preview](https://h.no.mt/logos/family/ipsafe/2026-09-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `01`
- Refined subject: A green network cable tester with a short patch lead
- Site path: `/projects/ipsafe#brand`; [local gallery](https://index.dev.hexly.ai/projects/ipsafe#brand)
- [Static review HTML](../../artwork/logo-family/ipsafe/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/ipsafe/2026-09-07-01)
- [Transparent foreground](https://h.no.mt/logos/family/ipsafe/2026-09-07-01/01/transparent.png); SHA-256: `1cad3a55e3b03e27cc3962351e72026af873120e5dcd0bfb8afe9b5fe65bc75b`
- [Square icon](https://h.no.mt/logos/family/ipsafe/2026-09-07-01/01/icon.png), [rounded icon](https://h.no.mt/logos/family/ipsafe/2026-09-07-01/01/rounded.png), [white version](https://h.no.mt/logos/family/ipsafe/2026-09-07-01/01/white.png)
- [Untouched generation](https://h.no.mt/logos/family/ipsafe/2026-09-07-01/01/raw.png), [exact prompt](https://h.no.mt/logos/family/ipsafe/2026-09-07-01/01/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/ipsafe/2026-09-07-01/01/manifest.json)
- [Previous original](https://h.no.mt/shared/site/v1.0.0/ipsafe-cfb96dff0fac.png), copied from [its immutable source](https://github.com/nocoo/nocoo/blob/9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6/README.md)
- Previous SHA-256: `cfb96dff0fac916f28c150e67adb746fb6b5c6adbe54286f66e23095bb5c239d`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#bbd2c7` | Adopted IPSafe presentation, 2026-09-07-01/01; background.base in archived settings.json |
| primary | `#315040` | Native ipsafe 949f4e0683ee, sampled sRGB pixel (1523, 1416); artwork/logo-family/ipsafe/2026-09-07-01/palette.json |
| accent | `#424646` | Native ipsafe 949f4e0683ee, sampled sRGB pixel (1474, 839); artwork/logo-family/ipsafe/2026-09-07-01/palette.json |
| accent | `#dcd1ba` | Native ipsafe 949f4e0683ee, sampled sRGB pixel (926, 316); artwork/logo-family/ipsafe/2026-09-07-01/palette.json |
| accent | `#64de0f` | Native ipsafe 949f4e0683ee, sampled sRGB pixel (1322, 1184); artwork/logo-family/ipsafe/2026-09-07-01/palette.json |

### The connection passes

A compact cable tester holds a short patch lead close to two ports. Three small status lights identify a completed connectivity check before the next command.

紧凑网线测试仪用短跳线连接两端口，三颗小状态灯表现下一条命令执行前已经通过的连接检查。

### Rubber, metal and cable

Green molded rubber surrounds a brushed charcoal face. Opaque cream cable and smoky connectors remain physical; the large loop opening is transparent.

绿色模压橡胶包覆拉丝深灰面板，象牙色线缆与烟灰接头保留实体质感，大线圈镂空透明。

### Connection lanes

Paired port rectangles, guarded chevron lanes and three short status bars in quiet mint paper. The field, grain and contact shadow are independent of transparent app marks.

薄荷色纸面上的成对端口、保护通道折线和三条状态短线。 底色、颗粒与接触阴影均独立于透明应用标记。

Small-size observation: At 128/64 px, the dark tester and cream cable loop remain clear. At 32/24/16 px, the compact silhouette and dominant colors carry recognition; fine material detail, printed marks and background lines naturally merge.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
