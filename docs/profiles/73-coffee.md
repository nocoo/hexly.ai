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
- Repository revision inspected: `a6f179b1f530b1511e276eae6d3989a43c08a833`

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
- Subject: Dark-green six-point sparkle with a coffee bean, the original application icon
- [Source](https://github.com/nocoo/coffee/blob/a6f179b1f530b1511e276eae6d3989a43c08a833/public/icon-512.png): `public/icon-512.png`
- [Preserved asset](../../public/logos/originals/coffee-initial.png)
- Original dimensions: 512 × 512
- Original size: 12915 bytes
- SHA-256: `63c37f0e536e01f3d0cf0f6750d8be01e1f957a91b1f862f5778241b460cda20`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#c7d9a9` | src/styles.css :root --accent at a6f179b1f530b1511e276eae6d3989a43c08a833 |
| background | `#f8f6f0` | src/styles.css :root --bg at a6f179b1f530b1511e276eae6d3989a43c08a833 |
| accent | `#f2d5d9` | src/styles.css :root --pink at a6f179b1f530b1511e276eae6d3989a43c08a833 |
| accent | `#d9c9f0` | src/styles.css :root --illustration at a6f179b1f530b1511e276eae6d3989a43c08a833 |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Future family notes

Keep the current source mark and its provenance. For a future study, choose a recognizable physical object from the tool's actual function and follow the owner's material and composition direction. An animal or fragmented drawing is not required.

Keep the complete object uniformly inset from the actual rounded outline, with backgrounds, projected shadows and any external emission separate from the transparent foreground. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. This entry uses the preserved local application artwork; any new study follows its own recorded review decision.
