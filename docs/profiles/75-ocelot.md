# 🐆 Ocelot

## Profile

- Repository: [nocoo/ocelot](https://github.com/nocoo/ocelot)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: tools
- Archived repository: No; [repository status evidence](../../docs/sources/ocelot-2026-09-11.json)
- English: Read-only Obsidian reader for public and private GitHub vaults
- Chinese: 面向 GitHub 公开与私有知识库的只读 Obsidian 阅读器
- Profile section: Recent Projects
- Profile revision: `63fcd1383c1b1eca0f4471c47000feab852ab953`
- Repository revision inspected: `9d27eea583794ccda07dd2454c2a40302f86e227`

## Project goal

Read public and private Obsidian vaults from GitHub in a quiet, single-user web reader. Browse folders, follow wiki links and outlines, render math and diagrams, and apply new Git revisions explicitly while the source vault stays read-only. Production configuration is prepared; no deployed homepage is verified.

在安静的单用户网页阅读器里阅读 GitHub 上的公开和私有 Obsidian 知识库。浏览目录、跟随双链与大纲、查看公式图表，并主动应用新的 Git 版本，源知识库始终只读。生产配置已准备，尚无已验证的线上入口。

- [中文 README](https://github.com/nocoo/ocelot/blob/main/README.md) · [English README](https://github.com/nocoo/ocelot/blob/main/docs/README.en.md)
- Verified: 2026-09-11; [source revision](https://github.com/nocoo/ocelot/tree/9d27eea583794ccda07dd2454c2a40302f86e227)
- Source files: [`README.md`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/README.md), [`docs/README.en.md`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/docs/README.en.md), [`AGENTS.md`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/AGENTS.md), [`package.json`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/package.json), [`src/views/styles.css`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/src/views/styles.css), [`src/views/Mark.tsx`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/src/views/Mark.tsx), [`src/views/App.tsx`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/src/views/App.tsx), [`src/views/Markdown.tsx`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/src/views/Markdown.tsx), [`src/views/NavigationTree.tsx`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/src/views/NavigationTree.tsx), [`src/viewmodels/reader.ts`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/src/viewmodels/reader.ts), [`worker/index.ts`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/worker/index.ts), [`worker/app.ts`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/worker/app.ts), [`worker/auth.ts`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/worker/auth.ts), [`worker/github.ts`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/worker/github.ts), [`worker/store.ts`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/worker/store.ts), [`docs/02-github-auth-cache-and-sync.md`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/docs/02-github-auth-cache-and-sync.md), [`docs/06-running-and-deployment.md`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/docs/06-running-and-deployment.md), [`docs/08-visual-identity.md`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/docs/08-visual-identity.md), [`assets/brand/provenance.json`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/assets/brand/provenance.json), [`index.html`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/index.html), [`wrangler.jsonc`](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/wrangler.jsonc)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript / React / Vite | MVVM web reader and static frontend builds | MVVM 网页阅读器与静态前端构建 |
| Basalt 2.1.7 / Pierre Trees | Controls, application layout and virtualized vault navigation | 控件、应用布局与知识库虚拟目录 |
| react-markdown / unified | GFM, frontmatter, Obsidian links, callouts and sanitized HTML | GFM、frontmatter、Obsidian 链接、提示块与 HTML 清理 |
| KaTeX / Mermaid | Mathematical notation and diagrams | 数学公式与图表 |
| Cloudflare Workers / Access | Owner authentication and read-only GitHub requests | 所有者身份验证与只读 GitHub 请求 |
| Cloudflare D1 / private R2 | Repository metadata and a rebuildable private cache | 仓库元数据与可重建的私有缓存 |
| Vitest / Playwright / Biome | Runtime coverage, browser accessibility and static checks | 运行时代码覆盖率、浏览器无障碍与静态检查 |

## Current logo

![Ocelot source identity](https://h.no.mt/projects/ocelot/identity/v1.0.0/ocelot-160-ef26140991e8.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Warm-gold faceted ocelot watching a colorful paper bird
- [Source](https://github.com/nocoo/ocelot/blob/9d27eea583794ccda07dd2454c2a40302f86e227/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/ocelot/identity/v1.0.0/ocelot-family-2026-09-11-01-03-c593f3d70908.png)
- Original dimensions: 2048 × 2048
- Original size: 4575584 bytes
- SHA-256: `c593f3d709085a3fa2b5c6132cc6c43ac3bde3ebd084806137faa02a514ab4d5`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#435e73` | src/views/styles.css :root --accent at 9d27eea583794ccda07dd2454c2a40302f86e227 |
| background | `#fefefd` | src/views/styles.css :root --paper at 9d27eea583794ccda07dd2454c2a40302f86e227 |
| accent | `#283440` | src/views/styles.css :root --ink at 9d27eea583794ccda07dd2454c2a40302f86e227 |
| background | `#e7d4b7` | Owner-authorized Ocelot presentation 2026-09-11-01/03; background.base in archived settings.json |
| accent | `#dba55d` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (1000, 600); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#e7b070` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (940, 540); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#ecdbbe` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (1260, 1200); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#1c1814` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (650, 1080); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#ed8052` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (1690, 550); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#e8a446` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (1855, 480); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#2b6672` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (1790, 590); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#917451` | Designed independent background motif, 22% opacity; artwork/logo-family/ocelot/2026-09-11-01/finishing/03/settings.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/ocelot#brand).
- [Light lockup](https://h.no.mt/brands/ocelot/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/ocelot/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/ocelot/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/ocelot/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/ocelot/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/ocelot/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Warm-gold faceted ocelot watching a colorful paper bird.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Keep the existing portrait's natural frame entry. The full square is placed against the baseline; no anatomy is extended, trimmed or masked. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留原头像自然入框的边界，将完整方形画布贴齐基线；不补画、不截取解剖结构。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥78px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 78px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Ocelot refined preview](https://h.no.mt/logos/family/ocelot/2026-09-11-01/03/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-11.
- Study `2026-09-11-01`, finishing `03`
- Refined subject: Warm-gold faceted ocelot watching a colorful paper bird
- Site path: `/projects/ocelot#brand`; [local gallery](https://index.dev.hexly.ai/projects/ocelot#brand)
- [Static review HTML](../../artwork/logo-family/ocelot/2026-09-11-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/ocelot/2026-09-11-01)
- [Transparent foreground](https://h.no.mt/logos/family/ocelot/2026-09-11-01/03/transparent.png); SHA-256: `c593f3d709085a3fa2b5c6132cc6c43ac3bde3ebd084806137faa02a514ab4d5`
- [Square icon](https://h.no.mt/logos/family/ocelot/2026-09-11-01/03/icon.png), [rounded icon](https://h.no.mt/logos/family/ocelot/2026-09-11-01/03/rounded.png), [white version](https://h.no.mt/logos/family/ocelot/2026-09-11-01/03/white.png)
- [Untouched generation](https://h.no.mt/logos/family/ocelot/2026-09-11-01/03/raw.png), [exact prompt](https://h.no.mt/logos/family/ocelot/2026-09-11-01/03/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/ocelot/2026-09-11-01/03/manifest.json)
- [Previous original](https://h.no.mt/shared/site/v1.0.0/ocelot-initial-15feb95dae2e.svg), copied from [its immutable source](https://github.com/nocoo/ocelot/blob/b2d89fd134464ab2812a08e6e46703c7cdddd44d/public/favicon.svg)
- Previous SHA-256: `15feb95dae2e98e98cb6f173ae619db6ba65815c71932f19506e708dd42fc5d6`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#e7d4b7` | Owner-authorized Ocelot presentation 2026-09-11-01/03; background.base in archived settings.json |
| primary | `#dba55d` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (1000, 600); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#e7b070` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (940, 540); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#ecdbbe` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (1260, 1200); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#1c1814` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (650, 1080); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#ed8052` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (1690, 550); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#e8a446` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (1855, 480); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#2b6672` | Native Ocelot output SHA-256 4c73d8f8bc72c14e02260cbddd8c49d8aa6c526c53d5aad449eb30d764f61d3a; opaque sRGB pixel (1790, 590); artwork/logo-family/ocelot/2026-09-11-01/palette.json |
| accent | `#917451` | Designed independent background motif, 22% opacity; artwork/logo-family/ocelot/2026-09-11-01/finishing/03/settings.json |

### A glance at a paper bird

The ocelot turns toward the upper-right bird with both eyes visible. Its shoulder enters naturally through the bottom and lower-left frame. Both ears and the complete bird clear the rounded outline; the nearest bird tip retains 62.9 px of space.

豹猫转向右上方的纸鸟，双眼清晰可见。肩部自然延伸出底边与左下边框，双耳和纸鸟均完整保留，鸟翼尖距实际圆角边界最近为 62.9 px。

### Gold facets and dark rosettes

Connected irregular planes run across the face, ears and shoulder. Dark elongated spots, amber eyes and ivory whiskers keep the species readable. One coral, saffron and teal folded-paper bird supplies the secondary gesture; native opaque RGB is unchanged.

连贯的不规则平面贯穿脸部、耳朵与肩颈，深色长斑、琥珀色双眼和象牙色胡须保留物种特征。珊瑚、藏红花与青绿色折纸鸟形成唯一的彩色趣味点，不透明像素保留原生 RGB。

### Rosettes and turned pages

Broken almond rosettes sit in the upper-left negative space while asymmetric page curves sweep through the lower-right. Sand paper, fine grain and two shallow shadows remain independent of the transparent mark. The application keeps its cool blue-gray theme.

左上留白铺陈断开的杏仁形斑纹，右下以不对称曲线呼应翻页。砂色纸底、细颗粒和两层浅阴影独立于透明标记，应用保留原有的冷蓝灰配色。

Small-size observation: At 128/64 px the two eyes, dark markings and paper bird remain distinct. At 32/24/16 px the warm feline profile carries recognition; whiskers, small spots and bird folds merge. App navigation and browser tabs use the full transparent foreground.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
