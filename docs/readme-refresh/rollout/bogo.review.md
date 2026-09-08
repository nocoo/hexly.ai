# Bogo 主代理复核

2026-09-08，基线 `2e2d986edffd9d320a3e172f37affe5e3406cabe`。批准隔离副本的中文 README、英文 README、文档索引及 overview；完成正常检查后提交，再次 pull 并 push main，保持版本。

## 复核依据

- 全文核对双语文稿，读取工作区与包 manifests、API 入口、Access / bearer 中间件、workspace / 人物 / 文档 / 字段 / 表格视图路由、UI 路由与版本差异、Markdown 渲染、CLI schema / 构建、seed 和实际测试配置。
- workspace 列表没有 owner 筛选，创建使用 default-owner；认证控制入口而非租户隔离。README 明确适用可信共用知识库，未沿用旧架构的按用户隔离承诺。root 在文档索引补充双语入口与这一已核实差异，去掉索引中的质量治理简介。
- 人物主 / 虚线关系、主树移动环检测、多人物关联文档、文档时间线、自定义字段、保存表格列 / 排序 / 筛选 / 默认视图均有实现；没有把客户端排序筛选宣传为服务端分页。
- 文档 PUT 创建新版本并 batch 保存标题 / 正文快照；标签和人物关联不在版本快照中，相邻版本正文按需读取。没有实时协作、通用回滚或全元数据版本化承诺。
- 业务数据在 D1，无 R2 附件存储；头像使用 URL。前端实际依赖 React / Vite / Tailwind、React Query / Router、React Flow / Dagre、marked / js-yaml / @pierre/diffs，未把视觉风格误写成 Basalt 包依赖。
- 浏览器 Access 与 CLI bearer 地址分开；登录经浏览器确认，撤销同邮箱旧 cli-login token，服务端保存 SHA-256 摘要，本机仍保存可用凭据。CLIP_BASE_URL 只改业务 API 地址，不能迁移编译进 CLI 的登录地址。
- npm 与仓库版本存在实际差距，README 指向 --help 与源码构建；源码构建先生成 shared / UI，CLI 另需 clip。开发示例写明本地 D1 seed 的覆盖范围。
- API 测试端口 17036、独立 persist 目录与部署凭据检查有实现。浏览器和 CLI 同用 27036，README 要求逐项运行并先释放端口；CLI 需可用 clip，避免可选缺失导致的软跳过。
- 根与 CLI 均为 MIT，替换了旧 README 的 Private 说明。

## 验证与发布条件

代理完成 frozen 安装、完整 shared / Worker / UI 单元覆盖率、构建及本地 seed，root 回读日志确认通过。CLI 生成、浏览器与正常 hooks 尚待完成，不提前登记成功。静态校验双语示例、本地链接、基线证据和文档范围后保存审核摘要；发布后记录精确 SHA、远端双语字节与 CI。原个人 checkout 的四个未推送提交继续保持原样。
