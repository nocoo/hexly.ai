# 📐 Linie

## Profile

- Repository: [nocoo/linie](https://github.com/nocoo/linie)
- Website: [https://linie.hexly.ai](https://linie.hexly.ai)
- Website evidence: GitHub repository homepage
- Category: design
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A network operations dashboard template drawn like an engineering verification sheet.
- Chinese: 以工程校核图为视觉语言的网络运维控制台模板。
- Profile section: Recent Projects
- Profile revision: `bddebab587a51598d3687154497bec8f6272fe81`
- Repository revision inspected: `b5fd3abc06abc9127808afed6ee7b7356de1c6f2`

## Project goal

Start a large-scale network operations console from a working React template: a deterministic 1,248-host fleet, six operational panels, a closable sidebar and a read-only simulated companion, with no production systems connected.

用一套可运行的 React 模板起步做大型网络运维控制台：1,248 台确定性主机、六个运维面板、可收起侧栏和只读模拟助手，不接入任何生产系统。

- [中文 README](https://github.com/nocoo/linie/blob/main/README.md) · [English README](https://github.com/nocoo/linie/blob/main/docs/README.en.md)
- Verified: 2026-11-07; [source revision](https://github.com/nocoo/linie/tree/46c834b200b5edaa4d98731cb0d02f111b0558f4)
- Source files: [`package.json`](https://github.com/nocoo/linie/blob/46c834b200b5edaa4d98731cb0d02f111b0558f4/package.json), [`README.md`](https://github.com/nocoo/linie/blob/46c834b200b5edaa4d98731cb0d02f111b0558f4/README.md), [`docs/README.en.md`](https://github.com/nocoo/linie/blob/46c834b200b5edaa4d98731cb0d02f111b0558f4/docs/README.en.md), [`src/styles/tokens.css`](https://github.com/nocoo/linie/blob/46c834b200b5edaa4d98731cb0d02f111b0558f4/src/styles/tokens.css), [`src/views/WorkspaceShell.tsx`](https://github.com/nocoo/linie/blob/46c834b200b5edaa4d98731cb0d02f111b0558f4/src/views/WorkspaceShell.tsx), [`src/views/AtlasHeader.tsx`](https://github.com/nocoo/linie/blob/46c834b200b5edaa4d98731cb0d02f111b0558f4/src/views/AtlasHeader.tsx), [`src/models/infrastructure.ts`](https://github.com/nocoo/linie/blob/46c834b200b5edaa4d98731cb0d02f111b0558f4/src/models/infrastructure.ts), [`worker/index.ts`](https://github.com/nocoo/linie/blob/46c834b200b5edaa4d98731cb0d02f111b0558f4/worker/index.ts), [`cloudflare.config.ts`](https://github.com/nocoo/linie/blob/46c834b200b5edaa4d98731cb0d02f111b0558f4/cloudflare.config.ts), [`vitest.config.ts`](https://github.com/nocoo/linie/blob/46c834b200b5edaa4d98731cb0d02f111b0558f4/vitest.config.ts)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | Strict application, view-model and Worker logic | 严格模式的应用、视图模型与 Worker 逻辑 |
| React | Six-panel atlas interface and workspace shell | 六面板图谱界面与工作台外壳 |
| Vite | Local development and production build | 本地开发与生产构建 |
| Radix Themes | Accessible standard controls with square drawing geometry | 带方形制图几何的可访问标准控件 |
| Lucide | Interface icons | 界面图标 |
| Biome | Lint and formatting with warnings rejected | 拒绝告警的静态检查与格式化 |
| Vitest | Model, view-model, Worker and deployment-verification tests | 模型、视图模型、Worker 与部署校验测试 |
| Playwright | Desktop and mobile journeys with axe accessibility checks | 桌面与手机流程及 axe 无障碍检查 |
| Cloudflare Workers | Static assets plus an anonymous liveness endpoint | 静态资源托管与匿名存活端点 |

## Current logo

![Linie source identity](https://h.no.mt/projects/linie/identity/v1.0.0/linie-160-c9c2e5d369f0.webp)

- Type: Original project artwork, copied without modification
- Subject: Satin teal-enamel drafting set square with a triangular opening and brushed-brass working edge
- [Source](https://github.com/nocoo/linie/blob/21dc59c64d7627ad497ee335aa1438379824269d/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/linie/identity/v1.0.0/linie-family-2026-11-07-01-01-c6c3b34616bf.png)
- Original dimensions: 2048 × 2048
- Original size: 2683501 bytes
- SHA-256: `c6c3b34616bf9ef4fa8969e56c275fe1122adc1dbefbe0a2baefcf09f01611a4`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#087368` | src/styles/tokens.css --accent |
| background | `#f3f5ef` | src/styles/tokens.css --paper |
| accent | `#21474b` | src/styles/tokens.css --ink |
| accent | `#014751` | Native linie c3dbf95889f3, sampled sRGB pixel (712, 1119); artwork/logo-family/linie/2026-11-07-01/palette.json |
| accent | `#b08f50` | Native linie c3dbf95889f3, sampled sRGB pixel (1124, 1599); artwork/logo-family/linie/2026-11-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Current textured icons

![Linie current icon](https://h.no.mt/projects/linie/icons/v1.0.0/rounded-160.webp)

- [Native square PNG](https://h.no.mt/projects/linie/icons/v1.0.0/icon.png) · [Native continuous-corner PNG](https://h.no.mt/projects/linie/icons/v1.0.0/rounded.png) · [iOS 1024 px square](https://h.no.mt/projects/linie/icons/v1.0.0/icon-1024.png) · [Favicon ICO](https://h.no.mt/projects/linie/icons/v1.0.0/favicon.ico) · [Apple touch](https://h.no.mt/projects/linie/icons/v1.0.0/apple-touch-icon.png)
- [Manifest and checksums](https://h.no.mt/projects/linie/icons/v1.0.0/manifest.json) · [Usage, resampling and source rights](https://h.no.mt/projects/linie/icons/v1.0.0/guide.md)
- Native canvas 2048 × 2048; zero new image generation. Unchanged foreground colors over the approved light texture at 70% opacity. Continuous corners are already rendered for site use; use the square master for iOS. Smaller delivery sizes are resampled from the native master.
- Hexly presentation is adopted on this site. Source repositories retain their own recorded adoption state. Original identity archives below remain available.

## Current campaign texture

- Construction-grain field / 制图刻线场: Pressed drafting-guide furrows, fine unnumbered ruler notches and crossing construction impressions form a quiet engineered paper field.
- 压印的制图导引槽、无数字的细密刻线与交叉构造痕构成一张克制的工程纸面。
- Model: `gpt-image-2.5-flare`; independently generated light/dark full canvases, no crop or repeat.
- Independent texture pack v1.0.1; the original identity kit and its historical surfaces remain unchanged. Text-bearing surfaces use a separate layer at opacity 0.45.
- [Paper PNG](https://h.no.mt/projects/linie/textures/v1.0.1/texture-light.png) · [Night PNG](https://h.no.mt/projects/linie/textures/v1.0.1/texture-dark.png) · [Exact paper prompt](https://h.no.mt/projects/linie/textures/v1.0.1/texture-light-prompt.txt) · [Exact night prompt](https://h.no.mt/projects/linie/textures/v1.0.1/texture-dark-prompt.txt)
- [Manifest and hashes](https://h.no.mt/projects/linie/textures/v1.0.1/manifest.json) · [Usage/rights](https://h.no.mt/projects/linie/textures/v1.0.1/guide.md) · [Full-canvas specimens](https://hexly.ai/textures/linie/v1.0.1/review.html)
- Hexly pages and promotional materials only. Preserve official Logo bytes/colors, product UI, and archived status. Reuse the files directly; no per-campaign generation is required.

## Refined identity

![Linie refined preview](https://h.no.mt/logos/family/linie/2026-11-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-11-07.
- Study `2026-11-07-01`, finishing `01`
- Refined subject: Teal enamel drafting set square with a brass working edge
- Site path: `/projects/linie#brand`; [local gallery](https://index.dev.hexly.ai/projects/linie#brand)
- [Static review HTML](../../artwork/logo-family/linie/2026-11-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/linie/2026-11-07-01)
- [Transparent foreground](https://h.no.mt/logos/family/linie/2026-11-07-01/01/transparent.png); SHA-256: `c6c3b34616bf9ef4fa8969e56c275fe1122adc1dbefbe0a2baefcf09f01611a4`
- [Square icon](https://h.no.mt/logos/family/linie/2026-11-07-01/01/icon.png), [rounded icon](https://h.no.mt/logos/family/linie/2026-11-07-01/01/rounded.png), [white version](https://h.no.mt/logos/family/linie/2026-11-07-01/01/white.png)
- [Untouched generation](https://h.no.mt/logos/family/linie/2026-11-07-01/01/raw.png), [exact prompt](https://h.no.mt/logos/family/linie/2026-11-07-01/01/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/linie/2026-11-07-01/01/manifest.json)
- [Previous original](https://h.no.mt/shared/site/v1.0.0/linie-favicon-3454b356d0d5.png), copied from [its immutable source](https://github.com/nocoo/linie/blob/46c834b200b5edaa4d98731cb0d02f111b0558f4/public/favicon.svg)
- Previous SHA-256: `3454b356d0d54ea27d3bbae9d4febc7e64f2e41e2b789d7ed184ddef4e24102d`
- Generation: gpt-image-2.5-sunburst, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#e7e8df` | Selected Linie presentation, 2026-11-07-01/01; background.base in archived settings.json |
| primary | `#014751` | Native linie c3dbf95889f3, sampled sRGB pixel (712, 1119); artwork/logo-family/linie/2026-11-07-01/palette.json |
| accent | `#4e7679` | Native linie c3dbf95889f3, sampled sRGB pixel (160, 699); artwork/logo-family/linie/2026-11-07-01/palette.json |
| accent | `#b08f50` | Native linie c3dbf95889f3, sampled sRGB pixel (1124, 1599); artwork/logo-family/linie/2026-11-07-01/palette.json |

### A complete drafting instrument

One triangular set square at a product-photography angle, with a clean central opening and the complete silhouette inset inside the rounded presentation. Its floor shadow is independent.

一块三角尺以产品摄影角度完整呈现，中央开孔干净，整体轮廓留出圆角安全距离。地面投影独立保存。

### Teal enamel and brass

Deep enamel carries the identity; a narrow brushed-brass working edge adds one crafted accent. Physical thickness, restrained highlights and machining grain keep the tool credible.

深青珐琅构成主体，细窄拉丝黄铜工作边提供唯一的工艺点缀。真实厚度、克制高光与加工细纹让工具保持可信。

### Set-square calibration field

Warm drafting paper holds one sparse right-angle construction, two reference rays, calibration ticks and three registration brackets. None of it enters transparent UI marks.

暖色制图纸上只有一组稀疏直角构造线、两条基准射线、校准刻线与三个定位括号，均不进入透明界面标记。

Small-size observation: At 128/64 px the triangular opening and brass edge remain readable. At 32/24 px the silhouette still reads as a set square; at 16 px the enamel outline and opening carry the mark, while machining grain and the brass reflection recede.

## Further refinements

This is an owner-directed physical material or architectural identity. Preserve its physical materials, complete silhouette, selected camera and distinct tonal presentation. The animal-series drawing and accessory rules do not apply.

Keep the complete object uniformly inset from the actual rounded outline, with backgrounds, projected shadows and any external emission separate from the transparent foreground. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. Preserve this reviewed composition and its archived predecessors.
