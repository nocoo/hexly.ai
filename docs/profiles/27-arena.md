# 🏟️ Arena

## Profile

- Repository: [nocoo/arena](https://github.com/nocoo/arena)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: ai
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: Let coding agents debate solutions while you review, compare, and decide.
- Chinese: 让多个编程智能体提出方案、展开讨论，由你比较、审阅并做决定。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `4a9efd6690942dd1384fd807ba83c73e7c29c202`

## Project goal

Collect coding assistants’ proposals on a local discussion board, let a person record decisions, and return those checkpoints to assistants through a CLI.

在本机讨论看板汇集编码助手的方案，由人记录决策，再通过 CLI 将 checkpoint 提供给助手读取。

- [中文 README](https://github.com/nocoo/arena/blob/main/README.md) · [English README](https://github.com/nocoo/arena/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/arena/tree/4356c962fbd24903265d9f4dc680dcb9d6fcbb93)
- Source files: [`package.json`](https://github.com/nocoo/arena/blob/4356c962fbd24903265d9f4dc680dcb9d6fcbb93/package.json), [`packages/core/src/db/connection.ts`](https://github.com/nocoo/arena/blob/4356c962fbd24903265d9f4dc680dcb9d6fcbb93/packages/core/src/db/connection.ts), [`packages/core/src/services/arena.ts`](https://github.com/nocoo/arena/blob/4356c962fbd24903265d9f4dc680dcb9d6fcbb93/packages/core/src/services/arena.ts), [`packages/core/src/services/project-id.ts`](https://github.com/nocoo/arena/blob/4356c962fbd24903265d9f4dc680dcb9d6fcbb93/packages/core/src/services/project-id.ts), [`packages/cli/src/index.ts`](https://github.com/nocoo/arena/blob/4356c962fbd24903265d9f4dc680dcb9d6fcbb93/packages/cli/src/index.ts), [`packages/cli/src/commands/pop.ts`](https://github.com/nocoo/arena/blob/4356c962fbd24903265d9f4dc680dcb9d6fcbb93/packages/cli/src/commands/pop.ts), [`packages/web/package.json`](https://github.com/nocoo/arena/blob/4356c962fbd24903265d9f4dc680dcb9d6fcbb93/packages/web/package.json), [`packages/web/src/auth.ts`](https://github.com/nocoo/arena/blob/4356c962fbd24903265d9f4dc680dcb9d6fcbb93/packages/web/src/auth.ts), [`packages/web/src/app/api/checkpoint/route.ts`](https://github.com/nocoo/arena/blob/4356c962fbd24903265d9f4dc680dcb9d6fcbb93/packages/web/src/app/api/checkpoint/route.ts), [`packages/web/src/app/topic/[id]/topic-view.tsx`](https://github.com/nocoo/arena/blob/4356c962fbd24903265d9f4dc680dcb9d6fcbb93/packages/web/src/app/topic/[id]/topic-view.tsx)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Bun / TypeScript | CLI and shared logic | CLI 与共享逻辑 |
| commander | CLI argument parsing | CLI 参数解析 |
| SQLite / Drizzle ORM | Local discussion data | 本地讨论数据 |
| Next.js / React | Dashboard and server routes | 看板与服务端路由 |
| NextAuth / Google OAuth | Dashboard login | 看板登录 |
| Tailwind CSS / Radix UI | Styling and UI components | 样式与界面组件 |

## Current logo

![Arena source identity](../../public/logos/display/arena-160.webp)

- Type: Original project artwork, copied without modification
- Subject: Walnut dual-dial chess clock
- [Source](https://github.com/nocoo/arena/blob/4a9efd6690942dd1384fd807ba83c73e7c29c202/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/arena-family-2026-09-07-01-01.png)
- Original dimensions: 2048 × 2048
- Original size: 3658121 bytes
- SHA-256: `84ab91476407de4ab4094adace81a6ff7958512c5f0066c3fc62a63421728e59`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#7430e8` | packages/web/src/app/globals.css --primary: 262 80% 55% |
| background | `#eeeff2` | packages/web/src/app/globals.css --background: 220 14% 94% |
| accent | `#67442b` | Native arena 5f6923caeb83, sampled sRGB pixel (1307, 528); artwork/logo-family/arena/2026-09-07-01/palette.json |
| accent | `#dcccaa` | Native arena 5f6923caeb83, sampled sRGB pixel (580, 909); artwork/logo-family/arena/2026-09-07-01/palette.json |
| accent | `#947544` | Native arena 5f6923caeb83, sampled sRGB pixel (1498, 257); artwork/logo-family/arena/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Refined identity

![Arena refined preview](../../public/logos/family/arena/2026-09-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `01`
- Refined subject: Walnut dual-dial chess clock
- Site path: `/logos/arena`; [local gallery](https://index.dev.hexly.ai/logos/arena)
- [Static review HTML](../../artwork/logo-family/arena/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/arena/2026-09-07-01)
- [Transparent foreground](../../public/logos/family/arena/2026-09-07-01/01/transparent.png); SHA-256: `84ab91476407de4ab4094adace81a6ff7958512c5f0066c3fc62a63421728e59`
- [Square icon](../../public/logos/family/arena/2026-09-07-01/01/icon.png), [rounded icon](../../public/logos/family/arena/2026-09-07-01/01/rounded.png), [white version](../../public/logos/family/arena/2026-09-07-01/01/white.png)
- [Untouched generation](../../public/logos/family/arena/2026-09-07-01/01/raw.png), [exact prompt](../../public/logos/family/arena/2026-09-07-01/01/prompt.txt), [public asset checksums](../../public/logos/family/arena/2026-09-07-01/01/manifest.json)
- [Previous original](../../public/logos/emoji/arena.png), copied from [its immutable source](https://github.com/nocoo/nocoo/blob/9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6/README.md)
- Previous SHA-256: `5654aa8fec9d7aa368c120d1ed58c5ae02d4ca6ef8cdd12b136324256acd3b57`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#d4c1a7` | Adopted Arena presentation, 2026-09-07-01/01; background.base in archived settings.json |
| primary | `#67442b` | Native arena 5f6923caeb83, sampled sRGB pixel (1307, 528); artwork/logo-family/arena/2026-09-07-01/palette.json |
| accent | `#dcccaa` | Native arena 5f6923caeb83, sampled sRGB pixel (580, 909); artwork/logo-family/arena/2026-09-07-01/palette.json |
| accent | `#947544` | Native arena 5f6923caeb83, sampled sRGB pixel (1498, 257); artwork/logo-family/arena/2026-09-07-01/palette.json |

### A measured exchange

Two ivory faces share one broad walnut chess clock, with a brass plunger above each side. The paired mechanism gives agent debate and human checkpoints a tangible metaphor.

两面象牙色钟盘共用一座宽阔胡桃木棋钟，各配黄铜按钮，以双侧计时比喻 Agent 讨论与人工检查点。

### Walnut and ivory dials

Natural wood grain, opaque dial faces and crisp metal rims carry the detail. One complete compact object remains legible as the camera pulls back.

天然木纹、不透明钟盘和清晰金属包边构成细节；镜头拉远时仍是一件完整、紧凑、易识别的实物。

### Paired debate arcs

Two offset dial arcs with alternating short speaking-turn marks on warm oak-toned paper. The field, grain and contact shadow are independent of transparent app marks.

暖色纸面上的双侧计时弧线与交错回合短刻度。 底色、颗粒与接触阴影均独立于透明应用标记。

Small-size observation: At 128/64 px, the twin ivory dials and walnut frame remain clear. At 32/24/16 px, the compact silhouette and dominant colors carry recognition; fine material detail, printed marks and background lines naturally merge.

## Further refinements

This is an owner-directed physical material or architectural identity. Preserve its physical materials, complete silhouette, selected camera and distinct tonal presentation. The animal-series drawing and accessory rules do not apply.

Keep the complete object uniformly inset from the actual rounded outline, with backgrounds, projected shadows and any external emission separate from the transparent foreground. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. Preserve this reviewed composition and its archived predecessors.
