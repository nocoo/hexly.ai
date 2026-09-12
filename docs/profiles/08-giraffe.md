# 🦒 Giraffe

## Profile

- Repository: [nocoo/giraffe](https://github.com/nocoo/giraffe)
- Website: [https://giraffe.hexly.ai](https://giraffe.hexly.ai)
- Website evidence: GitHub repository homepage
- Category: tools
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A personal GitHub observatory for repositories, workflows, and encrypted snapshots.
- Chinese: 个人 GitHub 观察台，集中查看仓库、工作流与加密的访问令牌快照。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `c71543478405f580e6dd36ebac18174f7ae6e474`

## Project goal

Review repositories, open work, alerts, and daily changes across GitHub accounts in a personal console with on-demand data refreshes.

在个人控制台查看多个 GitHub 账号的仓库、待办、告警和每日变化，按需同步 GitHub 数据。

- [中文 README](https://github.com/nocoo/giraffe/blob/main/README.md) · [English README](https://github.com/nocoo/giraffe/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/giraffe/tree/d772268203e31098f7efa40a032afee2efa91916)
- Source files: [`package.json`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/package.json), [`src/server/index.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/index.ts), [`src/server/env.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/env.ts), [`src/server/lib/token-crypto.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/lib/token-crypto.ts), [`src/server/lib/db/schema.sql`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/lib/db/schema.sql), [`src/server/routes/accounts.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/routes/accounts.ts), [`src/server/routes/refresh.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/routes/refresh.ts), [`src/server/routes/notifications.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/routes/notifications.ts), [`src/server/lib/collect.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/lib/collect.ts), [`src/server/lib/github-map.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/lib/github-map.ts), [`src/server/lib/insights.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/lib/insights.ts), [`src/server/lib/digest.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/lib/digest.ts), [`src/server/middleware/access.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/middleware/access.ts), [`src/server/middleware/origin.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/middleware/origin.ts), [`src/server/lib/access-config.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/lib/access-config.ts), [`src/server/lib/author-profile.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/server/lib/author-profile.ts), [`src/client/app.tsx`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/client/app.tsx), [`src/client/routes/settings.tsx`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/client/routes/settings.tsx), [`src/client/routes/repo-detail.tsx`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/client/routes/repo-detail.tsx), [`src/client/viewmodels/accounts.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/client/viewmodels/accounts.ts), [`src/client/viewmodels/digest.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/src/client/viewmodels/digest.ts), [`vite.config.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/vite.config.ts), [`wrangler.toml`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/wrangler.toml), [`scripts/dev.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/scripts/dev.ts), [`scripts/ensure-dev-vars.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/scripts/ensure-dev-vars.ts), [`scripts/run-e2e.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/scripts/run-e2e.ts), [`scripts/run-e2e-bdd.ts`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/scripts/run-e2e-bdd.ts), [`dev.vars.example`](https://github.com/nocoo/giraffe/blob/d772268203e31098f7efa40a032afee2efa91916/dev.vars.example)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | Application, Worker, and tooling logic | 应用、Worker 与工具脚本逻辑 |
| React | Console pages and interactions | 控制台页面与交互 |
| Basalt | Shared interface components | 界面组件 |
| Hono | Worker HTTP routes and middleware | Worker HTTP 路由与中间件 |
| Cloudflare Workers | GitHub collection and static hosting | GitHub 数据采集与静态托管 |
| Cloudflare D1 | Accounts, encrypted PATs, and snapshots | 账号、加密 PAT 与快照 |
| Cloudflare Access | Deployment access and API identity | 部署入口与 API 身份认证 |
| GitHub API | REST and GraphQL repository and notification data | REST 与 GraphQL 仓库和通知数据 |
| Vite | Local development and frontend builds | 本地开发与前端构建 |

## Current logo

![Giraffe source identity](../../public/logos/display/giraffe-160.webp)

- Type: Original project artwork, copied without modification
- Subject: Honey-colored giraffe portrait nibbling one colorful acacia sprig
- [Source](https://github.com/nocoo/giraffe/blob/c71543478405f580e6dd36ebac18174f7ae6e474/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/giraffe-family-2026-09-07-01-02.png)
- Original dimensions: 2048 × 2048
- Original size: 3073843 bytes
- SHA-256: `68144efac72c45b858868fe82c6321a3f23b7428581daec62372259c72d20339`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#598128` | src/client/index.css --basalt-primary: 87 53% 33% |
| background | `#eeeff2` | @nocoo/basalt/styles tokens --basalt-background: 220 14% 94% |
| accent | `#884812` | Native giraffe 55739caf938b, sampled sRGB pixel (260, 1830); artwork/logo-family/giraffe/2026-09-07-01/palette.json |
| accent | `#f3d49e` | Native giraffe 55739caf938b, sampled sRGB pixel (957, 923); artwork/logo-family/giraffe/2026-09-07-01/palette.json |
| accent | `#828731` | Native giraffe 55739caf938b, sampled sRGB pixel (1649, 1388); artwork/logo-family/giraffe/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Refined identity

![Giraffe refined preview](../../public/logos/family/giraffe/2026-09-07-01/02/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `02`
- Refined subject: Honey-colored giraffe portrait nibbling one colorful acacia sprig
- Site path: `/projects/giraffe#brand`; [local gallery](https://index.dev.hexly.ai/projects/giraffe#brand)
- [Static review HTML](../../artwork/logo-family/giraffe/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/giraffe/2026-09-07-01)
- [Transparent foreground](../../public/logos/family/giraffe/2026-09-07-01/02/transparent.png); SHA-256: `68144efac72c45b858868fe82c6321a3f23b7428581daec62372259c72d20339`
- [Square icon](../../public/logos/family/giraffe/2026-09-07-01/02/icon.png), [rounded icon](../../public/logos/family/giraffe/2026-09-07-01/02/rounded.png), [white version](../../public/logos/family/giraffe/2026-09-07-01/02/white.png)
- [Untouched generation](../../public/logos/family/giraffe/2026-09-07-01/02/raw.png), [exact prompt](../../public/logos/family/giraffe/2026-09-07-01/02/prompt.txt), [public asset checksums](../../public/logos/family/giraffe/2026-09-07-01/02/manifest.json)
- [Previous original](../../public/logos/originals/giraffe.png), copied from [its immutable source](https://github.com/nocoo/giraffe/blob/13083cd48ff37f4d47f1b5848d980eaa72fba80f/logo.png)
- Previous SHA-256: `169ba1ff6951014dd9fdedb750bc4d65d7099c250eb1f941570bfb3c509db0fe`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#79865b` | Selected Giraffe presentation, 2026-09-07-01/02; background.base in archived settings.json |
| primary | `#e6a328` | Native giraffe 55739caf938b, sampled sRGB pixel (1396, 1263); artwork/logo-family/giraffe/2026-09-07-01/palette.json |
| accent | `#884812` | Native giraffe 55739caf938b, sampled sRGB pixel (260, 1830); artwork/logo-family/giraffe/2026-09-07-01/palette.json |
| accent | `#f3d49e` | Native giraffe 55739caf938b, sampled sRGB pixel (957, 923); artwork/logo-family/giraffe/2026-09-07-01/palette.json |
| accent | `#828731` | Native giraffe 55739caf938b, sampled sRGB pixel (1649, 1388); artwork/logo-family/giraffe/2026-09-07-01/palette.json |
| accent | `#c76036` | Native giraffe 55739caf938b, sampled sRGB pixel (1648, 1477); artwork/logo-family/giraffe/2026-09-07-01/palette.json |

### The last tender leaf

A broad cheek, natural ear spread and a gently diagonal neck form one portrait. The mouth-held acacia sprig stays close; the lower neck continues through the viewfinder.

宽阔脸颊、自然展开的双耳与倾斜颈部构成统一头像。衔住的金合欢叶靠近嘴边，下方颈部自然延续到取景框外。

### Honey and chestnut

Ochre planes and broad chestnut patches preserve the giraffe’s species cues. One colored leaf sprig replaces the enclosing wreath and competing decorative fragments.

赭黄色面与宽阔栗棕斑纹保留物种特征。一枝多彩叶片取代外圈花环与分散的装饰碎片。

### Acacia canopy relief

Staggered flat-topped canopies and open branching stems sit in an olive field. Unequal spans add quiet structure around the ears and leaf gesture.

错落的平顶树冠与开放枝干压在橄榄色底纹上，不同跨度的形状在双耳与叶片周围提供安静的结构。

Small-size observation: Ossicones, both ears, face and every leaf keep at least 164.64 px of rounded-edge clearance. A one-pixel placement correction preserves the native extraction and closes the lower neck entry. The historical original is 1408 px; the new artwork is native 2048 px.

## Further refinements

Keep this asset as the phase-one baseline. A future family version should use a recognizable animal, one principal hue, and restrained multicolored geometric fragments.

Use head portraits for large animals and optionally full-body poses for small animals. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. Preserve this reviewed composition and its archived predecessors.
