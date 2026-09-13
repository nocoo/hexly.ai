# 🦇 Bat

## Profile

- Repository: [nocoo/bat](https://github.com/nocoo/bat)
- Website: [https://bat.hexly.ai](https://bat.hexly.ai)
- Website evidence: CLAUDE.md Live-check
- Category: tools
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: A lightweight watchtower for your servers, with a Rust probe and a clear dashboard.
- Chinese: 轻量的服务器观察台，用 Rust 探针采集状态，在仪表盘里集中查看。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `46f5c95a6c134487130e2a6d9336ec5e8895a0f7`

## Project goal

Collect Linux host metrics to inspect fleet status, alerts and infrastructure assets.

采集 Linux 主机指标，集中查看主机状态、告警与基础设施资产。

- [中文 README](https://github.com/nocoo/bat/blob/main/README.md) · [English README](https://github.com/nocoo/bat/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/bat/tree/ab6984c18475e4c38723777f09f31e381d3e2f96)
- Source files: [`package.json`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/package.json), [`packages/ui/package.json`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/ui/package.json), [`packages/ui/vite.config.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/ui/vite.config.ts), [`packages/ui/playwright.config.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/ui/playwright.config.ts), [`packages/worker/package.json`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/package.json), [`packages/worker/wrangler.toml`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/wrangler.toml), [`packages/worker/src/index.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/src/index.ts), [`packages/worker/src/middleware/entry-control.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/src/middleware/entry-control.ts), [`packages/worker/src/middleware/access-auth.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/src/middleware/access-auth.ts), [`packages/worker/src/middleware/api-key.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/src/middleware/api-key.ts), [`packages/worker/src/routes/setup.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/src/routes/setup.ts), [`packages/worker/src/routes/cli-auth.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/src/routes/cli-auth.ts), [`packages/worker/src/routes/monitoring.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/src/routes/monitoring.ts), [`packages/worker/src/routes/events-ingest.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/src/routes/events-ingest.ts), [`packages/worker/src/routes/heartbeat.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/src/routes/heartbeat.ts), [`packages/worker/src/adapters/d1/aggregation.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/src/adapters/d1/aggregation.ts), [`packages/worker/src/lib/host-meta-cache.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/src/lib/host-meta-cache.ts), [`packages/worker/src/services/status.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/src/services/status.ts), [`packages/worker/test/e2e/global-setup.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/worker/test/e2e/global-setup.ts), [`packages/shared/src/settings.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/shared/src/settings.ts), [`packages/shared/src/alerts.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/shared/src/alerts.ts), [`packages/cli/package.json`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/cli/package.json), [`packages/cli/src/bin/bat-cli.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/cli/src/bin/bat-cli.ts), [`packages/cli/src/commands/login.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/cli/src/commands/login.ts), [`packages/cli/src/commands/service/run.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/cli/src/commands/service/run.ts), [`packages/cli/src/commands/service/install.ts`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/packages/cli/src/commands/service/install.ts), [`probe/Cargo.toml`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/probe/Cargo.toml), [`probe/src/main.rs`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/probe/src/main.rs), [`probe/src/config.rs`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/probe/src/config.rs), [`probe/dist/bat-probe.service`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/probe/dist/bat-probe.service), [`probe/Dockerfile.build`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/probe/Dockerfile.build), [`scripts/l3-setup.sh`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/scripts/l3-setup.sh), [`scripts/l3-webserver.sh`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/scripts/l3-webserver.sh), [`.github/workflows/ci.yml`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/.github/workflows/ci.yml), [`.github/workflows/release.yml`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/.github/workflows/release.yml), [`LICENSE`](https://github.com/nocoo/bat/blob/ab6984c18475e4c38723777f09f31e381d3e2f96/LICENSE)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Rust | Linux host metric collection | Linux 主机指标采集 |
| Tokio / reqwest | Async collection and HTTPS upload | 异步采集与 HTTPS 上报 |
| TypeScript | Worker, dashboard and CLI logic | Worker、仪表盘与 CLI 逻辑 |
| Bun / Turborepo | Workspace dependencies and builds | 工作区依赖与构建 |
| Hono / Cloudflare Workers | Ingestion, API, scheduled jobs and static assets | 采集接入、API、定时任务与静态资源 |
| Cloudflare D1 | Metrics, alerts, events and assets | 指标、告警、事件与资产数据 |
| Cloudflare KV | Optional caches for frequent queries | 热点查询的可选缓存 |
| Vite / React | Dashboard interface and builds | 仪表盘界面与构建 |
| Recharts | Metric trends | 指标趋势图 |
| Cloudflare Access | Browser authentication | 浏览器认证 |

## Current logo

![Bat source identity](https://h.no.mt/projects/bat/identity/v1.0.0/bat-160-5e4c272e4d54.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Upright plum bat with folded wings and one colorful fig
- [Source](https://github.com/nocoo/bat/blob/46f5c95a6c134487130e2a6d9336ec5e8895a0f7/logo.png): `logo.png`
- [Preserved asset](https://h.no.mt/projects/bat/identity/v1.0.0/bat-family-2026-09-07-01-02-882034b5b3e7.png)
- Original dimensions: 2048 × 2048
- Original size: 2092682 bytes
- SHA-256: `882034b5b3e7511560a999422199cb486c80ee3fc00eb586d6584326fa4f1e1d`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#df497b` | packages/ui/src/index.css --primary: 340 70% 58% |
| background | `#eeeff2` | packages/ui/src/index.css --background: 220 14% 94% |
| accent | `#a589a4` | Native bat 1935dbb8272e, sampled sRGB pixel (1495, 1347); artwork/logo-family/bat/2026-09-07-01/palette.json |
| accent | `#302935` | Native bat 1935dbb8272e, sampled sRGB pixel (981, 1196); artwork/logo-family/bat/2026-09-07-01/palette.json |
| accent | `#d78b8f` | Native bat 1935dbb8272e, sampled sRGB pixel (1226, 1136); artwork/logo-family/bat/2026-09-07-01/palette.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/bat#brand).
- [Light lockup](https://h.no.mt/brands/bat/v1.0.0/lockup-light.png), [dark lockup](https://h.no.mt/brands/bat/v1.0.0/lockup-dark.png), [favicon](https://h.no.mt/brands/bat/v1.0.0/favicon.ico).
- [Complete usage and integration guide](https://h.no.mt/brands/bat/v1.0.0/guide.md), [standalone specimens](https://hexly.ai/brands/bat/v1.0.0/review.html), [all exports and SHA-256](https://h.no.mt/brands/bat/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Upright plum bat with folded wings and one colorful fig.

### Identity keeps its colors

Preserve the exact project identity and the separately recorded Hexly artwork. Hexly paper, ink and terracotta belong to archive and campaign surfaces only; independent product palettes and themes stay their own.

项目原标与单独记录的 Hexly 主视觉均保持形状和原色。Hexly 纸色、墨色和陶土色只用于档案及宣发画布，各产品色板与主题独立保留。

### A complete composition

Preserve the complete subject and its original square margins. Resize uniformly; never trim the canvas to force detail. Keep external clear space of at least 1/8 of the mark canvas height around standalone marks and lockups. Wide and mobile Heroes are separate compositions of existing artwork, with no image-model call.

保留完整主体与原有方形留白，只做等比缩放，不裁图强凑细节。独立标志及字标组合四周，至少留出标志画布高度 1/8 的外部净空。宽幅与手机 Hero 分别排版，没有新图像模型调用。

### A mark, not a tile

Navigation 24px preferred, 16px minimum. Wordmark ≥45px wide; lockup ≥160px. Use transparent PNG/ICO at small sizes without a tile, extra red dot, shadow or rounded mask. Fine facets soften at 16px.

导航推荐 24px，最小 16px。字标宽度至少 45px，组合至少 160px。小尺寸使用透明 PNG/ICO，不加底板、红点、阴影或圆角遮罩；16px 时细小切面会柔化。

## Refined identity

![Bat refined preview](https://h.no.mt/logos/family/bat/2026-09-07-01/02/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-01`, finishing `02`
- Refined subject: Upright plum bat with folded wings and one colorful fig
- Site path: `/projects/bat#brand`; [local gallery](https://index.dev.hexly.ai/projects/bat#brand)
- [Static review HTML](../../artwork/logo-family/bat/2026-09-07-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/bat/2026-09-07-01)
- [Transparent foreground](https://h.no.mt/logos/family/bat/2026-09-07-01/02/transparent.png); SHA-256: `882034b5b3e7511560a999422199cb486c80ee3fc00eb586d6584326fa4f1e1d`
- [Square icon](https://h.no.mt/logos/family/bat/2026-09-07-01/02/icon.png), [rounded icon](https://h.no.mt/logos/family/bat/2026-09-07-01/02/rounded.png), [white version](https://h.no.mt/logos/family/bat/2026-09-07-01/02/white.png)
- [Untouched generation](https://h.no.mt/logos/family/bat/2026-09-07-01/02/raw.png), [exact prompt](https://h.no.mt/logos/family/bat/2026-09-07-01/02/prompt.txt), [public asset checksums](https://h.no.mt/logos/family/bat/2026-09-07-01/02/manifest.json)
- [Previous original](https://h.no.mt/shared/site/v1.0.0/bat-24b80b738e84.png), copied from [its immutable source](https://github.com/nocoo/bat/blob/99e48ef72afeaf178422c17875728128fe06615c/logo.png)
- Previous SHA-256: `24b80b738e8425f05eac0e83a9a78ece9d22c7390fc56a33d50c7fdc0a05ee62`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#9a7e90` | Selected Bat presentation, 2026-09-07-01/02; background.base in archived settings.json |
| primary | `#72556f` | Native bat 1935dbb8272e, sampled sRGB pixel (1315, 1476); artwork/logo-family/bat/2026-09-07-01/palette.json |
| accent | `#a589a4` | Native bat 1935dbb8272e, sampled sRGB pixel (1495, 1347); artwork/logo-family/bat/2026-09-07-01/palette.json |
| accent | `#302935` | Native bat 1935dbb8272e, sampled sRGB pixel (981, 1196); artwork/logo-family/bat/2026-09-07-01/palette.json |
| accent | `#d78b8f` | Native bat 1935dbb8272e, sampled sRGB pixel (1226, 1136); artwork/logo-family/bat/2026-09-07-01/palette.json |
| accent | `#639ea2` | Native bat 1935dbb8272e, sampled sRGB pixel (1453, 1172); artwork/logo-family/bat/2026-09-07-01/palette.json |

### A pause before a bite

A friendly upright bat holds its wings close and pauses beside a fig. Complete ears and feet stay inside the frame; a small wing thumb supports the fruit.

温和的小蝙蝠正向站立、收拢翅膀，在无花果旁停顿。双耳和脚趾完整留在画面内，小翼拇指托住果实。

### Plum without menace

Broad mauve and charcoal planes describe the face, body and folded membranes. The bright fig forms one color group; its stem extends into nearby empty space.

宽阔灰紫与炭灰色面描绘脸部、身体和收拢的翼膜。鲜艳果实构成单一色彩组，果梗伸入旁边的留白。

### Dusk scallops

Unequal shallow scallops cross a deeper mauve field. Fine grain and offset folds give the wings separation while keeping the expression calm.

深灰紫底色上横穿不等宽的浅弧褶。细颗粒与错位折面分离翅膀轮廓，让表情保持平静。

Small-size observation: The complete animal and accessory have at least 145.5 px clearance from the actual rounded outline. Ten export sizes preserve one uniform placement. Small app/browser marks use the transparent foreground; fine facets and accessory details simplify at 16 px.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
