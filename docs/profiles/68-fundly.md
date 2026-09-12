# 🪴 Fundly

## Profile

- Repository: [nocoo/fundly](https://github.com/nocoo/fundly)
- Website: [https://fundly.hexly.ai](https://fundly.hexly.ai)
- Website evidence: GitHub repository homepage and docs/09-RAILWAY.md custom-domain table
- Category: everyday
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: China mutual-fund browser and ranking tool with local SQLite and Railway
- Chinese: 中国公募基金浏览与排名工具，采用本地 SQLite 存储并部署于 Railway。
- Profile section: Recent Projects
- Profile revision: `880737d35ff74923cc0c96873fccf9e09ea5e569`
- Repository revision inspected: `6de762074e00011009f7604bbeeb7c0b04923c00`

## Project goal

Collect fund and market data for private research into Chinese funds, ETFs, stocks, and macro conditions.

采集基金与市场数据，用于研究中国公募基金、ETF、股票与宏观环境。

- [中文 README](https://github.com/nocoo/fundly/blob/main/README.md) · [English README](https://github.com/nocoo/fundly/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/fundly/tree/6de762074e00011009f7604bbeeb7c0b04923c00)
- Source files: [`package.json`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/package.json), [`apps/web/package.json`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/apps/web/package.json), [`apps/worker/package.json`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/apps/worker/package.json), [`apps/web/src/lib/navigation.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/apps/web/src/lib/navigation.ts), [`apps/worker/scripts/app.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/apps/worker/scripts/app.ts), [`apps/worker/scripts/serve.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/apps/worker/scripts/serve.ts), [`apps/worker/src/lib/auth-config.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/apps/worker/src/lib/auth-config.ts), [`apps/worker/src/lib/auth-routes.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/apps/worker/src/lib/auth-routes.ts), [`apps/worker/src/lib/selection-service.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/apps/worker/src/lib/selection-service.ts), [`src/db/repo.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/src/db/repo.ts), [`src/metrics/screen-4433.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/src/metrics/screen-4433.ts), [`src/metrics/select-score.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/src/metrics/select-score.ts), [`src/metrics/selection-calc.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/src/metrics/selection-calc.ts), [`scripts/refresh-select.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/scripts/refresh-select.ts), [`scripts/fetch-macro.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/scripts/fetch-macro.ts), [`scripts/fetch-selection.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/scripts/fetch-selection.ts), [`apps/web/vite.config.ts`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/apps/web/vite.config.ts), [`Dockerfile`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/Dockerfile), [`railway.toml`](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/railway.toml)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | Collection, calculations, and application logic | 采集、计算与应用逻辑 |
| Bun | Collection scripts, HTTP server, and tests | 采集脚本、HTTP 服务与测试 |
| SQLite | Local market data and computed metrics | 本地市场数据与计算指标 |
| React | Research pages and charts | 研究页面与图表 |
| Vite | SPA development and build | SPA 开发与构建 |
| React Router | Research-page navigation | 研究页面导航 |
| Basalt | Interface components | 界面组件 |
| Tailwind CSS | Interface styling | 界面样式 |
| Recharts | Market and product charts | 市场与产品图表 |
| Hono | Market, authentication, and backup APIs | 行情、认证与备份 API |
| jose | OAuth state and session tokens | OAuth 状态与会话令牌 |
| Railway | Bun hosting with a persistent data volume | Bun 服务与持久数据卷 |

## Current logo

![Fundly source identity](../../public/logos/display/fundly-160.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: White flame on an orange rounded square
- [Source](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/apps/web/public/logo.svg): `apps/web/public/logo.svg`
- [Preserved asset](../../public/logos/originals/fundly.svg)
- Original dimensions: 32 × 32
- Original size: 456 bytes
- SHA-256: `08ec45808b94078caa2a31720da96adf9b9aadfdaf5498c98cfc0c2adc973bf8`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#e95d2b` | apps/web/src/globals.css :root --basalt-primary: 16 81% 54%, converted to sRGB |
| background | `#e85d2a` | apps/web/public/logo.svg background rect fill |
| accent | `#ffffff` | apps/web/public/logo.svg foreground path fill |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/fundly#brand).
- [Light lockup](../../public/brands/fundly/v1.0.0/lockup-light.png), [dark lockup](../../public/brands/fundly/v1.0.0/lockup-dark.png), [favicon](../../public/brands/fundly/v1.0.0/favicon.ico).
- [Complete usage and integration guide](../../public/brands/fundly/v1.0.0/guide.md), [standalone specimens](../../public/brands/fundly/v1.0.0/review.html), [all exports and SHA-256](../../public/brands/fundly/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Worldly navy-and-ivory penguin holding binoculars.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥67px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 67px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Fundly refined preview](../../public/logos/family/fundly/2026-09-07-01/02/icon-160.webp)

- Status: Local review; this finishing pass has not been adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `02`
- Refined subject: A worldly navy-and-ivory penguin holding binoculars
- Site path: `/projects/fundly#brand`; [local gallery](https://index.dev.hexly.ai/projects/fundly#brand)
- [Static review HTML](../../artwork/logo-family/fundly/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/fundly/2026-09-07-01)
- [Transparent foreground](../../public/logos/family/fundly/2026-09-07-01/02/transparent.png); SHA-256: `e45f5a9e9c062160d2ad91785f7ce9e9ddfb27b41362cfd89a539429b9fceb7f`
- [Square icon](../../public/logos/family/fundly/2026-09-07-01/02/icon.png), [rounded icon](../../public/logos/family/fundly/2026-09-07-01/02/rounded.png), [white version](../../public/logos/family/fundly/2026-09-07-01/02/white.png)
- [Untouched generation](../../public/logos/family/fundly/2026-09-07-01/02/raw.png), [exact prompt](../../public/logos/family/fundly/2026-09-07-01/02/prompt.txt), [public asset checksums](../../public/logos/family/fundly/2026-09-07-01/02/manifest.json)
- [Previous original](../../public/logos/originals/fundly.svg), copied from [its immutable source](https://github.com/nocoo/fundly/blob/6de762074e00011009f7604bbeeb7c0b04923c00/apps/web/public/logo.svg)
- Previous SHA-256: `08ec45808b94078caa2a31720da96adf9b9aadfdaf5498c98cfc0c2adc973bf8`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#9aafbb` | Selected local presentation, fundly/2026-09-07-01/02; background.base in archived settings.json |
| primary | `#192541` | Native fundly 967f052960b2, sampled sRGB pixel (1340, 214); artwork/logo-family/fundly/2026-09-07-01/palette.json |
| accent | `#27365c` | Native fundly 967f052960b2, sampled sRGB pixel (1520, 1100); artwork/logo-family/fundly/2026-09-07-01/palette.json |
| accent | `#dfd2b8` | Native fundly 967f052960b2, sampled sRGB pixel (1180, 1280); artwork/logo-family/fundly/2026-09-07-01/palette.json |
| accent | `#80682e` | Native fundly 967f052960b2, sampled sRGB pixel (861, 1025); artwork/logo-family/fundly/2026-09-07-01/palette.json |
| accent | `#335866` | Native fundly 967f052960b2, sampled sRGB pixel (908, 925); artwork/logo-family/fundly/2026-09-07-01/palette.json |
| accent | `#cb615f` | Native fundly 967f052960b2, sampled sRGB pixel (1034, 1148); artwork/logo-family/fundly/2026-09-07-01/palette.json |

### Just after the sighting

A compact whole penguin has lowered its binoculars and turns with calm curiosity. The navy body sits to the right while the instrument reaches into the left-hand space. Complete feet and feather tips stay comfortably inside the rounded viewfinder.

企鹅刚放下望远镜，带着平静的好奇回望。完整而紧凑的身体偏右，望远镜伸向左侧留白；脚趾与羽尖均在圆角取景框内保留充分空间。

### Navy planes, prismatic lenses

Broad connected navy and indigo facets contrast with an opaque warm-ivory face and bib. The flippers support one brass-and-teal binocular instrument. Its lens facets form the sole multicolored accent group without covering the eyes.

连贯的深蓝与靛蓝色块衬托暖象牙白面部和腹部。双鳍自然托着黄铜与青色望远镜，镜片中的彩色碎片构成唯一一组多彩兴趣点，双眼保持清晰。

### Far-horizon sightlines

Mineral-blue paper opens into broad horizon arcs and short sighting ticks. The curves follow the penguin’s gaze and remain visible beside the dark body. Grain and contact shadows are independent of the transparent foreground.

矿物蓝纸面铺开宽阔的地平线弧与简短瞄准刻线，顺着企鹅的视线延伸，在深色主体旁保持可见。颗粒和接触阴影与透明前景分别保存。

Small-size observation: The navy-and-ivory silhouette and lowered binoculars remain the main small-size cues. At 16 px the individual lens colors and eye facets merge. The 24 px sidebar and 16 px browser samples use the transparent penguin without its paper tile.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
