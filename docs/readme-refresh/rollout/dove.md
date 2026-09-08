# Dove README 整理

- 仓库：`https://github.com/nocoo/dove`
- Checkout：`/Users/nocoo/workspace/personal/dove`
- 调查日期：2026-09-08
- 基线：`main`，`a010ab2daf92fd3cda45dee41a18132f444d1780`
- 同步：原工作区干净，ahead / behind 0 / 0；调查前 `git pull --ff-only` 返回 Already up to date。
- 状态：`published`；主代理 review 已批准，README 已推送并回读，CI 与自动部署均已成功。

## 源码依据

| 文件 | 核实事实 |
| --- | --- |
| `package.json`、`vite.config.ts`、`wrangler.toml`、`src/server/index.ts` | 单 Worker 的 Hono API + Vite / React SPA；静态输出 dist/client，D1 / EMAIL 绑定 |
| `wrangler.toml`、`src/server/routes/db-init.ts` | 默认 D1 remote=true 连生产；env.test 是本地 D1，初始化接口必须搭配该环境；CREATE IF NOT EXISTS 不升级旧表 |
| `src/server/middleware/auth-session.ts`、`src/server/env.ts` | Access JWT / JWKS、team domain 和 audience；localhost 开发身份；无 Google OAuth / KV sessions |
| `src/client/components/layout/sidebar.tsx`、`src/client/routes/projects/$id.tsx` | 真实导航、Token 与收件人模式开关，历史设计中称未实现的 UI 已存在 |
| `src/server/routes/webhook.ts`、`src/server/lib/email/rate-limit.ts`、`quota.ts` | 完整项目路径、Bearer、收件人模式、变量校验、配额、五分钟冷却、422 / 409 幂等响应 |
| `src/server/lib/email/provider.ts`、`src/lib/email/providers/resend.ts`、`cloudflare.ts` | 新旧配置分支；dry-run 仅被旧版 Resend 创建路径应用，Cloudflare 不支持 dry-run |
| `src/lib/email/render.ts`、`src/server/routes/templates.ts` | Markdown / 变量处理；Test Send 直接发送，不经过 Webhook 白名单、配额、地址锁、发送日志 |
| `src/server/routes/providers.ts`、`src/server/lib/db/email-providers.ts` | 服务商数据库配置、域名、API key 遮盖；health 是配置与历史统计，不做投递探测 |
| `scripts/setup-ci-env.ts`、`scripts/run-e2e.ts`、`playwright.config.ts`、`e2e/bdd/` | 占位 env 只在缺失时生成，HTTP / 浏览器本地 test 环境，17034 / 27034，建表与流程测试 |
| `vitest.config.ts`、`src/server/__tests__/isolated/` | 单元主体为服务端 / 共享库；test:webhook 运行 Webhook、模板试发、Access 三组隔离测试 |
| `.github/workflows/ci.yml`、`.github/workflows/release.yml` | main CI 成功后自动部署 Worker；tag / dispatch 也支持；不自动创建或迁移 D1 |
| `src/server/schema.sql`、`migrations/`、`LICENSE` | 当前 D1 结构、历史增量文件；MIT © 2026 Zheng Li |

`gh repo view nocoo/dove --json homepageUrl,licenseInfo,url` 返回空 homepage 和 MIT。站点 `https://dove.hexly.ai` 由 Wrangler custom domain 与 Release 健康检查双重确认。

## 文档纠正

- 保留 Logo，改成中文入口与完整英文镜像，站点链接置于语言切换之前。
- 修正旧 README 错误的 `/api/webhook/send` 路径，补充实际请求字段与幂等 / 限频响应。
- 首次运行加入 Vite build、占位配置和本地 D1 初始化；明确默认开发命令连生产，不能套用本地建表步骤。
- 不将 dry-run 写成全局发送保护：项目选择数据库 Provider 后，新 Resend 分支不会设置开关，Cloudflare 明确不支持。
- 补充管理界面、Provider、收件人模式、日志等已实现能力；发送成功只表明 provider 调用成功，不保证收件箱送达。
- 测试仅写基本命令与前提，不保留固定数量、门槛或 hook 制度；两套 E2E 共用本地 test D1，要求顺序执行。
- 新增 `docs/04-development.md` 与 `docs/README.md`，归档重写方案及限频设计明确标为历史；没有将 Queues、KV 或 Durable Objects 规划写成当前能力。
- 不改版本、依赖、实现、配置、CLAUDE 或原历史文档。

## 验证与限制

- 通过 `git diff --check`，四份文档相对链接 / 图片、换行、八节顺序、shell 语法、脚本引用，以及双语 bash 逐块对应。
- 将 `src/server/schema.sql` 与 `db-init.ts` 的原始 SCHEMA_SQL 分别在内存 SQLite 新库执行，再重复执行；当前字段、地址锁 token 与测试标记均正确。
- 从本机 Wrangler CLI 实现核实显式 `--env-file` 会选择指定文件并跳过默认 `.dev.vars`，未读取任何忽略的秘密文件。当前 Cloudflare 文档抓取此前返回 HTTP 403，未据旧 API 记忆改配置。
- 文档核实阶段未启动用户开发服务、执行实际 Wrangler 数据写入、访问生产数据库或发送真实邮件。主代理批准后，正常 hooks 已在本地 test D1 执行完整 HTTP 测试；发送用例返回 dry-run 消息 ID。
- 本地演练使用可丢弃的 test D1 和占位邮件配置，不代表 Access、Cloudflare Email Routing 或真实投递已验证。

## 发布

主代理逐项批准见 `dove.review.md`。

- `bun install --frozen-lockfile` 正常执行 Husky prepare，锁文件未修改；Vite build 通过。
- 仅检查 `.env.test` 的本地 URL、dry-run 标志与占位凭据特征，不输出秘密值；17034 / 27034 均空闲。
- 文档提交：`dc75e9604d15d1d6af7b7c6915271854b4d82428`，只包含四份已审文档。
- 正常 pre-commit 的类型、lint-staged、Gitleaks、路由 / 页面覆盖映射与单元覆盖率检查均通过。
- 再次 `git pull --ff-only`，确认 ahead 只有本次文档提交。正常 pre-push 的 OSV 与 HTTP E2E 均通过，Worker 明确绑定 local dove-db-test，测试初始化与 marker 验证成功；未使用默认远程 D1。
- 已推送 main，无 hook 绕过、无 force push。GitHub contents API 按该提交回读中英文 README，均与本地逐字节一致；工作区干净，本地与 origin/main 同步。
- [CI](https://github.com/nocoo/dove/actions/runs/34223410858) 与 [Release](https://github.com/nocoo/dove/actions/runs/34223484674) 均成功；Worker 和静态资源由 GitHub CD 自动部署。
- 构建 / 测试显示现有 Vite 配置格式、包体积、test 环境继承路由及缺少 EMAIL 绑定提示。检查均成功；未部署 test 环境、未改配置、未发送真实邮件。
- 未修改版本或创建标签。
