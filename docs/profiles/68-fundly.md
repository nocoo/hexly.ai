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

![Fundly source identity](https://h.no.mt/projects/fundly/identity/v1.0.0/fundly-v2-160-d9ecd987ca8d.webp)

- Type: Preserved original project artwork; official identity and Hexly campaign artwork retain their separate source bytes and rights
- Subject: Charcoal emperor penguin head holding one small coral fish
- [Source](https://github.com/nocoo/fundly/blob/9b5a655ce0576a279a6d9b2363b8e8fe79a17aae/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/fundly/identity/v1.0.0/fundly-v2-1024-a0739b288351.webp)
- Original dimensions: 2048 × 2048
- Original size: 2085886 bytes
- SHA-256: `fc6ee745c7510fc7a8cb6ea2e1ff1bf104297f25685f58f36b43b7552ce6572b`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#e95d2b` | apps/web/src/globals.css :root --basalt-primary: 16 81% 54%, converted to sRGB |
| background | `#e85d2a` | apps/web/public/logo.svg background rect fill |
| accent | `#ffffff` | apps/web/public/logo.svg foreground path fill |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Current textured icons

![Fundly current icon](https://h.no.mt/projects/fundly/icons/v1.1.0/rounded-160-d6dee153ca5f.webp)

- [1024 px square WebP](https://h.no.mt/projects/fundly/icons/v1.1.0/icon-1024-16cdfab4ad79.webp) · [1024 px rounded WebP](https://h.no.mt/projects/fundly/icons/v1.1.0/rounded-1024-d62f5caa4266.webp) · [Favicon ICO](https://h.no.mt/projects/fundly/icons/v1.1.0/favicon.ico) · [Apple touch](https://h.no.mt/projects/fundly/icons/v1.1.0/apple-touch-icon.png)
- [Manifest and checksums](https://h.no.mt/projects/fundly/icons/v1.1.0/manifest.json) · [Usage, resampling and source rights](https://h.no.mt/projects/fundly/icons/v1.1.0/guide.md)
- Native canvas 2048 × 2048; zero new image generation. Unchanged foreground colors over the approved light texture at 70% opacity. Continuous corners are already rendered for site use; use the square master for iOS. Smaller delivery sizes are resampled from the native master.
- Hexly presentation is adopted on this site. Source repositories retain their own recorded adoption state. Original identity archives below remain available.

## Current campaign texture

- Coastal leaf shelter / 海岸叶荫: A plausible vegetated subantarctic penguin coast, without asserting a penguin species: broad leathery coastal megaherb leaves with shallow scalloped margins and a few substantial folded tussock blades.
- 海岸叶荫：宽阔叶面与清晰叶脉形成浅浮雕，右侧疏密错落，左侧保留安静纸面。
- Model: `gpt-image-2.5-flare`; independently generated light/dark full canvases, no crop or repeat.
- Independent texture pack v1.0.2; the original identity kit and its historical surfaces remain unchanged. Text-bearing surfaces use a separate layer at opacity 0.39.
- [Paper WebP](https://h.no.mt/projects/fundly/textures/v1.0.2/texture-light.webp) · [Night WebP](https://h.no.mt/projects/fundly/textures/v1.0.2/texture-dark.webp) · [Exact paper prompt](https://h.no.mt/projects/fundly/textures/v1.0.2/texture-light-prompt.txt) · [Exact night prompt](https://h.no.mt/projects/fundly/textures/v1.0.2/texture-dark-prompt.txt)
- [Manifest and hashes](https://h.no.mt/projects/fundly/textures/v1.0.2/manifest.json) · [Usage/rights](https://h.no.mt/projects/fundly/textures/v1.0.2/guide.md) · [Full-canvas specimens](https://hexly.ai/textures/fundly/v1.0.2/review.html)
- Hexly pages and promotional materials only. Preserve official Logo bytes/colors, product UI, and archived status. Reuse the files directly; no per-campaign generation is required.

## Hexly campaign brand archive

- Brand version: `1.1.0`; [public archive](https://hexly.ai/projects/fundly#brand).
- [Light lockup](https://h.no.mt/brands/fundly/v1.1.0/lockup-light.webp), [dark lockup](https://h.no.mt/brands/fundly/v1.1.0/lockup-dark.webp), [favicon](https://h.no.mt/brands/fundly/v1.1.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/fundly/v1.1.0/guide.md), [standalone specimens](https://hexly.ai/brands/fundly/v1.1.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/fundly/v1.1.0/manifest.json).
- Source adoption: recorded at `9b5a655ce0576a279a6d9b2363b8e8fe79a17aae`.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Charcoal emperor penguin head holding one small coral fish.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥67px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine material detail softens at 16px.

导航推荐 24px，最小 16px。字标宽度至少 67px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小材质细节会柔化。

## Refined identity

![Fundly refined preview](https://h.no.mt/logos/family/fundly/2026-10-28-02/02/icon-160.webp)

- Status: Adopted in the source project; updated 2026-10-28.
- Study `2026-10-28-02`, finishing `02`
- Refined subject: Charcoal emperor penguin head holding one small coral fish
- Site path: `/projects/fundly#brand`; [local gallery](https://index.dev.hexly.ai/projects/fundly#brand)
- [Static review HTML](../../artwork/logo-family/fundly/2026-10-28-02/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/fundly/2026-10-28-02)
- [Transparent foreground](https://h.no.mt/projects/fundly/identity/v1.0.0/fundly-v2-1024-a0739b288351.webp); SHA-256: `fc6ee745c7510fc7a8cb6ea2e1ff1bf104297f25685f58f36b43b7552ce6572b`
- [Square icon WebP](https://h.no.mt/logos/family/fundly/2026-10-28-02/02/icon-1024.webp), [rounded icon WebP](https://h.no.mt/logos/family/fundly/2026-10-28-02/02/rounded-1024.webp), [transparent foreground WebP](https://h.no.mt/projects/fundly/identity/v1.0.0/fundly-v2-1024-a0739b288351.webp)
- [Exact prompt](https://h.no.mt/brands/fundly/v1.1.0/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/fundly/2026-10-28-02/02/manifest.json) (raw `raw.png` master cold-archived in Google Drive `My Drive/hexly.ai/04-masters-png/`)
- Previous original: `/logos/family/fundly/2026-09-07-01/02/transparent.png` (cold-archived in Google Drive), from [its preserved local source](https://h.no.mt/logos/family/fundly/2026-09-07-01/02/transparent.png)
- Previous SHA-256: `e45f5a9e9c062160d2ad91785f7ce9e9ddfb27b41362cfd89a539429b9fceb7f`
- Generation: gpt-image-2.5-sunburst, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#77848d` | Selected local presentation; background.base in archived settings.json |
| primary | `#38343d` | Native fundly 67836b069de2, sampled sRGB pixel (300, 350); palette.json |
| accent | `#51515f` | Native fundly 67836b069de2, sampled sRGB pixel (600, 360); palette.json |
| accent | `#efe4d0` | Native fundly 67836b069de2, sampled sRGB pixel (500, 1120); palette.json |
| accent | `#f1b66c` | Native fundly 67836b069de2, sampled sRGB pixel (120, 600); palette.json |
| accent | `#fc7371` | Native fundly 67836b069de2, sampled sRGB pixel (1090, 1420); palette.json |
| accent | `#4e939c` | Native fundly 67836b069de2, sampled sRGB pixel (1130, 1300); palette.json |

### Caught one, still watching

A large head enters from the left edge, its beak holding one very small deep-sea fish. The right side stays open so the face carries the weight and the fish sits as a single punctuation.

大头从左边缘入框，喙尖叼着一条极小的深海鱼。右侧保留大片空白，重量集中在脸，鱼只是一处标点。

### Quiet charcoal, one coral fish

Connected flat facets step from deep charcoal through slate to warm ivory, with a muted amber ear patch echoing the product accent. The fish is the only saturated area, moving through coral, teal, amber and rose.

连贯碎面从深炭经岩灰过渡到暖象牙，低饱和琥珀耳斑呼应产品主色。全图只有鱼是饱和彩色，由珊瑚、青、琥珀与玫瑰色碎面组成。

### Aphotic depth lines

Horizon lines sink and compress toward the lower right with short depth ticks in the open field. The field reads as a descent through water instead of a sightline across it, and it stays clear of the face.

水平线向右下缓慢下沉并收紧，空白处只留简短深度刻度。整片底图读作一次下潜，而不是一次远望，且始终避让面部。

Small-size observation: The charcoal-to-ivory face and the small fish stay the main small-size cues. At 16 px the fish resolves to one warm spark. The 24 px sidebar and 16 px browser marks use the transparent penguin without its field.

## Further refinements

Preserve exact official Logo and family campaign bytes, original colors, source roles and historical packages. Decorative surface changes use independent texture versions; generated texture PNG/WebP files are not native SVG or new project identities.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
