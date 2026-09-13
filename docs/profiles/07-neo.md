# 🔐 Neo

## Profile

- Repository: [nocoo/neo](https://github.com/nocoo/neo)
- Website: [https://neo.hexly.ai](https://neo.hexly.ai)
- Website evidence: Owner-confirmed Docker/jp2 deployment, 2026-09-12; public /api/live verified in docs/sources/status-targets-2026-09-12.json
- Category: everyday
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: Your two-factor codes, together. Encrypted storage, easy imports, and offline access.
- Chinese: 把双重验证口令放在一起，支持加密存储、多格式导入与离线访问。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `0d750484792449914b07e9b3e3404a823493f8a5`

## Project goal

Manage authentication secrets and TOTP codes in a browser, move data between authenticators, and maintain encrypted backup archives.

在浏览器中管理认证密钥和 TOTP 验证码，在认证器之间迁移数据，并维护加密备份归档。

- [中文 README](https://github.com/nocoo/neo/blob/main/README.md) · [English README](https://github.com/nocoo/neo/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/neo/tree/4e7a2ab145d021addf932c7a154416e99a8bf451)
- Source files: [`package.json`](https://github.com/nocoo/neo/blob/4e7a2ab145d021addf932c7a154416e99a8bf451/package.json), [`auth.ts`](https://github.com/nocoo/neo/blob/4e7a2ab145d021addf932c7a154416e99a8bf451/auth.ts), [`lib/db/d1-client.ts`](https://github.com/nocoo/neo/blob/4e7a2ab145d021addf932c7a154416e99a8bf451/lib/db/d1-client.ts), [`lib/db/scoped.ts`](https://github.com/nocoo/neo/blob/4e7a2ab145d021addf932c7a154416e99a8bf451/lib/db/scoped.ts), [`viewmodels/useSecretsViewModel.ts`](https://github.com/nocoo/neo/blob/4e7a2ab145d021addf932c7a154416e99a8bf451/viewmodels/useSecretsViewModel.ts), [`models/backup-archive.ts`](https://github.com/nocoo/neo/blob/4e7a2ab145d021addf932c7a154416e99a8bf451/models/backup-archive.ts), [`models/import-parsers.ts`](https://github.com/nocoo/neo/blob/4e7a2ab145d021addf932c7a154416e99a8bf451/models/import-parsers.ts), [`app/sw.ts`](https://github.com/nocoo/neo/blob/4e7a2ab145d021addf932c7a154416e99a8bf451/app/sw.ts), [`worker/src/index.ts`](https://github.com/nocoo/neo/blob/4e7a2ab145d021addf932c7a154416e99a8bf451/worker/src/index.ts)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | Application and OTP logic | 应用与 OTP 逻辑 |
| Next.js | Web application and server actions | Web 应用与服务端操作 |
| React | Secret management interface | 密钥管理界面 |
| Tailwind CSS | Interface styles | 界面样式 |
| Cloudflare D1 | User-scoped data through the HTTP API | 经 HTTP API 存储用户数据 |
| Auth.js | Google sign-in and sessions | Google 登录与会话 |
| Web Crypto | TOTP and AES-GCM backup encryption | TOTP 与 AES-GCM 备份加密 |
| Serwist | PWA caching and offline fallback | PWA 缓存与离线回退 |

## Current logo

![Neo source identity](https://h.no.mt/projects/neo/identity/v1.0.0/neo-160-1003fcb81839.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Golden retriever portrait
- [Source](https://github.com/nocoo/neo/blob/0d750484792449914b07e9b3e3404a823493f8a5/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/neo/identity/v1.0.0/neo-2939c3edb084.png)
- Original dimensions: 2048 × 2048
- Original size: 4237355 bytes
- SHA-256: `2939c3edb084df9e8e0f823dc1433a87374e4432b6af9c94097c10d7dd36bb2d`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#3c83f6` | app/globals.css imports @nocoo/basalt/styles: 217 91% 60% |
| background | `#eeeff2` | app/globals.css --background: 220 14% 94% |
| accent | `#ffdebc` | Preserved project artwork, sampled pixel |
| accent | `#b17157` | Preserved project artwork, sampled pixel |
| accent | `#f3be7f` | Preserved project artwork, sampled pixel |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/neo#brand).
- [Light lockup](https://h.no.mt/brands/neo/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/neo/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/neo/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/neo/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/neo/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/neo/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Golden faceted retriever with a relaxed smile.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Keep the existing portrait's natural frame entry. The full square is placed against the baseline; no anatomy is extended, trimmed or masked. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留原头像自然入框的边界，将完整方形画布贴齐基线；不补画、不截取解剖结构。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥48px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 48px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Neo refined preview](https://h.no.mt/logos/family/neo/2026-09-07-03/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-03`, finishing `01`
- Refined subject: Original golden faceted retriever with a relaxed smile
- Site path: `/projects/neo#brand`; [local gallery](https://index.dev.hexly.ai/projects/neo#brand)
- [Static review HTML](../../artwork/logo-family/neo/2026-09-07-03/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/neo/2026-09-07-03)
- [Transparent foreground](https://h.no.mt/logos/family/neo/2026-09-07-03/01/transparent.png); SHA-256: `2939c3edb084df9e8e0f823dc1433a87374e4432b6af9c94097c10d7dd36bb2d`
- [Square icon](https://h.no.mt/logos/family/neo/2026-09-07-03/01/icon.png), [rounded icon](https://h.no.mt/logos/family/neo/2026-09-07-03/01/rounded.png), [white version](https://h.no.mt/logos/family/neo/2026-09-07-03/01/white.png)
- [Untouched original](https://h.no.mt/logos/family/neo/2026-09-07-03/01/source.png), [presentation brief](https://h.no.mt/logos/family/neo/2026-09-07-03/01/brief.txt), [public asset checksums](https://h.no.mt/logos/family/neo/2026-09-07-03/01/manifest.json)
- [Previous original](https://h.no.mt/projects/neo/identity/v1.0.0/neo-2939c3edb084.png), copied from [its immutable source](https://github.com/nocoo/neo/blob/856e487050327aa471ff9761c9d111822f2b46db/logo.png)
- Previous SHA-256: `2939c3edb084df9e8e0f823dc1433a87374e4432b6af9c94097c10d7dd36bb2d`
- Original artwork retained byte-for-byte at native 2048 × 2048. Zero image-generation calls; only background, grain, and shadow layers were composed.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#5c7eaa` | Selected Neo presentation, finishing 01; background.base in archived settings.json |
| primary | `#f4be7e` | Original neo 2939c3edb084, sampled sRGB pixel (1447, 448); palette.json |
| accent | `#ffdebb` | Original neo 2939c3edb084, sampled sRGB pixel (1040, 504); palette.json |
| accent | `#b17158` | Original neo 2939c3edb084, sampled sRGB pixel (345, 729); palette.json |
| accent | `#e88089` | Original neo 2939c3edb084, sampled sRGB pixel (919, 1539); palette.json |
| accent | `#322a37` | Original neo 2939c3edb084, sampled sRGB pixel (855, 1120); palette.json |

### Keep the relaxed smile

The original face, ears, smile, tongue, and lower-frame entry stay unchanged. No elongated-neck candidate or new paw is substituted for the owner-retained portrait.

原来的脸、耳朵、笑容、舌头与下方入框关系全部保留，不以延长颈部的候选或新增爪子替换用户选定的头像。

### Warm gold on clear facets

Golden and cream planes carry the dog, with its existing rose tongue and dark nose. The original transparency, color, anatomy, and framing are copied byte-for-byte.

金色与奶油色面构成小狗，保留原来的玫瑰舌头和深色鼻尖。透明度、色彩、解剖与构图均逐字节复制。

### Broad folds of blue light

Unequal oblique paper planes cross the blue negative space. The cooler setting separates the golden face, while fine grain and a shallow shadow keep the family material consistent.

宽窄不一的斜向纸面穿过蓝色留白，清凉底色突出金色面部，细颗粒与浅阴影保持家族材质的一致。

Small-size observation: The golden ears, dark nose, and open smile remain clear at 32 px. Finer coat planes simplify at 16 px. Sidebar and browser marks stay transparent; touch and install icons use platform-specific presentations.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
