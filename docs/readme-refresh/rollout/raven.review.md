# Raven 主代理复核

2026-09-08，隔离 checkout 基线 `a668dbf4fa318429e34686f7bf86731ca1494fd4`。批准双语 README 与 overview；继续完成现有正常检查，再提交、重新 pull 并 push main。不改版本，不操作原分叉 checkout。

## 复核依据

- 全文核对中英文文稿，读取 manifest、启动和路由装配、七策略注册、协议分流、认证中间件、WebSocket 授权、Dashboard 登录模式、平台目录、token 初始化及 provider 存储。文稿中的协议范围与当前实现一致。
- Chat 到 Responses 的转换已注册；Messages 到 Responses 仍是设计。自定义 Anthropic 不能接收 Chat，自定义 provider 不能接收 Responses，Embeddings 走 Copilot。原生 Claude 的可用性取决于模型目录与端点，文稿没有承诺完整上下文或工具兼容性。
- Proxy 启动无条件初始化 GitHub / Copilot 凭据。AI 接口始终认证，internal key 仅用于管理；`rk-` 只走数据库摘要匹配。管理 API 和 WebSocket 在两个环境变量 key 均缺失时持续免认证，与数据库 key 数量无关。
- Dashboard 缺任一必需 OAuth 变量时为免登录 Local 模式，空邮箱名单接受所有已登录 Google 账号。启动没有显式 loopback 绑定，文稿准确说明访问范围的配置前提。
- 两份环境模板位于各 package；最小配置省略覆盖平台默认目录的旧相对 token 路径。数据库管理 key 为摘要，GitHub token 和自定义上游 key 仍为本地明文。`count_tokens` 为本地估算，缺模型或出错时返回回退值。
- 基础测试命令与 manifest 对应。真实 API runner 使用实际 Proxy 配置和数据库；浏览器 runner 仅隔离数据库，仍依赖 GitHub 凭据。文稿明确这两类测试的运行前提，未写成完全隔离的离线测试。

## 验证与发布条件

主代理静态校验通过：双语示例一致、相对链接有效、代码块闭合、基线证据路径存在、文稿不含 6DQ 或治理门槛。代理仍在完成 frozen 安装和仓库正常测试 / 构建，不把待完成项记为通过。保留现有 pre-commit / pre-push，失败时回报具体原因，不绕过检查；发布后补充精确 SHA、远端文稿回读及 CI 回执。

## 必要测试修复复核

root 已阅读 `packages/proxy/test/app.test.ts` 与 `packages/proxy/test/lib/utils.test.ts` 两项完整 diff、对应模型缓存 / fetch / 路由实现及测试配置。批准当前两个测试文件作为单独修复提交；不修改业务实现、原有断言、基线、门槛、hooks 或版本。

- 原覆盖率依赖其他路由测试触发的后台刷新是否及时完成；`lib/` 的 97.41% / 97.53% 差异已定位至刷新完成回调。新增用例直接验证 TTL 内缓存、到期后的请求合并、成功更新、失败保留旧缓存以及后续重试。
- 时钟由 spy 控制，延迟响应使用受控 Promise，在 finally 释放；异步收尾使用事件循环推进，没有固定等待或删除断言。测试结束恢复 mocks。
- 原应用工厂测试的合法模型查询会在空缓存时访问真实上游。加入 fetch fixture 后保留原认证与路由断言，并恢复 fetch / models，消除该单元测试对真实服务响应的依赖。
- root 回读 `/tmp/readme-raven-deterministic-gate-2.log`：1985 项代理测试、41 项脚本测试及原覆盖率门禁通过，`lib/` 为 97.53%。类型与格式检查已通过。完整正常提交 / 推送检查仍由代理执行；本次通过不替代远端 CI。

两个测试文件的精确 SHA-256 纳入 `review-snapshots.json` 的 `executionFixes`，最终回读远端时再次核对。
