# 🎧 his.fm

## Profile

- Repository: [nocoo/his.fm](https://github.com/nocoo/his.fm)
- Website: [https://his.fm](https://his.fm)
- Website evidence: README badges and site.webmanifest; https://his.fm/api/live returned status ok at revision 927170df on 2026-10-23
- Category: everyday
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: An AI-collaboration Chinese podcast with a versioned prompt-slot studio
- Chinese: 由 AI 分工协作制作的中文播客，配套可版本化的提示词工作台
- Profile section: Recent Projects
- Profile revision: `c5c26acafab599bfe4b463798bd5033d5b35cad2`
- Repository revision inspected: `927170dfebc602ca6697dd514188c6f0c1136050`

## Project goal

Publish a Mandarin podcast whose collecting, editing, voicing, artwork and production are handled by AI roles. Each role reads versioned prompt slots and writes episodes back through a scoped Agent API instead of an in-site generator.

发布一档普通话播客，采集、编辑、配音、封面与制片分别由 AI 角色承担。各角色读取可版本化的提示词槽，并通过带作用域的 Agent API 写回节目，而不是在站内一键生成。

- [中文 README](https://github.com/nocoo/his.fm/blob/main/README.md) · [English README](https://github.com/nocoo/his.fm/blob/main/docs/README.en.md)
- Verified: 2026-10-23; [source revision](https://github.com/nocoo/his.fm/tree/927170dfebc602ca6697dd514188c6f0c1136050)
- Source files: [`README.md`](https://github.com/nocoo/his.fm/blob/927170dfebc602ca6697dd514188c6f0c1136050/README.md), [`package.json`](https://github.com/nocoo/his.fm/blob/927170dfebc602ca6697dd514188c6f0c1136050/package.json), [`apps/web/src/brand/themes.ts`](https://github.com/nocoo/his.fm/blob/927170dfebc602ca6697dd514188c6f0c1136050/apps/web/src/brand/themes.ts), [`apps/web/public/site.webmanifest`](https://github.com/nocoo/his.fm/blob/927170dfebc602ca6697dd514188c6f0c1136050/apps/web/public/site.webmanifest)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| React / Vite | Listener site, player, transcript and admin console | 听众站点、播放器、逐字稿与后台 |
| Cloudflare Workers / D1 / R2 | Worker gateway, episode database and media delivery | Worker 网关、节目数据库与媒体分发 |
| Prompt slots / Agent API | Versioned role prompts with scoped read and write tokens | 带作用域读写令牌的版本化角色提示词 |
| @nocoo/basalt | Console and editor interface | 后台与编辑器界面 |

## Current logo

![his.fm source identity](https://h.no.mt/projects/his-fm/identity/v1.0.0/his-fm-channel-160-1c93f55e7521.webp)

- Type: Original project artwork, copied without modification
- Subject: Existing application icon
- [Source](https://github.com/nocoo/his.fm/blob/927170dfebc602ca6697dd514188c6f0c1136050/artwork/show-stillwood-20261022/podcast-cover-3000.jpg): `artwork/show-stillwood-20261022/podcast-cover-3000.jpg`
- [Preserved asset](https://h.no.mt/projects/his-fm/identity/v1.0.0/his-fm-channel-0a64cac84ab3.jpg)
- Original dimensions: 3000 × 3000
- Original size: 495570 bytes
- SHA-256: `0a64cac84ab3bbb8a1c5bcb03976b516698cb41cfec0ea2cdd9c5b5e1372cd85`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#333935` | Native 0a64cac84ab3bbb8a1c5bcb03976b516698cb41cfec0ea2cdd9c5b5e1372cd85, sRGB pixel (900, 300); RSS channel artwork |
| accent | `#ebebe1` | Native 0a64cac84ab3bbb8a1c5bcb03976b516698cb41cfec0ea2cdd9c5b5e1372cd85, sRGB pixel (1240, 1500); RSS channel artwork |
| accent | `#9b9772` | Native 0a64cac84ab3bbb8a1c5bcb03976b516698cb41cfec0ea2cdd9c5b5e1372cd85, sRGB pixel (2250, 150); RSS channel artwork |
| accent | `#8b7253` | Native 0a64cac84ab3bbb8a1c5bcb03976b516698cb41cfec0ea2cdd9c5b5e1372cd85, sRGB pixel (380, 2250); RSS channel artwork |
| accent | `#d0f66d` | apps/web/src/brand/themes.ts grove palette Lime; website token, not the artwork |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Future family notes

Keep this asset as the phase-one baseline. A future family version should use a recognizable animal, one principal hue, and restrained multicolored geometric fragments.

Use head portraits for large animals and optionally full-body poses for small animals. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. No new logo is generated in phase one.
