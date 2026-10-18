# 🧠 Octo

## Profile

- Repository: [nocoo/octo](https://github.com/nocoo/octo)
- Website: [https://octo.hexly.ai](https://octo.hexly.ai)
- Website evidence: Deployment configuration at 0d0bcae39f7cb5fd4a22248f63bde57fed29cf01; docs/sources/octo-2026-10-18.json
- Category: everyday
- Archived repository: No; [repository status evidence](../../docs/sources/octo-2026-10-18.json)
- English: Private API-first memory and knowledge base
- Chinese: 以 API 为主的私人记忆与知识库
- Profile section: Recent Projects
- Profile revision: `ba9e19ea8343b456dd7640d89b2c873f66753543`
- Repository revision inspected: `0d0bcae39f7cb5fd4a22248f63bde57fed29cf01`

## Project goal

Store private memories, tags, versions and attachments through scoped REST and MCP APIs, with an Access-protected admin dashboard. External bots perform migration, deduplication and summaries; Vectorize is a derived index, not the source of truth.

通过带作用域的 REST 与 MCP API 保存私人记忆、标签、版本和附件，管理工作台由 Access 保护。迁移、去重和摘要由外部 bot 完成；Vectorize 是派生索引，而非数据源。

- [中文 README](https://github.com/nocoo/octo/blob/main/README.md) · [English README](https://github.com/nocoo/octo/blob/main/docs/README.en.md)
- Verified: 2026-10-18; [source revision](https://github.com/nocoo/octo/tree/0d0bcae39f7cb5fd4a22248f63bde57fed29cf01)
- Source files: [`README.md`](https://github.com/nocoo/octo/blob/0d0bcae39f7cb5fd4a22248f63bde57fed29cf01/README.md), [`package.json`](https://github.com/nocoo/octo/blob/0d0bcae39f7cb5fd4a22248f63bde57fed29cf01/package.json), [`wrangler.toml`](https://github.com/nocoo/octo/blob/0d0bcae39f7cb5fd4a22248f63bde57fed29cf01/wrangler.toml), [`apps/web/src/client/app.tsx`](https://github.com/nocoo/octo/blob/0d0bcae39f7cb5fd4a22248f63bde57fed29cf01/apps/web/src/client/app.tsx), [`apps/web/src/client/index.css`](https://github.com/nocoo/octo/blob/0d0bcae39f7cb5fd4a22248f63bde57fed29cf01/apps/web/src/client/index.css), [`apps/web/src/server/routes/live.ts`](https://github.com/nocoo/octo/blob/0d0bcae39f7cb5fd4a22248f63bde57fed29cf01/apps/web/src/server/routes/live.ts)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Hono / Cloudflare Workers | REST, MCP and protected dashboard delivery | REST、MCP 与受保护工作台 |
| D1 / R2 / Vectorize | Memory records, attachments and derived vectors | 记忆数据、附件与派生向量 |
| React / Vite / Basalt | Admin dashboard | 管理工作台 |

## Current logo

![Octo source identity](https://h.no.mt/projects/octo/identity/v1.0.0/octo-family-2026-10-18-160-4b32ff106cfa.webp)

- Type: Owner-approved GPT Image raster identity; source-adopted bytes and generation provenance preserved
- Subject: Fragmented blue seahorse portrait
- [Source](https://github.com/nocoo/octo/blob/0d0bcae39f7cb5fd4a22248f63bde57fed29cf01/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/octo/identity/v1.0.0/octo-family-2026-10-18-07-02-99dd018d5be6.png)
- Original dimensions: 2048 × 2048
- Original size: 2203787 bytes
- SHA-256: `99dd018d5be648af52f777a24eaac5dc627b8d17ff704f8ac2c5f1abc0fba3ad`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#3b8ee0` | Native 45a116b928a55c88463f205f76cdbc0a541baedb1e87e2f8fdf2128607ebb0e7, sRGB pixel (800, 450); artwork/logo-family/octo/2026-10-18-07/palette.json |
| accent | `#95d6f7` | Native 45a116b928a55c88463f205f76cdbc0a541baedb1e87e2f8fdf2128607ebb0e7, sRGB pixel (600, 1240); artwork/logo-family/octo/2026-10-18-07/palette.json |
| accent | `#fca87d` | Native 45a116b928a55c88463f205f76cdbc0a541baedb1e87e2f8fdf2128607ebb0e7, sRGB pixel (700, 720); artwork/logo-family/octo/2026-10-18-07/palette.json |
| accent | `#f5eac6` | Native 45a116b928a55c88463f205f76cdbc0a541baedb1e87e2f8fdf2128607ebb0e7, sRGB pixel (780, 310); artwork/logo-family/octo/2026-10-18-07/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Current textured icons

![Octo current icon](https://h.no.mt/projects/octo/icons/v1.0.2/rounded-160.webp)

- [Native square PNG](https://h.no.mt/projects/octo/icons/v1.0.2/icon.png) · [Native continuous-corner PNG](https://h.no.mt/projects/octo/icons/v1.0.2/rounded.png) · [iOS 1024 px square](https://h.no.mt/projects/octo/icons/v1.0.2/icon-1024.png) · [Favicon ICO](https://h.no.mt/projects/octo/icons/v1.0.2/favicon.ico) · [Apple touch](https://h.no.mt/projects/octo/icons/v1.0.2/apple-touch-icon.png)
- [Manifest and checksums](https://h.no.mt/projects/octo/icons/v1.0.2/manifest.json) · [Usage, resampling and source rights](https://h.no.mt/projects/octo/icons/v1.0.2/guide.md)
- Native canvas 2048 × 2048; zero new image generation. Unchanged foreground colors over the approved light texture at 70% opacity. Continuous corners are already rendered for site use; use the square master for iOS. Smaller delivery sizes are resampled from the native master.
- Hexly presentation is adopted on this site. Source repositories retain their own recorded adoption state. Original identity archives below remain available.

## Current campaign texture

- Seagrass shelter / 海草栖地: Long ribbon-like seagrass leaves form a loose coastal shelter around an open, quiet field.
- 细长带状海草叶围出疏朗的近岸栖地，将中央留给海马。
- Model: `gpt-image-2.5-flare`; independently generated light/dark full canvases, no crop or repeat.
- Independent texture pack v1.0.1; the original identity kit and its historical surfaces remain unchanged. Text-bearing surfaces use a separate layer at opacity 0.37.
- [Paper PNG](https://h.no.mt/projects/octo/textures/v1.0.1/texture-light.png) · [Night PNG](https://h.no.mt/projects/octo/textures/v1.0.1/texture-dark.png) · [Exact paper prompt](https://h.no.mt/projects/octo/textures/v1.0.1/texture-light-prompt.txt) · [Exact night prompt](https://h.no.mt/projects/octo/textures/v1.0.1/texture-dark-prompt.txt)
- [Manifest and hashes](https://h.no.mt/projects/octo/textures/v1.0.1/manifest.json) · [Usage/rights](https://h.no.mt/projects/octo/textures/v1.0.1/guide.md) · [Full-canvas specimens](https://hexly.ai/textures/octo/v1.0.1/review.html)
- Hexly pages and promotional materials only. Preserve official Logo bytes/colors, product UI, and archived status. Reuse the files directly; no per-campaign generation is required.

## Refined identity

![Octo refined preview](https://h.no.mt/logos/family/octo/2026-10-18-07/02/icon-160.webp)

- Status: Adopted in the source project; updated 2026-10-18.
- Study `2026-10-18-07`, finishing `02`
- Refined subject: Fragmented blue seahorse portrait
- Site path: `/projects/octo#brand`; [local gallery](https://index.dev.hexly.ai/projects/octo#brand)
- [Static review HTML](../../artwork/logo-family/octo/2026-10-18-07/review.html)
- [Full process archive](../../artwork/logo-family/octo/2026-10-18-07)
- [Transparent foreground](https://h.no.mt/logos/family/octo/2026-10-18-07/02/transparent.png); SHA-256: `99dd018d5be648af52f777a24eaac5dc627b8d17ff704f8ac2c5f1abc0fba3ad`
- [Square icon](https://h.no.mt/logos/family/octo/2026-10-18-07/02/icon.png), [rounded icon](https://h.no.mt/logos/family/octo/2026-10-18-07/02/rounded.png), [white version](https://h.no.mt/logos/family/octo/2026-10-18-07/02/white.png)
- [Untouched generation](https://h.no.mt/logos/family/octo/2026-10-18-07/02/raw.png), [exact prompt](https://h.no.mt/logos/family/octo/2026-10-18-07/02/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/octo/2026-10-18-07/02/manifest.json)
- First project identity; no earlier independent Logo existed at intake.
- Generation: gpt-image-2.5-sunburst, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#b9d2cc` | artwork/logo-family/octo/2026-10-18-07/presentation.json background.base; not a product UI token |
| primary | `#3b8ee0` | Native 45a116b928a55c88463f205f76cdbc0a541baedb1e87e2f8fdf2128607ebb0e7, sRGB pixel (800, 450); artwork/logo-family/octo/2026-10-18-07/palette.json |
| accent | `#95d6f7` | Native 45a116b928a55c88463f205f76cdbc0a541baedb1e87e2f8fdf2128607ebb0e7, sRGB pixel (600, 1240); artwork/logo-family/octo/2026-10-18-07/palette.json |
| accent | `#fca87d` | Native 45a116b928a55c88463f205f76cdbc0a541baedb1e87e2f8fdf2128607ebb0e7, sRGB pixel (700, 720); artwork/logo-family/octo/2026-10-18-07/palette.json |
| accent | `#f5eac6` | Native 45a116b928a55c88463f205f76cdbc0a541baedb1e87e2f8fdf2128607ebb0e7, sRGB pixel (780, 310); artwork/logo-family/octo/2026-10-18-07/palette.json |

### Complete approved form

An off-center head and long snout, with the lower neck entering the frame. A 96 px integer translation protects the complete fin.

偏心头部与长吻，颈部从底边进入；整体平移 96 像素保护完整侧鳍。

### Connected flat facets

Connected irregular flat blue facets with coral, yellow and pale mint accents; all opaque source RGB is unchanged.

蓝色不规则相连平面搭配珊瑚、黄色和浅薄荷切面，不改变不透明源像素颜色。

### Sheltered seagrass meadow

Sparse swaying eelgrass blades at the upper-right and lower-right canvas edges; quiet habitat marks behind the approved seahorse, not an underwater illustration.

独立海草压痕、细纸纹理与两层浅阴影，保持产品主题不变。

Small-size observation: At 24/16 px the crown and long snout carry identity; tiny facets and the second eye soften.

## Further refinements

Preserve the approved raster, original colors, complete silhouette, and exact generation/finishing records. Supporting textures remain separate. Published versions are immutable; generated raster artwork is not native SVG.

Use head portraits for large animals and optionally full-body poses for small animals. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. Preserve this reviewed composition and its archived predecessors.
