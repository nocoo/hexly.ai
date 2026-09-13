# 🦦 Otter

## Profile

- Repository: [nocoo/otter](https://github.com/nocoo/otter)
- Website: [https://otter.hexly.ai](https://otter.hexly.ai)
- Website evidence: GitHub repository homepage
- Category: tools
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: Keep your Mac development setup safe with snapshots, diffs, and cloud backups.
- Chinese: 用快照、差异比较与云端备份，保存 Mac 开发环境的每一次变化。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `0c87197fc9b67d74f9ed6ee70c7ea8c9c4567fe3`

## Project goal

Save macOS development settings and inventories as snapshots for inspection and migration.

保存 macOS 开发环境配置与清单快照，方便查看变化和迁移电脑。

- [中文 README](https://github.com/nocoo/otter/blob/main/README.md) · [English README](https://github.com/nocoo/otter/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/otter/tree/74276e49d667df345cac4d6590e01469f35c1115)
- Source files: [`package.json`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/package.json), [`packages/cli/package.json`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/package.json), [`packages/core/package.json`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/core/package.json), [`packages/api/package.json`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/api/package.json), [`packages/web/package.json`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/web/package.json), [`packages/worker/package.json`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/worker/package.json), [`packages/cli/src/cli.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/src/cli.ts), [`packages/cli/src/commands/login.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/src/commands/login.ts), [`packages/cli/src/commands/backup.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/src/commands/backup.ts), [`packages/cli/src/commands/snapshot.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/src/commands/snapshot.ts), [`packages/cli/src/config/manager.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/src/config/manager.ts), [`packages/cli/src/storage/local.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/src/storage/local.ts), [`packages/cli/src/collectors/index.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/src/collectors/index.ts), [`packages/cli/src/collectors/claude-config.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/src/collectors/claude-config.ts), [`packages/cli/src/collectors/hermes.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/src/collectors/hermes.ts), [`packages/cli/src/collectors/shell-config.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/src/collectors/shell-config.ts), [`packages/cli/src/utils/redact.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/src/utils/redact.ts), [`packages/cli/src/uploader/webhook.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/src/uploader/webhook.ts), [`packages/worker/src/index.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/worker/src/index.ts), [`packages/worker/wrangler.toml`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/worker/wrangler.toml), [`packages/api/src/app.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/api/src/app.ts), [`packages/api/src/middleware/access-auth.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/api/src/middleware/access-auth.ts), [`packages/api/src/middleware/api-key-auth.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/api/src/middleware/api-key-auth.ts), [`packages/api/src/routes/auth-cli.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/api/src/routes/auth-cli.ts), [`packages/api/src/routes/api-snapshots.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/api/src/routes/api-snapshots.ts), [`packages/api/src/lib/snapshot-repo.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/api/src/lib/snapshot-repo.ts), [`packages/api/src/routes/live.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/api/src/routes/live.ts), [`packages/web/vite.config.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/web/vite.config.ts), [`packages/web/src/pages/SnapshotsPage.tsx`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/web/src/pages/SnapshotsPage.tsx), [`packages/web/src/components/snapshot/export-section.tsx`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/web/src/components/snapshot/export-section.tsx), [`scripts/run-api-e2e.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/scripts/run-api-e2e.ts), [`scripts/run-e2e-spa.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/scripts/run-e2e-spa.ts), [`vitest.l2.config.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/vitest.l2.config.ts), [`packages/cli/e2e/cli-binary.test.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/cli/e2e/cli-binary.test.ts), [`packages/web/e2e/playwright.config.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/packages/web/e2e/playwright.config.ts), [`playwright.config.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/playwright.config.ts), [`e2e/bdd/app.spec.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/e2e/bdd/app.spec.ts), [`.github/workflows/ci.yml`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/.github/workflows/ci.yml), [`.github/workflows/release.yml`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/.github/workflows/release.yml), [`scripts/release.ts`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/scripts/release.ts), [`LICENSE`](https://github.com/nocoo/otter/blob/74276e49d667df345cac4d6590e01469f35c1115/LICENSE)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | CLI, collectors, API and web application | CLI、采集器、API 与 Web 应用 |
| Node.js / @nocoo/base-cli | Command-line runtime, login and configuration | 命令行运行、登录与配置 |
| Bun workspaces | Dependencies and development scripts | 依赖管理与开发脚本 |
| Hono / Cloudflare Workers | Single Worker for API and static assets | 单 Worker 提供 API 与静态资源 |
| Cloudflare D1 | Users, tokens, webhooks and snapshot indexes | 用户、Token、Webhook 与快照索引 |
| Cloudflare R2 | Snapshot JSON and application icons | 快照 JSON 与应用图标 |
| Vite / React | Snapshot browsing and JSON export | 快照查看与 JSON 导出 |
| Cloudflare Access / jose | Browser identity and JWT verification | 浏览器身份与 JWT 校验 |

## Current logo

![Otter source identity](https://h.no.mt/projects/otter/identity/v1.0.0/otter-160-d78ff81524b3.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Brown otter in a relaxed curl holding one colorful river shell
- [Source](https://github.com/nocoo/otter/blob/0c87197fc9b67d74f9ed6ee70c7ea8c9c4567fe3/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/otter/identity/v1.0.0/otter-family-2026-09-07-01-02-8902636945ce.png)
- Original dimensions: 2048 × 2048
- Original size: 2941233 bytes
- SHA-256: `8902636945ce93cd1a6f39a8e545d6462f0b5dd09c3d4d16d66f037d8bf10933`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#1b99a7` | packages/web/src/globals.css --primary: 186 72% 38% |
| background | `#eeeff2` | packages/web/src/globals.css --background: 220 14% 94% |
| accent | `#61462f` | Native otter eeca4aa68c5f, sampled sRGB pixel (850, 1091); artwork/logo-family/otter/2026-09-07-01/palette.json |
| accent | `#ead0a5` | Native otter eeca4aa68c5f, sampled sRGB pixel (863, 544); artwork/logo-family/otter/2026-09-07-01/palette.json |
| accent | `#409999` | Native otter eeca4aa68c5f, sampled sRGB pixel (1128, 424); artwork/logo-family/otter/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/otter#brand).
- [Light lockup](https://h.no.mt/brands/otter/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/otter/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/otter/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/otter/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/otter/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/otter/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Brown otter in a relaxed curl holding one colorful river shell.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥64px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 64px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Otter refined preview](https://h.no.mt/logos/family/otter/2026-09-07-01/02/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `02`
- Refined subject: Brown otter in a relaxed curl holding one colorful river shell
- Site path: `/projects/otter#brand`; [local gallery](https://index.dev.hexly.ai/projects/otter#brand)
- [Static review HTML](../../artwork/logo-family/otter/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/otter/2026-09-07-01)
- [Transparent foreground](https://h.no.mt/logos/family/otter/2026-09-07-01/02/transparent.png); SHA-256: `8902636945ce93cd1a6f39a8e545d6462f0b5dd09c3d4d16d66f037d8bf10933`
- [Square icon](https://h.no.mt/logos/family/otter/2026-09-07-01/02/icon.png), [rounded icon](https://h.no.mt/logos/family/otter/2026-09-07-01/02/rounded.png), [white version](https://h.no.mt/logos/family/otter/2026-09-07-01/02/white.png)
- [Untouched generation](https://h.no.mt/logos/family/otter/2026-09-07-01/02/raw.png), [exact prompt](https://h.no.mt/logos/family/otter/2026-09-07-01/02/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/otter/2026-09-07-01/02/manifest.json)
- [Previous original](https://h.no.mt/shared/site/v1.0.0/otter-c811a8f167c1.png), copied from [its immutable source](https://github.com/nocoo/otter/blob/10f4b2d4d137a9afa79c61622afd68fa03fff80e/logo.png)
- Previous SHA-256: `c811a8f167c11b250bd19b5cd569477e109ece11777cbf6d04c80de4be8eed78`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#648691` | Selected Otter presentation, 2026-09-07-01/02; background.base in archived settings.json |
| primary | `#a97542` | Native otter eeca4aa68c5f, sampled sRGB pixel (847, 273); artwork/logo-family/otter/2026-09-07-01/palette.json |
| accent | `#61462f` | Native otter eeca4aa68c5f, sampled sRGB pixel (850, 1091); artwork/logo-family/otter/2026-09-07-01/palette.json |
| accent | `#ead0a5` | Native otter eeca4aa68c5f, sampled sRGB pixel (863, 544); artwork/logo-family/otter/2026-09-07-01/palette.json |
| accent | `#409999` | Native otter eeca4aa68c5f, sampled sRGB pixel (1128, 424); artwork/logo-family/otter/2026-09-07-01/palette.json |
| accent | `#e99178` | Native otter eeca4aa68c5f, sampled sRGB pixel (1227, 348); artwork/logo-family/otter/2026-09-07-01/palette.json |

### A small river treasure

The otter pauses in a relaxed curl and holds a shell beside its muzzle. Small ears, cream whisker pads, natural paws and a tapering tail make the species clear.

水獭放松地蜷起身体，将贝壳捧在嘴边。小耳朵、奶油色须垫、自然爪子与渐细长尾让物种特征更加清晰。

### Brown carries the identity

Chestnut, umber and cream replace the competing body colors. A single fan-shaped shell carries turquoise, coral, violet and gold beside the face.

栗棕、深棕与奶油色取代相互争抢的身体色块。一枚扇形贝壳在脸旁集中呈现松石、珊瑚、紫与金色。

### Riverbank sweeps

Two broad offset eddies and a low bank sweep cross a blue-gray field. Open curves and fine grain give the warm animal a cooler, quiet setting.

两道宽阔错位的回旋和一条低岸曲线穿过蓝灰底色，开放曲线与细颗粒为暖色主体提供安静的冷色背景。

Small-size observation: The complete animal and accessory have at least 224.5 px clearance from the actual rounded outline. Ten export sizes preserve one uniform placement. Small app/browser marks use the transparent foreground; fine facets and accessory details simplify at 16 px.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
