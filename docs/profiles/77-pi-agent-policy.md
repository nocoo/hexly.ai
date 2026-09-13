# 🔧 Pi Agent Policy

## Profile

- Repository: [nocoo/pi-agent-policy](https://github.com/nocoo/pi-agent-policy)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: tools
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: User-level Pi tool policies and bounded recovery
- Chinese: 用户级 Pi 工具策略与有界恢复
- Profile section: Recent Projects
- Profile revision: `fb6a46a799607ddd99832ab82a9afc374df2e580`
- Repository revision inspected: `ba73409bd7326fa1a425e5faa918a285cde42de5`

## Project goal

Install once in the Pi user directory to apply declarative tool policies across projects. Policy repairs and eligible terminal recovery share one allowance per original user input; the extension returns real native-tool alternatives and waits for agent_settled before recovery. The repository is currently private, and there is no independent website.

在 Pi 用户目录安装一次，即可跨项目应用声明式工具策略。策略修复与符合条件的终止恢复共用每次原始输入的一次额度；工具受限时返回真实原生替代工具，恢复等待 agent_settled。仓库目前为私有，没有独立站点。

- [中文 README](https://github.com/nocoo/pi-agent-policy/blob/main/README.md) · [English README](https://github.com/nocoo/pi-agent-policy/blob/main/docs/README.en.md)
- Verified: 2026-09-14; [source revision](https://github.com/nocoo/pi-agent-policy/tree/ba73409bd7326fa1a425e5faa918a285cde42de5)
- Source files: [`README.md`](https://github.com/nocoo/pi-agent-policy/blob/ba73409bd7326fa1a425e5faa918a285cde42de5/README.md), [`docs/README.en.md`](https://github.com/nocoo/pi-agent-policy/blob/ba73409bd7326fa1a425e5faa918a285cde42de5/docs/README.en.md), [`docs/reference.md`](https://github.com/nocoo/pi-agent-policy/blob/ba73409bd7326fa1a425e5faa918a285cde42de5/docs/reference.md), [`src/index.ts`](https://github.com/nocoo/pi-agent-policy/blob/ba73409bd7326fa1a425e5faa918a285cde42de5/src/index.ts), [`install.mjs`](https://github.com/nocoo/pi-agent-policy/blob/ba73409bd7326fa1a425e5faa918a285cde42de5/install.mjs), [`package.json`](https://github.com/nocoo/pi-agent-policy/blob/ba73409bd7326fa1a425e5faa918a285cde42de5/package.json), [`default-config.json`](https://github.com/nocoo/pi-agent-policy/blob/ba73409bd7326fa1a425e5faa918a285cde42de5/default-config.json), [`assets/brand/adoption.json`](https://github.com/nocoo/pi-agent-policy/blob/ba73409bd7326fa1a425e5faa918a285cde42de5/assets/brand/adoption.json)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Pi 0.85.1+ | Public extension events, native tool schemas and user-directory installation | 公开扩展事件、原生工具 schema 与用户级安装 |
| TypeScript / Node.js 22.19+ | Declarative rules, shared repair budget and versioned installer | 声明式规则、共享修复额度与版本化安装器 |
| mvdan-sh 0.10.1 | Pinned shell parser; unknown syntax defaults to known commands only | 固定版本 shell 解析器；未知语法默认仅检查已知命令 |

## Current logo

![Pi Agent Policy source identity](https://h.no.mt/projects/pi-agent-policy/identity/v1.0.0/pi-agent-policy-160-219e2b72a80e.webp)

- Type: Owner-approved GPT Image raster identity; source-adopted bytes and generation provenance preserved
- Subject: Compact graphite push-to-reset instrument with an ivory face, terracotta button and brass contacts
- [Source](https://github.com/nocoo/pi-agent-policy/blob/ba73409bd7326fa1a425e5faa918a285cde42de5/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/pi-agent-policy/identity/v1.0.0/pi-agent-policy-family-2026-09-14-03-01-c090785742f2.png)
- Original dimensions: 2048 × 2048
- Original size: 3982512 bytes
- SHA-256: `c090785742f29fbaed227af799e5555a49b20449c5f37cdea5fb826fae1d3611`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#e5e3d9` | artwork/logo-family/pi-agent-policy/2026-09-14-03/finishing/01/settings.json background.base; authored presentation, not a product UI token |
| accent | `#726f6c` | Native approved gpt-image-2 output 71582aad00f1f98416c900fa5ebc134a2b63136205da0411452931cc48260c85, sRGB pixel (1070, 360); artwork/logo-family/pi-agent-policy/2026-09-14-03/palette.json |
| accent | `#e3daca` | Native approved gpt-image-2 output 71582aad00f1f98416c900fa5ebc134a2b63136205da0411452931cc48260c85, sRGB pixel (655, 700); artwork/logo-family/pi-agent-policy/2026-09-14-03/palette.json |
| primary | `#aa381f` | Native approved gpt-image-2 output 71582aad00f1f98416c900fa5ebc134a2b63136205da0411452931cc48260c85, sRGB pixel (610, 1100); artwork/logo-family/pi-agent-policy/2026-09-14-03/palette.json |
| accent | `#d5c6b2` | Native approved gpt-image-2 output 71582aad00f1f98416c900fa5ebc134a2b63136205da0411452931cc48260c85, sRGB pixel (1030, 885); artwork/logo-family/pi-agent-policy/2026-09-14-03/palette.json |
| accent | `#a07c4b` | Native approved gpt-image-2 output 71582aad00f1f98416c900fa5ebc134a2b63136205da0411452931cc48260c85, sRGB pixel (1810, 800); artwork/logo-family/pi-agent-policy/2026-09-14-03/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.1`; [public archive](https://hexly.ai/projects/pi-agent-policy#brand).
- [Light lockup](https://h.no.mt/brands/pi-agent-policy/v1.0.1/lockup-light.png), [dark lockup](https://h.no.mt/brands/pi-agent-policy/v1.0.1/lockup-dark.png), [favicon](https://h.no.mt/brands/pi-agent-policy/v1.0.1/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/pi-agent-policy/v1.0.1/guide.md), [standalone specimens](https://hexly.ai/brands/pi-agent-policy/v1.0.1/review.html), [all exports and SHA-256](https://h.no.mt/brands/pi-agent-policy/v1.0.1/manifest.json).
- Source adoption: recorded at `ba73409bd7326fa1a425e5faa918a285cde42de5`.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.
- [Previous v1.0.0 archive](https://hexly.ai/brands/pi-agent-policy/v1.0.0/review.html) remains immutable.


A graphite reset instrument for user-level Pi tool policies and bounded recovery.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥143px wide; lockup ≥164px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine material detail softens at 16px.

导航推荐 24px，最小 16px。字标宽度至少 143px，组合至少 164px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小材质细节会柔化。

## Refined identity

![Pi Agent Policy refined preview](https://h.no.mt/logos/family/pi-agent-policy/2026-09-14-03/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-14.
- Study `2026-09-14-03`, finishing `01`
- Refined subject: Graphite reset instrument with terracotta enamel control
- Site path: `/projects/pi-agent-policy#brand`; [local gallery](https://index.dev.hexly.ai/projects/pi-agent-policy#brand)
- [Static review HTML](../../artwork/logo-family/pi-agent-policy/2026-09-14-03/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/pi-agent-policy/2026-09-14-03)
- [Transparent foreground](https://h.no.mt/logos/family/pi-agent-policy/2026-09-14-03/01/transparent.png); SHA-256: `c090785742f29fbaed227af799e5555a49b20449c5f37cdea5fb826fae1d3611`
- [Square icon](https://h.no.mt/logos/family/pi-agent-policy/2026-09-14-03/01/icon.png), [rounded icon](https://h.no.mt/logos/family/pi-agent-policy/2026-09-14-03/01/rounded.png), [white version](https://h.no.mt/logos/family/pi-agent-policy/2026-09-14-03/01/white.png)
- [Untouched generation](https://h.no.mt/logos/family/pi-agent-policy/2026-09-14-03/01/raw.png), [exact prompt](https://h.no.mt/logos/family/pi-agent-policy/2026-09-14-03/01/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/pi-agent-policy/2026-09-14-03/01/manifest.json)
- First project identity; no earlier independent Logo existed at intake.
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#e5e3d9` | artwork/logo-family/pi-agent-policy/2026-09-14-03/finishing/01/settings.json background.base; authored presentation, not a product UI token |
| accent | `#726f6c` | Native approved gpt-image-2 output 71582aad00f1f98416c900fa5ebc134a2b63136205da0411452931cc48260c85, sRGB pixel (1070, 360); artwork/logo-family/pi-agent-policy/2026-09-14-03/palette.json |
| accent | `#e3daca` | Native approved gpt-image-2 output 71582aad00f1f98416c900fa5ebc134a2b63136205da0411452931cc48260c85, sRGB pixel (655, 700); artwork/logo-family/pi-agent-policy/2026-09-14-03/palette.json |
| primary | `#aa381f` | Native approved gpt-image-2 output 71582aad00f1f98416c900fa5ebc134a2b63136205da0411452931cc48260c85, sRGB pixel (610, 1100); artwork/logo-family/pi-agent-policy/2026-09-14-03/palette.json |
| accent | `#d5c6b2` | Native approved gpt-image-2 output 71582aad00f1f98416c900fa5ebc134a2b63136205da0411452931cc48260c85, sRGB pixel (1030, 885); artwork/logo-family/pi-agent-policy/2026-09-14-03/palette.json |
| accent | `#a07c4b` | Native approved gpt-image-2 output 71582aad00f1f98416c900fa5ebc134a2b63136205da0411452931cc48260c85, sRGB pixel (1810, 800); artwork/logo-family/pi-agent-policy/2026-09-14-03/palette.json |

### A deliberate reset

A compact instrument floats in a measured three-quarter view. The housing, button and two contacts remain complete, uniformly inset from the rounded outline.

紧凑仪器从斜侧方悬浮呈现，外壳、按钮和两个触点完整保留，整体等比内收，为圆角边界留足空间。

### Materials with a purpose

Graphite, ivory, terracotta enamel, steel and brass give policy and bounded recovery a physical metaphor. Original material colors and opaque highlights survive transparent extraction; this is not a sandbox claim.

石墨、象牙白、陶土色珐琅、钢和黄铜，把策略与有界恢复转译为实体工具。透明提取保留原始材质颜色和不透明高光；这个隐喻不代表系统沙箱。

### Interrupted contacts and a single return

Paired contact stops and one returning trace, pressed into warm mineral paper. The open circuit and short reset path echo bounded recovery; their geometry belongs to this instrument, without copying another project's circuit grid.

暖矿物纸底上压印成对的触点断口和一条返回轨迹，呼应有限的恢复机会。纹理、细颗粒和柔和投影独立于透明标志。

Small-size observation: The graphite silhouette and red control remain legible at 24/16px; fine knurling and metal highlights soften. Small marks use transparent foregrounds without tiles, masks or extra dots. This extension has no standalone web UI.

## Further refinements

Preserve the approved raster, original colors, complete silhouette, and exact generation/finishing records. Supporting textures remain separate. Published versions are immutable; generated raster artwork is not native SVG.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
