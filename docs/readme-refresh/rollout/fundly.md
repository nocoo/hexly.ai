# Fundly 调查与交付

- 工作区 `/Users/nocoo/workspace/personal/fundly`；调查前 clean main，git pull --ff-only 成功。
- 基线 `6de762074e00011009f7604bbeeb7c0b04923c00`；状态 published。
- 已读 CLAUDE.md、README、docs 索引 / 脚本 / 认证 / 部署资料、采集入口、指标实现、Web 导航、当前 Bun / Hono API。

## 实现与旧说明的差异

| 结论 | 证据 |
| --- | --- |
| 4433 与多因子评分已经实现，不是纯路线图 | `src/metrics/screen-4433.ts`、`select-score.ts`、API fund-query 与筛选页面 |
| 基金六类比较、ETF 与股票筛选和详情已存在 | `apps/web/src/lib/navigation.ts`、`apps/web/src/App.tsx`、`apps/worker/src/lib/selection-service.ts` |
| 定投指标已实现，通用策略回测引擎与交易仍不在当前范围 | metric / select 页面及实际路由，没有交易/通用回测端点 |
| 当前 Web 是 Vite + Bun/Hono + 本机 SQLite，生产是 Railway Volume | `apps/worker/scripts/{app,serve}.ts`、`Dockerfile`、`railway.toml` |
| 名为 apps/worker 的目录仍保留旧 D1 / Access 代码，但当前入口不使用它 | `serve.ts` → `app.ts`，根脚本不再 deploy:web / import:d1 |
| 行情 API 只读已落库数据，不触发网络采集 | `app.ts#openReadonlySqlite`、`withMarketSnapshot`、market / selection services |
| 备份 API 不全是只读：设置、备份、恢复可写数据 | `app.ts` 中 backy 的 POST / PUT 与 restore 路由 |
| Google 登录本机也必需；缺配置时 protected API 503 | `auth-config.ts`、`auth-routes.ts#requireSession` |
| 空 ALLOWED_EMAILS 放行全部完成 Google 登录的账号 | `auth-config.ts#isEmailAllowed` |
| 采集与数据深度分离，可显式 watch；网页启动不自动采集 | `fetch-macro.ts`、`fetch-selection.ts`、`dev-all.ts`、`serve.ts` |
| refresh:select 包含全池增量采集，再依次计算排名/风险/选基指标 | `scripts/refresh-select.ts` |

## README 处理

保留现有 Web logo.svg，统一中英文模板和顶部站点 / 英文链接，docs 索引补两种语言入口。英语文件遵循用户指定 docs/README.en.md，优先于本地“新文档必须编号”的一般约定；不修改 CLAUDE.md。

删去历史实采规模、耗时、测试数量与覆盖率阈值，避免把本机样本当作持续服务覆盖承诺。说明基金/ETF/股票目录、价格历史和财报各有独立覆盖，缺失值保留，部署代码不自动上传本地数据库。保留来源引用、GoFundBot / AKShare 致谢、MIT 与研究定位。

## 验证与边界

- 两种语言各 139 行，路径/链接/代码块/路由/脚本及 git diff --check 通过，LICENSE 为 MIT © 2026 Zheng Li。
- GitHub homepage 与 https://fundly.hexly.ai 一致，公开首页 HTTP 200，没有登录私人站点或读取数据库内容。
- 按现有要求运行 bun run test:coverage：91 文件 / 514 用例通过，0 失败；当前覆盖率仍低于历史目标，不修断言或阈值。测试使用自有临时数据库，宏观/产品 API 通过 Hono app.request 调用，没有启动生产数据采集。
- bun run lint 退出 0，272 文件检查；tests/risk-metrics.test.ts:171 的既有非空断言 warning 保留。没有使用会改业务源码的 lint:fix，也没有格式化或提交无关文件。
- 当前没有安装 .husky / 自定义 core.hooksPath，.git/hooks 只有样例。提交/推送照常，不注入跳过参数。没有额外测试代码。
- 未运行 fetch、db:init、backup、restore、dev:all 或任何部署操作；没有使用上游 API Key。仅检查 .env.example 名称，实际 .env 未输出，git 未跟踪它。
- 原应用版本仍为 0.6.0。

## 发布

等待 root 的 fundly.review.md；批准后三份文档正常提交、pull、核对当前任务提交，再 push main，回读 README 与可用 CI / 自动部署状态。本站正式项目 JSON 由 root 合并。

## 发布结果

root 批准后保留其中文简介与目标修订，正常提交三份文档。再次 pull 成功，已推送 `3f33f558f2e770762c55d7fa921adfc3ee779eb3`；三份文档远端字节匹配，main 干净并与 origin/main 同步。CI [34228696032](https://github.com/nocoo/fundly/actions/runs/34228696032) success。版本 0.6.0 未变；无真实数据采集、备份恢复或部署操作。
