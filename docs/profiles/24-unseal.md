# 🔓 Unseal

## Profile

- Repository: [nocoo/unseal](https://github.com/nocoo/unseal)
- Website: [https://www.npmjs.com/package/unseal](https://www.npmjs.com/package/unseal)
- Website evidence: GitHub repository homepage
- Category: tools
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: Find quarantined macOS apps and interactively remove their quarantine flags.
- Chinese: 扫描被 macOS 隔离的应用，交互式地批量解除隔离标记。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `61a55cdb4380bc9e5dbaada3390ef29c7be6b84a`

## Project goal

Review quarantine results for apps in /Applications and select trusted apps for batch removal of the quarantine attribute.

查看 /Applications 内应用的隔离检测结果，选择可信应用后批量移除隔离属性。

- [中文 README](https://github.com/nocoo/unseal/blob/main/README.md) · [English README](https://github.com/nocoo/unseal/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/unseal/tree/2f31f698e1de11409d48dcf9e543bbb8c0706a7b)
- Source files: [`package.json`](https://github.com/nocoo/unseal/blob/2f31f698e1de11409d48dcf9e543bbb8c0706a7b/package.json), [`src/index.ts`](https://github.com/nocoo/unseal/blob/2f31f698e1de11409d48dcf9e543bbb8c0706a7b/src/index.ts), [`src/scanner.ts`](https://github.com/nocoo/unseal/blob/2f31f698e1de11409d48dcf9e543bbb8c0706a7b/src/scanner.ts), [`src/prompt.ts`](https://github.com/nocoo/unseal/blob/2f31f698e1de11409d48dcf9e543bbb8c0706a7b/src/prompt.ts), [`src/sudo.ts`](https://github.com/nocoo/unseal/blob/2f31f698e1de11409d48dcf9e543bbb8c0706a7b/src/sudo.ts), [`src/unseal.ts`](https://github.com/nocoo/unseal/blob/2f31f698e1de11409d48dcf9e543bbb8c0706a7b/src/unseal.ts), [`src/exec.ts`](https://github.com/nocoo/unseal/blob/2f31f698e1de11409d48dcf9e543bbb8c0706a7b/src/exec.ts), [`src/debug.ts`](https://github.com/nocoo/unseal/blob/2f31f698e1de11409d48dcf9e543bbb8c0706a7b/src/debug.ts), [`vitest.config.ts`](https://github.com/nocoo/unseal/blob/2f31f698e1de11409d48dcf9e543bbb8c0706a7b/vitest.config.ts), [`tests/exec.test.ts`](https://github.com/nocoo/unseal/blob/2f31f698e1de11409d48dcf9e543bbb8c0706a7b/tests/exec.test.ts)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript / Node.js | CLI logic and published-package runtime | CLI 逻辑与发布包运行环境 |
| Bun | Development and ESM bundling | 开发运行与 ESM 打包 |
| Inquirer / chalk | Terminal selection and colors | 终端选择与着色 |
| xattr / spctl / sudo | macOS attributes, assessment and permissions | macOS 属性、评估与权限操作 |
| Vitest | Module, flow and subprocess tests | 模块、流程与子进程测试 |

## Current logo

![Unseal source identity](../../public/logos/display/unseal-160.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: An opened green enamel and brass padlock
- [Source](https://github.com/nocoo/unseal/blob/61a55cdb4380bc9e5dbaada3390ef29c7be6b84a/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/unseal-family-2026-09-07-01-01.png)
- Original dimensions: 2048 × 2048
- Original size: 2323865 bytes
- SHA-256: `8868c38b03154d60f932fd26a67c198d4986476bbd81c4497bcc6f4c9e484c2b`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#4e5b4b` | Native unseal a793439f905e, sampled sRGB pixel (748, 1558); artwork/logo-family/unseal/2026-09-07-01/palette.json |
| background | `#bdcebd` | Adopted Unseal presentation, 2026-09-07-01/01; background.base in archived settings.json |
| accent | `#97793d` | Native unseal a793439f905e, sampled sRGB pixel (497, 558); artwork/logo-family/unseal/2026-09-07-01/palette.json |
| accent | `#d85238` | Native unseal a793439f905e, sampled sRGB pixel (1573, 1264); artwork/logo-family/unseal/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/unseal#brand).
- [Light lockup](../../public/brands/unseal/v1.0.0/lockup-light.png), [dark lockup](../../public/brands/unseal/v1.0.0/lockup-dark.png), [favicon](../../public/brands/unseal/v1.0.0/favicon.ico).
- [Complete usage and integration guide](../../public/brands/unseal/v1.0.0/guide.md), [standalone specimens](../../public/brands/unseal/v1.0.0/review.html), [all exports and SHA-256](../../public/brands/unseal/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Opened green enamel and brass padlock.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥79px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 79px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Unseal refined preview](../../public/logos/family/unseal/2026-09-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `01`
- Refined subject: An opened green enamel and brass padlock
- Site path: `/projects/unseal#brand`; [local gallery](https://index.dev.hexly.ai/projects/unseal#brand)
- [Static review HTML](../../artwork/logo-family/unseal/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/unseal/2026-09-07-01)
- [Transparent foreground](../../public/logos/family/unseal/2026-09-07-01/01/transparent.png); SHA-256: `8868c38b03154d60f932fd26a67c198d4986476bbd81c4497bcc6f4c9e484c2b`
- [Square icon](../../public/logos/family/unseal/2026-09-07-01/01/icon.png), [rounded icon](../../public/logos/family/unseal/2026-09-07-01/01/rounded.png), [white version](../../public/logos/family/unseal/2026-09-07-01/01/white.png)
- [Untouched generation](../../public/logos/family/unseal/2026-09-07-01/01/raw.png), [exact prompt](../../public/logos/family/unseal/2026-09-07-01/01/prompt.txt), [public asset checksums](../../public/logos/family/unseal/2026-09-07-01/01/manifest.json)
- [Previous original](../../public/logos/emoji/unseal.png), copied from [its immutable source](https://github.com/nocoo/nocoo/blob/9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6/README.md)
- Previous SHA-256: `67157ad6394cd71c60b4b19632cfa0883c2159aeeb8ea6146f51330f42eb19f9`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#bdcebd` | Adopted Unseal presentation, 2026-09-07-01/01; background.base in archived settings.json |
| primary | `#4e5b4b` | Native unseal a793439f905e, sampled sRGB pixel (748, 1558); artwork/logo-family/unseal/2026-09-07-01/palette.json |
| accent | `#97793d` | Native unseal a793439f905e, sampled sRGB pixel (497, 558); artwork/logo-family/unseal/2026-09-07-01/palette.json |
| accent | `#d85238` | Native unseal a793439f905e, sampled sRGB pixel (1573, 1264); artwork/logo-family/unseal/2026-09-07-01/palette.json |

### The latch lifts

A complete brass shackle lifts and turns above a substantial green padlock. The torn red paper seal stays attached as one restrained accent.

完整黄铜锁梁从厚实绿色锁身上抬起并转开。撕开的红色纸封仍贴着侧面，形成克制的单一兴趣点。

### Worn brass and sage enamel

Soft metal wear, curved enamel and the physical keyhole make the object tangible. The open shackle is unmistakable even without a separate key or symbol.

柔和金属磨损、弧面珐琅和真实锁眼带来触感；无需钥匙或附加符号，也能清楚识别解锁状态。

### Released seams

Separated perforated seams and folded-tab outlines embossed in calm sage paper. The field, grain and contact shadow are independent of transparent app marks.

鼠尾草色纸面的分离虚线与折页轮廓，呼应解除封印。 底色、颗粒与接触阴影均独立于透明应用标记。

Small-size observation: At 128/64 px, the open shackle, green body and red seal remain clear. At 32/24/16 px, the compact silhouette and dominant colors carry recognition; fine material detail, printed marks and background lines naturally merge.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
