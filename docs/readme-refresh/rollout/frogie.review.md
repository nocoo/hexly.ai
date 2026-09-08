# Frogie 主代理复核

2026-09-08，独立副本基线 `79e16babfb6067dcd90ad59b900fa76ad282f35c`。批准中文根 README、英文版、docs 索引与 overview；保持版本，正常提交、再次 pull 并 push main。原分叉工作区不动。

## 复核依据

- 已全文核对三份文稿，阅读 manifest、Bun / Hono 入口、认证路由与前端保护组件、设置、会话 / Fork、WebSocket 查询、工具执行、MCP client、SQLite / JSON 持久化、提示词预览、压缩与费用控制、开发和测试配置。
- 当前引擎直接调用 Anthropic SDK，内置五项本地工具；模型列表的名称分组不代表 OpenAI / Gemini 原生协议支持。MCP 的 SSE / HTTP 分支明确抛出未实现，文稿仅把 stdio 列为当前能力。
- Google 登录是前端进入条件；业务 API 的中间件仅解析身份，WebSocket 在 Hono 前升级。工具自动执行、默认监听范围及工作区路径处理均不构成沙箱。README 的限制有明确源码依据，不将登录界面当作完整访问控制。
- 登录回调须回到前端 7033，Vite 代理 API / WS 到 7034。三项认证变量、localhost Secure cookie 与自定义 HTTPS 域名的说明准确；root 回读隔离 OAuth 模拟探针，未声称真实 Google 登录通过。
- 初始模型地址保留旧 `/v1`，设置验证却拒绝该后缀，首次使用步骤已要求修正。API key 在 SQLite 为明文，显示遮盖不等于存储加密；会话正常查询结束后才写 JSON，Fork 只复制对话。
- 提示词层与 workspace 覆盖已实现，预览仅列内置工具。摘要与费用均为估算控制，文稿没有硬性账单 / 上下文保证。
- `test:l2` 是 Vitest 路由子集；浏览器 runner 使用默认目录、端口并会尝试聊天，缺少登录 fixture，文稿明确隔离前提。Node 条件跳过 Bun 启动用例也已交代。
- 官网为空，顶部仅语言入口；MIT、现有品牌图和英文相对路径正确。候选技术栈与源码、依赖一致。

## 验证与发布

代理已完成 frozen 安装、单元覆盖率和两包构建；root 回读日志，记录现有 Bun 启动用例条件跳过、Vite 配置加载兼容提示与大 bundle warning。全量浏览器测试未运行，不将模拟 cookie 探针替代为完整 UI 验收。

root 静态校验三份 docs 范围、双语命令 / 链接 / 代码块及证据路径后保存摘要。正常 hooks 仍须运行；原 pre-push 中安全扫描错误只作 warning，须核对实际退出和日志，并用已安装工具完成真实扫描，不把 hook 的最终成功提示当作所有扫描通过。发布后回读精确文件并跟踪 CI。
