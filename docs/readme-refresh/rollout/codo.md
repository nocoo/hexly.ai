# Codo README 调查与交付

## 同步与状态

- 日期：2026-09-08；checkout `/Users/nocoo/workspace/personal/codo`。
- 初始 main 干净、无 ahead；`git pull --ff-only` 成功。
- 基线 `c4d8982d8c91c44ccd85d3a13e824c0cc9ccc80a`。
- 双语 README 已准备，待主代理 review；未提交/push。
- 已读 CLAUDE 和当前实现；未修改 CLAUDE、版本、实现或 hooks。

## 关键实现证据

| 结论 | 依据 |
| --- | --- |
| SwiftPM / macOS 14 / 核心库+应用+测试服务 | `Package.swift` |
| 应用入口使用 BannerProvider，而非系统通知 provider | `Sources/Codo/AppDelegate.swift` 的 `startDaemon` |
| 自绘 NSPanel、排队显示、悬停暂停、手动关闭；无声音/thread 合并实现 | `Sources/Codo/BannerProvider.swift` 及 Banner 内容视图 |
| Dashboard 已实现，不止菜单栏守护进程 | `Sources/Codo/Dashboard/Views/DashboardView.swift`、`DashboardStore.swift`、其他 views |
| SQLite events/decisions/stats/projects | `Sources/CodoCore/EventStore.swift` 与扩展 |
| CLI 参数、模板、stdin、退出码 | `cli/codo.ts` |
| 七类 Claude Code 事件映射，失败不传播 | `hooks/claude-hook.sh` |
| Guardian 分类、近期上下文、模型 send/suppress | `guardian/classifier.ts`、`state.ts`、`llm.ts`、`main.ts` |
| Guardian prompt 要求简体中文，API key 从 Keychain 注入 | `guardian/llm.ts`、`Sources/CodoCore/GuardianSettings.swift`、AppDelegate |
| Guardian resolver 支持 bundle 资源与向上搜 checkout | `Sources/Codo/GuardianPathResolver.swift` |
| build 未复制 Guardian；install 复制 app/CLI/hook，创建的是 wrapper | `scripts/build.sh`、`scripts/install.sh` |

## 与旧文档的差异

- 旧 README 只描述系统 toast；当前 AppDelegate 明确使用自绘横幅。不能承诺系统通知中心、声音和 thread 分组效果。
- 补上已实现的原生 Dashboard 和 SQLite 持久化。
- Guardian 真实打包缺口明确写出，给仓库 bundle 的可用查找方式。CLAUDE 将 production resolver 描述为未实现，但实际 resolver 分支已存在，缺的是 build 中资源复制；README 按代码说明。
- Guardian 只输出 send/suppress 通知动作，没有任意 shell 执行能力；其中文摘要行为和模型请求上下文如实说明。
- `install.sh` 文案称 symlink，实际写入 `/usr/local/bin/codo` wrapper；README 使用“包装脚本”。
- 原测试描述含固定数量、覆盖率和 hooks 制度，已替换为各层基础命令。
- 原手动 UI 脚本包含旧 system notification 检查，README 说明它是人工清单且部分内容为历史实现，不冒充自动通过。
- Tests 实际 import Testing；README 写 Swift Testing，未沿用 XCTest 猜测。

## 站点 / 许可证

- GitHub homepage=null，没有已核实独立站点；顶部只放英文链接。
- Logo `assets/brand/icon-rounded.png` 保留。
- LICENSE 为 MIT © 2026 Zheng Li。

## 验证

- 根和 Guardian 的 frozen install 成功，锁文件未改。
- CLI `bun test`：79 通过；Guardian `bun test`：172 通过，模型调用使用 mock。
- `bash scripts/integration-test.sh`：当前 Swift 源码构建成功，35 检查通过，使用临时用户目录和 socket，未连接真实 `~/.codo`。
- 首次 `swift test` 因默认 Command Line Tools 缺少 `Testing` 模块失败。主代理发现已有完整 Xcode 后，使用进程级 `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer swift test` 已通过：169 测试、31 suites。保留原有 Swift 6 并发警告，未改全局工具选择、测试或 hooks。
- 本机默认未选择完整 Xcode；本轮没有执行包含 actool/签名的 .app 打包，也没有安装应用。
- 未执行安装或 `e2e-test.sh`，后者会停止真实 Codo 并要求人工确认；没有改个人应用、hooks 配置或 key。
- README 各 15 个本地引用存在，bash/json 示例一致。

## Review 与发布

待主代理审阅；工具链选择问题已解决，后续 native 检查使用进程级 DEVELOPER_DIR。批准后正常 hooks 提交、pull/ahead 核对、push main，补充 SHA/CI/回读。

## 发布回执（2026-09-08）

主代理书面批准后，按正常 hooks 提交并发布 `c1b4552e7ba36b99945b046164ccec64c928ff80`。使用进程级 Xcode，Swift / CLI / Guardian 单元测试、SwiftLint 和 Biome 全部通过；pre-push 再次运行这些层以及 35 项隔离 IPC 集成测试并通过。发布前重新 pull 成功，仅本任务 README 提交 ahead，已 push main。未运行需要人工确认的 UI 脚本、未安装 app、未修改个人设置。GitHub API 回读两份 README 与本地一致（英文首次连接被重置，重试成功）。[CI](https://github.com/nocoo/codo/actions/runs/34222356069) 已 completed / success。
