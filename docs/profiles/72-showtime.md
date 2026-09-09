# 🎬 Showtime

## Profile

- Repository: [nocoo/showtime](https://github.com/nocoo/showtime)
- Website: No current website verified; navigation opens the repository.
- Website evidence: Not applicable
- Category: tools
- Archived repository: No; [repository status evidence](../../docs/sources/showtime-2026-09-10.json)
- English: Native macOS browser for agent-directed product demo recordings
- Chinese: 原生 macOS 演示浏览器，由 Agent 编排网页交互并录制产品演示
- Profile section: Recent Projects
- Profile revision: `73203ef18b98ccf7cf03be7ef0ebf327bb8a743d`
- Repository revision inspected: Initial source commit pending; see the local snapshot above

## Project goal

Turn scripted interactions with real webpages into product demo movies on macOS. Agents can direct pointer movement, clicks, typing, camera zoom and animated captions through JSON scripts, a CLI or MCP; the native browser exports MP4 without an audio track.

把真实网页上的脚本化交互制作成 macOS 产品演示视频。Agent 可通过 JSON 剧本、CLI 或 MCP 编排鼠标移动、点击、输入、镜头缩放和动态字幕，原生浏览器将演示导出为不含音轨的 MP4。

- Verified: 2026-09-10; [preserved local source snapshot](../../docs/sources/showtime-2026-09-10.json)
- Snapshot SHA-256: `df845adc492a9f79c1a4df4089f060986991704e6ecad5684b2a2d9b1e751949`
- Source files: `README.md`, `Package.swift`, `Sources/Showtime/App/StudioView.swift`, `Sources/Showtime/App/StudioModel.swift`, `Sources/Showtime/Browser/BrowserEngine.swift`, `Sources/Showtime/Director/Director.swift`, `Sources/Showtime/Recording/MovieRecorder.swift`, `Sources/ShowtimeCore/Script.swift`, `scripts/showtime_cli.py`, `scripts/showtime_mcp.py`, `scripts/make_icon.swift`
- The source repository has no inspected commit yet. README publication and immutable repository links are deferred.

### Tech stack

| Technology | Role | 用途 |
| --- | --- | --- |
| Swift | Native application and typed script execution | 原生应用与类型化脚本执行 |
| SwiftUI / AppKit | macOS studio, inspector and window integration | macOS 演播室、检查器与窗口集成 |
| WebKit | Real webpages and browser interaction | 真实网页渲染与浏览器交互 |
| AVFoundation | Frame composition and MP4 export | 画面合成与 MP4 导出 |
| Python | Command-line client and MCP server | 命令行客户端与 MCP 服务器 |
| JSON / MCP | Declarative choreography and agent tools | 声明式演示编排与 Agent 工具 |

## Current logo

![Showtime source identity](../../public/logos/display/showtime-160.webp)

- Type: Original project artwork, copied without modification
- Subject: Initial purple browser window with a play symbol; green physical clapperboard study pending raw-image selection
- [Source](../../public/logos/originals/showtime-initial.png): `.build/Showtime.iconset/icon_512x512@2x.png`
- [Preserved asset](../../public/logos/originals/showtime-initial.png)
- Original dimensions: 1024 × 1024
- Original size: 528759 bytes
- SHA-256: `8fe319552849e04934273d30a10b9bc1fc68ae94bb08182b5d372511e12feef9`
- Locally modified source: No
- Display derivatives: 32, 64, 160, and 1024 px WebP; contain-fit, transparent padding, no recoloring or cropping.

## Current palette

| Role | Value | Evidence |
| --- | --- | --- |
| primary | `#4a8234` | Sources/Showtime/App/StudioView.swift: Theme.accentHex = #4A8234; docs/sources/showtime-2026-09-10.json |
| background | `#f6f8f4` | Sources/Showtime/App/StudioView.swift: Theme.surface, sRGB (246, 248, 244) |
| accent | `#cfe8b5` | Sources/Showtime/App/StudioView.swift: Theme.sprout, sRGB (207, 232, 181) |

Theme tokens take precedence. Additional colors are sampled from the preserved artwork. A transparent background means the source does not define an opaque background; the gallery's surrounding paper is not part of the project palette.

## Future family notes

Keep the current source mark and its provenance. For a future study, choose a recognizable physical object from the tool's actual function and follow the owner's material and composition direction. An animal or fragmented drawing is not required.

Keep the complete object uniformly inset from the actual rounded outline, with backgrounds, projected shadows and any external emission separate from the transparent foreground. Compare artwork, app icon, sidebar, and favicon sizes in both themes before adopting a replacement. This entry uses the preserved local application artwork; any new study follows its own recorded review decision.
