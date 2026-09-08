# Noheir README 整理

- 仓库：`https://github.com/nocoo/noheir`
- Checkout：`/Users/nocoo/workspace/personal/noheir`
- 调查日期：2026-09-08
- 基线：`main`，`68d20b352d8873865f39d2da89e2d086fcb5e03d`
- 同步：原工作区干净，ahead / behind 0 / 0；调查前 `git pull --ff-only` 返回 Already up to date。
- 状态：`published`；主代理 review 已批准，README 已推送并回读，CI 已通过，站点自动部署已成功。

## 源码依据

| 文件 | 核实事实 |
| --- | --- |
| `package.json`、`worker/package.json`、`worker/wrangler.toml` | Next.js + 独立 Hono Worker / D1；独立依赖安装，7004 / 37004 开发端口 |
| `src/auth.ts`、`src/proxy.ts`、`.env.example` | Google OAuth、邮箱白名单、登录同步用户；环境模板默认生产 Worker |
| `src/lib/navigation.ts`、`src/domain/dashboard/`、`src/domain/assets/` | 当前收支、账户、资金配置及已开启的资金计划导航 |
| `src/app/import/transaction-import.tsx`、`transfer-import.tsx`、`src/app/actions/import-actions.ts` | 指定中文 CSV 表头、单年份文件，确认后替换对应用户该年份 / 类型流水 |
| `src/app/actions/data-actions.ts`、`src/app/manage/manage-client.tsx`、`worker/src/index.ts` | JSON 导出覆盖五组数据，恢复只处理收支 / 转账并先删除用户全部年份流水；导出缺少投入日志 / 周期支出 |
| `src/app/ai-insight/page.tsx`、`src/lib/recurring-payment-detector.ts`、`src/app/ai-settings/ai-settings-client.tsx` | 洞察调用本地规则检测；设置页保存参数，不在洞察请求链调用模型 |
| `src/app/api/mcp/route.ts`、`src/lib/mcp/server.ts`、`src/lib/mcp/tools/` | MCP 现位于 Next.js，Streamable HTTP、POST JSON、OAuth token，查询与产品 / 单元 CRUD |
| `src/app/mcp-tokens/mcp-tokens-client.tsx` | 当前站点 /api/mcp 与各客户端配置模板 |
| `scripts/run-e2e.ts`、`playwright.config.ts`、`e2e/bdd/navigation.spec.ts`、Vitest 配置 | HTTP 使用独立 local D1 与 Bun test；浏览器仅公开条款页 smoke |
| `.github/workflows/ci.yml`、`.github/workflows/release.yml`、`Dockerfile` | green main CI 自动部署 Docker 站点，Worker 不随此流程更新 |

`gh repo view nocoo/noheir --json url,homepageUrl,licenseInfo` 确认站点 `https://noheir.hexly.ai` 与 licenseInfo=null；Git 跟踪文件无 LICENSE / COPYING，两个 manifest 均无 license 声明。

## 文档纠正

- 去除旧 Vite / `src/pages` / Supabase / 根 `mcp/` 架构，改写为实际 Next.js、独立 Worker 与 D1。
- 给出两处依赖安装、local D1 迁移、共享 token、OAuth 回调与白名单，明确 `.env.example` 生产连接默认值。
- 加入当前 MCP HTTP 配置、资金计划日历、CSV 覆盖范围、JSON 不完整恢复范围。
- “AI 洞察”只描述当前规则计算，不将设置页面的文案当成已实现的模型调用。
- 测试仅保留基本命令与前提；浏览器冒烟范围明确，不写固定测试数量 / 门槛。
- 保留 Logo；新建完整英文 README 与文档索引，历史迁移文档集中标注。
- 不修改版本、依赖、实现、配置或 CLAUDE.md。

## 验证与限制

- 通过：`git diff --check`、八节顺序、中英文 bash 示例对应、相对文件 / 图片 / 语言链接、所有使用的 package scripts 引用。
- 通过：安装的 Wrangler v4.129.0 的 `d1 migrations apply --help` 确认 `<database> --local` 语法；源码 manifest 固定 v4.129.1，后续正常安装仍遵守 frozen lock。
- 当前 Cloudflare 文档只读抓取返回 HTTP 403，语法核实改用本机实际 CLI help 与仓库 E2E 的同款迁移命令。未改任何 Wrangler 配置。
- 初次文档核实阶段未执行 OAuth 登录、数据库迁移 / 写入、开发服务器或重型测试；发布阶段正常 hooks 已运行本地 HTTP 测试及其数据库初始化，见下文。
- 本地开发需要使用者自己的 Google OAuth；未声称无需凭据即可进入应用。

## 发布

主代理逐项批准见 `noheir.review.md`。

- 根目录和 Worker 分别执行 `bun install --frozen-lockfile`，锁文件未改动；根目录另执行 `bun run prepare`，保持正常 `.husky/_` hooks。
- 文档提交：`b7b64d05c067d36a1186ec0468664f9dc8633ab4`；只包含根 README、完整英文 README 与文档索引。
- 正常 pre-commit 的单元覆盖率、Biome 和 TypeScript 检查均通过。
- 推送前再次 `git pull --ff-only`，确认 ahead 只有此次文档提交。正常 pre-push 的单元覆盖率、Biome、OSV、Gitleaks 和本地 HTTP E2E 均通过；未跳过 hooks 或 force push。
- GitHub contents API 按该提交回读中英文 README，均与本地逐字节一致；工作区干净，main 与 origin/main 同步。
- [CI](https://github.com/nocoo/noheir/actions/runs/34222399639) 已成功。
- [Release](https://github.com/nocoo/noheir/actions/runs/34222519466) 已成功部署 Docker / VPS 站点；独立 Worker 不由此流程部署。
- 未修改版本、创建标签或运行手动生产操作。
