# Otter 主代理复核

2026-09-08，基线 `74276e49d667df345cac4d6590e01469f35c1115`。批准五份 docs 与 overview：中文 / 英文 README、文档索引、当前开发指南及旧开发指南的一处锚点修复；正常提交、再次 pull 并 push main，保持版本。

## 复核依据

- 全文核对中英文与新增指南，读取 manifests、CLI 参数 / 扫描 / 备份 / 登录、配置与快照比较、采集注册表、Claude / Hermes 范围、上传、API app / 鉴权 / 快照路由、Worker dispatcher、Vite、测试 runner 与 CI / Release。
- 当前是配置与环境清单快照，恢复文件和重装软件需要手动完成。snapshot diff 根据文件路径 / 大小及清单名称比较，未宣传正文差异或同尺寸内容检测。
- slim 仅传给 Claude；Hermes 记忆 / 用户资料仍在采集范围，Markdown 和首条提示没有统一遮盖。文稿明确先看本地快照再决定上传，没有绝对脱敏保证。调查没有执行真实扫描或读取用户配置。
- backup 重新采集，快照 gzip 上传成功后才保存本地副本，再处理图标；当前使用 Bearer /api/snapshots 和 /api/icons，无需创建 Webhook。旧 ingest 接入单独交代。
- 配置 dev 只切换配置文件与登录域；上传 API 独立解析 OTTER_API_URL。快照和图标目录共用。Vite 默认代理生产 Workers 地址，环境文件目录与明确的本地覆盖命令符合 loadEnv 行为。
- 单个 Worker 将 /api/* 送入 Hono 工厂；/v1/* 没有在顶层转发。D1 保存索引 / Token，R2 保存 JSON / 图标。快照接口查询邮箱归属，删除先 R2 后 D1。
- Access JWT 与 Bearer 中间件均有实现；有效 Bearer 也可以取得邮箱并调用 CLI Token 签发，文稿没有沿用只能 Access 或无效 JWT 放行的旧说明。
- 根 build 只构建 SPA，完整 API / CLI 集成须先构建 core / cli / api。L2 本地端口 17020、browser 两种配置共用 27019 及非 CI 复用行为已核对；BDD 只有首页标题 smoke，未冒充完整业务浏览器覆盖。
- 原自动 Release 部署 Worker，不做 D1 迁移或 npm 发布；读取源代码 / 公开包证据后仍保持版本 2.0.3。

## 验证与发布条件

代理完成 frozen 安装、构建、编译 CLI 帮助、本地 L2 与文档中的 standalone runner；root 回读 L2 日志确认 15 项通过。其余正常提交 / 推送检查由代理继续，不提前标记通过。静态校验双语命令、图片 / 引用、基线文件和 docs 范围后保存审核摘要；发布后补精确 SHA、远端字节与 CI / Release。

17020 与 Pew 重号。root 的 Pew 检查已结束且端口释放，Otter 后续可继续独占使用；不启动第二个同端口服务。
