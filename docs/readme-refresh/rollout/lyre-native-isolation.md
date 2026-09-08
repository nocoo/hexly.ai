# Lyre 原生测试隔离诊断（只读）

2026-09-08，Native 工作线。状态：诊断与最小方案已交 root review；尚未编辑 Lyre 原生源码 / hooks，也未运行原生 build、tests 或录音。下文的实现和验收均为待批准步骤，不代表已经通过验证。

调查基线：`78b3a126f27a5adc53e4eaf4097b785ac7cb609e`。使用 `.readme-refresh-20260908/lyre`，Services 正在编辑 README / docs。普通 `git pull --ff-only origin main` 因本机 pull.rebase 与其未暂存文稿冲突而拒绝；随后进程级 `git -c pull.rebase=false pull --ff-only origin main` 成功，远端无新增提交。未 stash、reset 或改写他人文件。

## 结论

需要同时隔离应用宿主和真实录音用例。只给 RecordingE2ETests 加开关仍会在用例执行前启动完整 LyreApp，读取个人配置并启动检测。只把配置路径换到临时目录，也不能阻止 SwiftUI 的权限检查和已有授权下的真实录音。

建议的最小持久化修复：新增一个入口分发器，让原生测试进入空的 SwiftUI 测试宿主；正常应用仍调用现有 LyreApp。共享原生 runner 与测试 scheme 在启动宿主前传入明确标志；常规 hooks 强制关闭真实录音。三个真实录音用例采用独立的 `LYRE_RUN_LIVE_RECORDING=1` opt-in，纯状态机和合成音频用例完整保留。

此方案无需改 HOME、用户权限、业务默认输出目录或版本，不需要重构音频架构，也不需要把整个 suite 从 hooks 排除。

## 已确认的调用链

下文的 `Lyre/`、`LyreTests/`、`Meeting/`、`Audio/` Swift 路径以 `apps/macos/` 或其 `Lyre/` 源码目录为根；其余路径相对于 Lyre 仓库。

| 位置 | 源码事实 | 对测试的影响 |
| --- | --- | --- |
| `apps/macos/project.yml:51` 起；`Lyre.xcodeproj/project.pbxproj:604 / 617 / 648 / 661` | LyreTests 依赖 Lyre；`BUNDLE_LOADER=$(TEST_HOST)`，`TEST_HOST=.../Lyre.app/Contents/MacOS/Lyre` | 属于应用宿主测试，不能假设只加载测试库。 |
| `Lyre/LyreApp.swift:18–35` | App.init 创建默认 AppConfig、RecordingManager、RecordingsStore、MeetingDetectionSettings，并恢复输入设备 | 副作用早于任何 `@Test` 函数。 |
| `Lyre/Config/AppConfig.swift:57–79、108–132` | 默认加载 Application Support/Lyre/config.json；字段变动触发延迟 save；配置包含 auth token | 不应在测试里先构造默认 AppConfig 再覆盖路径。只在测试函数里 setenv 也太晚。 |
| `Lyre/Audio/InputDeviceRestore.swift:36–51` | 无条件 refreshDevices；失效的已存设备 ID 会被清除 | 宿主可能枚举真实设备，并写回个人 config。 |
| `Lyre/Meeting/MeetingDetectionSettings.swift:18–26` | 默认 UserDefaults.standard；首次使用会写入 true | 测试宿主会读写用户偏好，默认启用 Teams 检测。 |
| `Lyre/LyreApp.swift:43–56`；`Meeting/TeamsMeetingWatcher.swift:94–100、209–252` | coordinator.start；启用时 watcher.start；真实 NSWorkspace / CoreAudio / SCK providers | 会启动观察器、轮询和会议提示流程。 |
| `Lyre/Recording/RecordingsStore.swift:66–68`；`Lyre/Views/RecordingsView.swift:29–31` | Store 构造器仅保存 URL；真正创建 / 扫描目录发生在 View.task 的 startWatching / scan | 精确区别：不是构造器立即读录音，但正常 SwiftUI 场景建立后仍可能读取个人录音。 |
| `Lyre/LyreApp.swift:253–261、317–318`；`Audio/PermissionManager.swift:59–75` | Tray 出现时 checkAll / refreshDevices；checkScreenRecording 调用 SCShareableContent.current | 源码明确此调用可能弹出 TCC 对话框，不能把它当成只读 preflight。 |
| `LyreTests/RecordingE2ETests.swift:25–55、60–89、168–185、197–217` | 三个用例仅检查已有权限，随后使用默认真实 recorder；最长录制 2 秒 | 既有 TCC 授权会使普通 commit / push 触发真实录音。已有权限不等于本轮明确要求录音。 |
| `.husky/pre-commit:17–23`；`scripts/pre-push.ts:40–63` | 两处各自直接 xcodebuild test，同一 LyreTests / Debug / macOS 配置 | 要共用一个持久 runner，避免只修一处。 |
| `.github/workflows/ci.yml` | 调用共享 Bun workflow，当前 test / L2 / L3 都是 Web / Worker 命令 | 远端 CI success 不能代替本机原生隔离验收。 |

AppConfig 的业务默认输出是 Music/Lyre Recordings；RecordingManager 独立默认值仍是 Documents/Lyre Recordings，既有默认目录断言验证后者。不要通过全局重写默认值来做测试隔离。

## 其他原生测试的静态检查

已检索全部 LyreTests 中的默认配置、UserDefaults、权限请求、录制入口、网络、文件读写和播放调用，并阅读相应实现 / fixtures。

| 范围 | 隔离现状 | 处理建议 |
| --- | --- | --- |
| AppConfigTests、InputDeviceRestoreTests、UploadManagerTests | 显式唯一临时 configURL；模拟 token；UploadManager 只执行未配置的早退出或本地状态变更 | 保留，不把业务 AppConfig 默认路径改成测试路径。 |
| MeetingDetectionSettingsTests、MeetingPromptCoordinatorTests | 各自创建 UUID 命名的 UserDefaults suite；不使用 standard | 保留。部分 suite 结束后未移除持久域是已有清理不足，但不是读取个人偏好；本次无需扩大修复。 |
| PermissionManagerTests | 构造对象并直接设置状态，没有调用真实 check / request | 所有断言保留，不给它们加 opt-in。 |
| RecordingManagerTests | 默认构造仅验证初态、文件名、guard；实际 startRecording 用 FakePermissions / FakeCapture / FakeEncoder 和临时输出 | 保留全部；default constructors 本身未启动 capture。 |
| RecordingPipelineIntegrationTests | FakePermissions / FakeCapture + 真 AudioEncoder；合成 PCM 写临时 M4A / sidecar | 这是应继续默认运行的集成测试，双轨 / 单轨 / sidecar 断言不能减。 |
| AudioEncoder / Downmixer / AVAssetWriter probes / RecordingsStoreTests | 合成文件和唯一临时目录 | 保留。不能把“原生测试”一概当成需要权限而跳过。 |
| APIClientTests | ephemeral URLSession + canInit 恒 true 的 MockURLProtocol；suite.serialized | 请求通过模拟协议，不连接真实 Lyre 或 OSS。 |
| AudioCaptureManagerTests | 主要使用合成 buffer；三个 refreshDevices 用例实际枚举硬件 / 安装设备变化 listener，但不 startCapture | 保留断言；如后续机器兼容性失败再单独诊断，不在本轮虚称完全无系统 API。 |
| TeamsMeetingWatcherTests | 注入 runningApps / content / permissions / audioActivity fakes；部分生命周期测试安装真实 NSWorkspace 通知 observer | 保留完整生命周期断言，不把默认 live provider 带入测试宿主。 |
| AudioPlayerManagerTests | 自建静音 M4A 并调用真实 AVPlayer 的播放 / 暂停状态机 | 没有读取用户录音或采集音频；保留。它不是完全 mock 的媒体测试。 |
| RecordingE2ETests | 三个真实 ScreenCaptureKit / 麦克风用例 | 仅此 suite 改为显式 opt-in；其他 suite 正常执行。 |

没有发现其它用例读取默认 AppConfig、使用用户 token / Keychain 或主动启动真实录音。这个结论基于上述源码扫描，不是已经运行测试得到的动态证明。

## Xcode 环境传播证据

已只读查看本机 Xcode 自带手册，没有运行 xcodebuild test。

1. `/Applications/Xcode.app/Contents/Developer/usr/share/man/man1/xcodebuild.1:918–931` 明确记录：

   > Set an environment variable whose name is prefixed with TEST_RUNNER_ to have that variable passed, with its prefix stripped, to all test runner processes launched during a test action.

   手册示例 `TEST_RUNNER_Foo=Bar xcodebuild test ...` 会在测试进程中得到 `Foo=Bar`。因此 runner 应传 `TEST_RUNNER_LYRE_TEST_HOST=1` 和 `TEST_RUNNER_LYRE_RUN_LIVE_RECORDING=0`；不能只把普通 `LYRE_*` 环境变量交给 xcodebuild 后假设它必然转发。

2. `/Applications/Xcode.app/Contents/Developer/usr/share/man/man5/xcodebuild.xctestrun.5:132–156` 说明应用宿主测试的 TestHostPath 就是应用宿主；EnvironmentVariables 是：

   > The environment variables from the scheme test action that xcodebuild will provide to the test host process.

   因此应把相同安全默认值放到共享 scheme 的 TestAction EnvironmentVariables，覆盖直接在 Xcode 中执行 Test 的入口。RunAction 不能带测试标志，正常应用启动保持原样。项目当前没有 tracked shared xcscheme，不能只修改本机 xcuserdata 或依赖自动 scheme。

3. 两份手册证明的是约定的传播通道。新方案仍需在获准后运行一个不采集音频的宿主 sentinel，确认当前 Xcode + Swift Testing + 该项目配置实际走到空宿主。未把“查到手册”写成“宿主已验证”。

`XCTestConfigurationFilePath` 等 XCTest 注入变量可作为直接调试运行的后备检测；它们不是本轮已验证的跨版本保证，不能替代显式 runner / scheme 标志。不得依赖测试函数内 setenv，或只检查 XCTestCase 类是否已加载。

## 最小逐文件方案

### 1. 在创建 LyreApp 之前选择空宿主

新增 `apps/macos/Lyre/LyreEntryPoint.swift`，将现有 `LyreApp.swift` 的 `@main` 移到入口分发器。正常分支调用 `LyreApp.main()`；测试分支调用一个只提供空 Settings scene 的 SwiftUI App。示意结构如下，待 root review 后实现和编译：

```swift
@main
enum LyreEntryPoint {
    @MainActor
    static func main() {
        if NativeTestPolicy.isTestHost(environment: ProcessInfo.processInfo.environment) {
            LyreNativeTestHost.main()
        } else {
            LyreApp.main()
        }
    }
}

private struct LyreNativeTestHost: App {
    var body: some Scene {
        Settings { EmptyView() }
    }
}
```

空宿主不构造 AppConfig / recorder / stores / meeting settings，不建立 Tray / MainWindow，因而无需维护一整套测试专用业务实例。现有 LyreApp 的初始化和视图逻辑可以保持原样，只有入口标记移动。当前 Info.plist 没有自定义 AppDelegate 或主 nib；源码中没有其它提前构造这些对象的全局入口。

NativeTestPolicy 的输入是字典，便于无副作用地测试。主通道是精确 `LYRE_TEST_HOST == 1`；可添加 XCTest 注入变量的后备检测，但不从 CI、已授权状态或任意非空字符串推断。空宿主应留下一个进程内 sentinel，供测试确认入口分支已经发生；不要写用户配置来充当标记。

如果根 review 不接受自定义 @main 分发，等效方案是惰性 live runtime + 空 test Scene。仅跳过 watcher.start、仅更换 configURL 或全局改默认目录都不足以覆盖已确认的调用链。

### 2. 把安全默认值写入版本控制下的 scheme

在 `apps/macos/project.yml` 定义共享测试 scheme；保持 Lyre / LyreTests 原有 targets、Debug、签名与完整测试集合，在 TestAction 添加：

```text
LYRE_TEST_HOST = 1
LYRE_RUN_LIVE_RECORDING = 0
```

至少覆盖 hooks 使用的 LyreTests；若 Lyre scheme 也声明测试动作，同样使用这些值。RunAction 不加标志。生成并检查 tracked `project.pbxproj` 与 `xcshareddata/xcschemes`，确认新增入口已编入 app、TEST_HOST 仍正确，未改变版本、entitlements、断言或测试过滤。不要把 TEST_HOST 清空：既有 @testable import Lyre 依赖应用模块，这会变成链接架构改造。

### 3. 共用原生 runner，默认覆盖继承的 live 开关

新增 `scripts/test-macos.ts` 和 `package.json` 的 `test:macos`。runner 保留原 xcodebuild test 的 project / scheme / Debug / macOS / quiet / ad-hoc signing 参数和退出码；使用本任务创建的临时 DerivedData / result bundle 目录，退出时只清理自己持有的临时资源。工具链通过进程级 DEVELOPER_DIR 选择，不改全局 xcode-select。

普通入口向 xcodebuild 显式传入：

```text
TEST_RUNNER_LYRE_TEST_HOST = 1
TEST_RUNNER_LYRE_RUN_LIVE_RECORDING = 0
```

如果 runner 本身保留未加前缀的变量，同样统一为 1 / 0，避免上游遗留的 LYRE_RUN_LIVE_RECORDING=1 或 TEST_RUNNER_LYRE_RUN_LIVE_RECORDING=1 意外启用录音。普通 hook 的模式由命令选择，不能仅凭父进程 export 判断。

`.husky/pre-commit` 的原 native xcodebuild 行替换为 `bun run test:macos`，原 SwiftLint 保留；`scripts/pre-push.ts` 同一 native step 调用该 runner（从仓库根运行），其他 Web / API / 安全检查和并行策略不变。不得 skip hooks 或追加排除纯测试的选项。

可另提供 `test:macos:live`：仅在用户显式调用该命令且 `LYRE_RUN_LIVE_RECORDING=1` 时把测试进程值设为 1。这个入口仍使用空应用宿主，真实 recorder 只由获准的 live suite 创建。此次 README 发布验证不执行该入口。

### 4. 只为真实录音 suite 加 opt-in

`apps/macos/LyreTests/RecordingE2ETests.swift` 的三个真实用例以 Swift Testing 的条件 trait 标记：只有精确 `LYRE_RUN_LIVE_RECORDING == 1` 才运行。未启用时应在 hasPermissions、SCShareableContent、默认 RecordingManager 构造和 startRecording 之前显示明确的 skipped 原因。

参考现有 `e2e/api/asr-multitrack.test.ts:13–21、33–35、58–66` 的显式 live 语义，但使用独立变量，不联动 ASR 或模型调用。启用后权限不足 / 无 display 应报告失败，避免继承当前 withKnownIssue 的软通过语义；仍只使用已有权限的 preflight，不主动弹窗请求授权。保留所有现有 M4A、时长、sidecar、双 start、命名断言。

真实硬件用例适合 suite.serialized，避免三个 capture 并发。当前 cannotStartTwice 的 `defer { Task { ...stopRecording() } }` 没有等待停止，且其它异常路径未保证关闭 capture；若保留独立 live 入口，应把清理统一为 await 完成后再删除临时目录，防止失败路径继续录音。此项只改善已 opt-in 的清理，不增加实际录音验证的授权范围。

### 5. 有针对性的回归验证与文档

新增少量 NativeTestPolicy / runner 行为验证：普通模式即使继承两个 live 变量为 1，也向测试宿主传 0；缺失 / 0 / true 均不启用录音；显式 live 模式才传 1。权限 probe 使用计数 fake，证明未 opt-in 时调用次数为 0。测试进程 sentinel 确认空宿主已启动；不要通过真实麦克风或用户配置来验证。

Services 的双语 README / docs 开发页在方案落地后同步基础命令与实际前提，不引入治理章节。原生命令应统一指向共享 runner；显式 live 示例说明会采集系统音频和麦克风，以及需要既有权限。当前还没有此脚本，不能提前把拟议命令写成已经可用。

## 获准后的验证顺序

1. root 复核上述文件边界、入口逻辑、Xcode 环境传播与 live 条件；仅在批准后实现。先静态检查共享 scheme 的 TestAction / RunAction 分离、入口标记、原始 test targets 和 signing / version 没有变化。
2. 先 build-for-testing 或只编译，尚不执行任何原生用例。检查生成 xctestrun 的 TestHostPath / EnvironmentVariables；确认当前 Xcode 对新 entrypoint / 空 Settings App 的支持。此步失败应修实现，不退回会启动真实 app 的测试命令。
3. 原生执行前，再复核入口会在任何 AppConfig 构造前选择空宿主、所有真实录音用例 opt-in 条件在权限检查前。执行仅 sentinel / policy 的最小无采集验证，确认实际宿主拿到 LYRE_TEST_HOST=1、LYRE_RUN_LIVE_RECORDING=0；这是验证新边界的第一步，不是用它替代完整 suite。
4. 执行完整 `test:macos`：原有纯状态机、模拟网络、合成媒体、设备枚举用例全部运行；只有三个 live 录音用例因明确 opt-in 条件跳过。没有任何真实录音 / ASR / 凭据请求。保留完整结果和 skip 原因，不把 live 用例记为已通过。
5. SwiftLint 和正常 pre-commit / pre-push 完整运行；README、必要隔离修复分开提交，均正常 hooks。发布前再次安全 pull，正常 push / CI / 远端 README 回读；Lyre 版本仍为 1.8.0。

原生 fixture 本身会创建合成音频、使用本机媒体框架，有些用例会枚举设备 / 安装 observer；报告应保留这个边界。不得声称完全无系统 API，也不得据远端 Bun CI 成功推断原生已通过。真实录音测试留给后续明确选择 live 命令的人工验证，此次不运行。

## 本轮交付与未做事项

Native 原有 17 个仓库全部 published，CI 均 success。Frogie 最后提交 `2ed89a295257f413969bae72ef50ece592e76f7a` 的 CI 为 [34232921532](https://github.com/nocoo/frogie/actions/runs/34232921532)；Raven 完整历史安全复核和 Bogo 回执过期措辞也已补齐。

Lyre 本轮仅安全同步和读取源码 / Xcode 手册，写此诊断文件；未运行 build / test / native hooks，未读取个人配置内容，未改权限或 HOME，未采集音频，未编辑 Services 的文稿。等待 root 对具体方案 review 后再决定实施。
