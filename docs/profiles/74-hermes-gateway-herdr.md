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
- Repository revision inspected: `3cdecbf420e51232fe6e4ac790a8f51d42fe6e71`

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

- Type: Existing GitHub-profile emoji rendered as a portable PNG; no independent project logo was found
- Subject: Editorial door emoji from the new GitHub profile entry; no independent source logo at intake
- [Source](https://github.com/nocoo/nocoo/blob/4a0c394a79c8f4d24a11f8d9907d5c797e6b7718/README.md): `nocoo/nocoo README.md — new editorial project emoji`
- [Preserved asset](../../public/logos/emoji/hermes-gateway-herdr.png)
- Original dimensions: 1024 × 1024
- Original size: 218458 bytes
- SHA-256: `df84f29fc92535512e00cef39272d782a7b9a7f588f104fb85d5383720e6e3a5`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#855032` | Native Apple Color Emoji door rendered by artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/render-previous.swift; editorial profile identity, not a website theme; sRGB pixel (512, 512) |
| background | `transparent` | Native Apple Color Emoji door rendered by artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/render-previous.swift; editorial profile identity, not a website theme; transparent canvas |
| accent | `#9c5e3b` | Native Apple Color Emoji door rendered by artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/render-previous.swift; editorial profile identity, not a website theme; sRGB pixel (365, 500) |
| accent | `#643a23` | Native Apple Color Emoji door rendered by artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/render-previous.swift; editorial profile identity, not a website theme; sRGB pixel (674, 540) |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Future family notes

Keep the current source mark and its provenance. For a future study, choose a recognizable physical object from the tool's actual function and follow the owner's material and composition direction. An animal or fragmented drawing is not required.

Keep the complete object uniformly inset from the actual rounded outline, with backgrounds, projected shadows and any external emission separate from the transparent foreground. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. This entry uses the preserved local application artwork; any new study follows its own recorded review decision.
