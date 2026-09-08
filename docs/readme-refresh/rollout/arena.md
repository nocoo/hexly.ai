# Arena 调查与实施记录

## 基线与范围

- Checkout `/Users/nocoo/workspace/personal/arena`；main 干净，调查前 pull 成功。基线 `4356c962fbd24903265d9f4dc680dcb9d6fcbb93`。
- 中文根 README、英文 docs/README.en.md；保留 assets/brand/icon-rounded.png。没有已核实线上站点。
- 主代理 review 后正常提交，push 前再次 pull，补齐远端 README / CI 回执。

## 代码调查

| 事实 | 证据 / 文档处理 |
| --- | --- |
| 本地意见与决策记录，非 agent 启动器 | core services + CLI push/pop/status + Web checkpoint；模型/agent 参数是元数据，不会自动调用 LLM。 |
| 项目按路径识别 | deriveProjectId 格式化当前绝对目录；不按 Git remote。不同 checkout 得到不同项目。 |
| 主题是项目/分支/本地日期 | findOrCreateTopic 用 BEGIN IMMEDIATE；新日期首次 push 自动新建，人也能新建。 |
| pop 读取不消费、不等待 | 最新主题的最新 checkpoint；pending/no_topic exit1。不是消息队列的出队或长轮询。 |
| 共享本地 SQLite | ~/.arena/arena.db；bun:sqlite 与 better-sqlite3 两种driver；WAL/外键。测试明确使用临时 DB。 |
| 显式 Bun CLI | 源 shebang node，但 ESM 中用 require；CLAUDE 与实际 subprocess tests 都用 bun dist/index.js。README 不建议直接执行全局 node shebang。 |
| Dashboard Google 登录配置缺失被补齐 | auth.ts 用 GOOGLE_CLIENT_ID/SECRET，NextAuth AUTH_SECRET/URL；ALLOWED_EMAILS 为空接受所有 Google 登录账号。 |
| 无公开站点 | GitHub homepage null；Next allowedDevOrigins 仅开发域名，不能作为站点证据。 |
| 许可证是 MIT | 真实 LICENSE 与 GitHub license=MIT；旧 README Private 不再沿用。 |
| 文档中的 pnpm/Next15 已过时 | manifests 是 Bun workspace + Next16 + TS6；无版本号调整。 |
| 基础测试实际范围 | core服务与CLI unit/integration；Web没有浏览器测试，旧README所谓脚本分进程mock隔离也未见当前脚本支持，不重复陈述。 |

已读取 README、CLAUDE、package/driver/schema/服务、命令入口与各命令、NextAuth、受保护页面/写API、网页 checkpoint 组件及系统设计文档。

## 验证

- frozen install 与 core build 成功。
- `test:coverage` 39 core +31 CLI unit 通过；`test` 39 core +44 CLI（包括真实子进程）通过。
- 没有接触个人数据库或进行 Google OAuth。核心测试接受显式 temp DB，现有 CLI 集成测试自带临时用户目录。
- 完整 build、文档链接与中英文命令一致性提交前核对；正常 hooks 保留。

补充验证：完整工作区 build 成功，core / CLI / Next.js standalone 均通过。双语本地引用和 bash / dotenv 示例一致性检查通过。

## 发布回执

正常提交 `b5c6a2439129628d8c11b81b9e9a1793f1bea461`，仅两份 README。pre-commit 通过，pre-push 全部 core / CLI 测试、工作区 lint 和安全扫描通过；既有 esbuild advisory filter 未修改。push 前再次 pull，确认只领先此任务提交，然后正常推送 main。

远端两份 README 已通过 GitHub Contents API 与本地逐字节比对，工作区干净并与 origin/main 同步。CI [34226658696](https://github.com/nocoo/arena/actions/runs/34226658696) 首次回读 in_progress，完成后补齐结果。

CI 最终结果：`34226658696` completed / success。
