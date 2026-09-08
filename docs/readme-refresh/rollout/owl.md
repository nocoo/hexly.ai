# Owl 调查与 README 草稿

## 基线与范围

- 仓库：`/Users/nocoo/workspace/personal/owl`
- clean main、无 ahead；调查前 `git pull --ff-only` 成功，基线 `e1c69addb656e8907a8828001e1f5c103f3b9fbf`。
- 阅读现有 README、CLAUDE、Package.swift、应用启动/指标/检测/设置/UI、架构与分发设计、构建和 hooks 脚本。目标是更新中文根 README、完整英文版与本站候选资料，保留既有品牌图片。

## 代码核实与旧资料差异

| 原资料或容易误读的内容 | 当前代码 | 证据 |
| --- | --- | --- |
| 只有 14 个日志模式 | 14 类日志模式（Jetsam 由双检测器实现），另有持续 CPU、系统热状态、内存压力、swap 与磁盘占用的 5 类指标检测 | `PatternCatalog.swift`、`MetricsCatalog.swift`、`DetectorPipeline.swift` |
| UI 使用 MenuBarExtra、全部纯 Swift | 实际入口为 AppKit NSStatusItem + NSPopover，内容是 SwiftUI；Apple Silicon 温度包含 Objective-C HID 桥接 | `Sources/Owl/OwlApp.swift`、`Package.swift`、`Sources/HIDThermalBridge` |
| 固定 ~12 MB / 485 tests / swift-tools 5.9 | 没有对应当前测量；manifest 使用 tools 6.0、macOS 14（targets 保留 Swift 5 mode）。不在 README 写固定性能或测试数 | `Package.swift`、当前测试结果 |
| 系统数据只有 CPU、内存 | 已有多核心、负载、磁盘、网络、电池、SMC/HID 温度与进程统计 | `SystemMetricsPoller.swift`、`UI/PopoverContentView.swift`、`UI/ProcessTab.swift` |
| 一直采样全部指标 | foreground 2s 完整采样，background 10s 保留 CPU/内存/交换/磁盘等检测需要数据；开关面板切换 profile | `OwlEngine.swift`、`SystemMetricsPoller.swift` |
| 近期告警暗示持久历史 | AlertStateManager 中的内存数组，默认最多 50 条历史；仅 UserDefaults 偏好持久化 | `Pipeline/AlertStateManager.swift`、`Settings/AppSettings.swift` |
| SPM 可执行文件具有通知能力 | 无 bundle identifier 时主动跳过 UserNotifications；bundle + 系统授权 + 设置启用才尝试通知 | `OwlNotifications.swift`、`OwlAppExtensions.swift` |
| build.sh 默认 unsigned / 文档中的 Xcode archive 可直接用 | 脚本会默认选 Apple Development 进行 codesign；仓库实际是 SPM，无文档所假定 Xcode 项目 | `scripts/build.sh`、`docs/06-distribution.md` |

文稿保留真实价值（本地系统观察、事件模式聚合、指标和进程检查），明确日志/传感器可见性及内存历史边界。旧分发文档含历史 Xcode 示例，README 直接链接当前打包、公证脚本，未将旧设计当成执行步骤。未扩写功能承诺。

## 站点与安装

GitHub repo homepage 为空，本站原项目 website 为 null，不添加本地/推测站点。GitHub 最新 release 为 v1.8.0，真实资产 `Owl-v1.8.0.dmg`（通过 release API 确认），README 让读者使用发布页对应的 DMG，不暗示该发布包已包含 main 的最新改动。源码说明 macOS 14+、Swift 6 工具链；构建 app 时自行提供有效签名身份。

## 验证

- 用进程级完整 Xcode 运行 `swift test`：662 tests / 56 suites 通过，exit 0。日志 `/tmp/readme-owl-tests.log`。
- 包含 `EndToEnd` 检测管道测试，但输入是构造日志，并非真实桌面自动化；部分硬件/系统提供器会读取当前 Mac。
- 双语可执行示例一致，所有本地引用存在，`git diff --check` 通过。
- 未安装/启动 Owl app、未修改用户通知或登录设置、未签名或公证。
- 版本、业务代码、测试与现有维护说明不变。

## 下一步

双语草稿和候选 `owl.json` 已 ready_for_review。主代理 review 后安装/确认现有 hooks，正常提交；push 前再 pull，检查只有本任务提交，再 push main 并回读两份 README 与 CI。

## 发布回执（2026-09-08）

README 提交 `cceca53d490ef08dcbb4b15a9f4004220d1cbc76` 已按正常 hooks 发布到 main。发布前再次 pull 成功，核对仅本任务提交 ahead。远端 GitHub API 回读中英文 README 与本地一致。CI：<https://github.com/nocoo/owl/actions/runs/34224243868>，completed / success。
