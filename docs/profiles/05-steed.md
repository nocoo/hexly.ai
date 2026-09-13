# 🐎 Steed

## Profile

- Repository: [nocoo/steed](https://github.com/nocoo/steed)
- Website: [https://steed.hexly.ai](https://steed.hexly.ai)
- Website evidence: apps/web/wrangler.toml routes
- Category: ai
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A shared home for AI agents, their assets, and the relationships between them.
- Chinese: 面向多智能体的 AI 工作台，管理各个 Agent 的资源与关联。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `bcab1f113b9b7cde65898bbd23705c7dac339634`

## Project goal

Give users a shared inventory of agents, CLI tools and their bindings across hosts, so they can check status, ownership and business categories.

集中盘点多台主机上的 Agent、CLI 工具资源与绑定关系，帮助使用者核对运行状态、资源归属和业务分类。

- [中文 README](https://github.com/nocoo/steed/blob/main/README.md) · [English README](https://github.com/nocoo/steed/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/steed/tree/bcab1f113b9b7cde65898bbd23705c7dac339634)
- Source files: [`package.json`](https://github.com/nocoo/steed/blob/bcab1f113b9b7cde65898bbd23705c7dac339634/package.json), [`apps/web/package.json`](https://github.com/nocoo/steed/blob/bcab1f113b9b7cde65898bbd23705c7dac339634/apps/web/package.json), [`apps/web/worker/index.ts`](https://github.com/nocoo/steed/blob/bcab1f113b9b7cde65898bbd23705c7dac339634/apps/web/worker/index.ts), [`apps/web/wrangler.toml`](https://github.com/nocoo/steed/blob/bcab1f113b9b7cde65898bbd23705c7dac339634/apps/web/wrangler.toml), [`packages/api/src/server/router.ts`](https://github.com/nocoo/steed/blob/bcab1f113b9b7cde65898bbd23705c7dac339634/packages/api/src/server/router.ts), [`packages/worker/src/routes/bindings.ts`](https://github.com/nocoo/steed/blob/bcab1f113b9b7cde65898bbd23705c7dac339634/packages/worker/src/routes/bindings.ts), [`packages/cli/src/config/defaults.ts`](https://github.com/nocoo/steed/blob/bcab1f113b9b7cde65898bbd23705c7dac339634/packages/cli/src/config/defaults.ts), [`packages/cli/src/service/scanner/data-source.ts`](https://github.com/nocoo/steed/blob/bcab1f113b9b7cde65898bbd23705c7dac339634/packages/cli/src/service/scanner/data-source.ts), [`packages/cli/src/commands/init.ts`](https://github.com/nocoo/steed/blob/bcab1f113b9b7cde65898bbd23705c7dac339634/packages/cli/src/commands/init.ts)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | Shared types | 共享类型 |
| Bun | CLI & host service | CLI 与主机服务 |
| React | Web console | Web 控制台 |
| Vite | Frontend build | 前端构建 |
| React Flow | Relationship map | 关系图 |
| Hono | API routes | API 路由 |
| Cloudflare Workers | Application hosting | 应用托管 |
| D1 | Asset storage | 资产存储 |
| Cloudflare Access | Console access | 控制台访问 |

## Current logo

![Steed source identity](https://h.no.mt/projects/steed/identity/v1.0.0/steed-160-9338a3bb05b4.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Chestnut horse portrait with an ivory blaze and one colorful bird
- [Source](https://github.com/nocoo/steed/blob/bcab1f113b9b7cde65898bbd23705c7dac339634/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/steed/identity/v1.0.0/steed-family-2026-09-07-02-01-a58914242de4.png)
- Original dimensions: 2048 × 2048
- Original size: 3189966 bytes
- SHA-256: `a58914242de4d8f074ed64d8eb4dfb234354334618940c08d5f4e941edb35a44`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#1da599` | apps/web/src/index.css --primary: 175 70% 38% |
| background | `#eef1f1` | apps/web/src/index.css --background: 180 10% 94% |
| accent | `#4d3428` | Native steed 5ff814fe012b, sampled sRGB pixel (1165, 638); artwork/logo-family/steed/2026-09-07-02/palette.json |
| accent | `#f3d2a9` | Native steed 5ff814fe012b, sampled sRGB pixel (1153, 982); artwork/logo-family/steed/2026-09-07-02/palette.json |
| accent | `#309eaf` | Native steed 5ff814fe012b, sampled sRGB pixel (1632, 1233); artwork/logo-family/steed/2026-09-07-02/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/steed#brand).
- [Light lockup](https://h.no.mt/brands/steed/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/steed/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/steed/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/steed/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/steed/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/steed/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Chestnut horse portrait with an ivory blaze and one colorful bird.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Keep the existing portrait's natural frame entry. The full square is placed against the baseline; no anatomy is extended, trimmed or masked. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留原头像自然入框的边界，将完整方形画布贴齐基线；不补画、不截取解剖结构。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥71px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 71px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Steed refined preview](https://h.no.mt/logos/family/steed/2026-09-07-02/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-02`, finishing `01`
- Refined subject: Chestnut horse portrait with an ivory blaze and one colorful bird
- Site path: `/projects/steed#brand`; [local gallery](https://index.dev.hexly.ai/projects/steed#brand)
- [Static review HTML](../../artwork/logo-family/steed/2026-09-07-02/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/steed/2026-09-07-02)
- [Transparent foreground](https://h.no.mt/logos/family/steed/2026-09-07-02/01/transparent.png); SHA-256: `a58914242de4d8f074ed64d8eb4dfb234354334618940c08d5f4e941edb35a44`
- [Square icon](https://h.no.mt/logos/family/steed/2026-09-07-02/01/icon.png), [rounded icon](https://h.no.mt/logos/family/steed/2026-09-07-02/01/rounded.png), [white version](https://h.no.mt/logos/family/steed/2026-09-07-02/01/white.png)
- [Untouched generation](https://h.no.mt/logos/family/steed/2026-09-07-02/01/raw.png), [exact prompt](https://h.no.mt/logos/family/steed/2026-09-07-02/01/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/steed/2026-09-07-02/01/manifest.json)
- [Previous original](https://h.no.mt/shared/site/v1.0.0/steed-9543be6d4d51.png), copied from [its immutable source](https://github.com/nocoo/steed/blob/1159f3769ec3c0a00a9a2bf32e914cf7cff00e33/logo.png)
- Previous SHA-256: `9543be6d4d51cca7174ddd485f1bfd87540c22c79c52c8f1186a1fb0efac1719`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#53817c` | Selected Steed presentation, 2026-09-07-02/01; background.base in archived settings.json |
| primary | `#ba7135` | Native steed 5ff814fe012b, sampled sRGB pixel (659, 480); artwork/logo-family/steed/2026-09-07-02/palette.json |
| accent | `#4d3428` | Native steed 5ff814fe012b, sampled sRGB pixel (1165, 638); artwork/logo-family/steed/2026-09-07-02/palette.json |
| accent | `#f3d2a9` | Native steed 5ff814fe012b, sampled sRGB pixel (1153, 982); artwork/logo-family/steed/2026-09-07-02/palette.json |
| accent | `#309eaf` | Native steed 5ff814fe012b, sampled sRGB pixel (1632, 1233); artwork/logo-family/steed/2026-09-07-02/palette.json |
| accent | `#eb8361` | Native steed 5ff814fe012b, sampled sRGB pixel (1459, 1107); artwork/logo-family/steed/2026-09-07-02/palette.json |

### A small visitor

The horse turns with relaxed ears and a soft muzzle. A small bird sits at the outer mane edge, visibly extending into negative space; natural shoulder anatomy continues below and to the right.

马儿转头，耳朵放松、口鼻柔和。一只小鸟停在鬃毛外缘，伸入留白；自然肩部向下方与右侧延续。

### Chestnut, chocolate, ivory

Broad chestnut coat planes meet a dark chocolate mane and a quiet ivory blaze. The single jewel-colored bird carries the multicolored detail.

宽阔栗棕毛色切面与深巧克力色鬃毛、安静的象牙白额纹相接。多彩细节集中在一只宝石色小鸟上。

### Canter pleats

Unequal long wind folds lean across a deep petrol-teal field. Fine grain and shallow shadows separate the warm horse from its cooler setting.

长短不一的风褶斜穿深汽油青色底纹，细颗粒与浅阴影让暖色马儿从偏冷背景中显现。

Small-size observation: The complete ears, mane tips, face and bird retain at least 214.5 px of protected clearance. Only natural lower/right shoulder entries cross the frame. Two native requests were made: study 01 was rejected because its bird stayed inside the mane; study 02 is selected.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
