# 🐸 Frogie

## Profile

- Repository: [nocoo/frogie](https://github.com/nocoo/frogie)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: ai
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A local-first home for your AI agents. Chat, tools, and sessions in one place.
- Chinese: AI 智能体的本地工作台，把对话、工具与会话放在一起。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `e965214c3efe99f4c4b459e6716e2014184dc32d`

## Project goal

Work on local project directories through a web coding assistant, keeping conversations, tool execution, MCP tools and resumable sessions together.

通过网页编程助手处理本地项目，把对话、工具执行、MCP 工具和可续接会话放在一起。

- [中文 README](https://github.com/nocoo/frogie/blob/main/README.md) · [English README](https://github.com/nocoo/frogie/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/frogie/tree/79e16babfb6067dcd90ad59b900fa76ad282f35c)
- Source files: [`package.json`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/package.json), [`packages/server/package.json`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/server/package.json), [`packages/web/package.json`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/web/package.json), [`packages/server/src/index.ts`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/server/src/index.ts), [`packages/server/src/auth/middleware.ts`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/server/src/auth/middleware.ts), [`packages/server/src/routes/settings.ts`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/server/src/routes/settings.ts), [`packages/server/src/routes/sessions.ts`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/server/src/routes/sessions.ts), [`packages/server/src/routes/ws-chat.ts`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/server/src/routes/ws-chat.ts), [`packages/server/src/engine/frogie-agent.ts`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/server/src/engine/frogie-agent.ts), [`packages/server/src/engine/builtin-tools.ts`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/server/src/engine/builtin-tools.ts), [`packages/server/src/engine/session-sync.ts`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/server/src/engine/session-sync.ts), [`packages/server/src/mcp/client.ts`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/server/src/mcp/client.ts), [`packages/server/src/db/connection.ts`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/server/src/db/connection.ts), [`packages/web/src/App.tsx`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/web/src/App.tsx), [`packages/web/src/pages/PromptsPage.tsx`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/web/src/pages/PromptsPage.tsx), [`packages/web/src/viewmodels/models.viewmodel.ts`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/web/src/viewmodels/models.viewmodel.ts), [`packages/web/vite.config.ts`](https://github.com/nocoo/frogie/blob/79e16babfb6067dcd90ad59b900fa76ad282f35c/packages/web/vite.config.ts)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript / Bun | Service code, runtime and builds | 服务代码、运行与构建 |
| Hono / WebSocket | HTTP APIs and streaming conversation events | HTTP API 与流式会话事件 |
| Anthropic SDK | Model calls and the custom tool loop | 模型调用与自定义工具循环 |
| MCP TypeScript SDK | stdio connections and tool discovery | stdio 服务连接与工具发现 |
| SQLite / JSON | Settings, session indexes and conversation files | 设置、会话索引与对话文件 |
| React / Vite / Zustand | Web interface and client state | 网页界面与客户端状态 |
| Tailwind CSS / Radix UI | Styling and interactive components | 样式与交互组件 |
| react-markdown / remark-gfm / rehype-highlight | Markdown and code highlighting | Markdown 与代码高亮 |

## Current logo

![Frogie source identity](../../public/logos/display/frogie-160.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Full-body green frog with musical notes
- [Source](https://github.com/nocoo/frogie/blob/e965214c3efe99f4c4b459e6716e2014184dc32d/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/frogie-2026-09-06.png)
- Original dimensions: 2048 × 2048
- Original size: 3588507 bytes
- SHA-256: `752fae79301d175093cc726313c470b4cef4b7b56d299d2e802a4a0f59e39a2b`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#21c45d` | packages/web/src/index.css --primary: 142 71% 45% |
| background | `#eeeff2` | packages/web/src/index.css --background: 220 14% 94% |
| background | `#bbcb9e` | Selected Frogie presentation, finishing 03; background.base in archived settings.json |
| primary | `#86c32c` | Frogie native generation 2097aa50fe3a, sampled sRGB pixel (1065, 512); palette.json |
| accent | `#fbf4a8` | Frogie native generation 2097aa50fe3a, sampled sRGB pixel (1024, 1331); palette.json |
| accent | `#3b1220` | Frogie native generation 2097aa50fe3a, sampled sRGB pixel (1085, 717); palette.json |
| accent | `#f78571` | Frogie native generation 2097aa50fe3a, sampled sRGB pixel (1167, 860); palette.json |
| accent | `#56c8ee` | Frogie native generation 2097aa50fe3a, sampled sRGB pixel (1597, 307); palette.json |
| accent | `#9a4fbd` | Frogie native generation 2097aa50fe3a, sampled sRGB pixel (1803, 713); palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/frogie#brand).
- [Light lockup](../../public/brands/frogie/v1.0.0/lockup-light.png), [dark lockup](../../public/brands/frogie/v1.0.0/lockup-dark.png), [favicon](../../public/brands/frogie/v1.0.0/favicon.ico).
- [Complete usage and integration guide](../../public/brands/frogie/v1.0.0/guide.md), [standalone specimens](../../public/brands/frogie/v1.0.0/review.html), [all exports and SHA-256](../../public/brands/frogie/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Full-body green frog with musical notes.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥62px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 62px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Frogie refined preview](../../public/logos/family/frogie/2026-09-06-01/03/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-06-01`, finishing `03`
- Site path: `/projects/frogie#brand`; [local gallery](https://index.dev.hexly.ai/projects/frogie#brand)
- [Static review HTML](../../artwork/logo-family/frogie/2026-09-06-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/frogie/2026-09-06-01)
- [Transparent foreground](../../public/logos/family/frogie/2026-09-06-01/03/transparent.png); SHA-256: `752fae79301d175093cc726313c470b4cef4b7b56d299d2e802a4a0f59e39a2b`
- [Square icon](../../public/logos/family/frogie/2026-09-06-01/03/icon.png), [rounded icon](../../public/logos/family/frogie/2026-09-06-01/03/rounded.png), [white version](../../public/logos/family/frogie/2026-09-06-01/03/white.png)
- [Untouched generation](../../public/logos/family/frogie/2026-09-06-01/03/raw.png), [exact prompt](../../public/logos/family/frogie/2026-09-06-01/03/prompt.txt), [public asset checksums](../../public/logos/family/frogie/2026-09-06-01/03/manifest.json)
- [Previous original](../../public/logos/originals/frogie.png), copied from [its immutable source](https://github.com/nocoo/frogie/blob/3643e162ef3e3b784a1f8a7c88bd433fae0d5e45/logo.png)
- Previous SHA-256: `cf53c0a17c5a025dcfa4b3b1eb50e1088a62aa89c1d51813881f8a751c61fbb6`
- Generation: Azure Foundry · gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#bbcb9e` | Selected Frogie presentation, finishing 03; background.base in archived settings.json |
| primary | `#86c32c` | Frogie native generation 2097aa50fe3a, sampled sRGB pixel (1065, 512); palette.json |
| accent | `#fbf4a8` | Frogie native generation 2097aa50fe3a, sampled sRGB pixel (1024, 1331); palette.json |
| accent | `#3b1220` | Frogie native generation 2097aa50fe3a, sampled sRGB pixel (1085, 717); palette.json |
| accent | `#f78571` | Frogie native generation 2097aa50fe3a, sampled sRGB pixel (1167, 860); palette.json |
| accent | `#56c8ee` | Frogie native generation 2097aa50fe3a, sampled sRGB pixel (1597, 307); palette.json |
| accent | `#9a4fbd` | Frogie native generation 2097aa50fe3a, sampled sRGB pixel (1803, 713); palette.json |

### A diagonal balance

The seated frog carries the lower-left weight. Six colorful musical shapes lead the eye into the upper-right space.

蹲坐的小青蛙稳住左下方的重心，六个彩色音符把视线带向右上方的留白。

### Flat, connected facets

Broad planes clarify the face and belly. Smaller polygons describe the eyes, open mouth, and familiar little toes.

脸和肚子由大块平面构成，眼睛、张开的嘴巴和脚趾用更细的多边形刻画，保留熟悉的表情。

### A deeper sage field

Deeper sage, visible tonal curves, fine grain, and soft shadows give the green character a matte paper setting.

加深的鼠尾草绿、清晰的同色弧线、细微颗粒与柔和阴影，为绿色角色增添哑光纸面的层次。

Small-size observation: At 16 px the green silhouette and open mouth lead; individual facets and musical notes merge into small color accents.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
