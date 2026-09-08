# Deca 调查与实施记录

## 基线与范围

- Checkout `/Users/nocoo/workspace/personal/deca`；调查前 clean main，pull 成功。基线 `37911d4cdf1c242c50c5d48d890a0e041c486d8b`。
- 已读 AGENTS/CLAUDE；仅重写中文 README 并新增英文版，保留 assets/brand/icon-rounded.png。保持 Gateway 组装边界，不改维护文件或业务代码。
- 主代理 review 后正常提交，push 前再次 pull，记录远端 README 和 CI。

## 旧 README 与当前代码的关键差异

| 事实 | 证据 / 处理 |
| --- | --- |
| 默认 dev 已非免密 Echo | package dev -> gateway serve.ts，会通过 provider resolver 找 glm/minimax 凭据，缺少provider直接失败，可能自动连已有Discord。新README用 cli.ts 的明确Echo入口。 |
| 两入口的配置不同 | cli.ts 读 ANTHROPIC_* / DISCORD_TOKEN / HTTP_*；serve.ts 读 JSON 配置凭据，DECA_PROVIDER/activeProvider/available优先级。不混写。 |
| 存储不是 SQLite | SessionManager JSONL，MemoryManager index.json +可读Markdown，storage module JSON配置/凭据；旧SQLite说法删除。 |
| workspace不是文件沙箱 | 文件工具仅path.resolve，命令是子进程exec当前用户权限；不重述注释里“阻止越界”的保证。 |
| 当前工具无独立AppleScript项 | 有read/write/edit/exec/list/grep/search/research/memory/sessions_spawn/claude_code以及可选cron；不把旧设计的macOS控制层写成专用已实现接口。 |
| 模型协议是Anthropic SDK | 可配置baseURL/model；serve默认resolver只接受glm/minimax，不能按过时注释说自动接受anthropic.json。 |
| 记忆是关键词检索 | MemoryManager score由关键词/标签/recency构成，没有向量数据库。 |
| heartbeat/cron与消息调度实际接通 | gateway/adapter/dispatcher/scheduled，实现回调经共享调度发送结果；cron按enableCron开启，heartbeat读取HEARTBEAT.md。 |
| 目录隔离有边界 | session/memory默认相对进程cwd；storage DECA_STATE_DIR并不改全部子系统（例如锁和cron各有默认路径）。README不提供虚假的“单变量隔离所有状态”。 |
| HTTP默认loopback | types.ts DEFAULT_HOSTNAME=127.0.0.1，HTTP_API_KEY -> X-API-Key，health豁免；Echo明确清空DISCORD_TOKEN，不载入个人凭据。 |
| Lint不是测试层 | README只列真实unit/local integration/external integration/behavioral命令，不介绍6DQ或固定数量。 |
| hooks没有旧文档声称的全量外部E2E | 当前pre-push是unit+lint；尊重正常hooks，不自动运行会向Discord发消息的全量E2E。 |

阅读范围：README、维护说明、workspace manifests、CLI/serve入口、Agent/Adapter/Gateway/queue、文件与外部工具、session/memory、provider/config/credential、HTTP/Terminal独立入口、测试配置、各E2E runner/spawner、设计文档索引与模块代码。

## 验证

- frozen install成功，正常Husky配置。
- 六模块unit共1289测试/62文件通过：storage56、http48、terminal55、discord319、agent640、gateway171。
- local storage / HTTP / Terminal E2E 分别 22 / 9 / 6 项全部通过，使用临时目录、Echo 进程和 loopback，未读取个人 provider 或 Discord 凭据。HTTP 测试运行时清除了无关的继承 API_KEY 环境变量。
- Agent/Gateway完整E2E与behavioral代码会读真实凭据并发消息，本轮不执行，不把它们记为通过。不需要因此绕过任何现有hook。

## 发布回执

主代理全文批准后，正常提交 `61b8cbc50c9e59305bba016c5d3008e540557f56`，只包含两份 README。pre-commit 的 lint / 单元覆盖率与 pre-push 的完整单元测试 / lint 均通过。push 前第一次 pull 遇 GitHub SSL 连接中断，正常重试成功，确认只领先本次提交后推送 main。

两份 README 均通过 GitHub Contents API 与本地逐字节比对，工作区干净且与 origin/main 同步。CI [34227348442](https://github.com/nocoo/deca/actions/runs/34227348442) completed / success。全程未调用真实模型或发送 Discord 消息。
