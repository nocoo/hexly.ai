# Rooster README 调查与交付

## 状态与同步

- 日期：2026-09-08；checkout：`/Users/nocoo/workspace/personal/rooster`。
- 初始 main 干净，无 ahead；`git pull --ff-only` 成功，基线 `8907933c080ed86c6cbe15d9af5cdb0be86919d3`。
- 当前中文根 README 和 `docs/README.en.md` 已完成，待主代理 review，尚未提交/push。
- 未发现适用的 AGENTS / CLAUDE；遵循当前仓库实际脚本和模板，不改版本、实现或 hooks。

## 核实的实现

| 项目 | 代码依据 |
| --- | --- |
| Preact / Signals / Primer / Vite 界面 | `packages/client/package.json`、`src/state/chat.ts`、`components/` |
| Node / Hono / Socket.IO 服务与 SQLite 存储 | `packages/server/package.json`、`src/server.ts`、`src/services/hermes/db.ts` |
| 流式对话、中断、审批、澄清、压缩事件 | `src/services/hermes/chat-run/socket.ts` 和客户端 `src/state/chat.ts` |
| 会话搜索、重命名、删除、JSON/Markdown 导出 | `packages/server/src/routes/sessions.ts` |
| 附件上传 | `packages/server/src/routes/upload.ts`、attachment store、bridge-run attachments |
| bridge 通过 Unix socket/TCP 传 JSON 行 | `packages/server/src/services/hermes/agent-bridge.ts` |
| 真实 bridge 不在仓库中，外部 Hermes/Python 必需 | `scripts/start-bridge.sh` 的路径解析与参数 |
| Profiles/Models 只读，取值来自已有 bridge sessions | `packages/server/src/routes/bridge.ts`、客户端对应 admin 页面 |
| 其余管理页面只有尚待接入说明 | `packages/client/src/pages/admin/{Skills,Plugins,Memory,Files,Logs,Jobs,Settings}.tsx` |
| 服务默认 loopback、无内建鉴权 | `packages/server/src/index.ts` |
| 构建后 API 服务不托管静态 frontend | `packages/server/src/app.ts` 与 `server.ts` |

## README 调整

- 原文短且英文，缺少可复现的 bridge/Python 先决条件；改为匹配试点结构的完整中英文。
- 不把“manage the connected agent”扩写成已完成管理功能，明确目前只读与未接入页面的边界。
- 明确服务端口 7038、前端 7037、开发代理固定目标、数据目录按服务进程 cwd 计算。
- 从本次目标出发说明本地面板用途，而非重复历史 clean-room 或体积营销描述。
- 测试只给真实入口和条件；6DQ、hooks 与门槛没有移入 README。

## 站点、品牌、许可证

- GitHub 元数据 homepage=null；`rooster.dev.hexly.ai` 只见于本地 Vite allowed hosts，不作为站点链接。
- 既有 `assets/brand/icon-rounded.png` 保留。
- 仓库 LICENSE 实际为 Apache License 2.0。

## 验证

- `bun install --frozen-lockfile` 与 `bun run rebuild:native` 成功，无锁文件变化。
- `bun run test` 通过：68 文件、685 测试。
- `bun run test:e2e` 通过：6 文件、99 测试；临时端口、内存 SQLite、模拟 bridge。
- `bash scripts/test-bridge-lifecycle.sh` 通过：13 断言；临时 Unix socket/dry-run，不操作真实 Hermes。
- 两份 README 各 11 个本地引用存在；所有 bash 代码块一致。
- 没有运行真实 Hermes 对话或付费模型；此轮验证不触碰个人会话与凭据。

## Review 与发布

待主代理审阅。批准后按原 hooks 提交、重新 pull、确认 ahead 范围并 push main；记录 SHA、回读和 CI。

## 发布回执（2026-09-08）

主代理书面 review 批准后，正常 pre-commit 通过 lint、typecheck、685 项 Vitest coverage 测试与测试数据隔离检查。提交为 `9c9ab565554b75de86e3346fa66f4bca3725a83b`。发布前再次 `git pull --ff-only` 成功，仅该任务提交 ahead。正常 pre-push 通过 99 项 HTTP / Socket E2E、完整路由与方法覆盖、OSV 和 gitleaks，已 push main。GitHub Contents API 回读中英文 README，与本地字节一致。CI：<https://github.com/nocoo/rooster/actions/runs/34222213836>，首次检查仍在运行。

CI 后续回读：运行 `34222213836` 已 completed / success。工作区干净，main 与 origin/main 一致。
