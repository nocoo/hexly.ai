# 🚪 Hermes Gateway for Herdr

## Profile

- Repository: [nocoo/hermes-gateway-herdr](https://github.com/nocoo/hermes-gateway-herdr)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: tools
- Archived repository: No; [repository status evidence](../../docs/sources/hermes-gateway-herdr-2026-09-11.json)
- English: Dedicated Hermes Gateway supervision inside a real Herdr pane
- Chinese: 在真实 Herdr pane 内监督专用 Hermes Gateway，离线核心已实现
- Profile section: Recent Projects
- Profile revision: `4a0c394a79c8f4d24a11f8d9907d5c797e6b7718`
- Repository revision inspected: `f14ddf11bf4ac4912830f0a7259fdd8a769e5a41`

## Project goal

Keep one dedicated Hermes Gateway under explicit supervision inside its owning Herdr pane. The offline core implements lifecycle control, identity checks, duplicate prevention and JSON diagnostics; real Herdr/Hermes integration remains unverified.

让一个专用 Hermes Gateway 在所属 Herdr pane 内接受明确监督。离线核心已实现生命周期控制、身份核验、实例去重与 JSON 诊断，真实 Herdr/Hermes 集成仍待验证。

- [中文 README](https://github.com/nocoo/hermes-gateway-herdr/blob/main/README.md) · [English README](https://github.com/nocoo/hermes-gateway-herdr/blob/main/docs/README.en.md)
- Verified: 2026-09-11; [source revision](https://github.com/nocoo/hermes-gateway-herdr/tree/1cc8ac27ea9aecb6263d99a9cd26ae859168200a)
- Source files: [`README.md`](https://github.com/nocoo/hermes-gateway-herdr/blob/1cc8ac27ea9aecb6263d99a9cd26ae859168200a/README.md), [`docs/README.en.md`](https://github.com/nocoo/hermes-gateway-herdr/blob/1cc8ac27ea9aecb6263d99a9cd26ae859168200a/docs/README.en.md), [`requirements.txt`](https://github.com/nocoo/hermes-gateway-herdr/blob/1cc8ac27ea9aecb6263d99a9cd26ae859168200a/requirements.txt), [`herdr-plugin.toml`](https://github.com/nocoo/hermes-gateway-herdr/blob/1cc8ac27ea9aecb6263d99a9cd26ae859168200a/herdr-plugin.toml), [`src/hermes_gateway_herdr/config.py`](https://github.com/nocoo/hermes-gateway-herdr/blob/1cc8ac27ea9aecb6263d99a9cd26ae859168200a/src/hermes_gateway_herdr/config.py), [`src/hermes_gateway_herdr/cli.py`](https://github.com/nocoo/hermes-gateway-herdr/blob/1cc8ac27ea9aecb6263d99a9cd26ae859168200a/src/hermes_gateway_herdr/cli.py), [`src/hermes_gateway_herdr/controller.py`](https://github.com/nocoo/hermes-gateway-herdr/blob/1cc8ac27ea9aecb6263d99a9cd26ae859168200a/src/hermes_gateway_herdr/controller.py), [`src/hermes_gateway_herdr/supervisor.py`](https://github.com/nocoo/hermes-gateway-herdr/blob/1cc8ac27ea9aecb6263d99a9cd26ae859168200a/src/hermes_gateway_herdr/supervisor.py), [`src/hermes_gateway_herdr/rpc.py`](https://github.com/nocoo/hermes-gateway-herdr/blob/1cc8ac27ea9aecb6263d99a9cd26ae859168200a/src/hermes_gateway_herdr/rpc.py), [`tests/run.py`](https://github.com/nocoo/hermes-gateway-herdr/blob/1cc8ac27ea9aecb6263d99a9cd26ae859168200a/tests/run.py), [`examples/README.md`](https://github.com/nocoo/hermes-gateway-herdr/blob/1cc8ac27ea9aecb6263d99a9cd26ae859168200a/examples/README.md), [`docs/12-离线实现与验证.md`](https://github.com/nocoo/hermes-gateway-herdr/blob/1cc8ac27ea9aecb6263d99a9cd26ae859168200a/docs/12-离线实现与验证.md)

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Python | Controller, pane supervisor and CLI | Controller、pane supervisor 与命令行 |
| Unix sockets / JSONL | Bounded Herdr and Hermes control exchanges | 有时限的 Herdr 与 Hermes 控制通信 |
| flock / atomic JSON | Singleton locks, persistent intent and request deduplication | 单例锁、持久意图与请求去重 |
| psutil / PyYAML | Process identity and Profile configuration checks | 进程身份与专用 Profile 配置预检 |
| Herdr plugin TOML | Development hooks, actions and pane registration | 开发用 hooks、actions 与 pane 注册 |
| unittest | Isolated fake-process and RPC tests | 隔离的假进程与 RPC 测试 |

## Current logo

![Hermes Gateway for Herdr source identity](../../public/logos/display/hermes-gateway-herdr-160.webp)

- Type: Original project artwork, copied without modification
- Subject: Brushed-brass gateway with an ajar petrol enamel door, ivory terminal inlay and green status lens
- [Source](https://github.com/nocoo/hermes-gateway-herdr/blob/f14ddf11bf4ac4912830f0a7259fdd8a769e5a41/logo.png): `logo.png`
- [Preserved asset](../../public/logos/originals/hermes-gateway-herdr-family-2026-09-11-01-01.png)
- Original dimensions: 2048 × 2048
- Original size: 4337945 bytes
- SHA-256: `ba0a4a0a403d4775ce917290dc528884b0ac6666068ed0148f655777f815d719`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#dfe8ec` | Locally adopted hermes-gateway-herdr presentation 2026-09-11-01/01; background.base in archived settings.json |
| primary | `#2c3f52` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1050, 800); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#b08c5e` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1120, 305); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#e9dcc2` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1100, 1230); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#05560b` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1570, 400); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#7899a9` | Designed independent background motif, 30% opacity; artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/finishing/01/settings.json |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Refined identity

![Hermes Gateway for Herdr refined preview](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/icon-160.webp)

- Status: Adopted in the source project; updated 2026-09-11.
- Study `2026-09-11-01`, finishing `01`
- Refined subject: Brushed-brass gateway with an ajar petrol enamel door, ivory terminal inlay and green status lens
- Site path: `/logos/hermes-gateway-herdr`; [local gallery](https://index.dev.hexly.ai/logos/hermes-gateway-herdr)
- [Static review HTML](../../artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/review.html)
- [Full process archive](https://github.com/nocoo/hexly.ai/tree/main/artwork/logo-family/hermes-gateway-herdr/2026-09-11-01)
- [Transparent foreground](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/transparent.png); SHA-256: `ba0a4a0a403d4775ce917290dc528884b0ac6666068ed0148f655777f815d719`
- [Square icon](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/icon.png), [rounded icon](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/rounded.png), [white version](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/white.png)
- [Untouched generation](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/raw.png), [exact prompt](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/prompt.txt), [public asset checksums](../../public/logos/family/hermes-gateway-herdr/2026-09-11-01/01/manifest.json)
- [Previous original](../../public/logos/emoji/hermes-gateway-herdr.png), copied from [its immutable source](https://github.com/nocoo/nocoo/blob/4a0c394a79c8f4d24a11f8d9907d5c797e6b7718/README.md)
- Previous SHA-256: `df84f29fc92535512e00cef39272d782a7b9a7f588f104fb85d5383720e6e3a5`
- Generation: gpt-image-2, native 2048 × 2048; transparent extraction and presentation are separate finishing steps.
- The finishing archive includes transparent, square, and rounded PNGs at 2048, 1024, 512, 256, 128, 64, 48, 32, 24, and 16 px.
- Application previews use the refined square icon without extra padding, backgrounds, or circular masks. Artwork previews and downloads use its own transparent foreground, independently of the preserved source logo above.

### Refined palette

| Role | Value | Evidence |
| --- | --- | --- |
| background | `#dfe8ec` | Locally adopted hermes-gateway-herdr presentation 2026-09-11-01/01; background.base in archived settings.json |
| primary | `#2c3f52` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1050, 800); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#b08c5e` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1120, 305); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#e9dcc2` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1100, 1230); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#05560b` | Native hermes-gateway-herdr output SHA-256 7991518e28d32082f552ae15d98be7279361257d60c1aaef0fd1e4668e3e20f9; opaque sRGB pixel (1570, 400); artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/palette.json |
| accent | `#7899a9` | Designed independent background motif, 30% opacity; artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/finishing/01/settings.json |

### A door held open

The substantial frame and slightly open door read as one compact gateway. Both hinges, the status lens and complete feet remain visible, with 205.5 px clearance from the rounded outline.

厚实门框与微开的门扉形成紧凑整体。两枚铰链、状态灯和完整支脚均保留，距圆角边界最近为 205.5 px。

### Brass, enamel and a prompt

Brushed brass surrounds petrol-blue enamel with an opaque ivory terminal inlay. The green lens keeps its contained glass highlight; the real opening is transparent and every opaque extracted native pixel retains its RGB.

拉丝黄铜包围深蓝珐琅门面，象牙色终端嵌字保持不透明。绿色镜片保留内部玻璃高光，真实门洞透明，提取后所有不透明原生像素的 RGB 均不变。

### Paired panes and a return route

Unequal pane outlines and one returning route form a shallow relief on pale blue-gray paper. Paper, grain and projected shadow are independent layers; these designed colors do not imply an existing website theme.

大小不同的窗格与一条回程线路在浅蓝灰纸面形成浅浮纹。纸底、颗粒与投影各自独立，这套设计配色不代表已有的网站主题。

Small-size observation: At 128/64 px, the brass frame, enamel door and terminal prompt remain readable. At 32/24/16 px, the door silhouette and brass-blue contrast carry recognition; hinges, lens and inlay detail merge. Sidebar and browser specimens demonstrate scale; the source currently supplies a CLI and development manifest.

## Further refinements

This is an owner-directed physical material or architectural identity. Preserve its physical materials, complete silhouette, selected camera and distinct tonal presentation. The animal-series drawing and accessory rules do not apply.

Keep the complete object uniformly inset from the actual rounded outline, with backgrounds, projected shadows and any external emission separate from the transparent foreground. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. Preserve this reviewed composition and its archived predecessors.
