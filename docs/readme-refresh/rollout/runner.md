# Runner README 调查与交付

## 状态与范围

- 调查日期：2026-09-08。
- checkout：`/Users/nocoo/workspace/personal/runner`。
- main 初始干净、无 ahead 提交；调查前 `git pull --ff-only` 已成功。
- 源码基线：`d9d2a14828d20c6f27f4e44b3221d9d9a89190e1`。
- 已准备根中文 README 与 `docs/README.en.md`，状态为待主代理 review；未提交或推送。
- 读取 `CLAUDE.md` 和 `AGENT.md`（均指向 README）；依照本次授权将公开使用说明从维护制度中分离，CLAUDE 未修改。

## 当前实现证据

| 结论 | 证据 |
| --- | --- |
| macOS 13+，Swift 6，Swift Argument Parser / GRDB | `runner-swift/Package.swift` |
| 真实 CLI 包含 migrate、task-save | `runner-swift/Sources/Runner/Runner.swift`；`RunnerLib/RunnerRoot` 的测试根入口不包含这两项，未误用 |
| shell、OpenCode prompt 和 curl HTTP 执行；默认 prompt 固定 agent/model | `runner-swift/Sources/RunnerLib/Executor.swift` |
| 后台 shell、超时终止、complete 回调写运行结果 | `runner-swift/Sources/RunnerLib/ScriptBuilder.swift` |
| auto 是单次检查、UTC+8 | `runner-swift/Sources/RunnerLib/CLICommands.swift` 的 `runAutoCommand` 与 `AutoService.swift` |
| runs、tasks、schedules、state 已有 SQLite 表；任务/调度各自优先 enabled SQLite 结果，再回退 JSON | `runner-swift/Sources/RunnerLib/SQLiteStorage.swift` |
| Dashboard API 调用根目录二进制，只有开发服务器插件；status 仍读 state.json | `dashboard/src/api/vite-plugin-api.ts` 与 `dashboard/vite.config.ts` |
| 当前 Dashboard 为 React / TS / Vite / Tailwind，测试 Vitest / happy-dom | `dashboard/package.json`、`dashboard/vitest.config.ts` |
| launchd 样例含个人路径、非通用分钟轮询、特定日程 | `launchd/com.runner.scheduler.plist` |

## 修正的过时信息与边界

- 原文把运行态统一描述为 JSON 文件 API；现在明确 SQLite 与文本输出，及遗留 JSON 回退路径。
- 原快速开始进入 runner-swift 后直接 `./runner init`，目录错误；新命令从根目录使用 `--package-path`。
- 旧文档 Swift 5.9 与 manifest 6.0 不符，按当前 manifest 写 Swift 6。
- `bun test` 为旧测试用法；当前显式执行 package script，即 `bun run --cwd dashboard test`。
- 原 `./runner auto` 容易被理解为启动常驻调度，新文说明一次性检查和 launchd 配置要求。
- 默认 OpenCode provider/model 写在实现里，README 明确它所需的访问配置。
- Dashboard static preview 无 API、状态概览读取遗留 JSON、SQLite 任务写入后 JSON 不一定生效，均在对应使用位置说明。
- 清理了 README 中的测试门槛、hooks 和 agent 提交制度；未往 CLAUDE 加内容。
- 历史编号文档原样保留并给出历史性说明；本次没有重写全部设计文档。

## 站点、品牌与许可证

- 保留 `assets/brand/icon-rounded.png`。
- GitHub REST 元数据 `homepage: null`；代码只有本地 `runner.dev.hexly.ai` allowed host，没有把本地地址当站点。
- `LICENSE` 不存在，GitHub license 为 null；README 明确目前未附许可证文件。

## 验证

- 当前源码 `swift build --package-path runner-swift` 成功，有原有 unused-result warnings。
- 使用新构建二进制和临时目录实测 `init → validate → run sample → api runs → logs`，执行成功、exit code 0、输出符合示例；没有碰真实 data。
- 两份 README 各 13 个本地引用存在；bash/json 代码块一致。
- 根 `bun install --frozen-lockfile` 成功并正常安装 Husky。
- Dashboard frozen install 因原有 overrides / bun.lock 不一致失败；文档保留可用的 `bun install`，本地后续验证采用 `bun install --no-save` 以不改锁文件。
- `swift test --package-path runner-swift --skip IntegrationTests` 失败：当前 `xcode-select -p` 是 `/Library/Developer/CommandLineTools`，缺少 `Testing` module。README 已写 Swift Testing / Xcode 前提；没有跳过或修改 hooks，也未提交。

- Dashboard `bun run --cwd dashboard test` 通过：17 文件、236 测试。`--no-save` 安装成功，锁文件未变；Husky 安装造成的 tracked wrapper 换行/权限变化已还原，hook 配置仍正常启用。

## Review 与发布

待主代理审阅。发布前再次 pull，记录文档 commit、远端回读和 CI；只有发布后才将候选 overview 合并到本站。

### 执行状态更新

已读取主代理 `runner.review.md` 批准。按要求为 hook 修复准备独立提交，完整 pre-commit 正在使用进程级 Xcode 执行；README 随后独立提交。

## 完整 Swift 检查诊断（2026-09-08）

正常 hook 提交中的默认并发 Swift 测试停在 `MonitorTests.captureStderrAsync` 的 `readDataToEndOfFile`。对该自启动测试进程取样确认等待，诊断文件 `/tmp/readme-runner-hook-sample.txt`。终止该测试使 hook 失败，未产生提交。使用完整 Xcode 环境执行 `swift test --package-path runner-swift --no-parallel`，全部 287 tests / 29 suites 通过（33.17 秒）；日志 `/tmp/readme-runner-full-serial.log`。未过滤测试、未改门槛，已提请主代理 review 正常 hook 中使用串行运行的最小修复。

主代理待决事项：建议 `.husky/pre-commit` 与 `.husky/pre-push` 的 Swift 命令显式加 `--no-parallel`（保留所有 287 项测试）；测试涉及进程级文件描述符捕获，并发运行在实测中卡死。现有已批准 pre-push 修复仍保留 staged，暂未产生 hook 提交。

## 发布回执

- 主代理批准的 hook / CI 修复独立提交：`d65ee6f77acd7707f1d986f508c95e3c99caccb6`；双语 README：`687e5fbfbde9d38d59dfaa95a115ce7cbd088e4e`。
- 完整串行测试保留 287 个 Swift 测试。README 首次正常提交遭遇已有 SQLite contention（`ExecutorTests.swift:271` 的 SQLITE_BUSY 和 `:600` 的运行记录等待超时）；未改断言、未改业务代码，重试正常 git commit 后完整检查通过。
- 正常 pre-push 再次完成 287 Swift / 236 Dashboard 测试及 lint；有一项原有非致命 SwiftLint warning。推送前再次 pull，只有上述两项任务提交。
- main 已 push，工作区干净且同步；GitHub Contents API 回读中英文 README，字节均与本地一致。
- CI：https://github.com/nocoo/runner/actions/runs/34224762540 ，首次回读仍运行中。

Runner CI 最终 completed / success：https://github.com/nocoo/runner/actions/runs/34224762540。
