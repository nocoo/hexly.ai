# Steed README 调查与改写记录

## 基线与选择依据

2026-09-08 在干净的 `main` 上执行 `git pull --ff-only`，结果无需更新。调查基线为 [`bcab1f113b9b7cde65898bbd23705c7dac339634`](https://github.com/nocoo/steed/tree/bcab1f113b9b7cde65898bbd23705c7dac339634)。适用维护说明来自 Steed 的 `CLAUDE.md`，编辑路径未发现 `AGENTS.md`。

原 README 共 40 行，只有品牌头部、一句话定位、安装依赖和文档链接，缺少已经实现的功能、首次使用、本地启动和测试说明。Rooster 虽然只有 29 行，但已有安装和开发命令；Steed 在较短文档中缺少的关键入口更多，因此作为第二个试点。全部比较见 [49 个项目清单](inventory.md)。

本仓库改写中文 `README.md`、新增对应的 `docs/README.en.md`，新增编号文档 `docs/08-readme-refresh.md` 并更新文档索引。版本、运行代码、依赖、锁文件、部署配置和 `CLAUDE.md` 保持原有内容。

## 当前实现与证据

以下路径均相对 Steed 仓库，并对应上述调查提交。初筛中的 manifest 快照、测试脚本及同步记录保留在 [m-z.json](surveys/m-z.json) 的 Steed 条目。

| 主题 | 已核实情况 | 主要代码 / 配置 |
| --- | --- | --- |
| 项目目标 | 汇总多台主机上的 Agent、工具资源和绑定关系，核对状态、归属和业务分类 | `apps/web/src/router.tsx`、`packages/shared/src/` |
| Web 页面 | Overview、Hosts、Agents、Data Sources、Map；支持详情、编辑及关系筛选 | `apps/web/src/router.tsx`、`apps/web/src/routes/`、`apps/web/src/viewmodels/` |
| 当前前端 | React 19、React Router 7、Vite 8、Tailwind CSS 4、Radix UI，关系图使用 React Flow | `apps/web/package.json`、`apps/web/vite.config.ts` |
| 完整服务入口 | Web Worker 提供静态资源；`/api/v1/*` 在进程内调用 Hono；`/api/*` 经 Access 校验后进入浏览器 API | `apps/web/worker/index.ts`、`apps/web/worker/access-jwt.ts` |
| API 分层 | `packages/api` 包含类型化浏览器客户端与服务端处理函数；`packages/worker` 包含 Hono 路由与 D1 数据访问 | `packages/api/src/server/router.ts`、`packages/api/src/server/api-router.ts`、`packages/worker/src/index.ts` |
| 数据库 | D1，迁移为 `0001` 至 `0004`；Web 与 API Worker 配置使用相同数据库标识 | `packages/worker/migrations/`、两处 `wrangler.toml` |
| 生产部署 | 主分支 CI 成功后构建 `apps/web` 并发布其 `production` 环境；域名 `steed.hexly.ai` | `.github/workflows/release.yml`、`apps/web/wrangler.toml` |
| 浏览器访问 | Cloudflare Access；本地 `dev` 环境仅对 loopback / localhost 允许开发模式 | `apps/web/worker/access-jwt.ts`、`apps/web/wrangler.toml` |
| CLI | TypeScript / Bun / Commander；支持初始化、显式注册、扫描、上报、状态查看及前台 Host Service | `packages/cli/package.json`、`packages/cli/src/bin/steed.ts`、`packages/cli/src/commands/` |
| 初始化 | `init --url ... --key ...` 验证 Host API key 并保存配置；注册主机需要管理员调用 `/api/v1/hosts/register` | `packages/cli/src/commands/init.ts`、`packages/worker/src/routes/hosts.ts` |
| Agent 检测 | 先显式注册，再按配置中的进程、文件或自定义命令检测；不是任意发现所有 Agent | `packages/cli/src/commands/register.ts`、`packages/cli/src/service/scanner/agent.ts` |
| 工具扫描 | 当前扫描配置中的 CLI 工具；默认 Wrangler、Railway、GitHub CLI、Vercel CLI | `packages/cli/src/config/defaults.ts`、`packages/cli/src/service/scanner/data-source.ts` |
| 鉴权观察值 | 部分工具只判断配置文件是否存在；该结果不能保证远端凭据有效 | `packages/cli/src/config/defaults.ts`、`packages/cli/src/service/scanner/data-source.ts` |
| 未实现范围 | 配置已有 `mcp_scanners`，扫描实现尚未提供 | `packages/cli/src/config/schema.ts`、`packages/cli/src/service/scanner/index.ts` |
| 关系与分类 | Agent 与数据源绑定必须属于同一主机；绑定手动建立。Agent 单分类，数据源可多分类，预设 Work / Life / Learning | `packages/worker/src/routes/bindings.ts`、`packages/worker/src/routes/agents.ts`、`packages/worker/src/routes/data-sources.ts`、迁移文件 |
| 状态更新 | Host Service 默认每 600000 ms 发送快照，`service start` 前台运行 | `packages/cli/src/service/scheduler.ts`、`packages/cli/src/commands/service.ts`、`packages/cli/src/config/schema.ts` |
| 本地文件 | `~/.steed/config.json` 保存连接与检测配置；`~/.steed/state.json` 保存扫描与服务状态 | `packages/cli/src/config/index.ts`、`packages/cli/src/service/state.ts` |
| 单元与组件测试 | Vitest 覆盖 shared / worker / cli / api / web；Web 使用 jsdom + React Testing Library | 根 `vitest.config.ts`、`apps/web/vitest.config.ts`、各包 manifest |
| HTTP 测试 | 独立的本地 D1 状态目录，启动底层 API Worker，使用端口 8787；并非浏览器测试 | `scripts/run-e2e.ts` |
| 许可证 | MIT，版权信息来自实际文件 | `LICENSE` |

## 文档差异与改写决策

1. 旧架构文档与 `CLAUDE.md` 中的 Next.js / Railway / Google OAuth 描述落后于当前入口。实际 Next.js 代码已保留在 `apps/web_legacy`，当前构建和部署采用 Vite + Workers / D1 / Access。此次按代码写 README，维护说明留待后续整理。
2. 根 `bun run dev:worker` 只启动底层 API Worker，不能处理完整控制台需要的浏览器 API。README 明确从 `apps/web` 启动 Worker，并先构建其 `dist` 静态资源。
3. SQL 迁移在 `packages/worker`，Web Worker 的本地状态在 `apps/web/.wrangler/state/web`。README 为迁移指定相同的 `--persist-to`，避免创建了另一份数据库后仍遇到缺表。
4. CLI `login` 仍调用 `/api/auth/cli`，当前 `packages/api/src/server/router.ts` 未提供此流程。文档采用已有 Host API key 的初始化方式，不将旧流程写成当前可用入口。
5. 以主机、Agent、数据源、关系图和快照解释实际能力，保留手动绑定、周期状态、CLI 扫描和 Access 身份等使用条件。没有将项目描述为远程执行、自动推断关系或完整 MCP 资产发现工具。
6. README 测试段只说明单元 / 组件、HTTP 测试及其命令与前置条件。没有编造浏览器测试，也没有把覆盖率、hooks 或 6DQ 制度放进正文。
7. 两种语言沿用 [统一模板](template.md)，头部均保留已采用的 Logo，站点位于语言链接之前。英文版的图片、文档、manifest 和 LICENSE 相对路径均按 `docs/` 深度调整。

## 本地验证

环境：Bun 1.4.0、Node.js 26.7.0，使用已安装的锁定依赖。README 推荐 Node.js 22.12+，依据当前 Vite 引擎要求与 Wrangler 的 Node 22 要求。

| 验证 | 结果 / 范围 |
| --- | --- |
| `bun run typecheck` | 通过 |
| `bun run lint` | 通过，无警告 |
| `bun run build` | 通过；Vite 保留现有的大 chunk 提示，该提示不属于本轮文档改动 |
| `bun run test` | 98 个文件、1009 项单元与组件测试通过；生成覆盖率报告 |
| 覆盖率观察值 | statements 97.07%、branches 90.07%、functions 96.35%、lines 97.33%；仅在调查记录保留当次结果 |
| `bun run test:e2e` | 59 项真实 HTTP 测试通过；仅使用本地 API Worker 和独立 D1 状态 |
| CLI `--help` | 通过；未执行真实扫描、登录或启动 Host Service，未写入使用者的主目录配置 |
| 从空数据库启动 Web Worker | 在新建临时目录应用全部迁移，用同一状态启动 `apps/web` 的 `dev` Worker，端口 19035 / inspector 19036。首页、`/api/live`、`/api/hosts`、`/api/lanes`、`/api/v1/health` 均返回 200，预设分类可读。结束后关闭自有进程并删除临时状态 |
| 双语链接、章节和示例 | 两份各 155 行、8 个对应章节、12 处本地引用；链接全有效，可执行示例一致，代码块成对，无质量规约混入 |
| 浏览器完整业务流程 | 仓库无现成浏览器测试；此次未用真实身份进入生产控制台操作 |

上述本地启动验证使用公开的开发模式与临时 token，没有生产 D1 读写或远端数据修改。Wrangler 当前命令说明核对自 `developers.cloudflare.com/workers/wrangler/commands/`。

## 本站资料

`src/data/projects/steed.json` 新增可选 `overview`：中英文目标、九个技术 badge 的名称与双语用途，以及调查日期、源提交和证据路径。原有视觉来源提交继续对应 Logo 字节，另用 `overview.verified.revision` 表达功能核实基线。

目标：集中盘点多台主机上的 Agent、CLI 工具资源与绑定关系，帮助使用者核对运行状态、资源归属和业务分类。

主要技术：TypeScript、Bun、React、Vite、React Flow、Hono、Cloudflare Workers、D1、Cloudflare Access。前端辅助库和测试工具保留在 README 的技术表中，不将所有依赖都塞进页面 badges。

## 交付检查点

- [x] 同步并记录代码基线。
- [x] 对照当前代码和旧文档，确定第二个试点。
- [x] 写中文 README、对应英文版及仓库内编号文档。
- [x] 验证构建、静态检查、单元 / 组件、真实 HTTP 和空数据库启动。
- [x] 在本站添加目标、技术栈与证据字段。
- [x] 完成双语链接与页面复核。
- [x] 正常执行提交 / 推送 hooks，再次 pull 并推送 main：`107256b7104a067133029f7f4b5a60a86efd717b`。提交检查含覆盖率门槛并通过；推送检查含 59 项 HTTP、OSV 和 Gitleaks 并通过。
- [ ] 记录远端提交、CI 和部署结果。

最终提交及发布结果统一记录在 [交付验证记录](validation.md)。其他项目仍等待首批确认。
