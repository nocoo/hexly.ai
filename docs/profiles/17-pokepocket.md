# 🎮 Poké Pocket

## Profile

- Repository: [nocoo/pokepocket](https://github.com/nocoo/pokepocket)
- Website: [https://pokepocket.hexly.ai](https://pokepocket.hexly.ai)
- Website evidence: GitHub repository homepage
- Category: games
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: GB / GBC / GBA collection with browser play and local saves
- Chinese: GB / GBC / GBA 游戏收藏盘，支持浏览器游玩与本地存档。
- Profile section: Games
- Profile revision: `bf9076bff46ea58fba5885a9185cce8b71f9b09a`
- Repository revision inspected: `019798f1c8fae7a6e7c0beb2368279c9980c7188`

## Project goal

Play user-supplied GB, GBC, and GBA Pokémon cartridges in a browser collection while keeping controls and progress for each ROM.

在浏览器卡带收藏盘中游玩自备的 GB、GBC、GBA 宝可梦，管理操作设置和每枚 ROM 的进度。

- [中文 README](https://github.com/nocoo/pokepocket/blob/main/README.md) · [English README](https://github.com/nocoo/pokepocket/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/pokepocket/tree/461f4c3bb65480c43bdb5a8c27a054eba8da39ad)
- Source files: [`package.json`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/package.json), [`src/App.tsx`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/src/App.tsx), [`src/data/editions.json`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/src/data/editions.json), [`src/lib/emulator.ts`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/src/lib/emulator.ts), [`src/lib/cartridge.ts`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/src/lib/cartridge.ts), [`src/lib/storage.ts`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/src/lib/storage.ts), [`src/lib/settings.ts`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/src/lib/settings.ts), [`src/lib/key-bindings.ts`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/src/lib/key-bindings.ts), [`src/lib/input.ts`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/src/lib/input.ts), [`scripts/local-roms.ts`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/scripts/local-roms.ts), [`scripts/run-l3.mjs`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/scripts/run-l3.mjs), [`scripts/check-no-roms.mjs`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/scripts/check-no-roms.mjs), [`worker/index.ts`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/worker/index.ts), [`vite.config.ts`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/vite.config.ts), [`wrangler.jsonc`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/wrangler.jsonc), [`THIRD_PARTY_NOTICES.md`](https://github.com/nocoo/pokepocket/blob/461f4c3bb65480c43bdb5a8c27a054eba8da39ad/THIRD_PARTY_NOTICES.md)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | Application and Worker logic | 应用与 Worker 逻辑 |
| React | Cartridge collection and handheld controls | 卡带收藏盘与掌机操作界面 |
| mGBA | GB, GBC, and GBA emulation core | GB、GBC 与 GBA 模拟器核心 |
| WebAssembly | Browser execution of the emulator | 在浏览器运行模拟器 |
| IndexedDB | Local ROMs, battery saves, and save states | 本地卡带、电池存档与即时存档 |
| Vite | Development server and application builds | 开发服务器与应用构建 |
| Cloudflare Workers | Protected static hosting and application metadata | 受访问控制保护的静态托管与应用信息 |
| Cloudflare Access | Hosted site authentication | 托管站点认证 |

## Current logo

![Poké Pocket source identity](../../public/logos/display/pokepocket-160.webp)

- Type: Original project artwork, copied without modification
- Subject: Red-capped trainer turning with a Poké Ball
- [Source](https://github.com/nocoo/pokepocket/blob/019798f1c8fae7a6e7c0beb2368279c9980c7188/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/pokepocket-family-2026-09-07-03-01.png)
- Original dimensions: 960 × 960
- Original size: 547985 bytes
- SHA-256: `eed19029ccc4a84efd6c4f9704566218820b98fee182fff93b628812b5fd278d`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#294138` | src/styles.css --ink: #294138 |
| background | `#f7f8f2` | src/styles.css :root background: #f7f8f2 |
| accent | `#f55d5c` | Native pokepocket 806f144dbb40, sampled sRGB pixel (327, 140); artwork/logo-family/pokepocket/2026-09-07-03/palette.json |
| accent | `#2e2836` | Native pokepocket 806f144dbb40, sampled sRGB pixel (520, 164); artwork/logo-family/pokepocket/2026-09-07-03/palette.json |
| accent | `#fafafa` | Native pokepocket 806f144dbb40, sampled sRGB pixel (450, 327); artwork/logo-family/pokepocket/2026-09-07-03/palette.json |
| accent | `#fae6cd` | Native pokepocket 806f144dbb40, sampled sRGB pixel (487, 572); artwork/logo-family/pokepocket/2026-09-07-03/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Refined identity

![Poké Pocket refined preview](../../public/logos/family/pokepocket/2026-09-07-03/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-03`, finishing `01`
- Refined subject: Red-capped trainer turning with a Poké Ball
- Site path: `/projects/pokepocket#brand`; [local gallery](https://index.dev.hexly.ai/projects/pokepocket#brand)
- [Static review HTML](../../artwork/logo-family/pokepocket/2026-09-07-03/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/pokepocket/2026-09-07-03)
- [Transparent foreground](../../public/logos/family/pokepocket/2026-09-07-03/01/transparent.png); SHA-256: `eed19029ccc4a84efd6c4f9704566218820b98fee182fff93b628812b5fd278d`
- [Square icon](../../public/logos/family/pokepocket/2026-09-07-03/01/icon.png), [rounded icon](../../public/logos/family/pokepocket/2026-09-07-03/01/rounded.png), [white version](../../public/logos/family/pokepocket/2026-09-07-03/01/white.png)
- [Original illustration](../../public/logos/family/pokepocket/2026-09-07-03/01/source.jpg), [presentation brief](../../public/logos/family/pokepocket/2026-09-07-03/01/brief.txt), [public asset checksums](../../public/logos/family/pokepocket/2026-09-07-03/01/manifest.json)
- [Previous original](../../public/logos/originals/pokepocket.svg), copied from [its immutable source](https://github.com/nocoo/pokepocket/blob/48894ea4a1712c755d1bb60a9766a5f67bf15221/public/favicon.svg)
- Previous SHA-256: `45996e3f23bd37f18ea26b35ee2dc3f13174da07a2aa7fcffbb1a17167d62e29`
- The owner-supplied illustration is extracted and uniformly reframed at native 960 × 960. This is a documented reference adaptation, not a generated portrait. The untouched JPEG and complete extraction history remain archived.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px. Sizes above 960 px are explicitly recorded upscales; the native master retains its recorded resolution.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#af4b4a` | Adopted Poké Pocket presentation, 2026-09-07-03/01; background.base in archived settings.json |
| primary | `#f55d5c` | Native pokepocket 806f144dbb40, sampled sRGB pixel (327, 140); artwork/logo-family/pokepocket/2026-09-07-03/palette.json |
| accent | `#2e2836` | Native pokepocket 806f144dbb40, sampled sRGB pixel (520, 164); artwork/logo-family/pokepocket/2026-09-07-03/palette.json |
| accent | `#fafafa` | Native pokepocket 806f144dbb40, sampled sRGB pixel (450, 327); artwork/logo-family/pokepocket/2026-09-07-03/palette.json |
| accent | `#fae6cd` | Native pokepocket 806f144dbb40, sampled sRGB pixel (487, 572); artwork/logo-family/pokepocket/2026-09-07-03/palette.json |

### A backward glance

The supplied trainer turns toward the viewer with a complete raised ball beside the face. One uniform inset protects the cap and fingers while the lower jacket and forearm enter naturally through the frame.

参考人物回头看向观者，完整举球动作紧邻脸部。整体等比缩放为帽子和手指留白，下方外套与前臂自然延伸出取景框。

### The original illustration

The supplied 960 px illustration retains its red cap, charcoal ink contours, ivory clothing and calm expression. Extraction removes only the beige field; larger exports are explicitly resampled.

保留 960 像素原插画的红帽、深色墨线、象牙色衣服与平静表情；提取时只去除米色底，较大尺寸明确标注为放大导出。

### Pocket orbits

Offset interrupted ball orbits and short curved seams, impressed into a warm vermilion paper field. The field, grain and contact shadow are independent of transparent app marks.

朱红纸面上的偏心球体轨道与弧形接缝，呼应口袋里的冒险。 底色、颗粒与接触阴影均独立于透明应用标记。

Small-size observation: At 128/64 px, the red cap, face and raised red-white ball remain clear. At 32/24/16 px, the compact silhouette and dominant colors carry recognition; fine material detail, printed marks and background lines naturally merge. Native source: 960 px; 1024/2048 exports are resampling, not new detail.

## Further refinements

Preserve the owner-selected character illustration, its natural pose, native source resolution and documented transparent extraction. The lower jacket and forearm intentionally continue through the frame; the face, cap and raised ball remain inset.

Keep the character’s lower frame entry, complete expressive features and a separate paper field. Never describe resampled exports as new native detail. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. Preserve this reviewed composition and its archived predecessors.
