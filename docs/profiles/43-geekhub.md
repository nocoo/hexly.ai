# 📰 GeekHub

## Profile

- Repository: [nocoo/geekhub](https://github.com/nocoo/geekhub)
- Website: [https://geekhub.hexly.ai](https://geekhub.hexly.ai)
- Website evidence: GitHub repository homepage; README.md and wrangler.jsonc at 7126e9a368a1b70336ccb508f28a8465ce3bf165
- Category: everyday
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A self-hosted RSS reader with AI summaries and translation.
- Chinese: 可以自行托管的 RSS 阅读器，带有 AI 摘要与翻译。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `d45713b5d3a0cfd1530e31a7961e1b5748f1bb6c`

## Project goal

Read and organize RSS subscriptions in one place, with optional Chinese summaries and translations.

集中阅读和整理 RSS 订阅，按需生成中文摘要与翻译。

- [中文 README](https://github.com/nocoo/geekhub/blob/main/README.md) · [English README](https://github.com/nocoo/geekhub/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/geekhub/tree/ca7042dc77e4c64e317793b97a1c080c6fa8e567)
- Source files: [`package.json`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/package.json), [`src/lib/feed-fetcher.ts`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/src/lib/feed-fetcher.ts), [`src/lib/settings.ts`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/src/lib/settings.ts), [`src/lib/supabase-server.ts`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/src/lib/supabase-server.ts), [`src/lib/article-repository.ts`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/src/lib/article-repository.ts), [`src/lib/rsshub.ts`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/src/lib/rsshub.ts), [`src/contexts/AuthContext.tsx`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/src/contexts/AuthContext.tsx), [`src/app/api/ai/summarize/route.ts`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/src/app/api/ai/summarize/route.ts), [`src/app/api/ai/translate/route.ts`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/src/app/api/ai/translate/route.ts), [`src/components/ReaderView.tsx`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/src/components/ReaderView.tsx), [`supabase/migrations/20260113000000_schema.sql`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/supabase/migrations/20260113000000_schema.sql), [`scripts/run-api-e2e.sh`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/scripts/run-api-e2e.sh), [`tests/e2e/db-available.ts`](https://github.com/nocoo/geekhub/blob/ca7042dc77e4c64e317793b97a1c080c6fa8e567/tests/e2e/db-available.ts)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | Application logic | 应用逻辑 |
| Next.js | Web application and APIs | Web 应用与 API |
| React | Reading interface | 阅读界面 |
| Supabase | Authentication and database access | 认证与数据库访问 |
| PostgreSQL | Feeds, articles, and reading state | 订阅、文章与阅读状态 |
| Tailwind CSS | Interface styling | 界面样式 |
| OpenAI SDK | Optional summaries and translations | 可选的摘要与翻译 |
| rss-parser | RSS and Atom parsing | RSS 与 Atom 解析 |

## Current logo

![GeekHub source identity](../../public/logos/display/geekhub-160.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: A folded newspaper in a forest-green reading folio
- [Source](https://github.com/nocoo/geekhub/blob/d45713b5d3a0cfd1530e31a7961e1b5748f1bb6c/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/geekhub-family-2026-09-07-01-01.png)
- Original dimensions: 2048 × 2048
- Original size: 4053576 bytes
- SHA-256: `7de6b36e18165d87f1a840b9f762f2dce1739f70a28b8a50a9964c1a6fa4e545`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#1cce7b` | src/app/globals.css --primary: 152 76% 46% |
| background | `#ffffff` | src/app/globals.css --background: 0 0% 100% |
| accent | `#1e3a2c` | Native geekhub 6535caedb328, sampled sRGB pixel (831, 332); artwork/logo-family/geekhub/2026-09-07-01/palette.json |
| accent | `#dacdb1` | Native geekhub 6535caedb328, sampled sRGB pixel (1613, 1224); artwork/logo-family/geekhub/2026-09-07-01/palette.json |
| accent | `#b37d58` | Native geekhub 6535caedb328, sampled sRGB pixel (1668, 374); artwork/logo-family/geekhub/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/geekhub#brand).
- [Light lockup](../../public/brands/geekhub/v1.0.0/lockup-light.png), [dark lockup](../../public/brands/geekhub/v1.0.0/lockup-dark.png), [favicon](../../public/brands/geekhub/v1.0.0/favicon.ico).
- [Complete usage and integration guide](../../public/brands/geekhub/v1.0.0/guide.md), [standalone specimens](../../public/brands/geekhub/v1.0.0/review.html), [all exports and SHA-256](../../public/brands/geekhub/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Folded newspaper in a forest-green reading folio.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥105px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 105px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![GeekHub refined preview](../../public/logos/family/geekhub/2026-09-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `01`
- Refined subject: A folded newspaper in a forest-green reading folio
- Site path: `/projects/geekhub#brand`; [local gallery](https://index.dev.hexly.ai/projects/geekhub#brand)
- [Static review HTML](../../artwork/logo-family/geekhub/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/geekhub/2026-09-07-01)
- [Transparent foreground](../../public/logos/family/geekhub/2026-09-07-01/01/transparent.png); SHA-256: `7de6b36e18165d87f1a840b9f762f2dce1739f70a28b8a50a9964c1a6fa4e545`
- [Square icon](../../public/logos/family/geekhub/2026-09-07-01/01/icon.png), [rounded icon](../../public/logos/family/geekhub/2026-09-07-01/01/rounded.png), [white version](../../public/logos/family/geekhub/2026-09-07-01/01/white.png)
- [Untouched generation](../../public/logos/family/geekhub/2026-09-07-01/01/raw.png), [exact prompt](../../public/logos/family/geekhub/2026-09-07-01/01/prompt.txt), [public asset checksums](../../public/logos/family/geekhub/2026-09-07-01/01/manifest.json)
- [Previous original](../../public/logos/originals/geekhub.png), copied from [its immutable source](https://github.com/nocoo/geekhub/blob/4d3d7fa0676a0adda9e1af3f7f99b2cfd5855863/logo.png)
- Previous SHA-256: `a1cec3b549d3c812f52f7d47748584bf07cbfd636d4d15b8a6415cba9cb4f47b`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#d0d3bb` | Adopted GeekHub presentation, 2026-09-07-01/01; background.base in archived settings.json |
| primary | `#1e3a2c` | Native geekhub 6535caedb328, sampled sRGB pixel (831, 332); artwork/logo-family/geekhub/2026-09-07-01/palette.json |
| accent | `#dacdb1` | Native geekhub 6535caedb328, sampled sRGB pixel (1613, 1224); artwork/logo-family/geekhub/2026-09-07-01/palette.json |
| accent | `#b37d58` | Native geekhub 6535caedb328, sampled sRGB pixel (1668, 374); artwork/logo-family/geekhub/2026-09-07-01/palette.json |

### A page ready to open

A forest-green folio holds a folded newspaper and one copper clip. The complete page corners and quiet layered silhouette make an RSS reading object, without a busy desk scene.

森林绿阅读夹收纳折叠报纸与一枚铜夹，完整纸角和安静层次表现 RSS 阅读，无需繁杂桌面场景。

### Leather, paper and copper

Fine leather grain and dense ivory paper create tactile contrast. Abstract headline and column rules suggest articles without generating illegible text.

精细皮纹与厚实象牙色纸张形成触感对比；抽象标题线与分栏暗示文章，不使用乱码文字。

### Collected columns

Staggered editorial columns, fine baseline rules and an offset paper-fold seam in warm olive paper. The field, grain and contact shadow are independent of transparent app marks.

暖橄榄纸面上的错位报栏、细基线和偏移折页线。 底色、颗粒与接触阴影均独立于透明应用标记。

Small-size observation: At 128/64 px, the green folio and layered ivory pages remain clear. At 32/24/16 px, the compact silhouette and dominant colors carry recognition; fine material detail, printed marks and background lines naturally merge.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
