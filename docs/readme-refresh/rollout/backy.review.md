# Backy 主代理复核

2026-09-08，基线 `5b23349c94ac6778f2242a857386e8b01dac4f1c`。批准当前根 README、英文 README、docs 索引与 `docs/10-development.md`，以及候选 overview，按正常 hooks 提交、再次 pull 后 push main；版本不变。

## 源码与文稿核对

- 全文核对中英文 README 与新增开发文档，并检查根 README / 索引 diff、链接、示例、证据路径。Hono Worker、Vite / React SPA、D1 / R2 与占位 CLI 均与当前 workspace 一致。
- `restoreHandler` 实际校验项目 token / IP 后返回 900 秒签名 URL，不执行业务恢复。新版消除了旧版“一键恢复”的歧义；普通上传、直传初始化 / PUT / complete、JSON 预览与压缩包提取的不同限制有源码支持。
- Access 浏览器身份与项目 token 分开，边缘策略需允许集成路径。`isLocalhost` 依赖缺少 `request.cf`，没有把 localhost 直接写成通用免认证入口。
- 默认开发配置的 D1 / R2 都是 `remote = true`。文稿明确先准备自己的开发资源；实际 API runner 使用显式 `--local`、独立状态目录与本地 S3 模拟端点。初始化器自行写入 `_test_marker`，文稿没有把该标记单独当作隔离保证。
- R2 binding 与 S3 签名 / CopyObject 配置区分正确。定时任务传递 `CRON_SECRET`，按 UTC 小时选择间隔，回调成功不等于已收到备份。
- Release 工作流构建、应用增量迁移并自动部署；增量迁移依赖已有基础表，构建和部署命令不被描述成全新数据库安装器。

## 验证与发布边界

主代理静态核验通过，代理已执行不改动 runner 的本地 API 全流程并记录结果；本轮无真实 Access 登录、远程数据库初始化或生产备份操作。网站来自当前 Worker 路由，MIT 来自实际 LICENSE。发布继续运行正常检查，并记录该提交的 CI / 自动部署最终结果；源码和配置不在本次批准改动中。
