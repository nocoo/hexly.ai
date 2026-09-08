# 主代理复核台账

本表记录主代理对完整 README 改写、英文对应、源码依据及站点候选字段的人工复核。发布结果见各项目调查、候选 JSON 及主代理独立核验的 [publication-audit.json](publication-audit.json)；本站仅纳入已发布项目。

| 项目 | Review | 关键核对 / 修订 | 发布 |
| --- | --- | --- | --- |
| Echo | 已批准 | IP 查询 key 回退、Collector token / TTL、Go UDP / A 边界、包目录命令、双语示例；修复 pre-push 的工作区入口并 fail-fast | 已发布 1e0bc457，CI 成功 |
| Runner | 已批准 | Swift CLI / SQLite 回退 / Dashboard API / 固定时区；已修订英文范围与 hook 入口，Xcode 下完整串行 287 测试通过 | 已发布 687e5fbf，CI 成功 |
| Xray | 已批准 | 当前 Workers / D1 栈、外部生产者与自定义来源边界、dry-run 联网、加密 key 与本地测试前提、双语全文 | 已发布 c20488dc，CI 成功、部署成功 |
| Noheir | 已批准 | CSV 与 JSON 覆盖范围、规则洞察、Next.js MCP、OAuth / Worker 本地前置 | 已发布 b7b64d05，CI 成功、部署成功 |
| R2Shot | 已批准 | 整页截图范围、手动复制、英文 UI、本地凭据、模拟测试范围 | 已发布 876ee4bf，CI 成功 |
| Rooster | 已批准 | 外部 bridge 前置、只读与占位管理页、API / 静态前端边界 | 已发布 9c9ab565，CI 成功 |
| Neo | 已批准 | 业务密钥与归档加密边界、TOTP 主界面、四份迁移、Backy / PWA 实际范围 | 已发布 8d3c7feb，CI 成功、部署成功 |
| Gecko | 已批准 | Mac 权限与同步、vinext / Node 托管、D1 REST、Google 白名单和 AI 数据边界 | 已发布 14b43d95，CI 成功 |
| Pew Game | 已批准 | 自动射击输入、波次与道具、Canvas、持久化和成绩校验范围 | 已发布 f6bdd1fe，CI 成功 |
| Codo | 已批准 | 横幅 / Dashboard、Guardian 上下文与打包缺口、签名和安装、原生 UI 手动范围 | 已发布 c1b4552e，CI 成功 |
| Wooly | 已批准 | 独立 fetch Worker、共享快照替换、手动积分、本地初始化与真实 MIT | 已发布 76320dfe，CI 成功、部署成功 |
| Dove | 已批准 | 实际 Webhook、幂等与限频、dry-run 分支、模板试发、显式本地 D1 前提 | 已发布 dc75e960，CI 成功、部署成功 |
| Owl | 已批准 | 系统指标、AppKit 与 Objective-C 桥接、内存告警和签名 / 通知前提 | 已发布 cceca53d，CI 成功 |
| Flow | 已批准 | 浏览器实验、硬编码 API 地址、模型前提与配置存储、单元测试范围 | 已发布 b3e32a8b，CI 成功 |
| Hooky | 已批准 | 点击触发规则、页面变量、请求格式、权限边界与真实扩展 E2E | 已发布 44c66401，CI 成功 |
| IPSafe | 已批准 | 仅 2xx、配置合并、显式 shell、执行超时 helper 差异与 npm / main 区别 | 已发布 8cbac66a，CI 成功 |
| Ellie | 已批准 | 双 Key 与三服务初始化、标题搜索、TUI 边界、本地测试和当前域名 | 已发布 7271e318，CI 成功、部署成功 |
| Life.ai | 已批准 | 功能 / 导入 / 数据共享 / 测试、SQLite 内存诊断与目标依赖构建文档均已核对 | 已发布 a4febb04，CI 成功 |
| Zhe | 已批准 | 链接 / 想法 / 待办与 Scope、固定 CLI 地址、原生 Node 入口、迁移差异和本地测试前提 | 已发布 ec428786，CI 成功 |
| Shrike | 已批准 | rsync 本地副本、Drive 上传边界、HTTP 鉴权 / 端口、Tauri 与文件测试 | 已发布 847c03e0，CI 成功 |
| GeekHub | 已批准 | Supabase 与浏览器设置、无独立抓取 cron、AI 操作顺序及数据库测试条件跳过 | 已发布 89c1de12，CI 成功 |
| Dotty | 已批准 | 静态模板 / mock 数据、真实页面路由、主题与图表、开发 API 和测试范围 | 已发布 f13a3aa2，CI 成功、部署成功 |
| Firefly | 已批准 | D1 Worker 与 R2 S3、作者权限、管理员评论、备份缺口、开发迁移与 E2E 隔离 | 已发布 bfa7e525，CI 成功 |
| clip | 已批准 | 自定义 YAML 到 Bun CLI、认证与配置、生成边界和本地 HTTP 端到端测试 | 已发布 1c7e3e5c，CI 成功 |
| Arena | 已批准 | 本地协作板、共享 SQLite、checkpoint / pop 行为、Bun CLI 与 Google 登录前提 | 已发布 b5c6a243，CI 成功 |
| Backy | 已批准 | 文件取回与业务恢复区分、Access / token、远程开发配置、直传和增量迁移范围 | 已发布 59d53952，CI 成功、部署成功 |
| Basalt | 已批准 | 组件库与 mock 示例站、样式 / peer / 子路径、原样保留的可编译文档示例 | 已发布 74a1ea14，CI 成功、部署成功 |
| Deca | 已批准 | Echo / 默认入口区分、文件存储、工具权限、provider 选择与外部测试范围 | 已发布 61b8cbc5，CI 成功 |
| Matrix | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [matrix.review.md](rollout/matrix.review.md) | 已发布 25240313，CI 成功、部署成功 |
| Meowth | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [meowth.review.md](rollout/meowth.review.md) | 已发布 b4adc3ef，CI 成功 |
| Pika | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [pika.review.md](rollout/pika.review.md) | 已发布 4fd43965，CI 成功、部署成功 |
| Pew | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [pew.review.md](rollout/pew.review.md) | 已发布 239e858e，CI 成功 |
| Unseal | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [unseal.review.md](rollout/unseal.review.md) | 已发布 c93334a2，CI 成功 |
| Fundly | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [fundly.review.md](rollout/fundly.review.md) | 已发布 3f33f558，CI 成功 |
| Surety | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [surety.review.md](rollout/surety.review.md) | 已发布 9df59e70，CI 成功、部署成功 |
| Raven | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [raven.review.md](rollout/raven.review.md) | 已发布 cd7f16e7，CI 成功 |
| Bat | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [bat.review.md](rollout/bat.review.md) | 已发布 e47f762f，CI 成功、部署成功 |
| Poké Pocket | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [pokepocket.review.md](rollout/pokepocket.review.md) | 已发布 8698f1ac，CI 成功、部署成功 |
| DreamRO | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [dreamro.review.md](rollout/dreamro.review.md) | 已发布 92c77722，CI 成功、部署成功 |
| Dogfight | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [dogfight.review.md](rollout/dogfight.review.md) | 已发布 20748048，Release 失败、CI 成功 |
| Gaga | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [gaga.review.md](rollout/gaga.review.md) | 已发布 a6a8ddfe，Release 失败、CI 成功 |
| Bogo | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [bogo.review.md](rollout/bogo.review.md) | 已发布 dfadc0a8，CI 成功、部署成功 |
| Otter | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [otter.review.md](rollout/otter.review.md) | 已发布 18e55635，CI 成功、部署成功 |
| Giraffe | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [giraffe.review.md](rollout/giraffe.review.md) | 已发布 deb25d07，CI 成功、部署成功 |
| Frogie | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [frogie.review.md](rollout/frogie.review.md) | 已发布 2ed89a29，CI 成功 |
| signoff.now | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [signoff-now.review.md](rollout/signoff-now.review.md) | 已发布 1d658480，CI 成功 |
| Lyre | 已批准 | 双语全文、源码目标 / 技术栈、运行与测试前提；详见 [lyre.review.md](rollout/lyre.review.md) | 已发布 3acc9494，CI 成功、部署成功 |

## 必要执行修复

### Echo 推送 hook

原 `.husky/pre-push` 在根目录串联 `build / test / lint / test:e2e`，而迁移后的根脚本只提供 lint。此 `&&` 组合后仍有独立 OSV 命令，前项失败也可能被最后一次扫描成功覆盖。

主代理将构建检查连接到现有 `packages/ip-service` 的 `test:builder`（与 CI 相同的 Vercel Lambda 构建验证），单元和 HTTP 测试连接到该包的现有脚本；保留根 lint 与 OSV，并添加 `set -eu`。不修改断言、覆盖率门槛、依赖或版本。

已执行 shell 语法检查，以及临时命令替身检查：正常路径按顺序运行全部五项；单元测试返回 23 时立即以 23 结束，不继续 lint / HTTP / OSV。这项检查只验证 shell 路由与失败传播，不能替代正常提交和推送时运行真实检查。

### Runner 推送 hook 与 Xcode

旧 hook 重复 source Husky `_h`，主代理在临时副本中复现其返回成功却没有执行任何检查。已移除重复 source，将 Dashboard 连接到 Vitest package script；保留 Swift 测试、Dashboard lint 和 SwiftLint。临时检查验证完整顺序与失败传播，正常发布仍需执行真实 hooks。

本机已有 Xcode 26.6，只是全局选择为 Command Line Tools。使用进程级 `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer` 后，280 个 Swift 单元测试通过。全局开发工具选择保持不变。

### Runner 完整测试串行执行

实测完整默认测试卡在 stderr 管道，串行运行全部 287 tests / 29 suites 在 33.17 秒通过。已将两个本地 hooks 与 CI 的 Swift 命令统一为 `--no-parallel`，README 的各层命令也同步。检查范围、断言及门槛保持原样。

随后正常 README 提交曾出现既有 SQLite contention：ExecutorTests 报 database is locked 及少一条任务完成结果。未修改测试的完整重试、正常 pre-push 和该提交远端 CI 均通过；串行调整解决已复现的 stderr 捕获挂起，不代表 SQLite 偶发竞争已经消失。

### Gecko 已有 image-size 补丁复核

原来两项有源码补丁的扫描例外在本日到期，正常 push 被拒绝。npm 最新仍为 2.0.2，无已发布修复版本；root 对照 OSV 公告核实三个零长度循环，现有 6 项 CJS / ESM 回归测试通过。下载原包作负向对照，ICNS / HEIF / JXL 都触发超时。安全检查现在先强制验证已安装补丁的回归行为，再运行 OSV / Gitleaks；原两项例外经重新评估续至 2026-10-08。源仓库 `docs/11-image-size-patch-review.md` 保存证据与到期处理要求；不新增其他忽略、不改版本或依赖。

### Pew 成就查询超时

两次正常 pre-push 都在同一成就 API 超过原有 30 秒时限，其余 API、浏览器与安全检查通过。root 只将每个成就的用户列表与人数这两项独立只读 RPC 成对并行；跨成就仍串行，SQL、隐私条件、输出与测试时限不变。

现有 88 项相关测试、完整 pre-commit、正常 pre-push 的 116 项 API / 55 项浏览器 / 安全检查通过，文档与修复一并发布至 `239e858e68bc696175f5406317bad0716b544a65`，版本仍为 2.29.1。成就请求本次在 24.4 秒内完成，此观测不代表性能保证。精确源码摘要、Next 生成文件清理依据与日志见 [Pew 复核](rollout/pew.review.md)和回执。

### Raven 模型缓存测试隔离

原覆盖率门禁的目录统计依赖后台刷新回调是否在其他测试结束前完成，同一未修改基线下出现 97.41% / 97.53% 的差异；应用工厂单元测试还可能访问真实模型服务。主代理批准两个测试文件的最小修复：模拟模型 fetch，直接验证缓存过期、并发请求合并、成功更新与失败重试，并等待受控异步任务收尾。原断言、业务源码、基线、门槛和 hooks 不变。

现有完整覆盖率门禁已通过，详细证据和精确文件摘要见 [Raven 复核](rollout/raven.review.md)与快照；正常发布结果另行回读记录。

### Lyre 原生宿主与真实录音隔离

正常原生hooks原本启动日常应用并在已有系统权限时录音。Native调查并指出草稿的scheme层级、失败诊断和信号传播问题，主代理完成并验证最小隔离补丁：Debug空宿主、默认关闭真实录音、显式入口、原三项完整结果断言与await清理、共享runner和生成目录的lint排除。全部原生普通用例与新增策略用例通过，真实音频未采集；完整hooks、源码CI与自动Release均成功。详见[完整复核](rollout/lyre.review.md)。
