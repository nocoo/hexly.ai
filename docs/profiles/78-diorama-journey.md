# 🏞️ Diorama Journey

## Profile

- Repository: [nocoo/diorama-journey](https://github.com/nocoo/diorama-journey)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: extensions
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: Miniature 3D storytelling with narration, chapter clips and slides
- Chinese: 以微型 3D 场景讲故事，输出配音视频、章节切片和演示文稿
- Profile section: Skills & MCP Servers
- Profile revision: `f7fb0554c24d243f4b1aa9087403fa56125c17d0`
- Repository revision inspected: `c1c522d54d110c8a7dfa0996691fb9ba20436afc`

## Project goal

Turn an outline, report, lesson or process into a narrated journey through connected miniature 3D worlds. One recurring element links the chapters; the same composition produces a film, exact chapter clips, presentations, speaker notes and an archived production.

将大纲、报告、课程或流程组织成穿越微型 3D 世界的配音故事。以同一个元素串联各章，从同一套画面导出成片、章节切片、演示文稿、演讲备注和制作归档。

- [中文 README](https://github.com/nocoo/diorama-journey/blob/main/README.zh-CN.md) · [English README](https://github.com/nocoo/diorama-journey/blob/main/README.md)
- Verified: 2026-09-17; [source revision](https://github.com/nocoo/diorama-journey/tree/c1c522d54d110c8a7dfa0996691fb9ba20436afc)
- Source files: [`README.md`](https://github.com/nocoo/diorama-journey/blob/c1c522d54d110c8a7dfa0996691fb9ba20436afc/README.md), [`README.zh-CN.md`](https://github.com/nocoo/diorama-journey/blob/c1c522d54d110c8a7dfa0996691fb9ba20436afc/README.zh-CN.md), [`SKILL.md`](https://github.com/nocoo/diorama-journey/blob/c1c522d54d110c8a7dfa0996691fb9ba20436afc/SKILL.md), [`assets/starter/package.json`](https://github.com/nocoo/diorama-journey/blob/c1c522d54d110c8a7dfa0996691fb9ba20436afc/assets/starter/package.json), [`assets/starter/src/film.css`](https://github.com/nocoo/diorama-journey/blob/c1c522d54d110c8a7dfa0996691fb9ba20436afc/assets/starter/src/film.css), [`docs/validation.md`](https://github.com/nocoo/diorama-journey/blob/c1c522d54d110c8a7dfa0996691fb9ba20436afc/docs/validation.md)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| React / Remotion | Frame timeline, shared composition, player and H.264 video rendering | 逐帧时间轴、共享画面、播放器和 H.264 视频渲染 |
| Three.js / React Three Fiber | Original geometric scenes, lighting and continuous camera movement | 原创几何场景、灯光和连续镜头运动 |
| Vite / TypeScript | Standalone review website and typed source | 独立审片网站与类型检查 |
| FFmpeg / Python / uv | Audio mastering, exact chapter cuts and isolated media scripts | 音频处理、精确章节切片和独立媒体脚本环境 |
| edge-tts / NumPy | Cached Microsoft speech and original synthesized music | 可缓存的微软语音与原创合成音乐 |
| python-pptx / odfpy / ReportLab | PPTX, ODP and PDF from clean keyframes, with native presentation notes | 由干净关键帧导出 PPTX、ODP 和 PDF，并保留原生演讲备注 |

## Current logo

![Diorama Journey source identity](https://h.no.mt/projects/diorama-journey/identity/v1.0.0/diorama-journey-160-9dff2cdf1115.webp)

- Type: Existing GitHub-profile emoji rendered as a portable PNG; no independent project logo was found
- Subject: Profile landscape emoji; a skill for connected miniature 3D worlds
- [Source](https://github.com/nocoo/nocoo/blob/f7fb0554c24d243f4b1aa9087403fa56125c17d0/README.md): `nocoo/nocoo README.md — project emoji`
- [Preserved asset](https://h.no.mt/projects/diorama-journey/identity/v1.0.0/diorama-journey-68c16332ea78.png)
- Original dimensions: 1024 × 1024
- Original size: 93560 bytes
- SHA-256: `68c16332ea78b455d6016a80fec183a1ec20016814fcceeb9cf8bb1c79a595a0`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#869777` | assets/starter/src/film.css — .film h1 .accent |
| background | `#f5f2e9` | assets/starter/src/film.css — .film |
| accent | `#bb7a4e` | assets/starter/src/film.css — .film-mark |
| accent | `#f7f5ee` | assets/starter/src/web.css — :root background |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Future family notes

Keep this asset as the phase-one baseline. A future family version should use a recognizable animal, one principal hue, and restrained multicolored geometric fragments.

Use head portraits for large animals and optionally full-body poses for small animals. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. No new logo is generated in phase one.
