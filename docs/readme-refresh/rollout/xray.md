# Xray README 调查与交付

## 同步基线

- 仓库：`https://github.com/nocoo/xray`
- 工作区：`/Users/nocoo/workspace/personal/xray`
- 2026-09-08 调查前工作区干净，main 与 origin/main 同步；执行 `git pull --ff-only`，结果 Already up to date。
- 调查提交：`f0864583697a734b7279087b9a1de8d3a1a18bff`。
- 已读 `CLAUDE.md`；其中 v1 的回顾与版本发布指令不作为当前产品行为依据。本轮按用户要求不改版本、不改 CLAUDE.md。

## 已核实的产品范围

| 结论 | 当前代码证据 |
| --- | --- |
| 按关注列表阅读 X 与 custom 内容，管理成员标签、备注、来源过滤 | `packages/worker/src/index.ts`、`packages/worker/src/routes/watchlists.ts`、`packages/ui/src/views/watchlist-detail-page.tsx` |
| Groups 可导入带 username 的文本并复制成员到 watchlist | `packages/worker/src/routes/groups.ts`、`packages/shared/src/twitter-export.ts` |
| 推送采集为主要入口，独立 ingest 域名使用 Bearer token | `packages/worker/src/middleware/access-auth.ts`、`packages/worker/src/routes/ingest-graph.ts`、`packages/worker/src/routes/ingest-push.ts` |
| 根据来源 ID 去重，有接收窗口和 ingest 记录 | `packages/worker/src/routes/ingest-push.ts`、`packages/worker/src/repos/items.ts` |
| AI 是兼容 Chat Completions 的用户配置服务，翻译可追加摘要 | `packages/worker/src/lib/ai-client.ts`、`packages/worker/src/repos/translate.ts` |
| zhe.to webhook 保存时间线链接 | `packages/worker/src/routes/zheto.ts`、`packages/ui/src/lib/zheto-save.ts` |
| X 抓取在本地执行，默认分散于 60 分钟，依赖 twitter-cli 和 Python 进程锁 | `scripts/refresh-watchlists.ts`、`packages/shared/src/twitter-cli-source.ts`、`packages/shared/src/producer-schedule.ts` |
| 当前 UI/API 栈为 React + Vite + Hono + Workers + D1 | 根及 workspace `package.json`、`packages/worker/wrangler.toml` |

## 修正的旧说明和边界

- 原 README 仅介绍 v2 重写、包目录、开发与版本发布，缺少用户功能和内容如何进入系统；改为已实现能力与实际流程。
- 不延续 CLAUDE.md 中已归档的 NextAuth、vinext、SQLite/Railway 作为当前栈；旧代码明确位于 `legacy/v1/`。
- 自定义来源具有协议和阅读界面，但仓库内置生产者仅覆盖 X；README 不声称已有通用抓取器或 Workers Cron。
- 明确 `--dry-run` 仍读取实时 graph，不将其写成完全离线。
- 增补 Python 3 进程锁前置条件；仅 twitter-cli 与 Bun 不足以完成真实完整运行。
- 保留既有品牌图 `assets/brand/icon-rounded.png`，英文相对路径改为 `../assets/...`。
- `packages/worker/wrangler.toml` 配置 `xray.hexly.ai`；2026-09-08 无鉴权 HEAD 返回 302 到 Cloudflare Access，符合受限站点描述。
- 搜索根目录及当前包未发现 LICENSE / COPYING，package.json 也未声明许可证；README 明确未提供 LICENSE。

## 命令和验证

- `bun run build:shared`：成功，Turborepo 缓存命中；未将其记录为完整重新构建。
- `bun run refresh:watchlists -- --help`：成功，核对参数与默认 60 分钟调度。未读取本机生产 token 或触发采集。
- 本机 Bun 版本为 1.4.0，仓库 packageManager 为 1.3.14；README 保留仓库要求。
- HTTP 集成入口 `packages/worker/package.json#test:e2e` 已读；`global-setup.ts` 拒绝远程 CF 环境变量，使用端口 18787 和 `.wrangler/state-l2`。
- Playwright 不自动启动服务；`e2e/helpers.ts` 默认使用 UI 7007 / Worker 37007。README 要求先启动 dev；测试创建本地数据。
- 两份 README 各 127 行，相对链接、代码块、候选证据文件存在性与无 6DQ 检查通过，`git diff --check` 通过；正常 commit/push hooks 的结果在发布后补记。
- 本轮不调用生产者、不配置外部服务、不触发手动部署；README 的集成能力以代码和既有测试为证据，不声称本机已完成生产端到端验证。

## Review 与发布

- 状态：ready_for_review。
- 待主代理复核：两份 README、候选 `xray.json`、公开站点和各层测试前置条件。
- 主代理批准后再提交 README，pull 后确认仅本任务提交并 push main。本站 metadata 仅在 README 已发布后合入。

## 正常发布结果

主代理完成发布：`c20488dc68be9646aea832e44b257d994a933b8b`。frozen install 启用 Husky；pre-commit 的 Biome / workspace 类型检查 / 覆盖率 / staged Gitleaks 均通过。pre-push 通过 17 项本地 HTTP 测试、42 路由覆盖检查、全仓 Gitleaks 与 OSV。发布前再次 pull 返回 Already up to date，只有这一份 README 提交。GitHub Contents API 回读中英文 README 与批准内容逐字节一致，工作区干净且 main 同步。CI：<https://github.com/nocoo/xray/actions/runs/34222664148>，发布时仍在运行。
