# Ellie README 整理

- 仓库：`https://github.com/nocoo/ellie`
- Checkout：`/Users/nocoo/workspace/personal/ellie`
- 调查日期：2026-09-08
- 基线：`main`，`5b59a96419ca72d6a3b27fe004f08d79fec2728c`
- 同步：原工作区干净，ahead / behind 0 / 0；调查前 `git pull --ff-only` 返回 Already up to date。
- 状态：已发布 `7271e3187fa9f9fc305c2e58647d2de4a50516f9`；CI 与 Docker Release 均成功。

## 源码依据

| 文件 | 核实事实 |
| --- | --- |
| `package.json`、各 app manifest、`scripts/run-tests.sh` | Bun workspaces，独立论坛 / 后台 / Worker；当前脚本与 Node / Bun 前提 |
| `apps/worker/src/index.ts`、`lib/env.ts`、`wrangler.toml` | 原生 fetch 路由，D1 / KV / R2 与定时任务；未把 root Hono 依赖当作 Worker 框架 |
| `apps/web/src/auth.ts`、`apps/admin/src/auth.ts`、`apps/admin/src/lib/admin.ts` | 论坛 Credentials、后台 Google + ADMIN_EMAILS；两套会话配置 |
| `apps/worker/src/middleware/apiKey.ts`、`auth.ts`、`handlers/thread.ts`、`handlers/post.ts` | 双 Key 分工，用户 JWT，发帖 / 回复真实挂接邮箱验证 |
| `apps/web/src/app/(auth)/login/login-form.tsx`、`register/register-form.tsx`、`components/cap-widget.tsx` | 网页 Cap 控件，缺端点阻止提交；Credentials 回调本身不验证 Cap token |
| `apps/worker/src/handlers/email.ts`、`lib/dove.ts`、三份 `.example` | 邮件验证前提，真实环境文件位置，Worker secrets 根文件 / symlink，论坛与后台匹配 Key |
| `apps/worker/src/handlers/search.ts`、前端论坛与后台路由 | 标题 FTS5 搜索，讨论 / 社区 / 管理功能入口 |
| `packages/cli-rs/Cargo.toml`、`ellie-tui/src/{main,app,events,actions}.rs` | Rust 1.88，TUI 浏览 / 本地列表筛选 / 登录；无发帖回复动作 |
| `packages/cli-rs/ellie-core/src/config.rs`、`scripts/tui.ts` | 实际 JSON / camelCase 配置与平台目录，参数 / 环境优先级；tui 脚本要求已存在 release 二进制 |
| `packages/migrate/src/{index,cli}.ts`、`load/batch-insert.ts` | Discuz dump → 本地 SQLite，源目录 / 输出参数；不自动上传所有附件或切换生产 |
| `scripts/run-l2.ts`、`scripts/lib/local-d1.ts`、`local-worker.ts` | 真实 HTTP runner 自行重建本地 D1、seed、启动 Worker；17031 及动态空闲端口 |
| `scripts/run-l3.ts`、`run-l3-admin.ts`、`scripts/lib/l3-local-worker.ts` | 本地 L3 Worker 8788，共享 .wrangler/state/l3，论坛 27031 / 后台 7032，必须顺序运行 |
| `tests/e2e/fixtures/base.ts`、`tests/e2e/admin/fixtures/admin-base.ts`、`tests/e2e/bdd/auth.spec.ts` | 论坛测试直调 Credentials 回调，后台注入签名会话；真实 Cap 场景跳过，不验证 Google OAuth |
| `.github/workflows/ci.yml`、`.github/workflows/release.yml`、`LICENSE` | main green CI 部署两个 Docker 站点，Worker 独立 migrate / deploy；MIT |

GitHub homepage 为空。当前 Release 工作流的外部检查与 summary 明确指向论坛 `https://bbs.tongji.net` 和后台 `https://admin.tongji.net`。旧 CLAUDE / Docker 文档中的 ellie.hexly.ai 域名只作为历史例子标注，不据其覆盖当前工作流。

## 文档纠正

- 按已批准模板改为八节中文入口与完整英文镜像，保留现有 Logo，删除固定测试数。
- 完整说明论坛 / 后台登录与两把 API Key，给出实际三份 env 模板路径和 `.dev.vars` 符号链接。
- 加入本地 D1 迁移与独立开发状态目录；使用 `apps/worker/node_modules/.bin/wrangler`，避免根目录没有 Wrangler binary 时 bunx 临时取用其他版本。
- 根 README 的「Rust TUI 发帖 / 回复」改为实际浏览、筛选和登录。包内旧 README 的 TOML 配置没有沿用；新指南给出真实 JSON、平台路径和优先级。
- 搜索范围限定主题标题；Cap 只描述实际网页行为，没有宣称它保护所有 API。
- 当前主要 L2 / L3 runner 均使用本地资源，取代旧文档远程测试 Worker 步骤；明确后台测试实际使用开发端口 7032、论坛 / 后台 L3 共用状态目录。
- 新增 `docs/25-development.md`，更新 docs index 并保留旧设计入口，标注过时状态 / 域名 / 配置的局限。
- 不修改版本、业务实现、配置、依赖、CLAUDE 或旧 package README。

## 验证与限制

- 通过 `git diff --check`、四份文档的相对链接、图片、尾部换行、八节顺序、shell 语法、脚本引用、完整双语命令对应。
- 为验证新开发命令，在临时目录复制原 `apps/worker/wrangler.toml` 与迁移，使用该包已安装 Wrangler 执行 `d1 migrations apply DB --local --persist-to .wrangler/state/dev -c apps/worker/wrangler.toml`。30 份迁移全部成功；临时目录已清理，没有改仓库现有环境或 D1 状态。
- 确认根 `node_modules/.bin/wrangler` 不存在，Worker 包 binary 存在；README 定位后者，与本仓库测试 runner 相同。
- 未启动开发服务、运行真实 Cap / Google OAuth / 邮件验证、执行原始社区数据迁移或访问生产写入接口。
- 发布时已执行正常 hooks 中的覆盖率、Bun 单测和本地 HTTP 测试；Rust 外部 API 集成测试因没有专用配置，由既有 hook 按条件跳过。

## 发布

主代理已通过 `ellie.review.md` 批准。正常 pre-commit / pre-push 均通过；再次 pull 后只推送本任务文档提交 `7271e3187fa9f9fc305c2e58647d2de4a50516f9`，没有修改版本或跳过 hook。

GitHub contents API 已按发布提交逐字节比对中英文 README，均一致；工作区干净且 main 与 origin/main 对齐。CI [34224755255](https://github.com/nocoo/ellie/actions/runs/34224755255) 已成功；自动 Docker Release [34225174210](https://github.com/nocoo/ellie/actions/runs/34225174210) 已成功，论坛与后台均通过工作流 smoke checks。

发布检查包含依赖冻结安装、覆盖率检查、Bun 单测、本地 HTTP Worker、类型 / lint、Gitleaks 与 JS / Rust OSV。Rust 外部集成配置未设置，正常 hook 因而不运行外部 API 测试；未使用生产 API 或修改用户开发服务。
