# Wooly README 整理

- 仓库：`https://github.com/nocoo/wooly`
- Checkout：`/Users/nocoo/workspace/personal/wooly`
- 调查日期：2026-09-08
- 基线：`main`，`611b99cc868dc3e90ff5b20f54785d0d858d10ed`
- 同步：原工作区干净，ahead / behind 0 / 0；调查前安全 pull，Already up to date。
- 状态：`published`；主代理 review 已批准，README 已推送并回读，CI 已通过，站点自动部署已成功。

## 代码与配置依据

| 文件 | 核实事实 |
| --- | --- |
| `package.json`、`worker/package.json`、`Dockerfile` | Next.js / React，独立 Worker 包，Bun，Docker standalone |
| `src/models/types.ts`、`cycle.ts`、`benefit.ts`、`points.ts`、`dashboard.ts` | 权益种类、周期、核销、积分可兑换比较与页面提醒 |
| `src/viewmodels/usePointsDetailViewModel.ts`、`useSettingsViewModel.ts` | 积分余额手动更新、兑换项目管理与家庭成员设置 |
| `src/auth.ts`、`src/proxy.ts` | Google OAuth 与邮箱白名单；家庭成员不与登录用户分区 |
| `src/hooks/use-dataset-context.tsx`、`src/services/worker-client.ts` | 延迟整份快照同步、无并发合并；Worker key 留在服务端 |
| `worker/src/index.ts`、`routes/dataset.ts`、`db/operations.ts` | 原生 fetch Worker、数据校验、共享 dataset 全量 D1 batch 替换 |
| `.env.example`、`worker/.dev.vars.example`、`worker/wrangler.toml.example`、`scripts/dev.sh` | 默认生产 Worker；本地需要显式填写匹配 key；脚本只补不存在的变量，wait -n 要求 Bash 4.3+ |
| `tests/api/data-route.test.ts`、`worker/test/create-d1-miniflare.ts`、`e2e/bdd/app.spec.ts` | API handler + mocked fetch，Miniflare local D1，浏览器仅登录页 smoke |
| `.github/workflows/ci.yml`、`.github/workflows/release.yml`、`LICENSE` | main CI 成功后部署站点，Worker 单独部署；实际为 MIT |

GitHub homepage 为空，站点链接来自 `.github/workflows/release.yml` 的外部检查与 summary：`https://wooly.hexly.ai`。没有猜测域名。

## 纠正

- 原 README 缺少 Worker、D1、迁移、共享 key 与默认生产连接，现给出完整本地初始化；新增 `docs/08-development.md` 说明持久化与部署入口。
- 原 “Private” 改为实际 LICENSE 的 MIT；保留同一 Logo，完整中文 / 英文八节对应。
- 去掉保证式到期提醒，明确提醒仅在应用内，积分兑换由使用者操作。
- 明确共享家庭数据与整份快照保存范围；不声称账号隔离或实时协作。
- 维护说明仍称浏览器 CI 未开启，但实际 workflow 已启用；README 按当前 Playwright / CI 写登录页 smoke，不复制旧测试数量或门槛。
- 当前 dev 脚本不会填充已有空 key，README 明确要求用户填写；未修改脚本实现。

## 验证

- 通过 `git diff --check`，四份文档全部相对路径、图片、语言回链、八节顺序与空白检查。
- 中英文 bash 示例去注释后逐块一致；列出的所有根 / Worker scripts 均存在。
- 为验证首次本地初始化，在独立临时目录原样复制 `worker/wrangler.toml.example` 和迁移，使用已安装 Wrangler 4.127.1 执行 `d1 migrations apply DB --local`。两份迁移均成功，证明占位 D1 名称 / ID 可用于纯本地状态。临时目录已清理，未接触仓库现有 `.env.local` / `.dev.vars` / `.wrangler` 或生产资源。
- 未启动用户开发服务器、未使用 mock 开发模式、未执行生产写入。正常提交 / 推送 hooks 已按批准执行，见下文。
- 未修改版本、依赖、配置、实现或 CLAUDE.md。

## 发布

主代理批准见 `wooly.review.md`。

- 根目录和 Worker 各执行 `bun install --frozen-lockfile`，根 prepare 正常运行 Husky；锁文件未改动。
- 文档提交：`76320dfee79e59ca9e14a02d944c1e933f0199c7`，仅四份已审文档。
- 正常 pre-commit 的单元覆盖率、Worker / API 测试、类型检查、lint-staged、Gitleaks 及源码规则检查均通过。
- 再次 `git pull --ff-only`，确认 ahead 只有本次提交，然后正常 push main；无跳过 hook、无 force push。
- pre-push 的 Next 构建、单元 / Worker / API 测试、Worker 类型检查、完整 lint / 源码规则和两份锁文件 OSV 均通过。
- GitHub contents API 按该提交回读双语 README，均与本地逐字节一致；工作区干净，main 与 origin/main 同步。
- [CI](https://github.com/nocoo/wooly/actions/runs/34222922047) 已成功；[Release](https://github.com/nocoo/wooly/actions/runs/34223039997) 已成功部署 Docker / VPS 站点，独立 Worker 不由该流程部署。
- 构建仅出现项目已有 metadataBase 缺失提示，构建成功。版本、依赖、业务实现与配置均未修改。
