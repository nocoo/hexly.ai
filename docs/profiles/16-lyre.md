# 🎶 Lyre

## Profile

- Repository: [nocoo/lyre](https://github.com/nocoo/lyre)
- Website: [https://lyre.hexly.ai](https://lyre.hexly.ai)
- Website evidence: GitHub repository homepage
- Category: everyday
- Archived repository: No; [repository status evidence](../sources/repository-status-2026-09-06.json)
- English: Recordings, transcripts, and word-by-word playback, beautifully in sync.
- Chinese: 整理录音和转写文本，让逐字高亮跟着声音一起播放。
- Profile section: Recent Projects
- Profile revision: `9a7ad63e1e96428f9dcd12214bcdbd470b3b51c6`
- Repository revision inspected: `78b3a126f27a5adc53e4eaf4097b785ac7cb609e`

## Project goal

Manage recordings, transcribe speech and follow the text during audio playback.

管理录音、转写文字，并在回听时查看对应内容。

- [中文 README](https://github.com/nocoo/lyre/blob/main/README.md) · [English README](https://github.com/nocoo/lyre/blob/main/docs/README.en.md)
- Verified: 2026-09-08; [source revision](https://github.com/nocoo/lyre/tree/78b3a126f27a5adc53e4eaf4097b785ac7cb609e)
- Source files: [`package.json`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/package.json), [`bun.lock`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/bun.lock), [`apps/web/package.json`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/web/package.json), [`apps/web/vite.config.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/web/vite.config.ts), [`apps/web/src/components/upload-dialog.tsx`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/web/src/components/upload-dialog.tsx), [`apps/web/src/pages/recordings-list.tsx`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/web/src/pages/recordings-list.tsx), [`apps/web/src/pages/recording-detail.tsx`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/web/src/pages/recording-detail.tsx), [`apps/web/src/pages/settings.tsx`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/web/src/pages/settings.tsx), [`apps/api/package.json`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/api/package.json), [`apps/api/wrangler.toml`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/api/wrangler.toml), [`apps/api/src/index.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/api/src/index.ts), [`apps/api/src/lib/env.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/api/src/lib/env.ts), [`apps/api/src/middleware/access-auth.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/api/src/middleware/access-auth.ts), [`apps/api/src/middleware/bearer-auth.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/api/src/middleware/bearer-auth.ts), [`apps/api/src/routes/recordings.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/api/src/routes/recordings.ts), [`apps/api/src/routes/backy.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/api/src/routes/backy.ts), [`packages/api/package.json`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/package.json), [`packages/api/src/handlers/upload.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/src/handlers/upload.ts), [`packages/api/src/handlers/recordings.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/src/handlers/recordings.ts), [`packages/api/src/handlers/jobs.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/src/handlers/jobs.ts), [`packages/api/src/handlers/settings-oss.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/src/handlers/settings-oss.ts), [`packages/api/src/handlers/settings-asr.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/src/handlers/settings-asr.ts), [`packages/api/src/handlers/settings-tokens.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/src/handlers/settings-tokens.ts), [`packages/api/src/handlers/settings-backup.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/src/handlers/settings-backup.ts), [`packages/api/src/services/asr-provider.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/src/services/asr-provider.ts), [`packages/api/src/services/asr.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/src/services/asr.ts), [`packages/api/src/services/job-processor.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/src/services/job-processor.ts), [`packages/api/src/services/ai.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/src/services/ai.ts), [`packages/api/src/services/backup.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/src/services/backup.ts), [`packages/api/migrations/README.md`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/packages/api/migrations/README.md), [`apps/macos/project.yml`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/macos/project.yml), [`apps/macos/Lyre/LyreApp.swift`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/macos/Lyre/LyreApp.swift), [`apps/macos/Lyre/Audio/RecordingManager.swift`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/macos/Lyre/Audio/RecordingManager.swift), [`apps/macos/Lyre/Audio/AudioEncoder.swift`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/macos/Lyre/Audio/AudioEncoder.swift), [`apps/macos/Lyre/Network/UploadManager.swift`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/macos/Lyre/Network/UploadManager.swift), [`apps/macos/Lyre/Config/AppConfig.swift`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/macos/Lyre/Config/AppConfig.swift), [`apps/macos/Lyre/Meeting/MeetingDetectionSettings.swift`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/macos/Lyre/Meeting/MeetingDetectionSettings.swift), [`apps/macos/LyreTests/RecordingE2ETests.swift`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/apps/macos/LyreTests/RecordingE2ETests.swift), [`scripts/build-dmg.sh`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/scripts/build-dmg.sh), [`scripts/run-e2e.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/scripts/run-e2e.ts), [`scripts/pre-push.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/scripts/pre-push.ts), [`e2e/schema.sql`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/e2e/schema.sql), [`e2e/api/asr-multitrack.test.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/e2e/api/asr-multitrack.test.ts), [`playwright.config.ts`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/playwright.config.ts), [`.github/workflows/ci.yml`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/.github/workflows/ci.yml), [`.github/workflows/release.yml`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/.github/workflows/release.yml), [`LICENSE`](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/LICENSE)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| TypeScript / Bun | Web and API logic, workspaces and development scripts | Web 与 API 逻辑、工作区与开发脚本 |
| Vite / React / Basalt | Recording management, playback and transcript interface | 录音管理、播放与转写界面 |
| Hono / Cloudflare Workers | API, static assets and scheduled job polling | API、静态资源与定时任务轮询 |
| Cloudflare D1 / Drizzle ORM | Recording metadata, transcripts, jobs and settings | 录音资料、转写文字、任务与设置 |
| Aliyun OSS | Audio files and raw transcription results | 音频文件与原始转写结果 |
| Aliyun DashScope | Asynchronous speech transcription | 异步语音转写 |
| Vercel AI SDK / @nocoo/next-ai | Configurable model providers for summaries | 可配置模型供应商的摘要生成 |
| Swift / SwiftUI | Native macOS menu bar application | 原生 macOS 菜单栏应用 |
| ScreenCaptureKit / AVFoundation | System and microphone audio capture and encoding | 系统与麦克风声音采集、编码 |
| Cloudflare Access / jose | Browser identity verification | 浏览器身份校验 |

## Current logo

![Lyre source identity](../../public/logos/display/lyre-160.webp)

- Type: Original vector identity commissioned and designed in hexly.ai; the source SVG is preserved byte-for-byte
- Subject: Lyrebird portrait
- [Source](https://github.com/nocoo/lyre/blob/78b3a126f27a5adc53e4eaf4097b785ac7cb609e/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/lyre.png)
- Original dimensions: 2048 × 2048
- Original size: 3656299 bytes
- SHA-256: `1ba1c248228610d3e88e3428359391702f638cb44f1b42045c6a16861c2e581a`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#883720` | apps/web/src/styles.css --basalt-primary: 13 62% 33% |
| background | `#eeeff2` | @nocoo/basalt/styles tokens --basalt-background: 220 14% 94% |
| accent | `#5d2f24` | Preserved project artwork, sampled pixel |
| accent | `#a45d3b` | Preserved project artwork, sampled pixel |
| accent | `#dfc39e` | Preserved project artwork, sampled pixel |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Hexly campaign brand archive

- Brand version: `1.0.0`; [public archive](https://hexly.ai/projects/lyre#brand).
- [Light lockup](../../public/brands/lyre/v1.0.0/lockup-light.png), [dark lockup](../../public/brands/lyre/v1.0.0/lockup-dark.png), [favicon](../../public/brands/lyre/v1.0.0/favicon.ico).
- [Complete usage and integration guide](../../public/brands/lyre/v1.0.0/guide.md), [standalone specimens](../../public/brands/lyre/v1.0.0/review.html), [all exports and SHA-256](../../public/brands/lyre/v1.0.0/manifest.json).
- Source adoption: separate source-team handoff; no adoption commit is claimed.
- Official project identity and Hexly campaign interpretation are separate manifest roles. Existing artwork keeps its exact bytes, geometry and original colors. Heroes are authored wide/mobile compositions, with no new image-model calls. Hexly palettes and typography apply only to this archive and promotional materials, not product UI. Preserved imagery retains its recorded source rights; MIT covers authored support work and OFL covers the real font. See provenance.json and license.txt.


Chestnut faceted lyrebird with a curled feather crest.

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

![Lyre refined preview](../../public/logos/family/lyre/2026-09-07-03/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-07.
- Study `2026-09-07-03`, finishing `01`
- Refined subject: Original chestnut faceted lyrebird with a curled feather crest
- Site path: `/projects/lyre#brand`; [local gallery](https://index.dev.hexly.ai/projects/lyre#brand)
- [Static review HTML](../../artwork/logo-family/lyre/2026-09-07-03/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/lyre/2026-09-07-03)
- [Transparent foreground](../../public/logos/family/lyre/2026-09-07-03/01/transparent.png); SHA-256: `1ba1c248228610d3e88e3428359391702f638cb44f1b42045c6a16861c2e581a`
- [Square icon](../../public/logos/family/lyre/2026-09-07-03/01/icon.png), [rounded icon](../../public/logos/family/lyre/2026-09-07-03/01/rounded.png), [white version](../../public/logos/family/lyre/2026-09-07-03/01/white.png)
- [Untouched original](../../public/logos/family/lyre/2026-09-07-03/01/source.png), [presentation brief](../../public/logos/family/lyre/2026-09-07-03/01/brief.txt), [public asset checksums](../../public/logos/family/lyre/2026-09-07-03/01/manifest.json)
- [Previous original](../../public/logos/originals/lyre.png), copied from [its immutable source](https://github.com/nocoo/lyre/blob/c2c5cf883fef4cf775c98eba6dce883c56653fe7/logo.png)
- Previous SHA-256: `1ba1c248228610d3e88e3428359391702f638cb44f1b42045c6a16861c2e581a`
- Original artwork retained byte-for-byte at native 2048 × 2048. Zero image-generation calls; only background, grain, and shadow layers were composed.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#a16850` | Selected Lyre presentation, finishing 01; background.base in archived settings.json |
| primary | `#a35d3b` | Original lyre 1ba1c2482286, sampled sRGB pixel (1408, 138); palette.json |
| accent | `#d7884d` | Original lyre 1ba1c2482286, sampled sRGB pixel (1161, 1515); palette.json |
| accent | `#dfc39e` | Original lyre 1ba1c2482286, sampled sRGB pixel (1225, 1199); palette.json |
| accent | `#5d2e24` | Original lyre 1ba1c2482286, sampled sRGB pixel (1414, 223); palette.json |
| accent | `#f2a965` | Original lyre 1ba1c2482286, sampled sRGB pixel (877, 548); palette.json |

### The original attentive turn

The portrait, beak, eye, curled crest, and native spacing remain the original artwork. This pass preserves the existing neck silhouette and adds no extension.

头像、鸟喙、眼神、卷曲羽冠与原有留白均沿用原图，保留现有颈部轮廓，没有补画或拉伸。

### Chestnut, cream, and copper

The existing warm facets and expressive feather crest carry the identity. Every original pixel is retained; no new rainbow accessory or model output is introduced.

暖色碎片与灵动的羽冠继续承担识别特征。所有原始像素均保留，不新增彩虹配饰，也不重新生图。

### A pressed feather fan

Unequal feather ribs open around a chestnut paper field. Small raised edges, fine grain, and a shallow shadow separate the bird from its warm setting.

疏密不一的扇羽纹围绕栗棕纸面展开，细亮边、微颗粒与浅阴影将鸟的轮廓从暖色底面中托出。

Small-size observation: The eye, beak, and warm silhouette remain legible at sidebar size. Individual crest facets simplify at 16 px; use the transparent original for browser and menu bar marks.

## Further refinements

Preserve the original vector geometry, real Hexly tokens, outlined font and single-point hierarchy. Versioned published exports are immutable; revise into a new brand version. This commissioned scalable identity is separate from the faceted image-study workflow.

Use the supplied transparent marks in app navigation and browser tabs, keeping presentation tiles separate. Preserve clear space and minimum sizes from the guide. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. The source team integrates the exact published files and records its own adoption revision.
