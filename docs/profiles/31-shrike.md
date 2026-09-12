# 🪶 Shrike

## Profile

- Repository: [nocoo/shrike](https://github.com/nocoo/shrike)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: tools
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A small macOS menu bar app that keeps your files in sync with Google Drive.
- Chinese: 轻巧的 macOS 菜单栏工具，把文件和文件夹同步到 Google Drive。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `0fec187fc22742664925897400d0c1a62b2478bb`

## Project goal

Back up selected files and development configurations on a Mac to Google Drive's local directory, with sync triggered from the app or a local HTTP request.

在 Mac 上将选定文件和开发配置备份到 Google Drive 的本地目录，通过应用或本机 HTTP 请求触发同步。

- [中文 README](https://github.com/nocoo/shrike/blob/main/README.md) · [English README](https://github.com/nocoo/shrike/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/shrike/tree/0fec187fc22742664925897400d0c1a62b2478bb)
- Source files: [`package.json`](https://github.com/nocoo/shrike/blob/0fec187fc22742664925897400d0c1a62b2478bb/package.json), [`next.config.mjs`](https://github.com/nocoo/shrike/blob/0fec187fc22742664925897400d0c1a62b2478bb/next.config.mjs), [`src-tauri/Cargo.toml`](https://github.com/nocoo/shrike/blob/0fec187fc22742664925897400d0c1a62b2478bb/src-tauri/Cargo.toml), [`src-tauri/tauri.conf.json`](https://github.com/nocoo/shrike/blob/0fec187fc22742664925897400d0c1a62b2478bb/src-tauri/tauri.conf.json), [`src-tauri/src/lib.rs`](https://github.com/nocoo/shrike/blob/0fec187fc22742664925897400d0c1a62b2478bb/src-tauri/src/lib.rs), [`src-tauri/src/types.rs`](https://github.com/nocoo/shrike/blob/0fec187fc22742664925897400d0c1a62b2478bb/src-tauri/src/types.rs), [`src-tauri/src/commands.rs`](https://github.com/nocoo/shrike/blob/0fec187fc22742664925897400d0c1a62b2478bb/src-tauri/src/commands.rs), [`src-tauri/src/webhook.rs`](https://github.com/nocoo/shrike/blob/0fec187fc22742664925897400d0c1a62b2478bb/src-tauri/src/webhook.rs), [`src-tauri/src/sync/executor.rs`](https://github.com/nocoo/shrike/blob/0fec187fc22742664925897400d0c1a62b2478bb/src-tauri/src/sync/executor.rs), [`src/hooks/use-file-list.ts`](https://github.com/nocoo/shrike/blob/0fec187fc22742664925897400d0c1a62b2478bb/src/hooks/use-file-list.ts), [`src/components/settings-page.tsx`](https://github.com/nocoo/shrike/blob/0fec187fc22742664925897400d0c1a62b2478bb/src/components/settings-page.tsx)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Tauri / Rust | Desktop app and file operations | 桌面应用与文件操作 |
| Next.js / React | Statically exported desktop interface | 静态导出的桌面界面 |
| TypeScript | Frontend logic | 前端逻辑 |
| Tailwind CSS / Radix UI | Styling and UI components | 样式与界面组件 |
| Tokio / Axum | Local HTTP API | 本机 HTTP 接口 |
| rsync | Incremental file copying | 增量文件复制 |
| Tauri Store | Local settings and backup list | 本地设置与备份列表 |

## Current logo

![Shrike source identity](../../public/logos/display/shrike-160.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Shrike portrait
- [Source](https://github.com/nocoo/shrike/blob/0fec187fc22742664925897400d0c1a62b2478bb/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/shrike.png)
- Original dimensions: 2048 × 2048
- Original size: 3750012 bytes
- SHA-256: `97692ebf5b7811eb48005f814a5688bc05d582533adab440636295370a60befa`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#86502c` | src/app/globals.css --primary: oklch(0.486 0.088 52.8) |
| background | `#fffbf9` | src/app/globals.css --background: oklch(0.99 0.005 53) |
| accent | `#a0a2a6` | Preserved project artwork, sampled pixel |
| accent | `#1a1918` | Preserved project artwork, sampled pixel |
| accent | `#c5c7ce` | Preserved project artwork, sampled pixel |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/shrike#brand).
- [Light lockup](../../public/brands/shrike/v1.0.0/lockup-light.png), [dark lockup](../../public/brands/shrike/v1.0.0/lockup-dark.png), [favicon](../../public/brands/shrike/v1.0.0/favicon.ico).
- [Complete usage and integration guide](../../public/brands/shrike/v1.0.0/guide.md), [standalone specimens](../../public/brands/shrike/v1.0.0/review.html), [all exports and SHA-256](../../public/brands/shrike/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Grey faceted shrike with a dark eye mask.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥74px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 74px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Shrike refined preview](../../public/logos/family/shrike/2026-09-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `01`
- Refined subject: Original grey faceted shrike with a dark eye mask
- Site path: `/projects/shrike#brand`; [local gallery](https://index.dev.hexly.ai/projects/shrike#brand)
- [Static review HTML](../../artwork/logo-family/shrike/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/shrike/2026-09-07-01)
- [Transparent foreground](../../public/logos/family/shrike/2026-09-07-01/01/transparent.png); SHA-256: `97692ebf5b7811eb48005f814a5688bc05d582533adab440636295370a60befa`
- [Square icon](../../public/logos/family/shrike/2026-09-07-01/01/icon.png), [rounded icon](../../public/logos/family/shrike/2026-09-07-01/01/rounded.png), [white version](../../public/logos/family/shrike/2026-09-07-01/01/white.png)
- [Untouched original](../../public/logos/family/shrike/2026-09-07-01/01/source.png), [presentation brief](../../public/logos/family/shrike/2026-09-07-01/01/brief.txt), [public asset checksums](../../public/logos/family/shrike/2026-09-07-01/01/manifest.json)
- [Previous original](../../public/logos/originals/shrike.png), copied from [its immutable source](https://github.com/nocoo/shrike/blob/9ca43106ca79f35f7b0ad77198b82150a2307b44/logo.png)
- Previous SHA-256: `97692ebf5b7811eb48005f814a5688bc05d582533adab440636295370a60befa`
- Original artwork retained byte-for-byte at native 2048 × 2048. Zero image-generation calls; only background, grain, and shadow layers were composed.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#718591` | Selected Shrike presentation, finishing 01; background.base in archived settings.json |
| primary | `#a0a1a6` | Original shrike 97692ebf5b78, sampled sRGB pixel (1363, 324); palette.json |
| accent | `#c4c7ce` | Original shrike 97692ebf5b78, sampled sRGB pixel (1081, 284); palette.json |
| accent | `#1a1a18` | Original shrike 97692ebf5b78, sampled sRGB pixel (1091, 636); palette.json |
| accent | `#b7936f` | Original shrike 97692ebf5b78, sampled sRGB pixel (1197, 1367); palette.json |
| accent | `#576475` | Original shrike 97692ebf5b78, sampled sRGB pixel (322, 801); palette.json |

### Keep the watchful profile

The original head, hooked beak, eye mask, shoulders, and canvas are preserved exactly. The existing compact silhouette stays the source of every foreground size.

头部、钩状鸟喙、眼罩、肩羽和画布全部原样保留，现有紧凑轮廓是所有透明尺寸的唯一来源。

### Silver facets, dark mask

The silver crown, charcoal eye band, blue-grey beak, and warm shoulder facets are untouched. No new ornament or image-generation call is needed for this retained identity.

银灰头顶、炭黑眼带、蓝灰鸟喙与暖色肩羽均未修改。这次沿用既有形象，不增加装饰或调用生图。

### Angular paper folds

Oversized angular pleats enter a slate field from opposite corners. Narrow edge highlights and a low shadow give the grey bird separation without adding a scene.

大幅折翼纹从对角进入石板色底面，细边高光和轻浅阴影让灰色主体清晰浮现，保持图标简洁。

Small-size observation: The beak and dark eye band carry the mark at small sizes. Menu bar template icons keep their existing monochrome silhouette; app, toolbar, and browser derivatives retain their distinct roles.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
