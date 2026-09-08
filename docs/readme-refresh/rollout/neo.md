# Neo README 调查与交付

## 同步基线

- 仓库：`https://github.com/nocoo/neo`；工作区 `/Users/nocoo/workspace/personal/neo`。
- 2026-09-08 调查前为干净、同步的 main；`git pull --ff-only` 返回 Already up to date。
- 调查提交：`4e7a2ab145d021addf932c7a154416e99a8bf451`。
- 已读 CLAUDE.md 的构建、index snapshot 和 Next 指令；本轮只修改文档，不改版本、代码或 CLAUDE.md。

## 代码证据与重要修正

| 结论 | 证据与含义 |
| --- | --- |
| 当前为 Next.js 16、TypeScript 7、Tailwind 4、Biome；dev/build 显式使用 Webpack | `package.json`、`next.config.ts`。删除旧 Next 15 / TS 5.7 / ESLint / Turbopack 说法。 |
| D1 变量已改为 CLOUDFLARE_*，无 .env.example | `lib/db/d1-client.ts`。旧 README 的 cp 命令不可执行，CF_* 变量也不被读取。 |
| 首次运行需手动建表 | `drizzle/*.sql`、`migrations/0001_add_backy_and_encryption_key.sql`、`lib/db/schema.ts`。迁移分散两个目录，README 列出当前完整顺序。 |
| TOTP 计算在浏览器，主界面拒绝为非 totp 条目生成验证码 | `viewmodels/useSecretsViewModel.ts#generateOtpForSecret`。保留导入器 HOTP 字段事实，不承诺完整 HOTP 交互。 |
| 业务 secret 为 Base32 明文，存储层没有调用 encryptData | `actions/secrets.ts`、`lib/db/scoped.ts`。旧“全部密钥加密存储/服务端完成”不实。 |
| AES-GCM 用于备份 ZIP，key 保存在 user_settings.encryption_key | `models/backup-archive.ts`、`models/encryption.ts`、`lib/db/scoped.ts`。明确操作方信任边界。 |
| 备份为下载/恢复与 Backy webhook；Worker 无 scheduled | `app/api/backup/archive/route.ts`、`app/api/backy/pull/route.ts`、`actions/backy.ts`、`worker/src/index.ts`。旧五分钟防抖/UTC 定时/保留100份已经不适用。 |
| PWA 提供 Serwist 缓存和 fallback，但 offline queue/sync helpers 未接入业务 | `app/sw.ts`、`lib/offline-queue.ts`、`lib/background-sync.ts`；全项目 import 搜索仅 helper 彼此引用，未被界面/动作导入。 |
| Tools 实际为导入解析、导出转换、TOTP 测试 | `viewmodels/useDevToolsViewModel.ts`。不沿用旧 README 的 QR 编解码、随机密钥等无当前 UI 证据功能。 |
| 加密第三方格式虽在 type union 中，parseImport 无对应分支 | `models/types.ts`、`models/import-parsers.ts#parseImport`。README 仅称受支持明文格式，不报固定格式总数。 |
| 回收站已实现 | `lib/db/scoped.ts`、`actions/secrets.ts`、`components/recycle-bin-view.tsx`。新增实际能力说明。 |
| Worker 模板残留 cron，实际没有 wrangler.toml | `worker/wrangler.toml.example`、`worker/src/index.ts`。README 提醒从模板准备配置时删除旧 cron，不改模板代码。 |
| 站点为 neo.hexly.ai | `.github/workflows/release.yml` 的部署 smoke 地址；本轮 GET 返回 200。 |

## 测试和验证

- 在临时内存 SQLite 按 README 顺序执行四个 SQL 成功，核对业务当前读取的 color、deleted_at、encryption_key 与 Backy 列全部存在。未对远程 D1 做任何写入。
- `test:unit` / `test:api` / `test:e2e` / `test:e2e:pw` / worker test 均按现存脚本记录。
- `tests/api/setup.ts` 的集成测试使用 MockScopedDB；真实 HTTP runner 使用 E2eScopedDB，不能描述为真实 D1 测试。
- Playwright 目前只有 `e2e/bdd/app.smoke.spec.ts` 登录页标题检查；删除旧“40 E2E”及完整浏览器流程表述。
- HTTP runner 固定端口 17026，并会清理占用进程；执行 hook 前先确认端口未被他人使用。浏览器自动启动 27026。
- Node.js 22.12+ 为当前 Next/Vite 工具链提供支持的环境；主应用与 worker 分别有 lockfile，README 明确安装二者依赖。
- 两份 README 各 132 行，相对链接、代码块、候选证据文件存在性与无 6DQ 检查通过，`git diff --check` 通过；正常 hooks 结果待发布后补记。

## Review 与发布

- 状态：ready_for_review。
- 重点请主代理复核：明文业务密钥与加密归档边界、TOTP-only 主界面、离线模块未接线、真实测试层与数据库首次初始化。
- 本轮只整理 README；发现的功能缺口、过时 Worker 模板及旧文档暂留调查记录，不扩大为产品代码修复。
- 等待主代理批准后 commit；推送前再次 pull，确认仅本任务提交，push main 并回读远端。

## 正常发布结果

主代理发布 `8d3c7feb7fb75facdf20f850d4aeba75ebedd34b`，根与 Worker frozen install 均通过。正常 pre-commit 使用仓库已有 docs-only 分支；没有手动跳过。pre-push 运行 34 项 HTTP 测试，数据经过 `lib/auth-context.ts` 进入本地 `E2eScopedDB`，不使用真实 D1；OSV 与 Gitleaks 通过。确认 17026 空闲后才启动；Next.js 增加的 `.next-e2e` tsconfig 路径已在确认无其他变动后恢复。再次 pull 后只有 README 提交，push 成功，远端双语字节一致，工作区干净。CI <https://github.com/nocoo/neo/actions/runs/34222938853> 成功，自动部署 <https://github.com/nocoo/neo/actions/runs/34223050844> 仍在运行。
