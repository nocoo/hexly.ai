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

![Coffee source identity](../../public/logos/display/coffee-160.webp)

- Type: Original project artwork, copied without modification
- Subject: Peach ceramic cup, latte leaf, saucer and brass teaspoon
- [Source](https://github.com/nocoo/coffee/blob/0f0b9acd71497ed65c27cc3623f65a7e9a655f09/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/coffee-family-2026-09-11-01-01.png)
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

## Refined identity

![Coffee refined preview](../../public/logos/family/coffee/2026-09-11-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-11.
- Study `2026-09-11-01`, finishing `01`
- Refined subject: Peach ceramic cup, latte leaf, saucer and brass teaspoon
- Site path: `/projects/coffee#brand`; [local gallery](https://index.dev.hexly.ai/projects/coffee#brand)
- [Static review HTML](../../artwork/logo-family/coffee/2026-09-11-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/coffee/2026-09-11-01)
- [Transparent foreground](../../public/logos/family/coffee/2026-09-11-01/01/transparent.png); SHA-256: `d00ad151f073a71b2b324b86903154551a8acd38d91d53f83fae9d661e0cb124`
- [Square icon](../../public/logos/family/coffee/2026-09-11-01/01/icon.png), [rounded icon](../../public/logos/family/coffee/2026-09-11-01/01/rounded.png), [white version](../../public/logos/family/coffee/2026-09-11-01/01/white.png)
- [Untouched generation](../../public/logos/family/coffee/2026-09-11-01/01/raw.png), [exact prompt](../../public/logos/family/coffee/2026-09-11-01/01/prompt.txt), [public asset checksums](../../public/logos/family/coffee/2026-09-11-01/01/manifest.json)
- [Previous original](../../public/logos/originals/coffee-initial.png), copied from [its immutable source](https://github.com/nocoo/coffee/blob/a6f179b1f530b1511e276eae6d3989a43c08a833/public/icon-512.png)
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

This is an owner-directed physical material or architectural identity. Preserve its physical materials, complete silhouette, selected camera and distinct tonal presentation. The animal-series drawing and accessory rules do not apply.

Keep the complete object uniformly inset from the actual rounded outline, with backgrounds, projected shadows and any external emission separate from the transparent foreground. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. Preserve this reviewed composition and its archived predecessors.
