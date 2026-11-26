# 🐿️ Squirrel

## Profile

- Repository: [nocoo/squirrel](https://github.com/nocoo/squirrel)
- Website: [https://squirrel.hexly.ai](https://squirrel.hexly.ai)
- Website evidence: wrangler.jsonc custom_domain route and PUBLIC_ORIGIN at 0b2869d9b4a8516808bca812394ecc1618949617; docs/sources/onboarding-squirrel-2026-11-26.json
- Category: tools
- Archived repository: No; [repository status evidence](../../docs/sources/onboarding-squirrel-2026-11-26.json)
- English: Personal API key and token vault MCP server on Cloudflare Workers with OAuth 2.1 and Bot Bearer Tokens
- Chinese: 基于 Cloudflare Workers 的个人级 API Key / Token 托管 MCP 服务，支持 OAuth 2.1 与无头 Bot Token
- Profile section: Recent Projects
- Profile revision: `9ba9f30b857ce1b86e3020dd645ae60f0339399c`
- Repository revision inspected: `0b2869d9b4a8516808bca812394ecc1618949617`

## Project goal

Provide a personal API key and token vault on Cloudflare Workers that dispatches low-sensitivity credentials on demand to Gemini, Claude Code, Cursor and CI agents over Streamable HTTP MCP, OAuth 2.1 + PKCE and headless Bot Bearer Tokens with folder/secret ACLs, AES-256-GCM encryption and 90-day audit retention.

部署在 Cloudflare Workers 上的个人级 API Key / Token 托管服务，通过标准 Streamable HTTP MCP、OAuth 2.1 + PKCE 与无头 Bot Bearer Token 向 Gemini、Claude Code、Cursor 及自动化 Agent 按需分发低敏凭证，支持文件夹与单密钥细粒度授权、AES-256-GCM 加密及 90 天审计留存。

- [中文 README](https://github.com/nocoo/squirrel/blob/main/README.md) · [English README](https://github.com/nocoo/squirrel/blob/main/README.md)
- Verified: 2026-11-26; [source revision](https://github.com/nocoo/squirrel/tree/0b2869d9b4a8516808bca812394ecc1618949617)
- Source files: [`README.md`](https://github.com/nocoo/squirrel/blob/0b2869d9b4a8516808bca812394ecc1618949617/README.md), [`package.json`](https://github.com/nocoo/squirrel/blob/0b2869d9b4a8516808bca812394ecc1618949617/package.json), [`wrangler.jsonc`](https://github.com/nocoo/squirrel/blob/0b2869d9b4a8516808bca812394ecc1618949617/wrangler.jsonc), [`AGENTS.md`](https://github.com/nocoo/squirrel/blob/0b2869d9b4a8516808bca812394ecc1618949617/AGENTS.md), [`worker/src/index.ts`](https://github.com/nocoo/squirrel/blob/0b2869d9b4a8516808bca812394ecc1618949617/worker/src/index.ts)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Hono / Cloudflare Workers | Streamable HTTP MCP endpoint, OAuth 2.1 authorization server and CF Access admin API | Streamable HTTP MCP 服务端、OAuth 2.1 授权服务与 Cloudflare Access 管理接口 |
| D1 / KV / AES-256-GCM | Encrypted secret storage with per-secret IV/AAD, OAuth KV state and 90-day audit log pruning | 独立随机 IV 与 AAD 的 AES-256-GCM 密钥加密存储、OAuth KV 状态与 90 天定时审计清理 |
| React 19 / Vite 8 / Basalt | Amber-themed vault console and OAuth scope approval UI | 琥珀色主题密钥托管控制台与 OAuth 作用域授权界面 |

## Current logo

![Squirrel source identity](https://hexly.ai/logos/display/squirrel-family-2026-11-26-160.webp)

- Type: Owner-approved generated raster identity; model unrecorded, source-adopted bytes and native JPEG provenance preserved
- Subject: Fragmented russet-orange squirrel head portrait
- [Source](https://github.com/nocoo/squirrel/blob/0b2869d9b4a8516808bca812394ecc1618949617/logo.png): `logo.png`
- [Preserved asset](https://hexly.ai/logos/display/squirrel-family-2026-11-26-1024.webp)
- Original dimensions: 1024 × 1024
- Original size: 661253 bytes
- SHA-256: `e0b07713d9f3473bd9c27f3656d862cfbc601835cc8698a18e44db0e84287fbb`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#f05423` | Native 15dee7abd4a3b0f9de35d4b688693424566a4c9f60f87f20cfdafba42b30993f, sRGB pixel (180, 820); artwork/logo-family/squirrel/2026-11-26-01/palette.json |
| accent | `#ed8129` | Native 15dee7abd4a3b0f9de35d4b688693424566a4c9f60f87f20cfdafba42b30993f, sRGB pixel (190, 940); artwork/logo-family/squirrel/2026-11-26-01/palette.json |
| accent | `#9d5431` | Native 15dee7abd4a3b0f9de35d4b688693424566a4c9f60f87f20cfdafba42b30993f, sRGB pixel (240, 320); artwork/logo-family/squirrel/2026-11-26-01/palette.json |
| accent | `#fbf3e0` | Native 15dee7abd4a3b0f9de35d4b688693424566a4c9f60f87f20cfdafba42b30993f, sRGB pixel (350, 990); artwork/logo-family/squirrel/2026-11-26-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Current textured icons

![Squirrel current icon](https://h.no.mt/projects/squirrel/icons/v1.0.0/rounded-160.webp)

- [1024 px square WebP](https://h.no.mt/projects/squirrel/icons/v1.0.0/icon-1024.webp) · [1024 px rounded WebP](https://h.no.mt/projects/squirrel/icons/v1.0.0/rounded-1024.webp) · [Favicon ICO](https://h.no.mt/projects/squirrel/icons/v1.0.0/favicon.ico) · [Apple touch](https://h.no.mt/projects/squirrel/icons/v1.0.0/apple-touch-icon.png)
- [Manifest and checksums](https://h.no.mt/projects/squirrel/icons/v1.0.0/manifest.json) · [Usage, resampling and source rights](https://h.no.mt/projects/squirrel/icons/v1.0.0/guide.md)
- Native canvas 1024 × 1024; zero new image generation. Exact approved native square/rounded masters; foreground RGB, background and shadows follow the study recipe without recompositing. Continuous corners are already rendered for site use; use the square master for iOS. Smaller delivery sizes are resampled from the native master.
- Hexly presentation is adopted on this site. Source repositories retain their own recorded adoption state. Original identity archives below remain available.

## Refined identity

![Squirrel refined preview](https://h.no.mt/logos/family/squirrel/2026-11-26-01/02/icon-160.webp)

- Status: Adopted in the source project; updated 2026-11-26.
- Study `2026-11-26-01`, finishing `02`
- Refined subject: Fragmented russet-orange squirrel head portrait
- Site path: `/projects/squirrel#brand`; [local gallery](https://index.dev.hexly.ai/projects/squirrel#brand)
- [Static review HTML](../../artwork/logo-family/squirrel/2026-11-26-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/squirrel/2026-11-26-01)
- [Transparent foreground](https://h.no.mt/logos/family/squirrel/2026-11-26-01/02/transparent-1024.webp); SHA-256: `e0b07713d9f3473bd9c27f3656d862cfbc601835cc8698a18e44db0e84287fbb`
- [Square icon WebP](https://h.no.mt/logos/family/squirrel/2026-11-26-01/02/icon-1024.webp), [rounded icon WebP](https://h.no.mt/logos/family/squirrel/2026-11-26-01/02/rounded-1024.webp), [transparent foreground WebP](https://h.no.mt/logos/family/squirrel/2026-11-26-01/02/transparent-1024.webp)
- [Exact prompt](https://h.no.mt/logos/family/squirrel/2026-11-26-01/02/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/squirrel/2026-11-26-01/02/manifest.json) (raw `raw.jpg` master cold-archived in Google Drive `My Drive/hexly.ai/04-masters-png/`)
- First project identity; no earlier independent Logo existed at intake.
- Generation: gemini-nano-banana-2.1, native 1024 × 1024; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px. Sizes above 1024 px are explicitly recorded upscales; the native master retains its recorded resolution.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#cfd6c4` | artwork/logo-family/squirrel/2026-11-26-01/presentation.json background.base; not a product UI token |
| primary | `#f05423` | Native 15dee7abd4a3b0f9de35d4b688693424566a4c9f60f87f20cfdafba42b30993f, sRGB pixel (180, 820); artwork/logo-family/squirrel/2026-11-26-01/palette.json |
| accent | `#ed8129` | Native 15dee7abd4a3b0f9de35d4b688693424566a4c9f60f87f20cfdafba42b30993f, sRGB pixel (190, 940); artwork/logo-family/squirrel/2026-11-26-01/palette.json |
| accent | `#9d5431` | Native 15dee7abd4a3b0f9de35d4b688693424566a4c9f60f87f20cfdafba42b30993f, sRGB pixel (240, 320); artwork/logo-family/squirrel/2026-11-26-01/palette.json |
| accent | `#fbf3e0` | Native 15dee7abd4a3b0f9de35d4b688693424566a4c9f60f87f20cfdafba42b30993f, sRGB pixel (350, 990); artwork/logo-family/squirrel/2026-11-26-01/palette.json |

### Lower-left edge entry

A tufted-ear squirrel head enters from the bottom-left edge while ears, brow and muzzle clear the upper and right margins.

带耳簇的松鼠头部从左下角入画，双耳、额面与吻部远离上沿与右侧留白。

### Connected flat facets

Connected irregular flat facets carry russet-orange, warm amber, chestnut brown and cream tones without outlines or surface texture.

赤橙、暖琥珀、栗棕与米白不规则相连切面组成主体，无描边与表面肌理。

### Woodland oak canopy

Sparse oak twigs and gentle lobed leaf silhouettes along the right margin with fine grain and two soft contact shadows; transparent UI marks exclude all background layers.

右侧边缘稀疏栎树枝条与浅色叶影搭配细纸纹和两层浅阴影，透明界面标记不含任何背景层。

Small-size observation: At 32 and 16 px the twin tufted ears and pointed cheek silhouette remain legible while small muzzle facets merge.

## Further refinements

Preserve the approved raster, original colors, complete silhouette, and exact generation/finishing records. Supporting textures remain separate. Published versions are immutable; generated raster artwork is not native SVG.

Use head portraits for large animals and optionally full-body poses for small animals. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. Preserve this reviewed composition and its archived predecessors.
