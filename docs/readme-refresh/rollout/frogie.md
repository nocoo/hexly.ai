# Frogie 调查与实施记录

2026-09-08。调查基线 `79e16babfb6067dcd90ad59b900fa76ad282f35c`。使用 `/Users/nocoo/workspace/personal/.readme-refresh-20260908/frogie` 的干净 main，深入阅读前再次 pull，已同步。原 `/personal/frogie` 分叉 checkout 保持原样。本轮只改三份 README，不改 0.1.1 版本、产品逻辑、测试或 hooks。

## 当前目标与读者

面向个人开发者的本地 Web 编程助手。在浏览器内组织已有项目目录、多工作区会话、流式模型回复与工具调用，配置 stdio MCP 和工作区提示词。Bun 进程直接执行本机文件与 Shell 操作。它仍是早期应用，需要按源码说明启动和访问边界；不能沿用旧 README 的 SDK、工具数量和全传输承诺。

## 已核实差异

| 旧介绍 / 设计 | 代码现状 | README 决定 |
| --- | --- | --- |
| 基于 open-agent-sdk | manifest 无该包；`engine/frogie-agent.ts` 自行封装 Anthropic SDK 的 `messages.stream` | 明确 Anthropic SDK 与自定义工具循环 |
| 30+ 内置工具 | `builtin-tools.ts` 只有 read_file / write_file / list_files / run_command / search_files | 列出实际五项，不硬编码测试数量 |
| 原生多提供商 Claude / GPT / Gemini | 模型名称按字符串分组，查询始终走 Anthropic messages / models；无 OpenAI 或 Gemini adapter | 其他模型需要兼容或转换协议的上游 |
| MCP 支持 stdio / SSE / HTTP | schema 与 WS 转换接受三类，但 `mcp/client.ts` 对 SSE / HTTP 直接 throw not implemented | 只宣称 stdio；说明类型声明不等于实现 |
| 用户工作区是安全隔离边界 | run_command 用 sh -c 并继承进程权限；路径辅助函数允许相对路径穿越 / prefix 不等于 sandbox | 明确自动执行与无可靠沙箱，限制访问范围 |
| Google 登录保护所有接口 | `authMiddleware` 只解析 cookie 并设置 user，`requireAuth` 未挂载；`/ws` 在 Hono 前升级，无 auth / origin 拦截 | 清楚说明业务 API / WS 尚未强制鉴权 |
| 可不配 OAuth 直接本地使用 | main 需三项 OAuth/JWT 变量才挂 auth 路由，前端却始终 ProtectedRoute + /api/auth/me | 不写免登录模式，给出完整真实配置前提 |
| .env BASE_URL 指向 7034 | OAuth callback 返回 `/`，Bun 不服务前端；7033 的 Vite 才代理 API / WS | BASE_URL 改为前端7033并登记同源callback |
| 旧配置模块中的 FROGIE_* 环境变量 | main 不读取该模块；仅 PORT、OAuth相关变量；数据目录默认 homedir/.frogie | 说明真实入口和程序化 startServer 隔离方式 |
| baseURL 默认 localhost:7024/v1 | Settings 验证拒绝 /v1 结尾，SDK 会自动追加；迁移/重置默认值仍为旧地址 | 首次使用要求在 Settings 修正实际模型地址 |
| 本地持久化意味着不外发 / token 加密 | 对话、工具输出发往上游；API key 明文数据库，GET仅遮盖；MCP env 也存本地配置 | 如实说明数据位置与明文凭据，不承诺离线或加密 |
| 会话持久化无条件实时 | WS query正常退出后一次性 saveMessages；异常时未完成轮次不保证保存 | 不作逐 token 落盘承诺 |
| Fork 是完整项目分支 | sessions route 只复制会话历史与model，不复制工作文件 | 对话分叉范围写明 |
| 自动压缩与预算是完整上下文/计费保证 | 压缩粗估4字符/token；未知model固定200k窗口；摘要另发同provider请求；预算固定单价表、回合间检查，未纳入摘要费用 | 写成尝试摘要与费用估算，不承诺硬性账单上限 |
| L2 是外部 API E2E | `test:l2` = vitest run packages/server/src/routes/ | 按路由测试子集描述 |
| L3 可直接运行 | Playwright复用默认端口与个人数据，无authfixture，用例路径需真实存在，并会发chat | 列脚本和隔离前提，不运行个人实例 |

## 额外源码边界

- MCP 工具实际按 `mcp__serverName__toolName` 存全局 registry；workspace manager 分组连接不能当成进程/租户隔离承诺。stdio 进程继承环境并叠加配置，连接失败留错误状态且继续内置工具。
- 工具搜索用 find -name 和 head，不能宣称完整 glob 语义。目录浏览和 Finder 打开依赖 osascript / open；其他环境可手输路径，内置 sh/find/head要求Unix工具。
- Prompt 路由、DB repository、Zustand viewmodel 与 PromptsPage 已实现全局 / workspace 分层、启停、还原、模板替换与预览。模板含 cwd / date / git_status / tools，预览不连接 MCP。设计文档状态仍标 Draft，但不能因此遗漏已实现功能。
- OAuth state 被生成和写cookie，但callback没有核对state；未扩大本轮为认证改造。`ALLOWED_EMAILS` 空接受所有Google账号，不能补偿业务API的缺失检查。Bun.serve未设hostname，Vite host:true，不能写loopback-only。
- Cookie始终Secure。使用真实Hono回调和临时SQLite，以模拟token/userinfo响应、独立同源反代和Chromium验证了localhost可保存Secure cookie并成功/api/auth/me；没有真实OAuth、模型请求或个人数据库访问。自定义域名应HTTPS。此probe验证cookie与callback路径，不声称完整Google线上登录已测。
- `build` 生成server/dist与web/dist；后端没有静态资源路由。server start脚本仍运行src/index.ts，README不编造单命令生产部署。
- GitHub homepage=null，hexly.ai website=null，仓库中dev域名只作本地host配置，因此不加站点链接。MIT许可证由实际文件核实；保留现有assets/brand/icon-rounded.png。

## 调查来源

已读根与子包 manifests、README / CONTRIBUTING、.env.example、GitHub CI、Vitest / Playwright / Vite配置、两个hooks；源码包括 server入口 / app / auth / settings / workspaces / sessions / ws-chat / prompts / MCP路由、db连接/迁移/仓储、engine agent / tools / compact / session-sync / prompt builder/context、mcp client/manager/types，以及前端App / AuthProvider / ProtectedRoute / auth/models/settings/prompts viewmodels与对应页面。

模型SDK、OAuth请求和WS测试mock已核实；数据层用唯一临时SQLite，prompt-context测试在临时git仓库操作。真实Bun服务测试在Node下条件跳过，未把注释中的bun test命令误当可执行Vitest入口。L3 specs已全文检查，未自动启动。

## 已完成验证

- `bun install --frozen-lockfile` 通过，Husky正常；无锁文件或版本改动。
- `bun run test:coverage` 通过 534 项，Node下既有4项Bun启动测试跳过。当前各阈值通过；记录事实，不写进README计数表。日志 `/tmp/readme-frogie-unit-tests.log`。
- `bun run build` server / web均通过；保留既有大bundle提示及 Vite 原生配置加载对 `__dirname` 的兼容提示，构建未带来tracked差异。日志 `/tmp/readme-frogie-build.log`。
- 临时数据与模拟OAuth的Chromium同源cookie探针通过，清理全部临时server/data。日志 `/tmp/readme-frogie-auth-probe.log`，脚本 `/tmp/readme-frogie-auth-probe.ts` 不纳入产品仓库。
- 双语本地链接均有效，bash/dotenv示例完全一致，代码围栏闭合；不包含6DQ、测试数量、覆盖率门槛或hooks治理。

## 提交计划与状态

双语README及docs索引、overview候选已完成，等待主代理完整review。主代理批准后，按原有pre-commit运行types/lint/coverage，再pull和正常push。原pre-push的bunx osv-scanner/gitleaks失败只warning；不能据exit0就宣称扫描成功，需看实际日志并酌情以本机安装工具独立验证。不要绕过、替换或弱化hooks。

发布后在本记录与frogie.json补SHA、远端双语字节回读、CI结果；本站overview集成和v0.5.0发布由root负责。

## 发布回执

主代理已完成三份 README 与候选资料复核并批准，见 `frogie.review.md`。正常 pre-commit 的 types / lint / coverage 均通过；发布前再次 `git pull --ff-only origin main`，仅本轮已复核文档提交领先。正常 pre-push 中 OSV 与 gitleaks 实际成功，没有把 warning 当成检查通过。另以本机安装的工具独立复核：OSV 扫描 bun.lock 的 557 个包无漏洞，gitleaks 扫描工作区 261.48 MB 无泄漏；后者为工作树扫描，不宣称覆盖完整 Git 历史。日志 `/tmp/readme-frogie-commit.log`、`/tmp/readme-frogie-push.log`、`/tmp/readme-frogie-osv.log`、`/tmp/readme-frogie-gitleaks.log`。

已正常推送 main：`2ed89a295257f413969bae72ef50ece592e76f7a`。GitHub Contents API 回读 README.md、docs/README.en.md、docs/README.md，分别 7744 / 8573 / 1517 字节，与本地完全一致；工作区干净且对齐远端。CI [34232921532](https://github.com/nocoo/frogie/actions/runs/34232921532) 已 completed / success。版本保持 0.1.1，无产品、测试、hook、锁文件或版本改动。原分叉 checkout 未动。
