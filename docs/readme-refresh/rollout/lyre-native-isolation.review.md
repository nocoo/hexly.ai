# Lyre 原生隔离方案的主代理复核

2026-09-08。已复核[只读诊断与逐文件方案](lyre-native-isolation.md)、当前宿主 / 纯测试源码与 Xcode 手册证据。批准 Native 工作线在独立 Lyre 副本实现本节所述最小修复；这是实施批准，尚不是发布或真实录音授权。

## 实施边界

- 采用创建 `LyreApp` 之前的空 SwiftUI 测试宿主。测试分支和 sentinel 限于 Debug；Release 继续走原应用入口。原 AppConfig、目录默认值、Teams 检测、权限与 UI 行为保持原有语义。
- 共享 scheme 的 TestAction 使用明确测试宿主标志，RunAction 不带此标志；runner 使用 Xcode 官方 `TEST_RUNNER_` 传播方式。普通入口无条件覆盖继承的两个 live 开关为 0，不能由父进程环境意外开启录音。
- `project.yml` 与生成的受控 Xcode 工程同步；保留现有完整 targets、测试集合、Debug / 签名参数、版本和 entitlements。
- 共用 `test:macos` runner 替代两处重复原生命令，保留 SwiftLint、TS / API / 浏览器和安全检查及失败传播。临时目录只使用本次创建的资源；结果 bundle 应能供 root 回读，失败时不得先清除诊断。
- 只有三个真实录音用例增加明确 opt-in。空值、0、true 等均不启用；显式 live 入口还须主动传入录音确认变量。opt-in 之前不能探测权限或构造 live recorder；启用后的权限 / 显示器前提失败必须报告失败，保留全部录音结果断言与等待完成的清理。
- 若 shared scheme 的 live 默认值会覆盖 runner 传入值，需通过生成的 xctestrun / 无录音 sentinel 核实优先级，再采用可证实的明确配置；不能把未验证的 live 命令写成已支持。
- 纯测试全部保留，包括合成音频编码、播放器、设备枚举与 watcher 生命周期。实际 AppConfig 的 Music 默认路径与独立 RecordingManager 的 Documents fallback 不同，现有分别验证它们的断言不能误改。

## 验证与交付顺序

1. 实现后先 build-for-testing、检查 xctestrun 环境和代码 diff，给 root 精确文件清单。此时不启动整套原生测试。
2. root 静态复核通过后，先只运行空宿主 sentinel / policy，用结果证明当前 Xcode 的环境传播和选择分支；再运行完整普通原生测试。
3. Services 负责同步中英文 README 与开发说明的基础命令；Native 不编辑这四份文稿。
4. 必要隔离修复、文档分别正常提交，均保留 hooks；最终发布仍等 root 对精确字节、完整检查和 README 的书面批准。

本轮不修改个人配置、HOME、系统权限，不执行真实录音入口，不把三个明确未启用的 live 用例记为通过。
