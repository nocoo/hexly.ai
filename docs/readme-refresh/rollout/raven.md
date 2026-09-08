# Raven 调查与实施记录

## 基线与范围

- 仅操作隔离 checkout `/Users/nocoo/workspace/personal/.readme-refresh-20260908/raven`。原 `/personal/raven` 有无关领先 / 分叉工作，本轮不修改。
- 详细调查前再次确认 clean main 并 pull 成功。基线 `a668dbf4fa318429e34686f7bf86731ca1494fd4`。
- 一个双语 README 提交，保留现有 logo，不改版本、维护文档或代理行为。源码调查 / 构建与模拟测试后主代理 review，批准后正常 hooks 提交、再次 pull、push main、远端回读与 CI。

## 已确认的关键差异

| 事实 | 证据与 README 处理 |
| --- | --- |
| Messages→Responses 尚未实现 | docs/25首行明确Design pending review；core/router与strategy-registry仍七策略，无copilot-messages-via-responses。不把文档设计列成已发布能力。 |
| Chat→Responses 已实现 | core/router以supported_endpoints选择copilot-chat-via-responses；注册和协议目录存在。 |
| 自定义上游有协议边界 | Anthropic客户端可路由OpenAI/Anthropic；OpenAI Chat不能路由Anthropic；Responses明确拒绝所有custom。Embeddings独立Copilot路径。 |
| 原生Claude依赖catalog/能力 | native路由需模型存在于catalog，运行时还有endpoint检查；旧“完整1M窗口/零翻译开销/完整支持”不作为保证。 |
| 启动仍强依赖Copilot认证 | index无条件setupGitHubToken与setupCopilotToken；只想使用custom provider也没有跳过启动认证的入口。 |
| 管理认证与DB key数量无关 | middleware.dashboardAuth与index.authenticateWs：无两个envkey时始终开发免认证模式，即使DB已有key。旧.env/CLAUDE部分注释与README首次bootstrap说法过时。 |
| internal key只给管理接口 | apiKeyAuth不接受internal；DB key rk-前缀只走hashlookup，envkey不应使用rk-前缀；文稿用两个独立随机hex key且Dashboard/Proxy共享internal。 |
| Dashboard缺任一OAuth变量就无认证 | auth-mode需要GOOGLE_CLIENT_ID / SECRET / NEXTAUTH_SECRET三项；ALLOWED_EMAILS为空允许所有Google账号。 |
| 设计本机使用不等于loopback绑定 | proxy export default只有port没有hostname；Next启动脚本也未加hostname。README不写默认仅127.0.0.1可访问。 |
| 环境模板位置和token路径 | 根.env.example不存在；两个package各自有模板。proxy模板显式设置相对RAVEN_TOKEN_PATH=data/github_token，会覆盖平台默认目录；最小新示例不复制这条旧路径。 |
| 默认数据目录与秘密存储 | app-dirs分别macOS ApplicationSupport、LinuxXDG、WindowsAppData；GitHubtoken为本地文件，DBmanagedkey存SHA256，上游provider api_key列为明文。 |
| count_tokens仅估计 | tokenizer加模型校正，model缺失/异常返回1；不是上游精确计费或真实上下文上限证明。 |
| Token Sentinel已接通 | lib/token.ts调用sentinelBootstrap，替换旧定时器；Dashboard有sentinel状态和相关API，描述刷新状态而非不间断保证。 |
| 当前UI使用Basalt | Dashboard依赖@nocoo/basalt，原README仅Radix表述过时；Next/React、SWR、Recharts、Tailwind仍实际使用。 |
| E2E隔离不能过度声称 | run-e2e复用7024真实proxy或启动并使用真实配置/DB；run-playwright仅隔离DB，会拒绝已占用proxy端口，但仍需要真实GitHub认证。均不在本轮执行。 |

已读维护说明、README主要使用/接口/环境配置段、manifests、两份环境模板、完整proxy启动、app/config、router/registry、认证与WebSocket授权、token初始化、平台路径、DBkeys/provider字段、Dashboard认证/请求转发、测试配置与hooks脚本、真实E2E/UIrunner、设计文档20/23/24/25的相关部分。

## 验证计划与当前结果

- 两次 frozen Bun 安装停在锁定的 npmmirror gpt-tokenizer 4.0.0 下载，已确认只终止本任务安装进程。从 registry.npmjs.org 下载同版本 tarball（9,130,169 bytes），SHA-512 与 bun.lock 完全一致；检查包名 / 版本并安全解压到缺失的正常 Bun cache 条目。随后原样 `bun install --frozen-lockfile` 成功，Husky 正常执行。未改锁文件、registry 配置、源码或 hooks，也没有跳过 scripts / 完整性校验。
- 下一步运行模拟上游的proxy / dashboard测试，构建Dashboard；保留仓库现有正常checks。
- 不启动个人proxy、不读取已有Copilot凭据、不发起真实模型请求，不运行会使用生产数据库的E2E或仅隔离数据库的UI脚本。

双语文稿完成；各14个本地引用有效，Bash与dotenv代码块一致。候选资料ready_for_review，安装已通过，测试/构建结果仍待补齐，未宣称这些检查已经通过。

主代理已批准双语文稿，见 raven.review.md。首轮 proxy 全部 1983 项 /126 files、scripts 41 项 /3 files、Dashboard 测试与覆盖率通过；现有 gate:coverage 仍因 lib/ 97.41% 比基线 97.53% 低 0.12pp 而退出 1。未修改门槛或测试，已向主代理回报，进一步定位。Dashboard 构建使用本任务绑定但不监听的本地端口，避免访问个人 proxy。

补充定位：Istanbul 文本表的 src/lib 顶层是 97.53%，但 gate 按第一层目录汇总子目录（包括 server-tools/tavily）得到 97.41%，需核实基线统计口径。远端基线 a668dbf 的 CI 34182589395 已 success。下一步用 CI 的 Bun 1.3.11 在进程级 PATH 下重跑原样 gate，区分工具链差异；不更新基线或放宽检查。

CI 固定的 Bun 1.3.11 原样重跑完整 gate:coverage 已通过：全部 1983 proxy 测试及 41 scripts 测试，lib/ 回到 97.53%，全局 98.33%。当时仅能确定该次运行通过，不能据此证明运行时就是根因。后续 commit / push 仅通过进程级 PATH 使用 CI 同版 Bun，不改全局 Bun。Dashboard 的隔离构建已成功。

正常 pre-commit 随后再次失败（其余 stages 全部通过），同样 lib/ 97.41%。对比完整报告发现唯一新增命中是 utils.ts:37 的后台 refresh finally 回调；现有 utils.test.ts 并未直接测试 refreshModelsIfStale 的完成 / 后续重试。目前不能断言切换 Bun 已解决；需要确定性测试或解释为何 hook 环境改变回调收尾。没有反复尝试提交取巧，也没有改源码或门槛。

## 正常 hook 修复提案（待主代理批准）

2026-09-08。双语 README 已批准且暂存；首次正常 commit 被原 gate:coverage 拒绝，尚无新 commit。

- 所有 1983 proxy tests / 41 scripts tests / Dashboard tests 均通过，构建成功。
- 本机 Bun 1.4 的 gate 报 lib/ 97.41%，CI 固定的 Bun 1.3.11 单独执行一次通过 97.53%；同一进程级 PATH 执行正常 commit 又回到 97.41%。不再以运行时差异作为已证实根因。
- 完整报告逐行对比，唯一变化是 `packages/proxy/src/lib/utils.ts:37` 的 `modelsRefreshing = null` finally callback 是否被覆盖。当前 `test/lib/utils.test.ts` 没有 `refreshModelsIfStale` 直接测试，后台刷新完成可能依赖其他 route 测试的调度时机。
- 基线是 97.53%，允许回退 0.1pp，实际失败为 0.12pp。不能降门槛或改基线解决。
- 建议单独增加确定性行为测试：固定 Date.now / 模拟 getModels 成功及失败，验证并发请求合并、finally 后可重试、TTL 内不刷新。通过当前完整 gate 后再正常 commit。需要主代理批准后才编辑非 README 文件。

日志：/tmp/readme-raven-proxy-tests.log、/tmp/readme-raven-proxy-tests-ci-bun.log、/tmp/readme-raven-commit.log；隔离 checkout `.readme-refresh-20260908/raven`。继续处理 Bogo / Frogie，不停止独立工作。

## 缓存刷新回归用例候选

已在 `packages/proxy/test/lib/utils.test.ts` 增加两个行为用例，直接调用 `refreshModelsIfStale`：未过期时不发请求；TTL 到期时并发调用只共用一个延迟响应；成功后缓存更新并重新计时；请求失败保留旧模型，下一次调用重新请求。仅模拟 fetch 与 Date.now，以实际受控 Promise 加 setImmediate 完成事件循环，不使用固定睡眠或放宽断言。受控响应在 finally 释放，时钟 mock 在 teardown 恢复。单文件 44 项通过，Biome 通过；原正常 gate 仍待此次完整验证。候选改动未提交，待主代理复核，产品代码和 baseline 完全未改。

完整 gate 初次在 `test/app.test.ts` 的合法模型列表与 connection-info 两项超时。源码确认该工厂装配测试没有 mock fetch，空缓存会访问真实模型目录；本轮不使用真实上游。现给该文件增加 fetch fixture 和 teardown 恢复（原有断言全部保留），避免网络波动决定结果。加上缓存刷新两项用例后，正常 `bun run gate:coverage` 全部 1985 项通过，lib/ 回到 97.53%，总体 gate 98.33%；Biome 与 typecheck 均通过。请主代理 review 两个 test 文件的最小补丁；不改产品、基线或 hooks。完整日志 `/tmp/readme-raven-deterministic-gate-2.log`。

## 正常提交完成

主代理已批准两项最小测试修复并保存精确快照。独立测试提交`458d98f8133bb9dc2fc193b43f417c888dbdb5a2`及双语README提交`cd7f16e7829429f14855cbc615324f32db51e407`均通过完整原pre-commit（coverage、Dashboard/scripts、lint-staged、types、architecture微检查、gitleaks）。未使用hook绕过，也不需要固定Bun版本来碰运气。重新pull后只有这两项任务提交ahead，已开始正常push。日志 `/tmp/readme-raven-test-commit.log`、`/tmp/readme-raven-readme-commit.log`、`/tmp/readme-raven-push.log`。

## 发布回执

两项任务提交已正常push main，工作区干净且对齐远端。README发布SHA `cd7f16e7829429f14855cbc615324f32db51e407`，独立测试修复SHA `458d98f8133bb9dc2fc193b43f417c888dbdb5a2`。原pre-push的coverage/security/arch/lint全部通过，23.5秒。GitHub Contents回读双语README（8157 / 8848字节）及两项测试修复均与本地相同。CI运行34232519515已completed/success。

由于初始隔离 clone 仍有 3281 个 promisor-only 对象，已用 `git fetch --refetch --no-filter origin main` 补齐全部可达历史；当前缺失对象为 0，可用历史为 1361 个提交。随后原样重新运行 `bun run gate:security`，OSV 未发现漏洞、gitleaks 未发现泄漏，两项实际成功且无历史对象读取错误。日志 `/tmp/readme-raven-security-complete.log`。版本保持 2.7.0，未改源码或任何检查门槛。
