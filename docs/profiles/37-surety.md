# 🛡️ Surety

## Profile

- Repository: [nocoo/surety](https://github.com/nocoo/surety)
- Website: [https://surety.hexly.ai](https://surety.hexly.ai)
- Website evidence: README.md browser access
- Category: everyday
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A private, local-first home for your family insurance policies.
- Chinese: 以隐私和本地数据为先，为家庭保险保单建立一个清晰的档案。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `f257e0977e85358f9d02ed3f79a9fad8862e5117`

## Project goal

Organize household policies, coverage, payment schedules and medical visits.

集中整理家庭保单、保障范围、缴费计划和就诊记录。

- [中文 README](https://github.com/nocoo/surety/blob/main/README.md) · [English README](https://github.com/nocoo/surety/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/surety/tree/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767)
- Source files: [`package.json`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/package.json), [`apps/web/package.json`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/web/package.json), [`apps/web/vite.config.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/web/vite.config.ts), [`apps/web/src/App.tsx`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/web/src/App.tsx), [`apps/web/src/app/policies/[id]/page.tsx`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/web/src/app/policies/[id]/page.tsx), [`apps/web/src/app/settings/page.tsx`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/web/src/app/settings/page.tsx), [`apps/worker/package.json`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/worker/package.json), [`apps/worker/wrangler.toml`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/worker/wrangler.toml), [`apps/worker/src/index.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/worker/src/index.ts), [`apps/worker/src/middleware/access-auth.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/worker/src/middleware/access-auth.ts), [`apps/worker/src/middleware/api-key-auth.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/worker/src/middleware/api-key-auth.ts), [`apps/worker/src/middleware/is-localhost.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/worker/src/middleware/is-localhost.ts), [`apps/worker/src/routes/auth-cli.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/worker/src/routes/auth-cli.ts), [`apps/worker/src/routes/policies.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/worker/src/routes/policies.ts), [`apps/worker/src/routes/backup.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/worker/src/routes/backup.ts), [`apps/worker/src/routes/settings.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/worker/src/routes/settings.ts), [`apps/cli/package.json`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/cli/package.json), [`apps/cli/src/config.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/cli/src/config.ts), [`apps/cli/src/commands/auth.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/cli/src/commands/auth.ts), [`apps/cli/src/commands/policies.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/cli/src/commands/policies.ts), [`packages/db/src/index.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/packages/db/src/index.ts), [`packages/db/src/schema.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/packages/db/src/schema.ts), [`packages/db/src/backup.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/packages/db/src/backup.ts), [`packages/db/src/types.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/packages/db/src/types.ts), [`packages/api/src/lib/attachment-validation.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/packages/api/src/lib/attachment-validation.ts), [`packages/api/src/renewal-calendar.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/packages/api/src/renewal-calendar.ts), [`scripts/run-l2-http.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/scripts/run-l2-http.ts), [`scripts/run-l3-server.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/scripts/run-l3-server.ts), [`scripts/seed-remote.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/scripts/seed-remote.ts), [`apps/web/playwright.config.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/apps/web/playwright.config.ts), [`drizzle.config.ts`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/drizzle.config.ts), [`.github/workflows/release.yml`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/.github/workflows/release.yml), [`LICENSE`](https://github.com/nocoo/surety/blob/4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767/LICENSE)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | Application, CLI and shared logic | 应用、CLI 与共享逻辑 |
| Bun workspaces | Dependencies, CLI runtime and scripts | 依赖管理、CLI 运行时与脚本 |
| Vite | SPA development and builds | SPA 开发与构建 |
| React | Household policy and medical-visit interface | 家庭保单与就诊界面 |
| Hono | HTTP API and authentication middleware | HTTP API 与认证中间件 |
| Cloudflare Workers | API and static assets | API 与静态资源 |
| Drizzle ORM | Schema and data access | Schema 与数据访问 |
| Cloudflare D1 | Household, policy and medical records | 家庭、保单与就诊数据 |
| Cloudflare R2 | Policy attachments | 保单附件 |
| Cloudflare Access | Browser authentication | 浏览器身份认证 |

## Current logo

![Surety source identity](https://h.no.mt/projects/surety/identity/v1.0.0/surety-160-8948672f84c1.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Amber lion portrait with one multicolored butterfly
- [Source](https://github.com/nocoo/surety/blob/f257e0977e85358f9d02ed3f79a9fad8862e5117/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/surety/identity/v1.0.0/surety-family-2026-09-07-01-01-cb590912df7e.png)
- Original dimensions: 2048 × 2048
- Original size: 3212224 bytes
- SHA-256: `cb590912df7eb4ad0cf505b195870d448cde7ee3c8038ed7ea8a7ca5a8462314`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#ed511d` | apps/web/src/globals.css --primary: 15 85% 52% |
| background | `#eeeff2` | apps/web/src/globals.css --background: 220 14% 94% |
| accent | `#754321` | Native surety ae84f2009fb7, sampled sRGB pixel (466, 1388); artwork/logo-family/surety/2026-09-07-01/palette.json |
| accent | `#edcfa7` | Native surety ae84f2009fb7, sampled sRGB pixel (1466, 1263); artwork/logo-family/surety/2026-09-07-01/palette.json |
| accent | `#19989b` | Native surety ae84f2009fb7, sampled sRGB pixel (1778, 915); artwork/logo-family/surety/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/surety#brand).
- [Light lockup](https://h.no.mt/brands/surety/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/surety/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/surety/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/surety/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/surety/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/surety/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Amber lion portrait with one multicolored butterfly.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥67px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 67px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Surety refined preview](https://h.no.mt/logos/family/surety/2026-09-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `01`
- Refined subject: Amber lion portrait with one multicolored butterfly
- Site path: `/projects/surety#brand`; [local gallery](https://index.dev.hexly.ai/projects/surety#brand)
- [Static review HTML](../../artwork/logo-family/surety/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/surety/2026-09-07-01)
- [Transparent foreground](https://h.no.mt/logos/family/surety/2026-09-07-01/01/transparent.png); SHA-256: `cb590912df7eb4ad0cf505b195870d448cde7ee3c8038ed7ea8a7ca5a8462314`
- [Square icon](https://h.no.mt/logos/family/surety/2026-09-07-01/01/icon.png), [rounded icon](https://h.no.mt/logos/family/surety/2026-09-07-01/01/rounded.png), [white version](https://h.no.mt/logos/family/surety/2026-09-07-01/01/white.png)
- [Untouched generation](https://h.no.mt/logos/family/surety/2026-09-07-01/01/raw.png), [exact prompt](https://h.no.mt/logos/family/surety/2026-09-07-01/01/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/surety/2026-09-07-01/01/manifest.json)
- [Previous original](https://h.no.mt/shared/site/v1.0.0/surety-13b22815f3d0.png), copied from [its immutable source](https://github.com/nocoo/surety/blob/aad7b0298935b71642e8d25abb125c0cb9cc0d22/logo.png)
- Previous SHA-256: `13b22815f3d07d56ee294f005db9638809e0329fedce51887dd55cba75b01dc6`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#9b865c` | Selected Surety presentation, 2026-09-07-01/01; background.base in archived settings.json |
| primary | `#cc8330` | Native surety ae84f2009fb7, sampled sRGB pixel (1280, 708); artwork/logo-family/surety/2026-09-07-01/palette.json |
| accent | `#754321` | Native surety ae84f2009fb7, sampled sRGB pixel (466, 1388); artwork/logo-family/surety/2026-09-07-01/palette.json |
| accent | `#edcfa7` | Native surety ae84f2009fb7, sampled sRGB pixel (1466, 1263); artwork/logo-family/surety/2026-09-07-01/palette.json |
| accent | `#19989b` | Native surety ae84f2009fb7, sampled sRGB pixel (1778, 915); artwork/logo-family/surety/2026-09-07-01/palette.json |
| accent | `#6f4584` | Native surety ae84f2009fb7, sampled sRGB pixel (1770, 1105); artwork/logo-family/surety/2026-09-07-01/palette.json |

### The guardian pauses

The complete irregular mane frames a quiet head turn. A butterfly beside the nose adds a single secondary focus; the whole group sits safely inside the rounded tile.

完整而自然的鬃毛围住安静转动的脸，鼻尖旁的蝴蝶成为唯一的兴趣点。整组主体在圆角内保留留白。

### Amber takes the lead

Broad honey and umber planes describe the face and mane. The former tiger identity is replaced by a recognizable lion, with color concentrated in one small butterfly.

大块蜜金与深棕色面描绘脸部和鬃毛。旧虎形标识替换为清晰的狮子，多彩点缀集中在一只小蝴蝶上。

### Folded amber fan

Unequal fan folds spread from a low off-center pivot. Deeper ochre, fine grain and shallow shadows give the mane separation without competing with its expression.

不等宽的扇形折面从偏下方展开，较深赭色、细颗粒和浅阴影托起鬃毛，同时保留表情的主导地位。

Small-size observation: The whole mane and butterfly stay inside the rounded outline with at least 145.5 px of native clearance. Small marks use the transparent lion; butterfly details simplify at 16 px.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
