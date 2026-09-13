# 🐱 Meowth

## Profile

- Repository: [nocoo/meowth](https://github.com/nocoo/meowth)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: ai
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: Local bridge for five coding-agent CLIs with HTTP control and a web dashboard
- Chinese: 把五种本机编程 Agent CLI 接入统一 HTTP 服务，并提供网页管理面板。
- Profile section: Recent Projects
- Profile revision: `880737d35ff74923cc0c96873fccf9e09ea5e569`
- Repository revision inspected: `15b4d902c71ec6184c7220f0fb50a29ca87e080d`

## Project goal

Run locally installed coding CLIs through one web console and HTTP API, with streaming output and a record of their sessions.

通过同一个网页控制台与 HTTP 接口调用本机 coding CLI，查看流式输出并保存会话记录。

- [中文 README](https://github.com/nocoo/meowth/blob/main/README.md) · [English README](https://github.com/nocoo/meowth/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/meowth/tree/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7)
- Source files: [`package.json`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/package.json), [`daemon/go.mod`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/daemon/go.mod), [`daemon/cmd/meowthd/main.go`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/daemon/cmd/meowthd/main.go), [`daemon/internal/agentfactory/agentfactory.go`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/daemon/internal/agentfactory/agentfactory.go), [`daemon/internal/server/handlers/exec.go`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/daemon/internal/server/handlers/exec.go), [`daemon/internal/home/home.go`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/daemon/internal/home/home.go), [`daemon/internal/remoteaccess/remoteaccess.go`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/daemon/internal/remoteaccess/remoteaccess.go), [`daemon/internal/store/secret.go`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/daemon/internal/store/secret.go), [`apps/dashboard/package.json`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/apps/dashboard/package.json), [`apps/dashboard/vite.config.ts`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/apps/dashboard/vite.config.ts), [`apps/dashboard/src/models/chat.ts`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/apps/dashboard/src/models/chat.ts), [`apps/dashboard/src/lib/localStorage.ts`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/apps/dashboard/src/lib/localStorage.ts), [`scripts/prepare-dashboard-embed.sh`](https://github.com/nocoo/meowth/blob/803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7/scripts/prepare-dashboard-embed.sh)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Go / Chi | Daemon, HTTP API and CLI subprocesses | daemon、HTTP 接口与 CLI 子进程 |
| SQLite / sqlc | Local tokens, sessions and events | 本地 token、会话与事件 |
| React / TypeScript / Vite | Embedded dashboard | 内嵌 Dashboard |
| Basalt / Tailwind CSS | Components, themes and styling | 组件、主题与样式 |
| React Markdown / remark-gfm | Chat and session content | 聊天与会话内容展示 |
| pnpm / Turborepo | Frontend workspaces and builds | 前端工作区与构建 |

## Current logo

![Meowth source identity](https://h.no.mt/projects/meowth/identity/v1.0.0/meowth-160-619965b3b38b.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Multicolored faceted kitten with a bow tie and paw-print accents
- [Source](https://github.com/nocoo/meowth/blob/15b4d902c71ec6184c7220f0fb50a29ca87e080d/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/meowth/identity/v1.0.0/meowth-13c60445ab61.png)
- Original dimensions: 2048 × 2048
- Original size: 3003934 bytes
- SHA-256: `13c60445ab61a9c54831af5a185d5c137b95a3c9abb672793250ceef29c33541`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#3c83f6` | apps/dashboard/src/index.css :root --primary: 217 91% 60%, converted to sRGB |
| background | `#eeeff2` | apps/dashboard/src/index.css :root --background: 220 14% 94%, converted to sRGB |
| accent | `#1f1f1f` | apps/dashboard/src/index.css :root --foreground: 0 0% 12%, converted to sRGB |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/meowth#brand).
- [Light lockup](https://h.no.mt/brands/meowth/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/meowth/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/meowth/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/meowth/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/meowth/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/meowth/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Silver-blue American Shorthair head playing with one yarn loop.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥97px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 97px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Meowth refined preview](https://h.no.mt/logos/family/meowth/2026-09-07-01/02/icon-160.webp)

- Status: Local review; this finishing pass has not been adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `02`
- Refined subject: A silver-blue American Shorthair head playing with one yarn loop
- Site path: `/projects/meowth#brand`; [local gallery](https://index.dev.hexly.ai/projects/meowth#brand)
- [Static review HTML](../../artwork/logo-family/meowth/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/meowth/2026-09-07-01)
- [Transparent foreground](https://h.no.mt/logos/family/meowth/2026-09-07-01/02/transparent.png); SHA-256: `5d7236bab120c37ab93a929d182708bc1c07da14285925be50c95e868e6ec378`
- [Square icon](https://h.no.mt/logos/family/meowth/2026-09-07-01/02/icon.png), [rounded icon](https://h.no.mt/logos/family/meowth/2026-09-07-01/02/rounded.png), [white version](https://h.no.mt/logos/family/meowth/2026-09-07-01/02/white.png)
- [Untouched generation](https://h.no.mt/logos/family/meowth/2026-09-07-01/02/raw.png), [exact prompt](https://h.no.mt/logos/family/meowth/2026-09-07-01/02/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/meowth/2026-09-07-01/02/manifest.json)
- [Previous original](https://h.no.mt/projects/meowth/identity/v1.0.0/meowth-13c60445ab61.png), copied from [its immutable source](https://github.com/nocoo/meowth/blob/15b4d902c71ec6184c7220f0fb50a29ca87e080d/logo.png)
- Previous SHA-256: `13c60445ab61a9c54831af5a185d5c137b95a3c9abb672793250ceef29c33541`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#b5a6bb` | Selected local presentation, meowth/2026-09-07-01/02; background.base in archived settings.json |
| primary | `#4c6073` | Native meowth 64e396c30a77, sampled sRGB pixel (1180, 680); artwork/logo-family/meowth/2026-09-07-01/palette.json |
| accent | `#bdc2cc` | Native meowth 64e396c30a77, sampled sRGB pixel (840, 710); artwork/logo-family/meowth/2026-09-07-01/palette.json |
| accent | `#e8ded4` | Native meowth 64e396c30a77, sampled sRGB pixel (800, 1300); artwork/logo-family/meowth/2026-09-07-01/palette.json |
| accent | `#e3b265` | Native meowth 64e396c30a77, sampled sRGB pixel (667, 930); artwork/logo-family/meowth/2026-09-07-01/palette.json |
| accent | `#2badb8` | Native meowth 64e396c30a77, sampled sRGB pixel (1740, 1390); artwork/logo-family/meowth/2026-09-07-01/palette.json |
| accent | `#f1958d` | Native meowth 64e396c30a77, sampled sRGB pixel (1650, 1220); artwork/logo-family/meowth/2026-09-07-01/palette.json |

### A tilted head and a waiting paw

The American Shorthair tilts its large head toward a single yarn strand held by one natural paw. Unequal ear heights and the loop beside the cheek establish the offset moment. The complete faceted shoulder contour is uniformly inset with generous room around ears, whiskers and yarn.

美短把大脑袋歪向一根毛线，一只自然的小爪轻轻按住它。高低错落的双耳与脸旁线圈形成偏心瞬间，完整的肩部色块轮廓等比内收，为耳尖、胡须和毛线留出空间。

### Silver tabby, one yarn gesture

Silver, slate blue and warm ivory form the classic tabby markings through connected flat facets. Amber eyes keep the expression clear. Coral, gold, turquoise and violet stay together along one continuous yarn strand instead of spreading across the coat.

银灰、石板蓝和暖象牙白以连贯的平面碎片构成经典虎斑，琥珀眼保持神态清楚。珊瑚、金、青与紫集中在一根连续毛线上，不散落到毛色中。

### Quiet yarn loops

Muted mauve paper carries broad looping relief in the empty corners, echoing the yarn’s action at lower contrast. Fine grain, broad light and shallow contact shadows add depth while keeping the silver portrait distinct from the background.

柔和灰紫纸面在角落留白处铺开宽阔回环，以较低对比呼应毛线动作。细颗粒、宽柔光和浅接触阴影增加层次，让银灰头像与背景清楚分开。

Small-size observation: At 32/16 px the tilted ears, silver tabby mask and amber eyes carry recognition. Fine whiskers and the two bends of the single yarn strand simplify. Sidebar and favicon marks use the transparent cat; large views may use the mauve presentation.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
