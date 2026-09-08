# Surety 主代理复核

2026-09-08，基线 `4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767`。批准当前五份文档和 overview；继续正常 hooks，提交后再次 pull 并 push main，不改版本、不运行远程 schema push / seed。

## 复核依据

- 全文核对根 / 英文 README、文档索引、20-development 和 CLI README；对照 manifests、实际 Worker 路由及认证、Vite 代理、CLI 命令 / 配置与其已安装的 base-cli 实现、备份函数和测试 / 发布入口。
- 单 Worker 托管 SPA / Hono，Drizzle 直连 D1，R2 保存附件；同实例共享家庭数据，没有按邮箱划分独立家庭。成员 / 资产 / 保单 / 就诊及状态转换功能有当前路由和 UI 依据。
- 生产浏览器 Access 与硬编码的机器 API 域名分开；token 管理需要交互会话，CLI 修改两个地址仍不足以完成自定义域名适配。
- Vite 默认代理线上 API 并可注入开发 token；README 先要求配置自己的实例，没有把直接 dev 或旧远程 seed 当作隔离初始化流程。
- PDF / JPEG / PNG、50 MiB、每保单 20 个限制与实现一致。主代理修正附件删除措辞：CLI rm 不只操作元数据，还尝试删除 R2 对象，后者失败不向调用者报告。
- 受益人只读、CLI 无附件上传 / 专门状态转换命令、续保仅页面查询、Backy 手动 JSON 推送，均按当前能力说明。
- buildBackup 包含 settings 与附件元数据，排除 R2 文件 / api_tokens。Worker restore route 未传 D1 batch executor，确实进入 BEGIN TRANSACTION 分支；代理在自有本地 D1 复现 500，没有把 JSON 导出称作完整可恢复备份。
- logout 删除内存字段后 ConfigManager.write 会重新合并磁盘字段，源码与合成配置复现一致；文稿区分本地删除和服务端撤销。
- API 内存 / 本地 HTTP / Playwright 的入口和资源路径正确，Release 在 main CI 成功后检出对应 SHA 构建部署，未执行数据库迁移。

## 验证

主代理检查双语命令、链接、基线证据及空白，回读本地 HTTP 日志全部通过，包括 D1 / R2 附件完整往返及状态转换。浏览器 --list 仅记录测试发现，不计作运行通过。完整单元与发布检查继续按原 hooks 执行；不触碰真实家庭数据、账户配置或 Backy 投递。
