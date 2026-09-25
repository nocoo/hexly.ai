# 🪶 Kite

## Profile

- Repository: [nocoo/kite](https://github.com/nocoo/kite)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: tools
- Archived repository: No; [repository status evidence](../../docs/sources/kite-2026-09-25-publication.json)
- English: Local Pi execution-trace collection for inspection and visualization
- Chinese: 面向检查与可视化的本地 Pi 执行轨迹采集
- Profile section: Recent Projects
- Profile revision: `b6e66e05be7fe14607be53caddd84d5ddc616ded`
- Repository revision inspected: `704ae3833c9bf752ae7785d9aa6faa7756fefbbf`

## Project goal

Collect Pi execution traces locally through a passive extension and a separate Unix-socket collector. SQLite preserves source events, timestamps and correlations for inspection and future visualization. Capture is bounded and fail-open; the preserved collector documentation does not establish a released visualization interface.

通过被动扩展与独立 Unix socket 采集进程，在本机收集 Pi 执行轨迹。SQLite 保存源事件、时间戳与关联信息，供检查及后续可视化使用。采集有界且不阻塞 Pi；已保存的采集器文档不代表可视化界面已经发布。

- Verified: 2026-09-25; [preserved local source snapshot](../../docs/sources/kite-2026-09-25-publication.json)
- Snapshot SHA-256: `4555fb1dea6cf019351dd76cb3f53e74615573e85f4afdba62274ab6a4c82756`
- Source files: `AGENTS.md`, `README.md`, `package.json`, `docs/collector.md`, `src/schema.ts`, `src/cli.ts`, `src/pi-extension.ts`
- The source repository has no inspected commit yet. README publication and immutable repository links are deferred.

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript / Node.js 24+ | Local collector, command-line inspection and export | 本地采集器、命令行检查与导出 |
| Pi extension API | Passive observation of released Pi 0.87.1 hooks | 被动观察 Pi 0.87.1 已发布事件钩子 |
| Unix sockets / SQLite | Bounded local delivery and durable source-event storage | 有界本机传输与源事件持久化 |

## Current logo

![Kite source identity](https://hexly.ai/logos/display/kite-160.webp)

- Type: Owner-approved GPT Image raster identity; source-adopted bytes and generation provenance preserved
- Subject: Multicolored fragmented red kite head entering from the right
- [Source](https://github.com/nocoo/kite/blob/704ae3833c9bf752ae7785d9aa6faa7756fefbbf/logo.png): `logo.png`
- [Preserved asset](https://hexly.ai/logos/originals/kite-family-2026-09-25-02-03.png)
- Original dimensions: 2048 × 2048
- Original size: 2284290 bytes
- SHA-256: `5e414e28dc102ee25dc7fa5ab51c1bd1ef20de1c318fdceeec5299d7a255d0d6`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `transparent` | Canonical logo.png at 704ae3833c9bf752ae7785d9aa6faa7756fefbbf; transparent canvas verified in the selected finishing |
| primary | `#eb6e36` | Native 417279a8e8a0901b22dc42fe38c7eee3a6b090c67617fceaf7b2d312b45047e9, sRGB pixel (1700, 460); artwork/logo-family/kite/2026-09-25-02/palette.json |
| accent | `#fcf7eb` | Native 417279a8e8a0901b22dc42fe38c7eee3a6b090c67617fceaf7b2d312b45047e9, sRGB pixel (1110, 630); artwork/logo-family/kite/2026-09-25-02/palette.json |
| accent | `#fcd72e` | Native 417279a8e8a0901b22dc42fe38c7eee3a6b090c67617fceaf7b2d312b45047e9, sRGB pixel (1380, 760); artwork/logo-family/kite/2026-09-25-02/palette.json |
| accent | `#424c60` | Native 417279a8e8a0901b22dc42fe38c7eee3a6b090c67617fceaf7b2d312b45047e9, sRGB pixel (840, 990); artwork/logo-family/kite/2026-09-25-02/palette.json |
| accent | `#7d1b22` | Native 417279a8e8a0901b22dc42fe38c7eee3a6b090c67617fceaf7b2d312b45047e9, sRGB pixel (1130, 1130); artwork/logo-family/kite/2026-09-25-02/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/kite#brand).
- [Light lockup](https://h.no.mt/brands/kite/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/kite/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/kite/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/kite/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/kite/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/kite/v1.0.0/manifest.json).
- Source adoption: recorded at `704ae3833c9bf752ae7785d9aa6faa7756fefbbf`.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


An off-center multicolored red kite head.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Keep the existing portrait's natural frame entry. The full square is placed against the baseline; no anatomy is extended, trimmed or masked. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留原头像自然入框的边界，将完整方形画布贴齐基线；不补画、不截取解剖结构。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥49px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 49px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Kite refined preview](https://h.no.mt/logos/family/kite/2026-09-25-02/03/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-25.
- Study `2026-09-25-02`, finishing `03`
- Refined subject: Multicolored fragmented red kite head entering from the right
- Site path: `/projects/kite#brand`; [local gallery](https://index.dev.hexly.ai/projects/kite#brand)
- [Static review HTML](../../artwork/logo-family/kite/2026-09-25-02/review.html)
- [Full process archive](artwork/logo-family/kite/2026-09-25-02)
- [Transparent foreground](https://h.no.mt/logos/family/kite/2026-09-25-02/03/transparent.png); SHA-256: `5e414e28dc102ee25dc7fa5ab51c1bd1ef20de1c318fdceeec5299d7a255d0d6`
- [Square icon](https://h.no.mt/logos/family/kite/2026-09-25-02/03/icon.png), [rounded icon](https://h.no.mt/logos/family/kite/2026-09-25-02/03/rounded.png), [white version](https://h.no.mt/logos/family/kite/2026-09-25-02/03/white.png)
- [Untouched generation](https://h.no.mt/logos/family/kite/2026-09-25-02/03/raw.png), [exact prompt](https://h.no.mt/logos/family/kite/2026-09-25-02/03/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/kite/2026-09-25-02/03/manifest.json)
- First project identity; no earlier independent Logo existed at intake.
- Generation: gpt-image-2.5-sunburst, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#d8bb9f` | artwork/logo-family/kite/2026-09-25-02/presentation.json background.base; authored presentation, not a website token |
| primary | `#eb6e36` | Native 417279a8e8a0901b22dc42fe38c7eee3a6b090c67617fceaf7b2d312b45047e9, sRGB pixel (1700, 460); artwork/logo-family/kite/2026-09-25-02/palette.json |
| accent | `#fcf7eb` | Native 417279a8e8a0901b22dc42fe38c7eee3a6b090c67617fceaf7b2d312b45047e9, sRGB pixel (1110, 630); artwork/logo-family/kite/2026-09-25-02/palette.json |
| accent | `#fcd72e` | Native 417279a8e8a0901b22dc42fe38c7eee3a6b090c67617fceaf7b2d312b45047e9, sRGB pixel (1380, 760); artwork/logo-family/kite/2026-09-25-02/palette.json |
| accent | `#424c60` | Native 417279a8e8a0901b22dc42fe38c7eee3a6b090c67617fceaf7b2d312b45047e9, sRGB pixel (840, 990); artwork/logo-family/kite/2026-09-25-02/palette.json |
| accent | `#7d1b22` | Native 417279a8e8a0901b22dc42fe38c7eee3a6b090c67617fceaf7b2d312b45047e9, sRGB pixel (1130, 1130); artwork/logo-family/kite/2026-09-25-02/palette.json |

### An off-center head

The red kite head enters from the right with broad negative space to the left. A pale forehead, swept rust feathers and golden iris distinguish it from the peregrine.

红鸢头部从右侧入框，左侧保留大幅留白。浅色额羽、向后舒展的锈橙羽毛与金色虹膜使它区别于游隼。

### Connected color facets

Connected flat facets carry ivory, gray, rust-orange, gold and burgundy across the head and open beak. The feather silhouette stays recognizable without an added prop.

象牙白、灰色、锈橙、金色与酒红沿头部及张开的喙形成连贯平面切面，羽毛轮廓本身即可识别。

### Warm woodland paper

Quiet woodland leaves occupy the left-hand negative space on warm paper. A uniform 90% placement preserves the upper feather tip inside the rounded presentation; the original extraction remains archived.

安静的林缘叶片置于左侧留白与暖纸色之上。等比缩至 90% 的排布保护圆角内的上方羽尖，原尺寸抠图另行归档。

Small-size observation: Use the transparent head at 24/16px without an extra tile or mask. The head silhouette and beak remain the main cues; individual color facets soften at these sizes.

## Further refinements

Preserve the approved raster, original colors, complete silhouette, and exact generation/finishing records. Supporting textures remain separate. Published versions are immutable; generated raster artwork is not native SVG.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
