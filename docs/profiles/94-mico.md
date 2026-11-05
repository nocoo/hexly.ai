# 🖼️ Mico

## Profile

- Repository: [nocoo/mico](https://github.com/nocoo/mico)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: ai
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A local-first canvas where people and AI agents create together
- Chinese: 一个本地优先的画布，让人与 AI Agent 共同创作
- Profile section: Recent Projects
- Profile revision: `2b464b1089c468de0c79dc6fa02b8d831cb3341e`
- Repository revision inspected: `8a41d3a5df8a94c4ab4dc8128d71c5b5f7540682`

## Project goal

Provide a local-first collaborative canvas for people and AI agents, with named boards shared across the browser, daemon and CLI.

提供本地优先的协作画布，让人与 AI Agent 通过浏览器、守护进程和命令行共同创建和更新命名画布。

- [中文 README](https://github.com/nocoo/mico/blob/main/README.md) · [English README](https://github.com/nocoo/mico/blob/main/docs/README.en.md)
- Verified: 2026-11-05; [source revision](https://github.com/nocoo/mico/tree/8a41d3a5df8a94c4ab4dc8128d71c5b5f7540682)
- Source files: [`README.md`](https://github.com/nocoo/mico/blob/8a41d3a5df8a94c4ab4dc8128d71c5b5f7540682/README.md), [`package.json`](https://github.com/nocoo/mico/blob/8a41d3a5df8a94c4ab4dc8128d71c5b5f7540682/package.json), [`src/shared/palette.ts`](https://github.com/nocoo/mico/blob/8a41d3a5df8a94c4ab4dc8128d71c5b5f7540682/src/shared/palette.ts)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| React 19 / Vite 8 | Interactive browser canvas and local interface | 交互式浏览器画布与本地界面 |
| Node.js 24 | Daemon, HTTP API and WebSocket synchronization | 守护进程、HTTP API 与 WebSocket 同步 |
| SQLite | Local named-canvas and asset storage | 本地命名画布与素材存储 |
| OpenAI-compatible AI gateway | Agent chat and canvas drawing tools | Agent 对话与画布绘制工具 |

## Current logo

![Mico source identity](https://hexly.ai/logos/display/mico-160.webp)

- Type: Original project artwork, copied without modification
- Subject: Candy-colored rounded-square canvas application mark
- [Source](https://github.com/nocoo/mico/blob/8a41d3a5df8a94c4ab4dc8128d71c5b5f7540682/logo.png): `logo.png`
- [Preserved asset](https://hexly.ai/logos/originals/mico.png)
- Original dimensions: 1440 × 1440
- Original size: 1254051 bytes
- SHA-256: `012db800045ef65d7715129343dd4344ca3c77ea7cbbee703f67e0615b3cc521`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#00a2e1` | src/shared/palette.ts CANDY_COLORS.blue |
| background | `#f5fafc` | src/shared/palette.ts CANDY_LAYOUT.canvas |
| accent | `#2b3038` | src/shared/palette.ts CANDY_COLORS.ink |
| accent | `#a6d94f` | src/shared/palette.ts CANDY_COLORS.green |
| accent | `#f7de4b` | src/shared/palette.ts CANDY_COLORS.yellow |
| accent | `#ff7fa3` | src/shared/palette.ts CANDY_COLORS.pink |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Current campaign texture

- Pressed canvas surface / 画布压痕: Shallow frame, note, brush and connector impressions form a distributed working surface.
- 圆角框、便签、笔触与连接点的浅压痕铺满整张工作面。
- Model: `gpt-image-2.5-flare`; independently generated light/dark full canvases, no crop or repeat.
- Independent texture pack v1.0.0; the original identity kit and its historical surfaces remain unchanged. Text-bearing surfaces use a separate layer at opacity 0.45.
- [Paper PNG](https://h.no.mt/projects/mico/textures/v1.0.0/texture-light.png) · [Night PNG](https://h.no.mt/projects/mico/textures/v1.0.0/texture-dark.png) · [Exact paper prompt](https://h.no.mt/projects/mico/textures/v1.0.0/texture-light-prompt.txt) · [Exact night prompt](https://h.no.mt/projects/mico/textures/v1.0.0/texture-dark-prompt.txt)
- [Manifest and hashes](https://h.no.mt/projects/mico/textures/v1.0.0/manifest.json) · [Usage/rights](https://h.no.mt/projects/mico/textures/v1.0.0/guide.md) · [Full-canvas specimens](https://hexly.ai/textures/mico/v1.0.0/review.html)
- Hexly pages and promotional materials only. Preserve official Logo bytes/colors, product UI, and archived status. Reuse the files directly; no per-campaign generation is required.

## Future family notes

Keep this asset as the phase-one baseline. A future family version should use a recognizable animal, one principal hue, and restrained multicolored geometric fragments.

Use head portraits for large animals and optionally full-body poses for small animals. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. No new logo is generated in phase one.
