# Flow 调查与 README 草稿

## 基线

- 仓库 `/Users/nocoo/workspace/personal/flow`；clean main、无 ahead。
- 调查前 `git pull --ff-only` 成功，基线 `f4a9e9464d64184b793240adff182e08c04997e1`。
- 已核对原 README、workspaces manifests、API 全部路由/配置层、分词器、前端入口/流式输入/聊天/设置、Vite/Vitest 和 hooks 配置。

## 目标与实现核对

| 原资料或潜在误读 | 当前实现 | 证据 |
| --- | --- | --- |
| 系统输入法引擎 | 当前交付为浏览器实验 UI + Bun API，无系统 IME 集成、无自带模型 | `apps/web/src/App.tsx`、`apps/api/src/index.ts`、manifests |
| 多模型对比 | Local / Cloud 是两份可切换配置；每个请求只用当前 profile | `provider.ts`、`db.ts`、`settings-panel.tsx` |
| 只有拼音和 Chat | 已实现 /api/polish 及 Polish 面板，包含错字/格式/间距 Prompt | `apps/api/src/index.ts`、`components/polish-input.tsx` |
| Span 类型标记都传给模型 | segmenter 会生成 spans，但 /api/pinyin 当前只取 segmented；不宣传模型使用 span 标注 | `pinyin-segmenter.ts`、`index.ts` |
| clone / install / dev 即能本机联通 | API_BASE 被写死为维护者开发域名；Vite 无 /api proxy。README 必须明确先修改 API_BASE 到 http://localhost:7030 | `apps/web/src/lib/api.ts`、`vite.config.ts` |
| 全部本地处理、配置安全存储 | 请求发送给选中的服务，原始 API key 保存在 SQLite JSON 中；响应遮罩不是加密。API 无认证、CORS 默认开放 | `provider.ts`、`db.ts`、`index.ts` |
| 上屏或历史永久保存 | 已确认文本只留在组件 state，并按最近上下文发回模型；chat 同样是前端 state | `streaming-card.tsx`、`chat.tsx` |
| 文件目录中的旧 hook / settings 名称 | 实际使用 use-streaming-predict.ts 和 settings-panel.tsx | `apps/web/src` |
| 所有功能都有集成测试 | 现有自动化仅 API 分词器与前端 utils 单测，无 HTTP / browser E2E 脚本 | `vitest.config.ts`、各 package scripts |

README 使用两份完整同事实文稿，保留品牌图片，按统一顺序整理。没有站点：GitHub homepage 为空、本站 website 为 null；源码的 .dev 域名作为本地配置现状说明，不冒充公开站点。许可证实际为 MIT。

## 可复现入口

- Bun 安装和 workspaces 开发脚本；前端 Node 要求以实际 Vite 8 package engines `^20.19.0 || >=22.12.0` 核实，README 选 Node 22.12+。
- 默认 API 7030、Web 7029。API 首次初始化 `apps/api/data/settings.db`，不在调查时读取个人现有数据。
- API 兼容 OpenAI 风格服务；Local 初始地址 localhost:8000/v1，实际 model ID 和凭据需用户自己配置。
- 测试仅列实际单元测试入口，不写质量门禁、覆盖阈值或固定数量。

## 验证结果

- `bun install --frozen-lockfile` 成功，无 lock 改动，正常 Husky 安装。
- `bun run test`：34 tests / 2 files 通过。
- 复制当前 API 源码到临时目录，在 loopback 临时端口启动；健康检查和设置响应脱敏行为通过。第一次临时副本只连接了根 node_modules，Bun workspace 隔离导致无法找到 ai；改为连接 API workspace 的既有 node_modules 后成功。没有修改仓库、不访问原数据库、不调用模型。
- 中英文所有本地引用存在，可执行 bash / TypeScript 示例一致；diff 检查通过。
- 未启动维护者开发域名对应服务、未修改 API_BASE 业务文件、未提交模型请求，也未声称浏览器或真实 LLM 已实测。

## 下一步

`flow.json` 与双语 README ready_for_review。主代理 review 后正常提交、再次 pull、确认只有本任务提交并 push main，完成远端回读及 CI 记录。

## 发布回执（2026-09-08）

README 提交 `b3e32a8b493360c96aeee0787a0c51e13cd226d2` 已按正常 hooks 发布到 main。发布前再次 pull 成功，核对仅本任务提交 ahead。远端 GitHub API 回读中英文 README 与本地一致。CI：<https://github.com/nocoo/flow/actions/runs/34224245871>，completed / success。
