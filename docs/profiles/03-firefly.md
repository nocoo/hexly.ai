# 🔥 Firefly

## Profile

- Repository: [nocoo/firefly](https://github.com/nocoo/firefly)
- Website: [https://lizheng.blog](https://lizheng.blog)
- Website evidence: nocoo/nocoo README.md Writing link
- Category: everyday
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A modern home for writing, publishing, and the ideas worth keeping.
- Chinese: 写作、发布，也留住值得记录的想法。由 WordPress 迁移而来的博客平台。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `70a4de51b9fe6f152805298c031ca92165754c40`

## Project goal

Write, publish and organize a personal blog through a web console and AI clients sharing the same content.

写作、发布和整理个人博客，让网页后台与 AI 客户端共用一套内容。

- [中文 README](https://github.com/nocoo/firefly/blob/main/README.md) · [English README](https://github.com/nocoo/firefly/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/firefly/tree/dcdea91001928e374c1a64db9290f8ec83ebbd5e)
- Source files: [`package.json`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/package.json), [`worker/package.json`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/worker/package.json), [`worker/wrangler.toml`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/worker/wrangler.toml), [`worker/src/index.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/worker/src/index.ts), [`worker/src/fts.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/worker/src/fts.ts), [`src/lib/auth.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/lib/auth.ts), [`src/lib/auth-utils.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/lib/auth-utils.ts), [`src/lib/r2-client.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/lib/r2-client.ts), [`src/lib/mcp/server.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/lib/mcp/server.ts), [`src/lib/mcp/entities/author-post.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/lib/mcp/entities/author-post.ts), [`src/app/api/mcp/route.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/app/api/mcp/route.ts), [`src/app/api/comments/route.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/app/api/comments/route.ts), [`src/app/api/search/route.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/app/api/search/route.ts), [`src/data/backup-export.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/data/backup-export.ts), [`src/models/backup-schema.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/models/backup-schema.ts), [`src/services/post-service.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/services/post-service.ts), [`src/services/ai.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/services/ai.ts), [`src/proxy.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/src/proxy.ts), [`scripts/migrations/db-adapter.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/scripts/migrations/db-adapter.ts), [`scripts/migrations/runner.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/scripts/migrations/runner.ts), [`scripts/run-e2e.ts`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/scripts/run-e2e.ts), [`.github/workflows/ci.yml`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/.github/workflows/ci.yml), [`docs/30-social-preview.md`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/docs/30-social-preview.md), [`LICENSE`](https://github.com/nocoo/firefly/blob/dcdea91001928e374c1a64db9290f8ec83ebbd5e/LICENSE)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | Application code and scripts | 应用代码与脚本 |
| Next.js | Blog, admin console and server APIs | 博客、后台与服务端 API |
| React | Reading and administration interfaces | 阅读与管理界面 |
| Tailwind CSS | Page styles and themes | 页面样式与主题 |
| Cloudflare Workers | D1 proxy and search endpoints | D1 代理与搜索接口 |
| Cloudflare D1 | Blog records and full-text indexes | 博客数据与全文索引 |
| Cloudflare R2 | Image storage through the S3 API | 通过 S3 API 存储图片 |
| Auth.js | Google sign-in and admin sessions | Google 登录与管理会话 |
| MCP SDK | OAuth-protected writing tools | 经过 OAuth 授权的写作工具 |
| Vercel AI SDK | Excerpts and link text generation | 摘要与链接文本生成 |
| Bun | Dependencies, scripts and test runners | 依赖、脚本与测试运行器 |

## Current logo

![Firefly source identity](../../public/logos/display/firefly-160.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Broad-winged faceted firefly with a small campfire
- [Source](https://github.com/nocoo/firefly/blob/70a4de51b9fe6f152805298c031ca92165754c40/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/firefly-2026-09-06.png)
- Original dimensions: 2048 × 2048
- Original size: 2583578 bytes
- SHA-256: `a2c29a6601fb041c27c7fcc4a4493ae8b0ae09dc72d3d0da6e475400dd167759`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#3c83f6` | src/app/styles/tokens.css --primary: 217 91% 60% |
| background | `#eeeff2` | src/app/styles/tokens.css --background: 220 14% 94% |
| background | `#10282e` | Adopted Firefly presentation, finishing 02; background.base in archived settings.json |
| primary | `#fbaa3a` | Firefly native generation 384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25, sampled sRGB pixel (940, 695); palette.json |
| accent | `#fcf375` | Firefly native generation 384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25, sampled sRGB pixel (1390, 1370); palette.json |
| accent | `#fae1b1` | Firefly native generation 384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25, sampled sRGB pixel (1586, 429); palette.json |
| accent | `#271815` | Firefly native generation 384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25, sampled sRGB pixel (833, 795); palette.json |
| accent | `#706170` | Firefly native generation 384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25, sampled sRGB pixel (1348, 695); palette.json |
| accent | `#fc8816` | Firefly native generation 384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25, sampled sRGB pixel (452, 1474); palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/firefly#brand).
- [Light lockup](../../public/brands/firefly/v1.0.0/lockup-light.png), [dark lockup](../../public/brands/firefly/v1.0.0/lockup-dark.png), [favicon](../../public/brands/firefly/v1.0.0/favicon.ico).
- [Complete usage and integration guide](../../public/brands/firefly/v1.0.0/guide.md), [standalone specimens](../../public/brands/firefly/v1.0.0/review.html), [all exports and SHA-256](../../public/brands/firefly/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Broad-winged faceted firefly with a small campfire.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥62px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 62px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Firefly refined preview](../../public/logos/family/firefly/2026-09-06-10/02/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-06-10`, finishing `02`
- Refined subject: Broad-winged faceted firefly with a small campfire
- Site path: `/projects/firefly#brand`; [local gallery](https://index.dev.hexly.ai/projects/firefly#brand)
- [Static review HTML](../../artwork/logo-family/firefly/2026-09-06-10/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/firefly/2026-09-06-10)
- [Transparent foreground](../../public/logos/family/firefly/2026-09-06-10/02/transparent.png); SHA-256: `a2c29a6601fb041c27c7fcc4a4493ae8b0ae09dc72d3d0da6e475400dd167759`
- [Square icon](../../public/logos/family/firefly/2026-09-06-10/02/icon.png), [rounded icon](../../public/logos/family/firefly/2026-09-06-10/02/rounded.png), [white version](../../public/logos/family/firefly/2026-09-06-10/02/white.png)
- [Untouched generation](../../public/logos/family/firefly/2026-09-06-10/02/raw.png), [exact prompt](../../public/logos/family/firefly/2026-09-06-10/02/prompt.txt), [public asset checksums](../../public/logos/family/firefly/2026-09-06-10/02/manifest.json)
- [Previous original](../../public/logos/originals/firefly.png), copied from [its immutable source](https://github.com/nocoo/firefly/blob/94a16050f87867458d530e63442b99229603e72b/logo.png)
- Previous SHA-256: `2c07a3d70ee783d69d2f839ad7f3bc0ca340804a6e66e2702fbe0bc36a845269`
- Generation: Azure Foundry · gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#10282e` | Adopted Firefly presentation, finishing 02; background.base in archived settings.json |
| primary | `#fbaa3a` | Firefly native generation 384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25, sampled sRGB pixel (940, 695); palette.json |
| accent | `#fcf375` | Firefly native generation 384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25, sampled sRGB pixel (1390, 1370); palette.json |
| accent | `#fae1b1` | Firefly native generation 384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25, sampled sRGB pixel (1586, 429); palette.json |
| accent | `#271815` | Firefly native generation 384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25, sampled sRGB pixel (833, 795); palette.json |
| accent | `#706170` | Firefly native generation 384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25, sampled sRGB pixel (1348, 695); palette.json |
| accent | `#fc8816` | Firefly native generation 384fff12838b1e9b282879ffb008f9b9aa8af110ba28400050ef6cd489f48d25, sampled sRGB pixel (452, 1474); palette.json |

### Room for the wings

The broad-winged firefly leads the mark. A small fire below its gaze supplies the second point of interest, with clear space around the complete silhouette.

舒展双翼的萤火虫占据主体，视线下方的小篝火形成第二处兴趣点。完整的轮廓四周留出空间，让翅尖远离圆角边缘。

### Faceted light, living fire

Connected champagne, bronze, and gold planes describe the insect. Two visible eyes give its gaze direction; curved flame and wood grain add tactile depth to the small campfire.

香槟色、青铜色与金色的连续切面构成萤火虫，两只清楚的眼睛交代视线。弯曲的火焰与木纹为小篝火增添立体质感。

### Two lights after dark

A deep blue-green field carries a quiet crescent, sparse stars, and cloud contours. Warm light around the flame and abdomen lifts the mark from the matte night surface.

深蓝绿色底面上浮现安静的月牙、疏星与云纹。火焰和尾部的暖光，让主体从哑光的夜色中轻轻浮起。

Small-size observation: At 24–32 px, the broad wings, amber abdomen, and small fire carry the identity. At 16 px, eyes, fine legs, and wood grain simplify into the warm silhouette.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
