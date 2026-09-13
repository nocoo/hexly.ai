# 🤠 Pew Game

## Profile

- Repository: [nocoo/pew-game](https://github.com/nocoo/pew-game)
- Website: [https://pew.hexly.ai](https://pew.hexly.ai)
- Website evidence: wrangler.jsonc custom domain; nocoo/nocoo README.md Games section
- Category: games
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: Pixel art prairie shooter with an all-time leaderboard
- Chinese: 像素风草原射击游戏，支持键盘与触控操作，挑战历史排行榜。
- Profile section: Games
- Profile revision: `512b3c3d56e264464b0a906979d598fddf86b27a`
- Repository revision inspected: `5200316563da59252505ece261388e4c89266017`

## Project goal

Play a pixel prairie shooter with keyboard or touch controls, survive enemy waves with power-ups, and save scores to an all-time leaderboard.

用键盘或触控方向键游玩像素草原射击，收集道具、抵挡敌人波次，并将成绩保存到历史排行榜。

- [中文 README](https://github.com/nocoo/pew-game/blob/main/README.md) · [English README](https://github.com/nocoo/pew-game/blob/main/docs/README.en.md)
- Verified: 2026-09-12; [source revision](https://github.com/nocoo/pew-game/tree/5200316563da59252505ece261388e4c89266017)
- Source files: [`README.md`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/README.md), [`package.json`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/package.json), [`wrangler.jsonc`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/wrangler.jsonc), [`worker/index.ts`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/worker/index.ts), [`migrations/0001_scores.sql`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/migrations/0001_scores.sql), [`src/game/engine.ts`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/src/game/engine.ts), [`src/game/input.ts`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/src/game/input.ts), [`src/game/player.ts`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/src/game/player.ts), [`src/game/powerup.ts`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/src/game/powerup.ts), [`src/lib/db.ts`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/src/lib/db.ts), [`src/lib/anticheat.ts`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/src/lib/anticheat.ts), [`src/components/GameCanvas.tsx`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/src/components/GameCanvas.tsx), [`src/components/NameInput.tsx`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/src/components/NameInput.tsx), [`src/app/globals.css`](https://github.com/nocoo/pew-game/blob/5200316563da59252505ece261388e4c89266017/src/app/globals.css)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | Game engine and rules | 游戏引擎与规则 |
| Canvas 2D | Pixel rendering | 像素画面绘制 |
| Next.js | Static page export | 页面静态导出 |
| React | Game HUD, touch controls, and leaderboard | 游戏状态、触控操作与排行榜 |
| Cloudflare Workers | Static assets, health, and score APIs | 静态资源、健康检查与成绩 API |
| Cloudflare D1 | Persistent rankings and duplicate submission protection | 排名持久化与重复提交保护 |
| CSS | Responsive arcade layout and styling | 响应式街机布局与样式 |

## Current logo

![Pew Game source identity](https://h.no.mt/projects/pew/identity/v1.0.0/pew-game-160-699c7648dcde.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Walnut and brass prairie arcade joystick
- [Source](https://github.com/nocoo/pew-game/blob/ee68b2dead3e5e698b2427d6a949e8e57c69d520/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/pew-game/identity/v1.0.0/pew-game-family-2026-09-07-01-02-18602c76eb1a.png)
- Original dimensions: 2048 × 2048
- Original size: 3907401 bytes
- SHA-256: `18602c76eb1a445731b7baba7ec81175f6f81084977d1d7ad6168e6702238b90`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#583b2c` | Native pew-game ab0299e6617c, sampled sRGB pixel (850, 1360); artwork/logo-family/pew-game/2026-09-07-01/palette.json |
| background | `#191714` | src/app/globals.css --background: #191714 |
| accent | `#651b19` | Native pew-game ab0299e6617c, sampled sRGB pixel (818, 344); artwork/logo-family/pew-game/2026-09-07-01/palette.json |
| accent | `#836b42` | Native pew-game ab0299e6617c, sampled sRGB pixel (1328, 1038); artwork/logo-family/pew-game/2026-09-07-01/palette.json |
| accent | `#da9438` | Native pew-game ab0299e6617c, sampled sRGB pixel (1253, 928); artwork/logo-family/pew-game/2026-09-07-01/palette.json |
| accent | `#506866` | Native pew-game ab0299e6617c, sampled sRGB pixel (1640, 1020); artwork/logo-family/pew-game/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/pew-game#brand).
- [Light lockup](https://h.no.mt/brands/pew-game/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/pew-game/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/pew-game/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/pew-game/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/pew-game/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/pew-game/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Walnut and brass prairie arcade joystick.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥119px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 119px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Pew Game refined preview](https://h.no.mt/logos/family/pew-game/2026-09-07-01/02/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `02`
- Refined subject: Walnut and brass prairie arcade joystick
- Site path: `/projects/pew-game#brand`; [local gallery](https://index.dev.hexly.ai/projects/pew-game#brand)
- [Static review HTML](../../artwork/logo-family/pew-game/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/pew-game/2026-09-07-01)
- [Transparent foreground](https://h.no.mt/logos/family/pew-game/2026-09-07-01/02/transparent.png); SHA-256: `18602c76eb1a445731b7baba7ec81175f6f81084977d1d7ad6168e6702238b90`
- [Square icon](https://h.no.mt/logos/family/pew-game/2026-09-07-01/02/icon.png), [rounded icon](https://h.no.mt/logos/family/pew-game/2026-09-07-01/02/rounded.png), [white version](https://h.no.mt/logos/family/pew-game/2026-09-07-01/02/white.png)
- [Untouched generation](https://h.no.mt/logos/family/pew-game/2026-09-07-01/02/raw.png), [exact prompt](https://h.no.mt/logos/family/pew-game/2026-09-07-01/02/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/pew-game/2026-09-07-01/02/manifest.json)
- [Previous original](https://h.no.mt/shared/site/v1.0.0/pew-game-6ffd6aa8a203.png), copied from [its immutable source](https://github.com/nocoo/nocoo/blob/9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6/README.md)
- Previous SHA-256: `6ffd6aa8a203834dd8972fa0e8e2a520a2bdaf75f0519a585f6124212cfe4193`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#d6bb8a` | Adopted Pew Game presentation, 2026-09-07-01/02; background.base in archived settings.json |
| primary | `#583b2c` | Native pew-game ab0299e6617c, sampled sRGB pixel (850, 1360); artwork/logo-family/pew-game/2026-09-07-01/palette.json |
| accent | `#651b19` | Native pew-game ab0299e6617c, sampled sRGB pixel (818, 344); artwork/logo-family/pew-game/2026-09-07-01/palette.json |
| accent | `#836b42` | Native pew-game ab0299e6617c, sampled sRGB pixel (1328, 1038); artwork/logo-family/pew-game/2026-09-07-01/palette.json |
| accent | `#da9438` | Native pew-game ab0299e6617c, sampled sRGB pixel (1253, 928); artwork/logo-family/pew-game/2026-09-07-01/palette.json |
| accent | `#506866` | Native pew-game ab0299e6617c, sampled sRGB pixel (1640, 1020); artwork/logo-family/pew-game/2026-09-07-01/palette.json |

### A tactile move

A short ball-top joystick leans from a compact walnut arcade box. Its two close buttons and thick housing form one complete, comfortably inset assembly.

短球头摇杆从紧凑的胡桃木街机盒伸出，两颗按钮与厚实机箱组成完整、留足余量的主体。

### Walnut, brass and oxblood

Real wood grain and engraved aged brass give the prairie shooter a handmade arcade identity. The deep-red joystick leads, supported by one close ochre-and-teal button group.

木纹与刻线旧黄铜为西部射击游戏建立手作街机形象。深红摇杆是视觉中心，赭黄与青色按钮紧邻成组。

### Prairie suntracks

A low rising sun with short prairie grass cuts and concentric joystick-like arcs in warm sand paper. The field, grain and contact shadow are independent of transparent app marks.

沙色纸面上的低日弧线、草叶切线与摇杆圆弧呼应西部草原。 底色、颗粒与接触阴影均独立于透明应用标记。

Small-size observation: At 128/64 px, the red joystick, two buttons and wood block remain clear. At 32/24/16 px, the compact silhouette and dominant colors carry recognition; fine material detail, printed marks and background lines naturally merge.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
