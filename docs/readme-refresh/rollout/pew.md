# Pew 调查与交付

- 工作区 `/Users/nocoo/workspace/personal/pew`；调查前 clean main，git pull --ff-only 成功。
- 基线 `6eeccb962fe41a03e43c543592900673b9795211`；状态 ready_for_review。
- 已读 CLAUDE.md、README、PRIVACY、包依赖、CLI / driver / payload、Web 路由 / 数据 / 认证、测试 runner 和实际 hooks。

## 当前证据

| 结论 | 文件 |
| --- | --- |
| token 来源与会话来源范围不同；Hermes / VS Code Copilot 无会话 driver | `packages/cli/src/drivers/registry.ts`、`commands/session-sync-helpers.ts` |
| CLI 已使用 @nocoo/base-cli，发布入口是 Node shebang | `packages/cli/package.json`、`src/bin.ts` |
| SQLite 来源依赖 Bun 或 Node 内置 SQLite，package engines >=18 不能代表全部来源可用 | `parsers/opencode-sqlite-db.ts`、`hermes-sqlite-db.ts`、`zcode-sqlite-db.ts` |
| token 半小时聚合；session payload 有精确时间与消息数但无对话正文 | `packages/core/src/types.ts`、`commands/session-sync-helpers.ts` |
| 项目引用为截断 SHA-256；Web 可自行命名和映射 | `utils/hash-project-ref.ts`、Web projects API / 页面 |
| 正式和开发 CLI API 主机固定，无自定义 --host 参数 | `commands/login.ts#resolveHost`、`cli.ts` |
| 七种工具有自动同步集成，安装会改对应工具配置 | `notifier/registry.ts`、`cli.ts#initCommand` |
| 公开榜单 / 赛季 / 成就 / Showcase 与组织管理均已有路由和后端 | Web navigation、leaderboard / API 路由、worker-read RPC handlers |
| 模型价格已实现动态来源 / KV 与静态回退 | `lib/pricing.ts`、`worker-read/src/sync/orchestrator.ts` |
| 新注册默认需要邀请码，可由 app_settings 关闭 | `lib/invite.ts`、`src/auth.ts` |
| read Worker 为查询必需；batch ingest Worker 负责统计写入，其余写入仍走 D1 REST | `lib/db.ts`、`lib/db-worker.ts`、两个 Worker |
| R2 只用于团队和组织 Logo，CDN 域名仍固定 | `lib/r2.ts` |

## 文档漂移修正

- 统一根中文 / docs 英文模板，网站在语言链接之前；docs 索引增加两种语言入口。
- 删除固定工具计数、测试计数、质量门禁和阈值介绍；保留实际支持来源名单及会话统计范围。
- 旧 README / CLAUDE 声称根 build 构建所有包；当前根命令只构建 core 和 Web。新稿明确 CLI 单独构建。
- 旧 CLI 栈 citty / picocolors 是历史直接依赖；当前统一封装为 base-cli。Web 现用 Basalt，补齐 KV / R2 与模型价格同步。
- 旧会话统计描述包含“工具调用”独立指标，但上传 schema 没有该独立字段。新稿仅描述时间、消息数和分类。
- PRIVACY 的“never parsed”措辞过强：解析器会读取 JSON 日志来取字段，上传 schema 不包含对话正文。README 按实际上传范围写，不声称不读取日志内容，不把哈希称为不可逆隐私保证。PRIVACY 保留原文，差异记录于此。
- 采集结果取决于日志字段完整度，费用是价格表估算而非账单；未宣传绝对准确或生产力结论。
- 仅列基础各层测试方法与必需远端测试环境，未介绍 6DQ / hook / 覆盖率门槛。正常质量流程仍保留在仓库原有文件中。

## 验证与执行边界

- 双语各 140 行，相对链接、代码块、命令、现存目录和 git diff --check 通过。
- 官网 https://pew.md 与 GitHub homepage 一致，HTTP 200。
- 没有运行 pew sync / init / login / reset，没有读取或上传用户 AI 原始日志，也没有修改任何用户配置。
- CLI 集成测试直接调用采集函数，使用 mkdtemp 人工数据；无需已构建 CLI 或登录。
- API / 浏览器测试使用独立远端 D1 和两个 test Worker。已只打印布尔结果确认必需配置存在、测试 ID / URLs 与应用环境不同；没有输出凭据或实际 ID。后续正常 runner 会读 _test_marker 并执行完整隔离检查。
- prepush 会并行运行 API、浏览器和安全检查；API 每次创建独有测试用户并清理，浏览器按既有只读用例运行。执行前必须确认 17020 / 27020 空闲，避免 runner 的 ensurePortFree 杀掉他人服务。
- docs-only precommit 按现有代码正常略过重型代码检查；不注入绕过参数。批准后正常 hook 运行即可，无需提前重复完整远端测试。
- LICENSE 为 MIT © 2026 Zheng Li；全部版本维持 2.29.1，不 npm publish / tag / Release / 本机部署。

## 发布

待 root 写入 pew.review.md 后，正常提交三份文档、再次 pull、核对仅当前提交，再 push main，记录 API / browser / security、远端回读与 CI。本站正式 JSON 由 root 处理。

## 首次正常 pre-push 结果

文档提交 `5926727bbdf303e4dd9a922c7ed8d2a427299fab` 后再次 pull 成功。17020 / 27020 空闲；正常 hook 跑了隔离环境 API、browser 与 security。API 115 通过 / 1 超时：GET /api/achievements 的默认 30000ms 上限；browser 55 全通过；OSV 使用现有 clean cache、gitleaks 当前提交通过。sh -e 在 wait 收到失败后退出，未把临时日志汇总到 push 日志。原日志保留于 `/var/folders/hh/5b1tphh13wbg8hj9jj_bxbqr0000gn/T/tmp.dnHTalUBPU`，只以脱敏结果调查。未改超时、断言或 hooks，准备确认清理完成后完整重试。

Next runner 生成了 next-env.d.ts、tsconfig 差异，并新建 packages/web/AGENTS.md / CLAUDE.md；已发现但尚未撤出，等待核实来自当前 Next 生成器，且不会纳入文档提交。

## 第二次正常 pre-push

再次 pull 成功；完整重试仍为同一 GET /api/achievements 30000ms 超时（115 通过 / 1 失败），browser 55 全通过，安全检查通过。端口与子进程已清理。原始日志位于 `/var/folders/hh/5b1tphh13wbg8hj9jj_bxbqr0000gn/T/tmp.fwynYsxcS7`，汇总 `/tmp/readme-refresh-20260908-apps-pew-push-retry.log`。这不是单次网络失败，停止盲重试，交 root 调查；文档提交仍仅在本地 main ahead 1，未推送。

已核对 Next 的 `generate-agent-files.js`：当前新增的两个文件正是 dev 自动生成的完整 block 与 `@AGENTS.md`，无用户内容。第一次 runner 的 next-env / tsconfig 精确还原后再 pull；第二次又产生相同类型差异，暂待 root 统一清理决定。不会纳入文档提交或修改 hook。

## 主代理修复与发布结果

root 将单个成就的用户列表和人数两项独立查询成对并行，保留跨成就串行、原 SQL / 隐私条件和所有测试时限。现有 88 项相关测试、完整 pre-commit、原 pre-push 的 116 项 API / 55 项浏览器 / 安全检查全部通过，修复提交为 `239e858e68bc696175f5406317bad0716b544a65`。成就 API 本次为 24418.67ms；没有把该结果当作性能保证。

中途一次 push 在启动 hook 前因 GitHub TLS 连接失败退出；重新 pull 与正常 push 后，文档及最小修复均已到 main。版本未变。root 逐字节核对 Next 自动生成内容后清除本轮噪音，工作区干净；远端精确 SHA、双语及索引回读、执行修复摘要和日志见 [候选回执](pew.json)与[主代理复核](pew.review.md)。后续 CI 状态统一记录在 publication-audit.json。
