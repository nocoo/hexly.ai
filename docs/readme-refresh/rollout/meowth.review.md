# Meowth 主代理复核

2026-09-08，基线 `803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7`。批准当前双语 README 与 overview，正常 hooks 提交、再次 pull 后 push main；版本与运行配置不变。

## 复核依据

- 全文核对两份文稿、README diff、Go / pnpm manifests、daemon 构建与 Dashboard 嵌入脚本、Windows PowerShell 路径、当前 Vite / Playwright 配置。
- ProductionFactory 实际构造五种 CLI 后端并从 PATH 探测，已不是旧注释中的 placeholder；发现程序与已登录 / 模型可用明确区分。模型、账号和费用由对应 CLI 服务负责。
- exec handler 校验 cwd / 参数，创建源于 HTTP 请求的取消上下文并同步运行事件 pump；NDJSON、断开取消、续聊、会话查询与取消的表述有代码支持，没有写成持久后台任务队列。
- 自动执行工具的启动参数确实存在，包括 Claude 的权限模式、Codex app-server 的自动批准 / full-access 和 Copilot allow-all。token 没有细分 scope；README 准确说明本机权限边界。
- `init` 在创建目录前检查已有非空 home，生成一次显示的 token；正常启动子命令是 serve。SQLite 位置、Argon2id 摘要、浏览器 localStorage bearer 与各 CLI 自己的凭据存储正确区分。
- remoteaccess 的模式 / acknowledged_by / 重启与首个 token mint 限制相符；Vite 只代理 /v1 与 /healthz，首次 /setup 仍走 daemon 直接地址。没有把本机 Caddy 域名冒充公开站点。
- 常规 L2 和浏览器 fixture 使用独立测试 home、loopback 与 fake factory；真实 CLI 用例是单独的显式开关。README 给出基本命令和真实服务前提，未加入质量制度。
- MIT 与 vendored agent 的 Modified Apache 2.0 分别链接原文，未沿用旧版关于附加条款不适用的推断。Windows 仅按已提供的构建与实验范围说明。

## 验证

主代理静态链接、双语 Bash / PowerShell 示例、基线证据和空白检查通过。代理冻结安装、完整嵌入构建、Go 包级测试与 Dashboard / shared 单元测试通过；不操作个人 daemon、token 或 Caddy，不触发真实模型调用。发布保持正常检查，并补齐远端双语回读与 CI 最终结果。
