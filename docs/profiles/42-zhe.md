# 🔗 Zhe

## Profile

- Repository: [nocoo/zhe](https://github.com/nocoo/zhe)
- Website: [https://zhe.to](https://zhe.to)
- Website evidence: GitHub repository homepage
- Category: tools
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: Short links, clean URLs, and a little less friction when sharing things.
- Chinese: 把长网址变成简洁的短链接，让分享少一点麻烦。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `075c875936e9a244c147ff9d58452398bb1ef3cf`

## Project goal

Keep personal links, Markdown ideas, and nested todos together, with short-link sharing and unified search.

集中整理个人链接、Markdown 想法和层级待办，通过短链接分享并统一搜索内容。

- [中文 README](https://github.com/nocoo/zhe/blob/main/README.md) · [English README](https://github.com/nocoo/zhe/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/zhe/tree/967f6e738440ab0739697659c242652408d7155c)
- Source files: [`package.json`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/package.json), [`worker/src/index.ts`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/worker/src/index.ts), [`worker/wrangler.toml.example`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/worker/wrangler.toml.example), [`lib/db/d1-client.ts`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/lib/db/d1-client.ts), [`lib/db/scoped/links.ts`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/lib/db/scoped/links.ts), [`actions/ideas.ts`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/actions/ideas.ts), [`actions/todos.ts`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/actions/todos.ts), [`components/search-command-dialog.tsx`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/components/search-command-dialog.tsx), [`app/api/ai/suggest-link-org/route.ts`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/app/api/ai/suggest-link-org/route.ts), [`cli/src/index.ts`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/cli/src/index.ts), [`cli/src/api/client.ts`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/cli/src/api/client.ts), [`auth.ts`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/auth.ts), [`lib/auth-allowlist.ts`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/lib/auth-allowlist.ts), [`scripts/test-stack.ts`](https://github.com/nocoo/zhe/blob/967f6e738440ab0739697659c242652408d7155c/scripts/test-stack.ts)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript | Application and CLI logic | 应用与 CLI 逻辑 |
| Next.js | Web dashboard and APIs | Web 管理台与 API |
| React | Interactive views | 交互视图 |
| Cloudflare Workers | Redirects and D1 proxy | 短链接跳转与 D1 代理 |
| Cloudflare D1 | User data | 用户数据 |
| Cloudflare KV | Redirect cache | 跳转缓存 |
| Cloudflare R2 | Uploaded files | 上传文件 |
| Auth.js | Google sign-in | Google 登录 |
| Bun | Dependency management and development tools | 依赖管理与开发工具 |
| Node.js | CLI runtime | CLI 运行环境 |
| Vercel AI SDK | Optional link organization suggestions | 可选的链接整理建议 |

## Current logo

![Zhe source identity](https://h.no.mt/projects/zhe/identity/v1.0.0/zhe-160-3fdb22935853.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Bee with colorful wings
- [Source](https://github.com/nocoo/zhe/blob/075c875936e9a244c147ff9d58452398bb1ef3cf/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/zhe/identity/v1.0.0/zhe-a0c8b9240261.png)
- Original dimensions: 2048 × 2048
- Original size: 3100798 bytes
- SHA-256: `a0c8b924026189661b2e5eb11d876775f5a3fd506c91b32e61992f53a811a046`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#7c3bed` | app/globals.css --primary: 262 83% 58% |
| background | `#eeeff2` | app/globals.css --background: 220 14% 94% |
| accent | `#e48f2b` | Preserved project artwork, sampled pixel |
| accent | `#48260d` | Preserved project artwork, sampled pixel |
| accent | `#fac7e2` | Preserved project artwork, sampled pixel |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/zhe#brand).
- [Light lockup](https://h.no.mt/brands/zhe/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/zhe/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/zhe/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/zhe/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/zhe/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/zhe/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Golden faceted bee with multicolored wings.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥47px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 47px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Zhe refined preview](https://h.no.mt/logos/family/zhe/2026-09-07-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `01`
- Refined subject: Original golden faceted bee with multicolored wings
- Site path: `/projects/zhe#brand`; [local gallery](https://index.dev.hexly.ai/projects/zhe#brand)
- [Static review HTML](../../artwork/logo-family/zhe/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/zhe/2026-09-07-01)
- [Transparent foreground](https://h.no.mt/logos/family/zhe/2026-09-07-01/01/transparent.png); SHA-256: `a0c8b924026189661b2e5eb11d876775f5a3fd506c91b32e61992f53a811a046`
- [Square icon](https://h.no.mt/logos/family/zhe/2026-09-07-01/01/icon.png), [rounded icon](https://h.no.mt/logos/family/zhe/2026-09-07-01/01/rounded.png), [white version](https://h.no.mt/logos/family/zhe/2026-09-07-01/01/white.png)
- [Untouched original](https://h.no.mt/logos/family/zhe/2026-09-07-01/01/source.png), [presentation brief](https://h.no.mt/logos/family/zhe/2026-09-07-01/01/brief.txt), [public asset checksums](https://h.no.mt/logos/family/zhe/2026-09-07-01/01/manifest.json)
- [Previous original](https://h.no.mt/projects/zhe/identity/v1.0.0/zhe-a0c8b9240261.png), copied from [its immutable source](https://github.com/nocoo/zhe/blob/120a01207c1b978a081413e785099d3580890d80/logo.png)
- Previous SHA-256: `a0c8b924026189661b2e5eb11d876775f5a3fd506c91b32e61992f53a811a046`
- Original artwork retained byte-for-byte at native 2048 × 2048. Zero image-generation calls; only background, grain, and shadow layers were composed.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#bb914f` | Selected Zhe presentation, finishing 01; background.base in archived settings.json |
| primary | `#f0b724` | Original zhe a0c8b9240261, sampled sRGB pixel (1478, 1111); palette.json |
| accent | `#e48f2a` | Original zhe a0c8b9240261, sampled sRGB pixel (1150, 1048); palette.json |
| accent | `#47260c` | Original zhe a0c8b9240261, sampled sRGB pixel (1159, 747); palette.json |
| accent | `#86cddf` | Original zhe a0c8b9240261, sampled sRGB pixel (616, 797); palette.json |
| accent | `#fac7e2` | Original zhe a0c8b9240261, sampled sRGB pixel (860, 398); palette.json |
| accent | `#e57863` | Original zhe a0c8b9240261, sampled sRGB pixel (1224, 300); palette.json |

### Keep the hovering gesture

The bee, antenna curls, wing spread, and original off-center balance remain unchanged. The native 2048 px canvas already gives the complete mark ample rounded-corner clearance.

蜜蜂、卷曲触角、展开的翅膀和原来的偏心平衡全部保留。2048 像素原图已经为完整主体留出了充分的圆角安全空间。

### Gold with one wing flourish

Broad honey and amber facets lead the body; the existing cyan-and-rose wing group supplies the colorful interest point. All source pixels and the transparent silhouette remain untouched.

蜂蜜金与琥珀色面构成主体，现有青粉色翅膀形成集中多彩的兴趣点。源图像素和透明轮廓均未修改。

### Pressed beeswax

Sparse oversized honeycomb cells sit around a warm beeswax field. Their uneven rhythm, light edges, fine grain, and shallow contact shadow support the bee without turning the logo into a scene.

稀疏的大蜂巢格分布在暖蜂蜡底色周围，不均匀的节奏、细亮边、颗粒和浅接触阴影衬托蜜蜂，保持标识的简洁。

Small-size observation: The golden body and cyan-pink wing group remain distinct at 32 px. At 16 px the antenna curls and smaller facets simplify into the overall silhouette; sidebar and browser marks use the transparent foreground.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
