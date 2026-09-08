# Deca 主代理复核

2026-09-08，基线 `37911d4cdf1c242c50c5d48d890a0e041c486d8b`。批准当前双语 README 与候选 overview，正常提交、再次 pull 后 push main；不改版本、维护约定或 Agent 代码。

## 核对结果

- 全文核对双语文稿、根 README diff、workspace manifests、Gateway 两个入口、HTTP 服务、Agent adapter、文件 / 命令工具、会话与记忆实现。
- `cli.ts` 的 Echo 模式确实绕过 Agent 初始化；示例显式关闭 Discord 和终端，使用本机 HTTP、示例密钥与真实 `/health` / `/chat` 协议，不会自动读取个人模型凭据。默认 HTTP hostname 为 127.0.0.1，鉴权字段为 X-API-Key。
- `bun run dev` 是独立的 `serve.ts` 入口，读取配置 / provider / Discord，不能当作免配置 Echo。文稿明确当前支持的 provider 标识、选择顺序和与 ANTHROPIC 环境变量入口的差别，没有照搬过时入口注释。
- 文件工具只是解析路径，命令通过子进程执行；工作区不是文件系统沙箱。该边界说明来自真实代码，未增加不存在的 AppleScript 控制层或隔离保证。
- SessionManager 使用 JSONL，MemoryManager 使用 index.json 与关键词 / 标签 / 时效得分，没有 SQLite 或向量检索。默认会话 / 记忆路径相对进程 cwd，`DECA_STATE_DIR` 没有被误称为全系统状态重定向开关。
- Anthropic SDK、Hono、discord.js、p-queue 和本地文件格式各有实际使用。技能、heartbeat、cron 回调与通道调度已经接通，网络搜索凭据前提清楚。

## 验证与发布

主代理静态链接、示例对应、基线证据路径与空白检查通过，并回读本地集成日志：Storage 22、HTTP 9、Terminal 6 项全部通过。代理完整六模块单元测试已通过。外部模型、Discord 和行为测试需要专用服务，未运行且未宣称验证；正常 pre-push 仅要求单元测试与 lint。实际 LICENSE 为 MIT，无网站依据所以只显示语言链接。正常发布后补齐双语远端回读与 CI 最终结果。
