# 🚀 Echo

## Profile

- Repository: [nocoo/echo](https://github.com/nocoo/echo)
- Website: [https://echo.nocoo.cloud](https://echo.nocoo.cloud)
- Website evidence: GitHub repository homepage
- Category: tools
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A small, fast IP lookup service, built with Bun and TypeScript.
- Chinese: 用 Bun 与 TypeScript 构建的轻量 IP 查询服务。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `59730aa033b97d0a9ff917b34a90bedef2a06c39`

## Project goal

Give network diagnostic tools IP location and network data, plus observations of DNS resolver exit addresses.

为网络诊断工具提供 IP 位置与运营商信息，并观察 DNS 解析器的出口地址。

- [中文 README](https://github.com/nocoo/echo/blob/main/README.md) · [English README](https://github.com/nocoo/echo/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/echo/tree/b7373ec8e5d09a59847b3b9aa04f73526a019a41)
- Source files: [`package.json`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/package.json), [`packages/ip-service/package.json`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/packages/ip-service/package.json), [`packages/ip-service/src/server.ts`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/packages/ip-service/src/server.ts), [`packages/ip-service/src/services/ipLookup.ts`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/packages/ip-service/src/services/ipLookup.ts), [`packages/ip-service/src/services/selectBest.ts`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/packages/ip-service/src/services/selectBest.ts), [`packages/ip-service/vercel.json`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/packages/ip-service/vercel.json), [`packages/collector/package.json`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/packages/collector/package.json), [`packages/collector/src/index.ts`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/packages/collector/src/index.ts), [`packages/collector/wrangler.toml`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/packages/collector/wrangler.toml), [`packages/dns-probe/main.go`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/packages/dns-probe/main.go), [`packages/dns-probe/go.mod`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/packages/dns-probe/go.mod), [`.github/workflows/release.yml`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/.github/workflows/release.yml), [`LICENSE`](https://github.com/nocoo/echo/blob/b7373ec8e5d09a59847b3b9aa04f73526a019a41/LICENSE)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | IP API and result collector | IP API 与结果收集服务 |
| Bun | Local API runtime and workspaces | 本地 API 运行时与工作区管理 |
| Hono | IP lookup HTTP routes | IP 查询 HTTP 路由 |
| Vercel | IP service hosting | IP 服务托管 |
| Go | Authoritative DNS probe | 权威 DNS 探针 |
| Cloudflare Workers | DNS result collection API | DNS 结果收集 API |
| Cloudflare KV | Short-lived resolver observations | 短期保存解析器观察记录 |
| Vitest | IP service unit and HTTP tests | IP 服务单元与 HTTP 测试 |

## Current logo

![Echo source identity](https://h.no.mt/projects/echo/identity/v1.0.0/echo-160-f1517ce6afb9.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: A brass and navy pocket compass
- [Source](https://github.com/nocoo/echo/blob/59730aa033b97d0a9ff917b34a90bedef2a06c39/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/echo/identity/v1.0.0/echo-family-2026-09-07-01-01-ba7421a11db8.png)
- Original dimensions: 2048 × 2048
- Original size: 5170077 bytes
- SHA-256: `ba7421a11db8e5a5e16e3199b8d6612edd65b6ba3e98855328b2cb027644c58d`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#192d3e` | Native echo bce159d3b8a5, sampled sRGB pixel (1080, 1178); artwork/logo-family/echo/2026-09-07-01/palette.json |
| background | `#bfd4d7` | Adopted Echo presentation, 2026-09-07-01/01; background.base in archived settings.json |
| accent | `#b19254` | Native echo bce159d3b8a5, sampled sRGB pixel (272, 960); artwork/logo-family/echo/2026-09-07-01/palette.json |
| accent | `#a42f1e` | Native echo bce159d3b8a5, sampled sRGB pixel (1294, 585); artwork/logo-family/echo/2026-09-07-01/palette.json |
| accent | `#e2cfa2` | Native echo bce159d3b8a5, sampled sRGB pixel (952, 978); artwork/logo-family/echo/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/echo#brand).
- [Light lockup](https://h.no.mt/brands/echo/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/echo/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/echo/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/echo/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/echo/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/echo/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Brass and navy pocket compass.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥60px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 60px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Echo refined preview](https://h.no.mt/logos/family/echo/2026-09-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `01`
- Refined subject: A brass and navy pocket compass
- Site path: `/projects/echo#brand`; [local gallery](https://index.dev.hexly.ai/projects/echo#brand)
- [Static review HTML](../../artwork/logo-family/echo/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/echo/2026-09-07-01)
- [Transparent foreground](https://h.no.mt/logos/family/echo/2026-09-07-01/01/transparent.png); SHA-256: `ba7421a11db8e5a5e16e3199b8d6612edd65b6ba3e98855328b2cb027644c58d`
- [Square icon](https://h.no.mt/logos/family/echo/2026-09-07-01/01/icon.png), [rounded icon](https://h.no.mt/logos/family/echo/2026-09-07-01/01/rounded.png), [white version](https://h.no.mt/logos/family/echo/2026-09-07-01/01/white.png)
- [Untouched generation](https://h.no.mt/logos/family/echo/2026-09-07-01/01/raw.png), [exact prompt](https://h.no.mt/logos/family/echo/2026-09-07-01/01/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/echo/2026-09-07-01/01/manifest.json)
- [Previous original](https://h.no.mt/shared/site/v1.0.0/echo-b7a3eb2ada12.png), copied from [its immutable source](https://github.com/nocoo/nocoo/blob/9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6/README.md)
- Previous SHA-256: `b7a3eb2ada128f64271d7a91ceab4d58ff4589bdca20c07fb056270454dc68ca`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#bfd4d7` | Adopted Echo presentation, 2026-09-07-01/01; background.base in archived settings.json |
| primary | `#192d3e` | Native echo bce159d3b8a5, sampled sRGB pixel (1080, 1178); artwork/logo-family/echo/2026-09-07-01/palette.json |
| accent | `#b19254` | Native echo bce159d3b8a5, sampled sRGB pixel (272, 960); artwork/logo-family/echo/2026-09-07-01/palette.json |
| accent | `#a42f1e` | Native echo bce159d3b8a5, sampled sRGB pixel (1294, 585); artwork/logo-family/echo/2026-09-07-01/palette.json |
| accent | `#e2cfa2` | Native echo bce159d3b8a5, sampled sRGB pixel (952, 978); artwork/logo-family/echo/2026-09-07-01/palette.json |

### A direction found

A red-and-ivory needle crosses a deep navy compass face. The close brass hanging ring and complete circular instrument share one gentle diagonal.

红白指针划过深蓝罗盘，紧靠的黄铜提环与完整仪器沿同一条温和斜线组织。

### Brass and navy glass

Softly brushed brass, a controlled glass reflection and engraved direction marks retain physical depth. The hanging-ring opening is truly transparent.

柔和拉丝黄铜、克制玻璃反光和方向刻痕保留拟物深度，提环镂空保持真实透明。

### Survey bearings

Latitude arcs, a sparse meridian fan and short bearing marks in pale harbor-blue paper. The field, grain and contact shadow are independent of transparent app marks.

浅蓝纸面上的经纬弧线与偏移导航刻度，呼应 IP 位置查询。 底色、颗粒与接触阴影均独立于透明应用标记。

Small-size observation: At 128/64 px, the gold compass rim and red needle remain clear. At 32/24/16 px, the compact silhouette and dominant colors carry recognition; fine material detail, printed marks and background lines naturally merge.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
