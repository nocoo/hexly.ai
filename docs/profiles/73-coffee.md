# ☕ Coffee

## Profile

- Repository: [nocoo/coffee](https://github.com/nocoo/coffee)
- Website: [https://coffee.hexly.ai](https://coffee.hexly.ai)
- Website evidence: Repository homepage, README.md and wrangler.jsonc at a6f179b1f530b1511e276eae6d3989a43c08a833; HTTPS returned 200 on 2026-09-11
- Category: tools
- Archived repository: No; [repository status evidence](../../docs/sources/coffee-2026-09-11.json)
- English: Bilingual coffee flavor wheel, origin atlas, brewing lab and tasting journal
- Chinese: 双语咖啡风味轮、产地地图、冲煮实验室与本地品鉴手记
- Profile section: Recent Projects
- Profile revision: `4a0c394a79c8f4d24a11f8d9907d5c797e6b7718`
- Repository revision inspected: `0f0b9acd71497ed65c27cc3623f65a7e9a655f09`

## Project goal

Explore coffee through an original interactive flavor wheel, compare origins and brewing recipes, and record tasting notes locally. Bilingual learning paths and a slow exhibition mode support sensory practice and shop displays.

通过原创交互风味轮认识咖啡，对照产地与冲煮配方，并在本地记录品鉴手记。双语学习路径与慢速展示模式支持感官练习和店铺大屏。

- [中文 README](https://github.com/nocoo/coffee/blob/main/README.md) · [English README](https://github.com/nocoo/coffee/blob/main/docs/README.en.md)
- Verified: 2026-09-11; [source revision](https://github.com/nocoo/coffee/tree/d8e90515dbd36f3bad7530c226c7849f90b9ed04)
- Source files: [`README.md`](https://github.com/nocoo/coffee/blob/d8e90515dbd36f3bad7530c226c7849f90b9ed04/README.md), [`docs/README.en.md`](https://github.com/nocoo/coffee/blob/d8e90515dbd36f3bad7530c226c7849f90b9ed04/docs/README.en.md), [`package.json`](https://github.com/nocoo/coffee/blob/d8e90515dbd36f3bad7530c226c7849f90b9ed04/package.json), [`src/styles.css`](https://github.com/nocoo/coffee/blob/d8e90515dbd36f3bad7530c226c7849f90b9ed04/src/styles.css), [`src/App.tsx`](https://github.com/nocoo/coffee/blob/d8e90515dbd36f3bad7530c226c7849f90b9ed04/src/App.tsx), [`src/components/shared.tsx`](https://github.com/nocoo/coffee/blob/d8e90515dbd36f3bad7530c226c7849f90b9ed04/src/components/shared.tsx), [`src/lib/core.ts`](https://github.com/nocoo/coffee/blob/d8e90515dbd36f3bad7530c226c7849f90b9ed04/src/lib/core.ts), [`src/lib/journal.ts`](https://github.com/nocoo/coffee/blob/d8e90515dbd36f3bad7530c226c7849f90b9ed04/src/lib/journal.ts), [`docs/architecture.md`](https://github.com/nocoo/coffee/blob/d8e90515dbd36f3bad7530c226c7849f90b9ed04/docs/architecture.md), [`scripts/render-assets.mjs`](https://github.com/nocoo/coffee/blob/d8e90515dbd36f3bad7530c226c7849f90b9ed04/scripts/render-assets.mjs), [`public/icon-512.png`](https://github.com/nocoo/coffee/blob/d8e90515dbd36f3bad7530c226c7849f90b9ed04/public/icon-512.png), [`wrangler.jsonc`](https://github.com/nocoo/coffee/blob/d8e90515dbd36f3bad7530c226c7849f90b9ed04/wrangler.jsonc)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript / React | Bilingual interface and content model | 双语界面与内容模型 |
| Three.js / React Three Fiber | Interactive 3D flavor wheel with an SVG alternative | 交互式 3D 风味轮与 SVG 轻量视图 |
| Vite / Bun | Development and static builds | 开发与静态构建 |
| History API / localStorage | Navigation, preferences and local tasting notes | 导航、偏好与本地品鉴手记 |
| Web Audio API | Opt-in synthesized ambience | 主动开启的合成环境音 |
| Cloudflare Workers Static Assets | Static delivery | 静态站点分发 |
| Vitest / Playwright | Data, calculation, storage and browser tests | 数据、计算、存储与浏览器测试 |

## Current logo

![Coffee source identity](https://h.no.mt/projects/coffee/identity/v1.0.0/coffee-160-f4c67ea45d55.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Peach ceramic cup, latte leaf, saucer and brass teaspoon
- [Source](https://github.com/nocoo/coffee/blob/0f0b9acd71497ed65c27cc3623f65a7e9a655f09/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/coffee/identity/v1.0.0/coffee-family-2026-09-11-01-01-d00ad151f073.png)
- Original dimensions: 2048 × 2048
- Original size: 4374884 bytes
- SHA-256: `d00ad151f073a71b2b324b86903154551a8acd38d91d53f83fae9d661e0cb124`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#c7d9a9` | src/styles.css :root --accent at a6f179b1f530b1511e276eae6d3989a43c08a833 |
| background | `#f8f6f0` | src/styles.css :root --bg at a6f179b1f530b1511e276eae6d3989a43c08a833 |
| accent | `#f2d5d9` | src/styles.css :root --pink at a6f179b1f530b1511e276eae6d3989a43c08a833 |
| accent | `#d9c9f0` | src/styles.css :root --illustration at a6f179b1f530b1511e276eae6d3989a43c08a833 |
| accent | `#c68664` | Native coffee output SHA-256 b195d997f71efda0ce9a232b952adb767e45716bdb33d6c29fb1bb331503d8c9; opaque sRGB pixel (880, 970); artwork/logo-family/coffee/2026-09-11-01/palette.json |
| accent | `#ead0b6` | Native coffee output SHA-256 b195d997f71efda0ce9a232b952adb767e45716bdb33d6c29fb1bb331503d8c9; opaque sRGB pixel (1100, 305); artwork/logo-family/coffee/2026-09-11-01/palette.json |
| accent | `#efe5d7` | Native coffee output SHA-256 b195d997f71efda0ce9a232b952adb767e45716bdb33d6c29fb1bb331503d8c9; opaque sRGB pixel (1000, 470); artwork/logo-family/coffee/2026-09-11-01/palette.json |
| accent | `#b16328` | Native coffee output SHA-256 b195d997f71efda0ce9a232b952adb767e45716bdb33d6c29fb1bb331503d8c9; opaque sRGB pixel (760, 530); artwork/logo-family/coffee/2026-09-11-01/palette.json |
| accent | `#ae8255` | Native coffee output SHA-256 b195d997f71efda0ce9a232b952adb767e45716bdb33d6c29fb1bb331503d8c9; opaque sRGB pixel (1120, 1430); artwork/logo-family/coffee/2026-09-11-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/coffee#brand).
- [Light lockup](https://h.no.mt/brands/coffee/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/coffee/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/coffee/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/coffee/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/coffee/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/coffee/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Peach ceramic cup, latte leaf, saucer and brass teaspoon.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥81px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 81px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Coffee refined preview](https://h.no.mt/logos/family/coffee/2026-09-11-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-11.
- Study `2026-09-11-01`, finishing `01`
- Refined subject: Peach ceramic cup, latte leaf, saucer and brass teaspoon
- Site path: `/projects/coffee#brand`; [local gallery](https://index.dev.hexly.ai/projects/coffee#brand)
- [Static review HTML](../../artwork/logo-family/coffee/2026-09-11-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/coffee/2026-09-11-01)
- [Transparent foreground](https://h.no.mt/logos/family/coffee/2026-09-11-01/01/transparent.png); SHA-256: `d00ad151f073a71b2b324b86903154551a8acd38d91d53f83fae9d661e0cb124`
- [Square icon](https://h.no.mt/logos/family/coffee/2026-09-11-01/01/icon.png), [rounded icon](https://h.no.mt/logos/family/coffee/2026-09-11-01/01/rounded.png), [white version](https://h.no.mt/logos/family/coffee/2026-09-11-01/01/white.png)
- [Untouched generation](https://h.no.mt/logos/family/coffee/2026-09-11-01/01/raw.png), [exact prompt](https://h.no.mt/logos/family/coffee/2026-09-11-01/01/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/coffee/2026-09-11-01/01/manifest.json)
- [Previous original](https://h.no.mt/shared/site/v1.0.0/coffee-initial-63c37f0e536e.png), copied from [its immutable source](https://github.com/nocoo/coffee/blob/a6f179b1f530b1511e276eae6d3989a43c08a833/public/icon-512.png)
- Previous SHA-256: `63c37f0e536e01f3d0cf0f6750d8be01e1f957a91b1f862f5778241b460cda20`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#ecdeda` | Locally adopted coffee presentation 2026-09-11-01/01; background.base in archived settings.json |
| primary | `#c68664` | Native coffee output SHA-256 b195d997f71efda0ce9a232b952adb767e45716bdb33d6c29fb1bb331503d8c9; opaque sRGB pixel (880, 970); artwork/logo-family/coffee/2026-09-11-01/palette.json |
| accent | `#ead0b6` | Native coffee output SHA-256 b195d997f71efda0ce9a232b952adb767e45716bdb33d6c29fb1bb331503d8c9; opaque sRGB pixel (1100, 305); artwork/logo-family/coffee/2026-09-11-01/palette.json |
| accent | `#efe5d7` | Native coffee output SHA-256 b195d997f71efda0ce9a232b952adb767e45716bdb33d6c29fb1bb331503d8c9; opaque sRGB pixel (1000, 470); artwork/logo-family/coffee/2026-09-11-01/palette.json |
| accent | `#b16328` | Native coffee output SHA-256 b195d997f71efda0ce9a232b952adb767e45716bdb33d6c29fb1bb331503d8c9; opaque sRGB pixel (760, 530); artwork/logo-family/coffee/2026-09-11-01/palette.json |
| accent | `#ae8255` | Native coffee output SHA-256 b195d997f71efda0ce9a232b952adb767e45716bdb33d6c29fb1bb331503d8c9; opaque sRGB pixel (1120, 1430); artwork/logo-family/coffee/2026-09-11-01/palette.json |
| accent | `#b88179` | Designed independent background motif, 28% opacity; artwork/logo-family/coffee/2026-09-11-01/finishing/01/settings.json |

### Before the first sip

The elevated cup, open handle and spoon resting across the saucer form one complete assembly. A uniform inset leaves 188.5 px of clearance from the actual rounded outline.

俯视陶杯、通透把手与横放杯碟的茶匙构成完整一组。整体等比内收后，距实际圆角边界最近为 188.5 px。

### Ceramic, crema and brass

Peach ceramic, a cream rim, leaf-shaped milk foam and an incised coffee bean retain their native material shading. The brass spoon adds a quiet diagonal; fully opaque extracted pixels keep their original RGB.

桃色陶瓷、奶油色杯沿、叶形奶泡与凹刻咖啡豆保留原生材质光影。黄铜茶匙形成轻巧斜线，提取后所有不透明像素的 RGB 均保持原样。

### Broken cupping rings

Interrupted cupping rings and short tasting spokes sit on pale rose and oat paper. The paper, grain and soft shadows remain separate from the transparent mark; Coffee keeps its existing green application accent.

浅玫瑰与燕麦色纸底承托断开的杯测环纹和短刻度。纸底、颗粒与柔和阴影独立于透明标记，Coffee 界面保留原有的绿色强调色。

Small-size observation: At 128/64 px, the cup, handle, latte leaf and brass spoon remain distinct. At 32/24/16 px, the warm cup-and-saucer silhouette carries recognition; the incised bean, milk details and paper relief merge. Application headers and browser marks use the transparent foreground.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
