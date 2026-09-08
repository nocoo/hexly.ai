# Giraffe 调查与整理

状态：root 已批准并正常推送，三文档远端回读一致；CI 与自动 Release 均已成功。

## 仓库与范围

- 调查日期：2026-09-08。
- 仓库：`https://github.com/nocoo/giraffe`。
- 只使用 root 指定的独立副本 `/Users/nocoo/workspace/personal/.readme-refresh-20260908/giraffe`；原 `/Users/nocoo/workspace/personal/giraffe` 未触碰。
- 调查前再次 `git pull --ff-only`，main 干净且同步。基线 `d772268203e31098f7efa40a032afee2efa91916`。
- 版本为 `0.4.0`，本轮不修改。范围限定 `README.md`、`docs/README.en.md`、`docs/README.md`。
- 阅读了仓库 CLAUDE、既有 README、编号设计文档、实际 client/server 实现、manifest、配置和测试 runner。旧 CLAUDE 的阶段 1 与“人类文档不放 README”等历史规约不代表当前实现；本轮按用户明确授权整理双语，不修改现有 CLAUDE。

## 产品目标与当前能力

Giraffe 是个人 GitHub 控制台，使用一个或多个 classic PAT 获取仓库、开放 Issue / PR、GitHub 安全告警、通知，并展示按日变化。React / Basalt SPA 已实现，不再是旧文档里的待开发阶段。

- `src/server/routes/accounts.ts`：同 GitHub login 的令牌更新采用 upsert；新增首个账号设为 active，后续账号需切换。只有一个 active 账号，删除 active 不会自动选择另一个。
- `src/client/viewmodels/accounts.ts`：首个账号创建与账号激活后会刷新仓库；删除造成无当前账号时不刷新。
- `src/server/lib/github-map.ts`：classic PAT 必须包含 `repo`、`read:org`、`read:user`、`notifications` 四个 scope。
- `src/server/lib/token-crypto.ts`：只接受当前 classic PAT 的 `ghp_` 形式；不接受 fine-grained PAT。AES-256-GCM 信封保存版本、IV、密文和认证标签。
- `src/client/routes/settings.tsx`：提交处理一开始就清空 token state；成功与失败都不会保留输入框值。不是在 finally 中清空，finally 仅恢复 phase。
- `src/client/routes/repo-detail.tsx`：details / security / actions / prs / issues / releases / traffic / languages / contributors 共九个页签，缺快照时自动尝试一次刷新。
- `src/server/lib/collect.ts`：REST 与 GraphQL，仓库关联含 owner、collaborator 和 organization member；跨仓 Issue / PR 汇总只含 open。
- `src/server/lib/insights.ts`：按最近 push、open issues 与安全告警生成规则分类，没有 AI 推断或独立代码扫描。
- `src/server/lib/digest.ts`：按 UTC 日历日比较仓库 Stars、Forks、open Issue counts；昨天基线缺失时 delta=null，不伪造为 0。`src/client/viewmodels/digest.ts` 负责 Markdown 文本。
- 数据接口保留截断 / 不可用 / 权限不足状态，不声称返回所有仓库、全部告警或完整 GitHub 视图。

## 旧信息修正与数据边界

| 旧说明或容易误读的地方 | 当前代码证据与修订 |
| --- | --- |
| “拉取 GitHub 数据，加密后写入 D1 快照” | 只有 PAT 使用应用层 AES-GCM；schema 的 snapshots / snapshot_days payload 是 JSON TEXT。README 明确二者范围，不对 D1 底层存储加密作推断。 |
| “通知只读快照” | 通知已读接口会对 GitHub PATCH thread / PUT notifications，然后更新 D1；不能把应用整体称为只读。 |
| 监控台可能被理解为自动持续刷新 | 没有 Cron；GET 读取快照，POST refresh、首账号 / 切账号以及单仓缺快照加载时才采集。 |
| 多账号可能被理解为多租户隔离 | Access 只控制进入同一部署的身份；accounts 表未按 Access 用户分区，同一部署的获准访问者共享账号和快照。 |
| “输入完成后清空” | 确认为提交开始即清空。 |
| “加密密钥启动时自动随机生成” | 当前 dev.vars.example 中的公开 64 hex 样例格式有效，ensure-dev-vars 会原样复制，不会替换成随机密钥。README 明确要求真实 PAT 使用前自行生成并替换。 |
| 本地直接打开 localhost7045 即可完整操作 | Vite HMR 固定 giraffe.dev.hexly.ai wss443，changeOrigin 代理到37045，写入还校验 Origin。README 提供与当前配置相符的 HTTPS 域名入口。 |
| 旧 CLAUDE 中的 dev:server 端口 | 实际 dev:server 占7045，dev 的 API sidecar 才是37045；公共 README 只列完整 dev 入口。 |

`src/server/lib/author-profile.ts` 会把 trim/lower 后邮箱的 SHA-256 摘要发给 `https://lizheng.blog/api/authors/profile` 查询姓名与头像，失败回退。摘要查询不是“没有第三方数据请求”，README 如实说明。

## 开发与部署核实

- `package.json`：Bun 脚本，React 19 / Basalt / Hono / D1 / Vite；无 package engines。CI 指定 Bun 1.4.0，安装后的 Vite engines 为 `^20.19.0 || >=22.12.0`；文稿建议 Bun 1.4 与 Node 22.12+。
- `bun install --frozen-lockfile` 已成功，251 packages；正常 prepare 安装 Husky。manifest 与 lockfile 未变。
- `scripts/ensure-dev-vars.ts` 仅在 `.dev.vars` 不存在时准备文件；已有文件不覆盖。公开样例 key 格式有效，因此不自动改 key。没有创建本机真实 `.dev.vars`，没有录入 PAT。
- `scripts/dev.ts` 初始化本地 schema 后启动 Vite7045、Wrangler `--local --port 37045`；默认 persist `.wrangler/state`，不会自动迁移远程 D1。
- `vite.config.ts`：HMR host giraffe.dev.hexly.ai，HTTPS443；`/api` 转到127.0.0.1:37045，changeOrigin=true。本地须准备 DNS 与受信 HTTPS 反代到7045，本轮未改本机代理设置。
- `dev.vars.example` 的默认 `GITHUB_API_BASE` 指向真实 GitHub；文稿明确该默认值，未把正常开发冒充为假数据模式。
- `bun run build` 仅运行 Vite，输出 dist/client；类型检查必须单独运行 typecheck。
- Worker assets 由 `run_worker_first=[/api,/api/*]` 区分。API 中间件验证身份，但静态文件的入口保护依赖 Cloudflare Access 整域应用，不能声称每个静态资源由 Worker 检查 JWT。
- `/api/live` 为公开健康元数据；正式业务 API 受 Access。默认 team / audience 来自 access-config.ts，非空 env 可覆盖；生产 Origin 白名单仍硬编码 giraffe.hexly.ai，自托管必须同步调整。
- `wrangler.toml` 声明 Worker giraffe、D1 giraffe-db 和 custom domain，workers_dev 与 preview_urls 都为 false。公网匿名 HEAD 返回302到 nocoo Access 登录；没有尝试真实 SSO。
- 自托管文稿仅概述 D1、keys、整域 Access 和域名 / origin 一致性，并链接现有 Server 设计与配置。本轮未部署或修改 Cloudflare 资源。

## 测试入口与验证范围

公共 README 只列现有单元、coverage、HTTP 与 browser 运行方法和前提，不移入质量制度、覆盖率门槛或 hooks 说明。

| 入口 | 核实结果 |
| --- | --- |
| `bun run test` / `test:coverage` | Vitest，server 与 client viewmodels 有单元测试；薄壳 routes/layout 有现有 exclusions。 |
| `bun run test:e2e:api` | runner 自动准备隔离 config/env、`.wrangler/e2e/`、local D1 schema 和 marker；Worker17045、GitHub stub17046、JWKS17047。A 使用开发认证，B 使用临时 RS256 JWT / JWKS。 |
| `bun run test:e2e:bdd` | 先 Vite build，再启动隔离 `.wrangler/e2e-pw/`；Worker27045、GitHub stub27046，Playwright Chromium；开发认证分支，不验证真实 SSO。 |
| 依赖前提 | 不需要真实 PAT、.dev.vars 或远程测试资源；browser 需安装 Playwright Chromium。 |
| 正常 hooks | pre-commit 含 typecheck / lint / 四个现有 gate / coverage；pre-push API 与 security 并行。保留全部现有规则。 |

已执行：frozen install、生产 build、双语相对链接 / 图片 / fence / package script 检查、`git diff --check`。build 通过，现有 >500 kB chunk warning 保留；尚未在本候选阶段重复运行完整 hooks / browser，等待 root review 后进行正常发布检查。

日志：

- `/tmp/readme-refresh-20260908-apps-giraffe-install.log`
- `/tmp/readme-refresh-20260908-apps-giraffe-build.log`

## 候选与后续计划

1. 中文根 README 与完整英文 docs/README.en.md 各115行，保留原品牌图，顶部站点在语言链接之前。
2. docs/README.md 增加双语入口；原编号文档和品牌文件保留。
3. `giraffe.json` 记录 goal、九项主要技术及代码证据；只提供候选，不编辑本站正式 JSON。
4. root 全文 / 源码 review 后，保留修订，正常提交；push 前再次 pull，完成现有 hooks，再推 main。
5. 发布后回读三文档字节、记录 exact SHA，跟踪现有 CI / Release，不改版本、不手动发版。

## 发布回执

- root 全文 / 源码批准，三份文稿无额外改动；正常提交 `deb25d07c634c5122629346ddbc8741fde17e9e9`。
- pre-commit typecheck、lint、四个现有 gate 与 coverage 全部通过；50文件 /173单元测试通过，现有95%门槛未动。
- Playwright Chromium 已准备；`bun run test:e2e:bdd` 完整现有浏览器流程通过（1测试，设置 / PAT / 仓库列表 / 详情），脚本正常关闭隔离服务。
- push 前再次 pull，正常 pre-push 中 HTTP A/B 两组通过（2文件 /2套端到端流程），gitleaks 与 gate:security 通过；main 推送成功。
- GitHub 同 SHA 的 README.md、docs/README.en.md、docs/README.md 已逐字节回读一致。main 干净且与 origin/main 同步；原 checkout 未动，版本0.4.0未变。
- API17045/17046/17047、browser27045/27046 均已释放。
- CI34232364966 已启动；后续自动 Release 结果继续回填。
- 日志 `/tmp/readme-refresh-20260908-apps-giraffe-{commit,browser-install,browser,push}.log`。

最终 CI / 发布结果：CI34232364966 的 L1/G1/G2、API E2E 与 browser E2E 全部 success；现有自动 Release34232475587 success。所有分配工作已完成并有准确回执。
