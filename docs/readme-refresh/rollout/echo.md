# Echo README 整理

- 仓库：`https://github.com/nocoo/echo`
- Checkout：`/Users/nocoo/workspace/personal/echo`
- 调查日期：2026-09-08
- 分支与基线：`main`，`b7373ec8e5d09a59847b3b9aa04f73526a019a41`
- 同步：工作区原本干净，ahead / behind 为 0 / 0；调查前 `git pull --ff-only` 返回 Already up to date。
- 状态：`published`；主代理 review 通过，已推送并回读中英文 README。GitHub CI 已通过。

## 调查依据

| 文件 | 核实事实 |
| --- | --- |
| `package.json`、`packages/ip-service/package.json`、`packages/collector/package.json` | Bun workspaces；根目录没有 dev、test 或 build，业务命令在包内 |
| `packages/ip-service/src/server.ts`、`src/utils/ip.ts`（均相对 ip-service 包） | IP API 字段、detail 模式、key 仅控制 query IP；无效 key 回退到请求 IP，读取 forwarded / real IP 头 |
| `packages/ip-service/src/services/ipLookup.ts`、`selectBest.ts`、`cache.ts` | 四个本地数据源、结果选择、ASN 补充、LRU |
| `packages/ip-service/src/services/providers/`、`scripts/ipdb-fetch.ts` | 数据库文件、上游来源、字段覆盖差异与署名 |
| `packages/collector/src/index.ts`、`wrangler.toml` | KV 收集、300 秒 TTL、返回 token/dns_servers/count，无 expires_in、无鉴权 |
| `packages/dns-probe/main.go`、`go.mod`、`docker-compose.yml` | UDP A 查询、固定域名、异步上报与 Go 工具链 |
| `packages/ip-service/tests/e2e/api.e2e.test.ts`、`global-setup.ts`、`scripts/vercel-builder-check.ts` | HTTP 测试真实启动 7010 服务并需要所有数据库；构建检查在临时目录安装 builder |
| `.github/workflows/ci.yml`、`.github/workflows/release.yml`、`packages/ip-service/vercel.json` | 主服务 Vercel，main 只 CI，tag / schedule / dispatch 才部署 |
| `swiftbar/echo.1m.js`、`LICENSE` | SwiftBar Node 18+ 与 iso2 字段漂移；MIT © 2026 Zheng Li |

站点由 `gh repo view nocoo/echo --json url,homepageUrl,defaultBranchRef` 的 homepage 与 release 工作流的检查 URL 双重确认：`https://echo.nocoo.cloud`。

## 旧文档漂移与修正

- 原根 README 为英文，命令和结构停留在 monorepo 迁移前；改为中文入口及完整英文镜像，所有命令定位实际包。
- 补充 DNS probe / Collector 已实现能力，去掉没有证据的亚毫秒性能保证。
- 指定 IP 查询并非无 key 返回 401；按当前源代码解释回退行为。
- 文档明确数据库字段可能缺失、Collector 观察边界、KV 延迟、没有 expires_in 字段。
- 保留现有 Logo。新增文档索引，标注早期 01–05 文档的旧目录与命令；未重写历史方案。
- 不修改版本、依赖、实现或 CLAUDE.md。

## 验证与限制

- 通过：`git diff --check`。
- 通过：临时 Python 静态检查三份文档的相对路径、图片、语言回链、尾部换行、空白及八节顺序。
- 通过：中英文 bash 示例移除注释后逐块一致；所有列出的包脚本均存在。
- 初次文档验证仅运行静态检查；发布阶段正常 hooks 自动执行必要测试并下载缺少的数据库，未访问生产写入接口或启动用户开发服务。
- 主代理修复原 `.husky/pre-push` 的失效根脚本，加入 `set -eu` 并将构建、单元及 HTTP 检查定位到 ip-service；保留根 lint 与 OSV。主代理完成语法和 stub 顺序 / 失败即停验证，授权独立提交。
- 原 SwiftBar 国旗读旧字段、Collector 无测试与无鉴权、DNS 结果判读范围均保留为当前限制。

## 发布

主代理已读完三份文档并核对 API、Collector、DNS probe 与所有证据后批准。

- 通过 `bun install --frozen-lockfile` 正常运行 prepare，确认 `core.hooksPath=.husky/_`，锁文件未改动。
- Hook 修复提交：`d4ddd32c545964a61b71bbeb64c9fe0b48305d50`。
- 文档提交：`1e0bc457cf9fb1b88b75565f3dc0e14875b958ef`。
- 两次 pre-commit 都正常执行类型检查、Biome、IP 服务单元覆盖率与 Gitleaks，并通过。
- 推送前再次 `git pull --ff-only`，确认 ahead 只有上述两次提交；未绕过 hooks 或 force push。
- pre-push 的 Vercel builder、单元测试、根 lint、真实 HTTP 测试与 OSV 全部通过。缺少的数据库由 HTTP suite setup 自动下载；HTTP 检查成功后推送 main。
- GitHub contents API 按文档提交回读根 / 英文 README，内容与本地逐字节一致；本地与远端 main 同步、工作区干净。
- [GitHub CI](https://github.com/nocoo/echo/actions/runs/34221365359) 已完成且成功：静态检查 / 单元 / 安全检查与真实 HTTP E2E 均通过；未配置的 Worker 与浏览器任务跳过。
- 此次无 tag、无版本变更；main 推送不会触发 Vercel 部署。
