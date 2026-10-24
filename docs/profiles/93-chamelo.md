# 🖌️ Chamelo

## Profile

- Repository: [nocoo/chamelo](https://github.com/nocoo/chamelo)
- Website: [https://chamelo.hexly.ai](https://chamelo.hexly.ai)
- Website evidence: wrangler.jsonc custom domain; https://chamelo.hexly.ai/ returned the collection page on 2026-10-24
- Category: design
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A Chinese-cultural colour atlas with curated palettes and agent briefs
- Chinese: 从中国文化意象出发的配色图谱，配套策展色板与 Agent 主题简报
- Profile section: Recent Projects
- Profile revision: `78a9bcef80b07a127a82b10dc5a6ccc71b3fdc49`
- Repository revision inspected: `bec2c8314d262ce59140f7ada41577f3ac4e71fb`

## Project goal

Turn an original cultural image into a curated palette, a semantic website theme and a self-contained brief an agent can implement. Every palette ships with six swatches, twelve semantic roles, proportions, a live preview and CSS or agent-prompt export.

把原创文化意象转成策展色板、语义化站点主题，以及 Agent 可直接落地的主题简报；每套配色都带六个色值、十二个语义角色、用色比例、实时预览与 CSS / Agent Prompt 导出。

- [中文 README](https://github.com/nocoo/chamelo/blob/main/README.md) · [English README](https://github.com/nocoo/chamelo/blob/main/docs/README.en.md)
- Verified: 2026-10-24; [source revision](https://github.com/nocoo/chamelo/tree/bec2c8314d262ce59140f7ada41577f3ac4e71fb)
- Source files: [`README.md`](https://github.com/nocoo/chamelo/blob/bec2c8314d262ce59140f7ada41577f3ac4e71fb/README.md), [`AGENTS.md`](https://github.com/nocoo/chamelo/blob/bec2c8314d262ce59140f7ada41577f3ac4e71fb/AGENTS.md), [`src/data/palettes.ts`](https://github.com/nocoo/chamelo/blob/bec2c8314d262ce59140f7ada41577f3ac4e71fb/src/data/palettes.ts), [`public/favicon.svg`](https://github.com/nocoo/chamelo/blob/bec2c8314d262ce59140f7ada41577f3ac4e71fb/public/favicon.svg)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| React / Vite | Editorial collection explorer and live theme preview | 策展图谱浏览与主题实时预览 |
| Culori | Colour conversion, contrast and export calculations | 色彩转换、对比度校验与导出计算 |
| Cloudflare Workers | Static asset delivery for chamelo.hexly.ai | chamelo.hexly.ai 的静态资源分发 |
| gpt-image-2.5-sunburst | Original cultural artwork before curation | 策展前的原创文化意象图像 |

## Current logo

![Chamelo source identity](https://h.no.mt/projects/chamelo/identity/v1.0.0/chamelo-160-74ba145ee4ac.webp)

- Type: Original project artwork, copied without modification
- Subject: Dunhuang-mural chameleon head entering the frame
- [Source](https://github.com/nocoo/chamelo/blob/bec2c8314d262ce59140f7ada41577f3ac4e71fb/public/favicon.svg): `public/favicon.svg`
- [Preserved asset](https://h.no.mt/projects/chamelo/identity/v1.0.0/chamelo-36d1f5a19426.svg)
- Original dimensions: 64 × 64
- Original size: 305 bytes
- SHA-256: `36d1f5a194268e37890433809f0a09240e77ca166184e5d49d28a68baa8c266c`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#2e4640` | src/data/palettes.ts dunhuang-huacai swatch teal; site theme primary |
| accent | `#9c513b` | src/data/palettes.ts dunhuang-huacai swatch cinnabar; site theme accent |
| accent | `#5d705e` | src/data/palettes.ts dunhuang-huacai swatch sage |
| accent | `#bd985d` | src/data/palettes.ts dunhuang-huacai swatch gold |
| background | `#f3ebdd` | src/data/palettes.ts dunhuang-huacai swatch paper; site theme background |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Current textured icons

![Chamelo current icon](https://h.no.mt/projects/chamelo/icons/v1.0.0/rounded-160.webp)

- [Native square PNG](https://h.no.mt/projects/chamelo/icons/v1.0.0/icon.png) · [Native continuous-corner PNG](https://h.no.mt/projects/chamelo/icons/v1.0.0/rounded.png) · [iOS 1024 px square](https://h.no.mt/projects/chamelo/icons/v1.0.0/icon-1024.png) · [Favicon ICO](https://h.no.mt/projects/chamelo/icons/v1.0.0/favicon.ico) · [Apple touch](https://h.no.mt/projects/chamelo/icons/v1.0.0/apple-touch-icon.png)
- [Manifest and checksums](https://h.no.mt/projects/chamelo/icons/v1.0.0/manifest.json) · [Usage, resampling and source rights](https://h.no.mt/projects/chamelo/icons/v1.0.0/guide.md)
- Native canvas 2048 × 2048; zero new image generation. Exact approved native square/rounded masters; foreground RGB, background and shadows follow the study recipe without recompositing. Continuous corners are already rendered for site use; use the square master for iOS. Smaller delivery sizes are resampled from the native master.
- Hexly presentation is adopted on this site. Source repositories retain their own recorded adoption state. Original identity archives below remain available.

## Refined identity

![Chamelo refined preview](https://h.no.mt/logos/family/chamelo/2026-10-24-05/01/icon-160.webp)

- Status: Local review; this finishing pass has not been adopted in the source project; updated 2026-10-24.
- Study `2026-10-24-05`, finishing `01`
- Refined subject: Dunhuang-mural chameleon head with a cinnabar ribbon, entering from the left edge
- Site path: `/projects/chamelo#brand`; [local gallery](https://index.dev.hexly.ai/projects/chamelo#brand)
- [Static review HTML](../../artwork/logo-family/chamelo/2026-10-24-05/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/chamelo/2026-10-24-05)
- [Transparent foreground](https://h.no.mt/logos/family/chamelo/2026-10-24-05/01/transparent.png); SHA-256: `338f4041d0ce4c31c02163f403c051ed4f9ead04a2825eaf87b69fde9447d0aa`
- [Square icon](https://h.no.mt/logos/family/chamelo/2026-10-24-05/01/icon.png), [rounded icon](https://h.no.mt/logos/family/chamelo/2026-10-24-05/01/rounded.png), [white version](https://h.no.mt/logos/family/chamelo/2026-10-24-05/01/white.png)
- [Untouched generation](https://h.no.mt/logos/family/chamelo/2026-10-24-05/01/raw.png), [exact prompt](https://h.no.mt/logos/family/chamelo/2026-10-24-05/01/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/chamelo/2026-10-24-05/01/manifest.json)
- [Previous original](https://h.no.mt/projects/chamelo/identity/v1.0.0/chamelo-36d1f5a19426.svg), copied from [its immutable source](https://github.com/nocoo/chamelo/blob/bec2c8314d262ce59140f7ada41577f3ac4e71fb/public/favicon.svg)
- Previous SHA-256: `36d1f5a194268e37890433809f0a09240e77ca166184e5d49d28a68baa8c266c`
- Generation: Azure OpenAI / Foundry · gpt-image-2.5-sunburst, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#255a81` | Native d65019b022e11e56a5ab6b5bdbaa8cb1b9fa1d9e8589f0fb03ae057e9fbe74b9, sRGB pixel (832, 960); artwork/logo-family/chamelo/2026-10-24-05/palette.json |
| accent | `#b03011` | Native d65019b022e11e56a5ab6b5bdbaa8cb1b9fa1d9e8589f0fb03ae057e9fbe74b9, sRGB pixel (448, 960); artwork/logo-family/chamelo/2026-10-24-05/palette.json |
| accent | `#658a63` | Native d65019b022e11e56a5ab6b5bdbaa8cb1b9fa1d9e8589f0fb03ae057e9fbe74b9, sRGB pixel (704, 1088); artwork/logo-family/chamelo/2026-10-24-05/palette.json |
| accent | `#deb04e` | Native d65019b022e11e56a5ab6b5bdbaa8cb1b9fa1d9e8589f0fb03ae057e9fbe74b9, sRGB pixel (256, 1472); artwork/logo-family/chamelo/2026-10-24-05/palette.json |
| background | `#efd5a8` | Native d65019b022e11e56a5ab6b5bdbaa8cb1b9fa1d9e8589f0fb03ae057e9fbe74b9, sRGB pixel (576, 1728); artwork/logo-family/chamelo/2026-10-24-05/palette.json |

### Half the square stays empty

The head enters diagonally from the left edge as if it had just climbed into the viewfinder; the empty right half is the subject, not leftover margin. 64% of the canvas stays clear.

头部自左缘斜着入画，像刚爬进取景框；右侧整片留白是构图主体，不是剩余边距，画布 64% 保持空。

### Dunhuang mineral pigment, not a faceted mascot

Azurite crest, malachite cheek band, cinnabar ribbon and gold-leaf flecks inside fine dark ink outlines, with pigment granulation and weathered flecks. The animal-family flat polygon facets were explicitly withdrawn for this project.

石青冠背、石绿颊带、丹砂飘带与金箔斑点，以细墨线勾勒，带颜料颗粒与剥落感。项目明确放弃家族平面切面画法。

### Weathered plaster light

A sand plaster field with hairline drying cracks, a lifting plaster edge and three pigment flecks, plus paper grain and one soft contact shadow. It follows the site's sand-and-mineral surface rather than a generic icon tile.

砂壁底纹配细裂缝、翻边与三处颜料斑点，另加纸面颗粒与一层柔和投影，呼应站点的砂岩与矿物表面，而非通用图标底板。

Small-size observation: At 64 px the azurite crest, the cinnabar ribbon and the eye still read; at 32 px the mark becomes a two-tone silhouette of crest and ribbon, and gold flecks and scale texture merge. Small marks therefore use the transparent foreground without a tile.

## Further refinements

Keep this asset as the phase-one baseline. A future family version should use a recognizable animal, one principal hue, and restrained multicolored geometric fragments.

Use head portraits for large animals and optionally full-body poses for small animals. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. Preserve this reviewed composition and its archived predecessors.
