# 🦅 Eagle

## Profile

- Repository: [nocoo/eagle](https://github.com/nocoo/eagle)
- Website: [https://eagle.hexly.ai](https://eagle.hexly.ai)
- Website evidence: https://github.com/nocoo/eagle/blob/d03eb4d276ec20ead665e490eb78ce5b09d720a5/README.md
- Category: ai
- Archived repository: No; [repository status evidence](../../docs/sources/eagle-2026-09-19.json)
- English: Evidence-led Herdr Space overview across machines
- Chinese: 以真实证据汇总多台机器上的 Herdr Space 工作态势
- Profile section: Recent Projects
- Profile revision: `4e5549022a13319e84de03ad4d66863af9188264`
- Repository revision inspected: `d03eb4d276ec20ead665e490eb78ce5b09d720a5`

## Project goal

Read the current Herdr Spaces, pane layout, task evidence and history across reporting machines in a private dashboard. Missing or stale evidence stays explicit; lifecycle labels never certify completion.

在私有看板中查看多台上报机器的 Herdr Space、窗格布局、任务证据与历史。缺失或过期证据明确呈现，生命周期标签不等于完成证明。

- [中文 README](https://github.com/nocoo/eagle/blob/main/README.zh-CN.md) · [English README](https://github.com/nocoo/eagle/blob/main/README.md)
- Verified: 2026-09-19; [source revision](https://github.com/nocoo/eagle/tree/d03eb4d276ec20ead665e490eb78ce5b09d720a5)
- Source files: [`README.md`](https://github.com/nocoo/eagle/blob/d03eb4d276ec20ead665e490eb78ce5b09d720a5/README.md), [`AGENTS.md`](https://github.com/nocoo/eagle/blob/d03eb4d276ec20ead665e490eb78ce5b09d720a5/AGENTS.md), [`src/web/App.tsx`](https://github.com/nocoo/eagle/blob/d03eb4d276ec20ead665e490eb78ce5b09d720a5/src/web/App.tsx), [`src/web/main.tsx`](https://github.com/nocoo/eagle/blob/d03eb4d276ec20ead665e490eb78ce5b09d720a5/src/web/main.tsx), [`src/worker/index.ts`](https://github.com/nocoo/eagle/blob/d03eb4d276ec20ead665e490eb78ce5b09d720a5/src/worker/index.ts), [`agent/collector.ts`](https://github.com/nocoo/eagle/blob/d03eb4d276ec20ead665e490eb78ce5b09d720a5/agent/collector.ts), [`package.json`](https://github.com/nocoo/eagle/blob/d03eb4d276ec20ead665e490eb78ce5b09d720a5/package.json), [`assets/brand/provenance.json`](https://github.com/nocoo/eagle/blob/d03eb4d276ec20ead665e490eb78ce5b09d720a5/assets/brand/provenance.json), [`README.zh-CN.md`](https://github.com/nocoo/eagle/blob/d03eb4d276ec20ead665e490eb78ce5b09d720a5/README.zh-CN.md)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| React 19 / Vite / Basalt | Responsive private dashboard with shared application chrome | 采用统一应用组件的响应式私有看板 |
| Cloudflare Workers / D1 | Authenticated report ingestion, full snapshots, history and public dependency health | 受认证保护的上报、完整快照、历史与公开依赖健康检查 |
| Node.js / Herdr | Local evidence collection, bounded spooling and idempotent delivery | 本机证据采集、有界队列与幂等上报 |

## Current logo

![Eagle source identity](https://h.no.mt/projects/eagle/identity/v1.0.0/eagle-160-321f43fac766.webp)

- Type: Owner-approved GPT Image raster identity; source-adopted bytes and generation provenance preserved
- Subject: Golden faceted eagle holding a multicolored wind streamer
- [Source](https://github.com/nocoo/eagle/blob/d03eb4d276ec20ead665e490eb78ce5b09d720a5/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/eagle/identity/v1.0.0/eagle-family-2026-09-19-01-02-2dbda2e18513.png)
- Original dimensions: 2048 × 2048
- Original size: 3040705 bytes
- SHA-256: `2dbda2e185133a9f708cbad1190c817d18ff5bb96aa1337f0a18edc9b5532e20`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#e4dcc7` | artwork/logo-family/eagle/2026-09-19-01/presentation.json background.base; authored presentation, not a website token |
| primary | `#fcce6b` | Native f1c5b569d4041197de1d733f3a5316e5cd221e5190274bb53eaa9861fc899d33, sRGB pixel (620, 420); artwork/logo-family/eagle/2026-09-19-01/palette.json |
| accent | `#602917` | Native f1c5b569d4041197de1d733f3a5316e5cd221e5190274bb53eaa9861fc899d33, sRGB pixel (700, 1080); artwork/logo-family/eagle/2026-09-19-01/palette.json |
| accent | `#ecaf36` | Native f1c5b569d4041197de1d733f3a5316e5cd221e5190274bb53eaa9861fc899d33, sRGB pixel (1350, 700); artwork/logo-family/eagle/2026-09-19-01/palette.json |
| accent | `#1ccbbd` | Native f1c5b569d4041197de1d733f3a5316e5cd221e5190274bb53eaa9861fc899d33, sRGB pixel (1780, 690); artwork/logo-family/eagle/2026-09-19-01/palette.json |
| accent | `#fcd954` | Native f1c5b569d4041197de1d733f3a5316e5cd221e5190274bb53eaa9861fc899d33, sRGB pixel (1680, 780); artwork/logo-family/eagle/2026-09-19-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/eagle#brand).
- [Light lockup](https://h.no.mt/brands/eagle/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/eagle/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/eagle/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/eagle/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/eagle/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/eagle/v1.0.0/manifest.json).
- Source adoption: recorded at `d03eb4d276ec20ead665e490eb78ce5b09d720a5`.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


An observant golden eagle for evidence-led work across machines.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Keep the existing portrait's natural frame entry. The full square is placed against the baseline; no anatomy is extended, trimmed or masked. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留原头像自然入框的边界，将完整方形画布贴齐基线；不补画、不截取解剖结构。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥55px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine material detail softens at 16px.

导航推荐 24px，最小 16px。字标宽度至少 55px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小材质细节会柔化。

## Refined identity

![Eagle refined preview](https://h.no.mt/logos/family/eagle/2026-09-19-01/02/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-19.
- Study `2026-09-19-01`, finishing `02`
- Site path: `/projects/eagle#brand`; [local gallery](https://index.dev.hexly.ai/projects/eagle#brand)
- [Static review HTML](../../artwork/logo-family/eagle/2026-09-19-01/review.html)
- [Full process archive](artwork/logo-family/eagle/2026-09-19-01)
- [Transparent foreground](https://h.no.mt/logos/family/eagle/2026-09-19-01/02/transparent.png); SHA-256: `2dbda2e185133a9f708cbad1190c817d18ff5bb96aa1337f0a18edc9b5532e20`
- [Square icon](https://h.no.mt/logos/family/eagle/2026-09-19-01/02/icon.png), [rounded icon](https://h.no.mt/logos/family/eagle/2026-09-19-01/02/rounded.png), [white version](https://h.no.mt/logos/family/eagle/2026-09-19-01/02/white.png)
- [Untouched generation](https://h.no.mt/logos/family/eagle/2026-09-19-01/02/raw.png), [exact prompt](https://h.no.mt/logos/family/eagle/2026-09-19-01/02/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/eagle/2026-09-19-01/02/manifest.json)
- First project identity; no earlier independent Logo existed at intake.
- Generation: gpt-image-2.5-sunburst, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#e4dcc7` | artwork/logo-family/eagle/2026-09-19-01/presentation.json background.base; authored presentation, not a website token |
| primary | `#fcce6b` | Native f1c5b569d4041197de1d733f3a5316e5cd221e5190274bb53eaa9861fc899d33, sRGB pixel (620, 420); artwork/logo-family/eagle/2026-09-19-01/palette.json |
| accent | `#602917` | Native f1c5b569d4041197de1d733f3a5316e5cd221e5190274bb53eaa9861fc899d33, sRGB pixel (700, 1080); artwork/logo-family/eagle/2026-09-19-01/palette.json |
| accent | `#ecaf36` | Native f1c5b569d4041197de1d733f3a5316e5cd221e5190274bb53eaa9861fc899d33, sRGB pixel (1350, 700); artwork/logo-family/eagle/2026-09-19-01/palette.json |
| accent | `#1ccbbd` | Native f1c5b569d4041197de1d733f3a5316e5cd221e5190274bb53eaa9861fc899d33, sRGB pixel (1780, 690); artwork/logo-family/eagle/2026-09-19-01/palette.json |
| accent | `#fcd954` | Native f1c5b569d4041197de1d733f3a5316e5cd221e5190274bb53eaa9861fc899d33, sRGB pixel (1680, 780); artwork/logo-family/eagle/2026-09-19-01/palette.json |

### An observant turn

A golden eagle turns toward one connected wind streamer held at its hooked beak. Its natural shoulders continue through the bottom viewfinder edge; the complete face and streamer remain clear of rounded corners.

金色鹰转头看向鹰喙轻衔的一条彩色飘带，肩羽从画面底边自然延续，完整面部与飘带均避开圆角。

### Connected feather planes

Broad irregular flat facets describe the crown, cheek, neck and folded-wing roots. Golden ochre and umber carry the bird; saturated multicolored accents stay in one external streamer.

宽阔、不规则的平面切面描绘冠羽、面颊、短颈和折翼根部。赭金与棕褐构成主体，多色点缀集中在一条外部飘带。

### Pine above the mountain woodland

Sparse mountain-pine needles and alpine leaves are pressed into warm limestone paper. Authored habitat geometry, grain and shadows remain separate from the transparent animal.

稀疏的山松针叶与高山叶片压印在暖石灰岩纸色上。独立绘制的栖息地纹样、纸粒和阴影均与透明动物分离。

Small-size observation: 24/16px marks retain the golden head, hooked beak and colorful streamer. Fine feather facets soften. Use transparent foregrounds without a tile or extra mask.

## Further refinements

Preserve the approved raster, original colors, complete silhouette, and exact generation/finishing records. Supporting textures remain separate. Published versions are immutable; generated raster artwork is not native SVG.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
