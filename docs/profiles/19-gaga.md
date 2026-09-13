# 🧸 Gaga

## Profile

- Repository: [nocoo/gaga](https://github.com/nocoo/gaga)
- Website: [https://gaga.hexly.ai](https://gaga.hexly.ai)
- Website evidence: GitHub repository homepage
- Category: games
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A tiny 3D playroom where Taotao can explore, wander, and discover toys.
- Chinese: 给陶陶的小小三维玩具房，自由走动，探索喜欢的玩具。
- Profile section: Games
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `76260f08329784eead9b30912c7692b8ea0d3d56`

## Project goal

Watch and guide a virtual character through a browser playroom with animated toys, camera controls, and a daily discovery journal.

在浏览器玩耍空间中观察并引导虚拟角色探索玩具，调整视角并查看当天足迹。

- [中文 README](https://github.com/nocoo/gaga/blob/main/README.md) · [English README](https://github.com/nocoo/gaga/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/gaga/tree/76260f08329784eead9b30912c7692b8ea0d3d56)
- Source files: [`package.json`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/package.json), [`src/main.ts`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/src/main.ts), [`src/ui/AppUI.ts`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/src/ui/AppUI.ts), [`src/character/Explorer.ts`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/src/character/Explorer.ts), [`src/character/actions.ts`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/src/character/actions.ts), [`src/character/Taotao.ts`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/src/character/Taotao.ts), [`src/world/Playroom.ts`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/src/world/Playroom.ts), [`src/world/navigation.ts`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/src/world/navigation.ts), [`src/world/toys/index.ts`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/src/world/toys/index.ts), [`src/audio/Soundscape.ts`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/src/audio/Soundscape.ts), [`scripts/smoke.mjs`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/scripts/smoke.mjs), [`vite.config.ts`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/vite.config.ts), [`wrangler.jsonc`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/wrangler.jsonc), [`.github/workflows/ci.yml`](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/.github/workflows/ci.yml)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | Character behavior and application logic | 角色行为与应用逻辑 |
| Three.js | Procedural playroom, character, and toys | 程序化房间、角色与玩具 |
| WebGL | Browser 3D rendering | 浏览器三维渲染 |
| Web Audio | Synthesized ambient music and toy sounds | 合成环境音乐与玩具音效 |
| localStorage | Daily discovery journal | 当天探索足迹 |
| Vite | Development and static builds | 开发与静态构建 |
| Cloudflare Workers | Static application hosting | 应用静态托管 |

## Current logo

![Gaga source identity](https://h.no.mt/projects/gaga/identity/v1.0.0/gaga-160-86881d601f52.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Naturally crouched biscuit-colored rabbit with one colorful carrot
- [Source](https://github.com/nocoo/gaga/blob/76260f08329784eead9b30912c7692b8ea0d3d56/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/gaga/identity/v1.0.0/gaga-family-2026-09-07-01-01-3bbfa196509e.png)
- Original dimensions: 2048 × 2048
- Original size: 2357751 bytes
- SHA-256: `3bbfa196509e08de9c0d0b1ac18e944e3414b7082e70740898a2a09f6ed8f076`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#4c5342` | src/style.css :root color: #4c5342 |
| background | `#f3f0e8` | src/style.css :root background: #f3f0e8 |
| accent | `#ecd3a5` | Native gaga cfe8aeeef77b, sampled sRGB pixel (244, 1120); artwork/logo-family/gaga/2026-09-07-01/palette.json |
| accent | `#997040` | Native gaga cfe8aeeef77b, sampled sRGB pixel (582, 1759); artwork/logo-family/gaga/2026-09-07-01/palette.json |
| accent | `#ed7520` | Native gaga cfe8aeeef77b, sampled sRGB pixel (1867, 1632); artwork/logo-family/gaga/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/gaga#brand).
- [Light lockup](https://h.no.mt/brands/gaga/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/gaga/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/gaga/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/gaga/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/gaga/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/gaga/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Naturally crouched biscuit-colored rabbit with one colorful carrot.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥53px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 53px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Gaga refined preview](https://h.no.mt/logos/family/gaga/2026-09-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `01`
- Refined subject: Naturally crouched biscuit-colored rabbit with one colorful carrot
- Site path: `/projects/gaga#brand`; [local gallery](https://index.dev.hexly.ai/projects/gaga#brand)
- [Static review HTML](../../artwork/logo-family/gaga/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/gaga/2026-09-07-01)
- [Transparent foreground](https://h.no.mt/logos/family/gaga/2026-09-07-01/01/transparent.png); SHA-256: `3bbfa196509e08de9c0d0b1ac18e944e3414b7082e70740898a2a09f6ed8f076`
- [Square icon](https://h.no.mt/logos/family/gaga/2026-09-07-01/01/icon.png), [rounded icon](https://h.no.mt/logos/family/gaga/2026-09-07-01/01/rounded.png), [white version](https://h.no.mt/logos/family/gaga/2026-09-07-01/01/white.png)
- [Untouched generation](https://h.no.mt/logos/family/gaga/2026-09-07-01/01/raw.png), [exact prompt](https://h.no.mt/logos/family/gaga/2026-09-07-01/01/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/gaga/2026-09-07-01/01/manifest.json)
- [Previous original](https://h.no.mt/shared/site/v1.0.0/gaga-abfcdf4a83a6.svg), copied from [its immutable source](https://github.com/nocoo/gaga/blob/b960a12ce78a579ac9e99c4b985aaf85d5b8c8aa/public/favicon.svg)
- Previous SHA-256: `abfcdf4a83a692c90f0e3f9b40380fb3f3a701923291c7a45a71778386146995`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#b38c77` | Selected Gaga presentation, 2026-09-07-01/01; background.base in archived settings.json |
| primary | `#c39c65` | Native gaga cfe8aeeef77b, sampled sRGB pixel (1306, 1590); artwork/logo-family/gaga/2026-09-07-01/palette.json |
| accent | `#ecd3a5` | Native gaga cfe8aeeef77b, sampled sRGB pixel (244, 1120); artwork/logo-family/gaga/2026-09-07-01/palette.json |
| accent | `#997040` | Native gaga cfe8aeeef77b, sampled sRGB pixel (582, 1759); artwork/logo-family/gaga/2026-09-07-01/palette.json |
| accent | `#ed7520` | Native gaga cfe8aeeef77b, sampled sRGB pixel (1867, 1632); artwork/logo-family/gaga/2026-09-07-01/palette.json |
| accent | `#418e8c` | Native gaga cfe8aeeef77b, sampled sRGB pixel (1727, 1215); artwork/logo-family/gaga/2026-09-07-01/palette.json |

### A small discovery

A rabbit pauses in a natural crouch beside a carrot. The whole animal includes its ears, haunches, short forepaws and small tail; the face carries the moment.

小兔在胡萝卜旁自然蹲伏，完整呈现耳朵、后腿轮廓、短前爪和小尾巴，用脸部表情捕捉这一刻。

### Biscuit and cream

Large warm tan and cream facets keep the body soft and readable. One carrot and its colorful leaves form a single accent group beside the muzzle.

大块暖褐与奶油色切面让身体柔和易读，一根胡萝卜及其彩色叶片在嘴边构成单一兴趣点。

### Playroom folds

Offset rounded paper folds sit on a warm clay field. Their gentle corners and broad openings give the rabbit a tactile, quiet setting.

错位的圆角纸面铺在暖陶土色底色上，柔和转角和宽阔开口营造安静的触感背景。

Small-size observation: The complete animal and accessory have at least 183.5 px clearance from the actual rounded outline. Ten export sizes preserve one uniform placement. Small app/browser marks use the transparent foreground; fine facets and accessory details simplify at 16 px.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
