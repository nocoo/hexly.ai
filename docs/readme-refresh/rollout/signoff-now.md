# signoff.now 调查与交付候选

调查日期：2026-09-08。Apps 工作线接手 Services，原库 `/Users/nocoo/workspace/personal/signoff.now`；本站 id 为 `signoff-now`。

## 基线与范围

- 调查前再次 `git pull --ff-only`：Already up to date。main 干净且同步，基线 `51b679fba85d1a0cc81641e41f377ad77f867dd0`。
- 已读根 CLAUDE、原 README、docs 索引与相关产品 / 管线 / 上线文档。未找到额外 AGENTS、嵌套维护说明或 `docs/10-development.md`。
- 仅改中文 README、完整英文 docs/README.en.md 和必要 docs/README.md 索引。CLAUDE、版本、功能、数据库和运行配置不改。
- 根与主要 workspace 版本 0.0.1，辅助 gitinfo / pulse 为 0.1.0；MIT LICENSE（2026 Zheng Li）。均为 private workspace，不声称可以从 npm 安装主应用。
- 没有 `.env`、`.env.local`、`.dev.vars`、`.data` 或 `.wrangler`，进程也无 SIGNOFF_* / CF_ACCESS_* 变量；仅核对存在性，没有读取私人配置或业务 payload。
- 站点由 wrangler 两条 custom domain 路由与本站 JSON 确认。`https://signoff.hexly.ai` 匿名 HEAD 返回403，本轮没有生产 Access 会话验证，不能宣称公开可访问或生产业务完整验收。

## 旧文档与当前实现的差异

| 旧信息 / 容易误判之处 | 当前证据与写法 |
| --- | --- |
| collect main 的注释与 help 仍写 05 skeleton | `run-collect.ts`、`ado/collect.ts` 与 `ingest-normalized.ts` 已实现真实 ADO 采集、落盘和写入。README 按代码说明；不为文稿顺便改源码。 |
| docs 索引把07写为实施中、08写为待 review | Dashboard / stats、实体 CRUD、活动查询都有实现；索引改为主题，不把历史验收状态当成现在的产品状态。 |
| Electron / AI Code Review / Story / Wisdom | 属于归档设计；当前产品是 Bun CLI + React SPA + Hono Worker + D1。 |
| 将 pulse 的 GitHub 能力当成主产品 provider | 当前 runCollect 明确仅筛 `provider === ado`；pulse 是独立 GitHub 辅助工具，不能据此宣称主采集管线支持 GitHub。 |
| “只读平台” | Web 可管理人员、团队、标签、仓库与 Settings；只读的是 Activity / Score，数据由管线写入。 |
| “首批实体必须由人创建” | `access-principal.ts` 已支持 Service Token 的 common_name；Access Service Auth 身份也可 CRUD。pipeline token 仍不能访问这些接口。 |
| “Basalt” 作为包依赖 | Web 源于 Basalt 模板，实际是项目内 UI + Radix / Tailwind；没有 @nocoo/basalt 依赖。README 如实列当前技术，候选无 Basalt badge。 |
| 原本地开发命令省略前置 web build | Wrangler assets 指向 apps/web/dist；新安装步骤先 build:web，再通过workspace Wrangler本地迁移和指定local-upstream的Worker；Vite另终端启动。 |
| 将 fixture runner 当成自动隔离端到端测试 | 脚本会改默认本地 D1 / .data，不启动 Worker，而且硬编码配置版本1。README 标明新鲜默认数据库、独立副本和外部 Worker 前提。 |
| 用旧文档中的固定 D1 SQL 上限解释套餐 | 仅保留当前项目的 Workers Paid 部署约定，不复制可能过期的平台具体额度。 |

## 产品与代码证据

1. `apps/web/src/App.tsx` 挂载 Dashboard、Developers、Teams、Tags、Repos、Settings 与 Activity。页面可管理实体，归档 / 恢复均已有对应接口。
2. `DashboardPage.tsx`、`useDashboardViewModel.ts` 与 `models/stats.ts` 实现7/28/92天选择、补零日趋势、活动类型分布、开发者积分列表；`routes/stats.ts` 从折叠后的 scores 与原始 activities 分别取数，不用原始条数乘权重冒充积分。
3. `ActivityPage.tsx` 接收逗号分隔开发者 ID 和日期范围，展示按日热度表格、多开发者总分对比，以及单人分页时间线。不称它为高级筛选器或完整 GitHub 风格日历。
4. `constants.ts` / `score.ts` 支持 pr.merged / closed / created / vote / active 与 wi.created / updated / closed。按开发者与配置时区的 dayKey 分组；同日作者 PR 事件按 merged > closed > created > active 取一类，同日同工作项更新折叠一次。权重是确定规则；不能单独表征代码质量或个人产出。
5. `identity.ts` 以 alias@suffix 匹配 ADO uniqueName，大小写无关。transform 对无邮箱身份、容器和无法确定时间的事件有显式跳过 / 异常路径；未建档真人身份记录为 unmatched。
6. `ado/client.ts` 通过 Azure CLI 的 account get-access-token 获取 ADO token，REST 固定 api-version7.1；有429/5xx重试和请求超时。当前 collector 无 azure-devops extension 依赖，不需为它编造 PAT 设置。
7. `ado/collect.ts` 按仓库采集 PR、线程与迭代，按项目采集工作项与更新，并保留raw与normalized文件。active PR 总是全量；since只收窄其余相关窗口，首次大仓耗时不能作固定保证。
8. `run-collect.ts` 读取现有 bootstrap，拒绝无启用ADO仓或缺项目GUID的绑定；不自动枚举组织全部开发者，不自动创建 roster。
9. `ingest-normalized.ts` 校验 artifact 摘要与条数，逐chunk检查服务器回包；manifest先写、scope完整后才推进游标。全量清 stale 前还与当前启用repo / project scope集合比对，不能漏掉期间新增绑定。
10. `collect-flags.ts` 明确拒绝 full+repo / full+no-wi。README 先介绍初次建档的全量流程，再介绍日常增量，避免读者第一次建档后始终保持 stale。

## 本地开发与认证边界

- Bun monorepo + Turborepo。CI / packageManager固定Bun1.3.6；本机Bun1.4.0 / Node26.7.0。Vite安装包 engines为 ^20.19.0 || >=22.12.0，README使用Node22.12+作为开发准备。
- Vite7042，/api代理127.0.0.1:37042（changeOrigin）；localhost和受信代理域signoff.dev.hexly.ai均有配置支持。HMR没有强制固定生产域。
- `build:web` 包含前端 tsc 和 Vite；assets SPA目录apps/web/dist。原有 `dev:all` 同时启动本地Worker和Vite，但未指定local-upstream会受生产routes Host推导影响；最终文稿改用下文实测的分终端命令，D1明确local。原仓库安装和构建未产生版本或lockfile修改。
- `entry-control.ts` 的机器域名判断是首个DNS label精确等于signoff-ingest；允许bootstrap、ingest、recompute/complete、live、me，其余机器入口路由403。
- Web域名走Cloudflare Access，机器域名走pipeline token；Access身份不能调用pipeline，pipeline token不能CRUD。浏览器静态入口须由整域Access应用保护，不能宣称每个静态文件都由Worker JWT校验。
- Access的AUD和team domain缺任一项，受保护API返回500。机器read token可单独配置，默认沿用write token；read token不能写。live与me的例外随入口不同，README没有称me全局公开。
- localhost / loopback / *.dev.hexly.ai走开发认证分支。本地CLI自动省去生产token；.env.example默认生产机器URL，所以文稿不把复制它当作本地启动步骤。
- Service Token需要Access Application中的Service Auth策略，客户端headers与Worker secrets各自有位置。`principalFromPayload`通过common_name识别服务身份，并向me暴露service:true。
- wrangler保留workers_dev=true，只有CI，没有Release / 自动部署workflow。不创建tag、不本机部署、不远端migrate。

## 验证进度

| 命令 / 核对 | 结果 |
| --- | --- |
| frozen install | 原仓库成功；现有lock未改，正常prepare安装Husky。 |
| signoff / collect / ingest normalized / doctor 的 --help | 全通过，确认Bun参数转发；未执行真实doctor、Azure身份读取、采集或配置展示。 |
| bun run build:web --force | 前端类型检查与Vite实际构建通过，0项缓存命中。 |
| bun run --cwd apps/gitinfo test:integration | 现有3项Git子进程测试通过。 |
| 文稿静态校验 | 中文171行、英文173行；三文档相对路径和图片均存在，fence平衡，git diff --check通过。 |
| bash scripts/e2e-06-local.sh | 在全新 `/tmp/readme-refresh-signoff-now-e2e-nsdypell` 中经诊断后完整通过；使用锁定Wrangler和local-upstream，详见下文。 |
| 正常提交与推送检查 | root书面review后执行原hooks；不关闭检查、不改覆盖率或版本。 |

fixture副本从本次基线新clone，独立安装、构建并启动Worker37042。原脚本仅写该副本的本地D1和固定虚构fixture，不执行远端seed、远端迁移或真实ADO请求。测试结束后关闭所启动的Worker并核对端口释放。

发布检查使用既有pre-commit（coverage、lint-staged、typecheck）与pre-push（osv-scanner、gitleaks）。现有测试组合为Bun test和Vitest，没有Playwright/browser脚本。正常hooks与CI的结果另行如实回填，不把初步构建通过当成全部检查成功。

日志：`/tmp/readme-refresh-20260908-apps-signoff-now-{build,integration,e2e}.log`。临时测试副本元数据保存在同前缀 `e2e-checkout.json`。

## 候选与后续计划

1. 已写双语README，保留既有icon-rounded品牌图，居中头部先站点后语言链接；英文图片 / 文档 / LICENSE 路径均改为相对docs的位置。
2. 原README重要运维内容保留：双域与认证、Service Auth设置、初次全量、scope和artifact进度、单写者、重放恢复。保留中文 `运维手册` 锚点供CLAUDE与docs08引用。
3. docs/README.md更新为主题索引，并加入双语入口。未改历史设计稿和阶段验收记录。
4. `signoff-now.json` 提供双语目标、九项主要技术与调查基线；由rootreview后合并正式本站JSON。
5. root书面批准后正常暂存三文档、完整hooks、commit，再pull并push main，回读三份文档字节并跟踪CI。无Release工作流，不等待或创建不存在的发版路径。

## fixture 首次失败与继续诊断

- 全新副本的原命令 `bun run dev:worker` 启动后，原 fixture 脚本完成10份local migrations和虚构实体seed，但bootstrap返回500：Access authentication not configured。
- 直接向127.0.0.1发送不同Host（localhost / dev域 / 机器域）均得到同一Access配置错误。Wrangler `--help` 明确说明 local-upstream 默认采用 dev.host 或 route；本库存在生产custom domains，所以Worker实际看到的Host被改写成生产入口。
- 原root脚本调用全局Wrangler4.126.0，isolated安装没有root node_modules/.bin/wrangler；workspace的锁定Wrangler为4.111.0。这也是新环境需要说明的真实运行前提。
- 正在用现有 `--local-upstream localhost` 参数恢复预期本地Host，并核对workspace锁定Wrangler路径。没有关闭应用认证、改测试或改配置；待实测后将最小正确启动方法写回README。

## fixture 与启动命令最终验证

- 使用 `bun run --cwd packages/worker dev --local-upstream localhost` 后，锁定Wrangler4.111.0启动，bootstrap立即200且配置版本1。该参数仅使本地开发Host与既有isLocalhost判断一致；生产认证、源码、wrangler配置均未改。
- 运行原脚本 `PATH="$PWD/packages/worker/node_modules/.bin:$PATH" bash scripts/e2e-06-local.sh`，完整通过bootstrap、ingest、heatmap total10、pr.merged timeline；所有原断言保留。
- 文稿的初始化改用 `bun run --cwd packages/worker wrangler d1 migrations apply signoff-db --config ../../wrangler.toml --local`，实测退出0。此路径从workspace解析已锁定CLI，不依赖新环境有全局Wrangler。
- 另终端 `bun run dev` 启动Vite7042，网页、/api/live、/api/stats/summary、/api/activity/heatmap均200；透过代理得到虚构fixture积分10。未启动浏览器套件，也无此现成suite。
- README更新为中文171行、英文173行；保留root修订的精确折叠对象、完整team domain和shell-safe示例。各相对路径、图片、fence及diff whitespace再检查通过。
- 两个自启动服务均已关闭。原仓库仍没有.data/.wrangler；临时副本留下仅本轮虚构测试数据与日志供复核。
- 失败与成功分别保留 `/tmp/readme-refresh-20260908-apps-signoff-now-e2e.log`、`...-e2e-retry.log`，没有用成功记录掩盖首次真实发现的问题。

补充预检：`bun run test:coverage` 退出0（7项Turbo任务均命中已有成功缓存，准确记录为缓存结果）；`bun run typecheck` 退出0，根tsc与各workspace检查完成。保留原正常commit hooks，未执行commit或push。日志同前缀coverage.log与typecheck.log。

## 发布回执

- root已完成最终diff / 字节复核并书面批准；三文档正常提交 `1d658480fe8e4fdd527fae437b7c8747537d86ef`。
- pre-commit正常执行：coverage与workspace typecheck均复用7项成功Turbo缓存，根tsc通过；Markdown不匹配lint-staged的源码规则，因此该步骤正常报告无匹配文件。
- 提交后再次 `git pull --ff-only` 成功；正常pre-push的osv-scanner与gitleaks均通过，随后main推送成功。
- 三文档已通过GitHub Contents API在该完整SHA逐字节回读一致；根与英文README摘要与root批准快照一致，索引摘要为e22b289673873639bfa554f6df153d63dc458532091b5494253ad80e5fa6a201。
- 原工作区main干净、origin/main与HEAD一致；未创建或改写原库.data/.wrangler，7042和37042已释放。版本、源码、CLAUDE和配置均未修改。
- CI34236025103正在运行，后续继续回填；此库没有Release工作流，没有手工部署或发布。

最终结果：CI [34236025103](https://github.com/nocoo/signoff.now/actions/runs/34236025103) 已success；启用的quality job包含新安装、typecheck、lint、单元/coverage、gitleaks与OSV，均通过。可复用workflow的可选API / browser /独立Worker jobs未由本库启用，按原配置skipped；本轮本地管线fixture另有完整成功实测。没有Release workflow。signoff.now调查、双语文稿、候选、正常发布与远端回读已完成。
