# Firefly README 整理记录

## 状态

主代理已批准并发布；CI 与 Railway 网站部署均成功。调查基线 `dcdea91001928e374c1a64db9290f8ec83ebbd5e`；开始时 main 干净、无 ahead / behind，已安全 pull。仅修改根 README、英文 README、现有文档索引和新增 `docs/31-development.md`。

## 核实结果

- Next.js 博客、后台和业务 API + 独立原生 Fetch Worker。Worker 只绑定 D1；R2 由 Next.js S3 client 上传，不能把整个项目写成单 Worker 或 Hono 服务。
- 阅读面包含日期归档、分类标签、标题 / 正文 / 摘要 FTS5、Markdown 协商、RSS 和旧 WordPress 重定向。搜索通过 Worker 分词与 BM25 排序；公开搜索只返回 published。
- 后台 Google 登录受 `AUTH_ALLOWED_EMAILS` 限制，空名单拒绝。评论 / 回复是 admin-only，且需公开文章与双重评论开关；没有开放访客评论。
- 人类与 AI 作者独立；MCP `full` 与 `author` 的权限不同。author 操作传入有效 AI `author_id`，文章固定 private、不能改发布状态、只能查 / 建标签；没有把令牌写成绑定特定作者的多租户身份。令牌不会自行过期，可撤销或刷新轮换。
- AI 摘要必须有模型配置，链接可独立抓取原始元数据，AI 增强失败会回退。文章的标签 / 计数 / FTS 为 best-effort，不回滚主记录。
- Backy 目前导出文章、人类、分类标签、评论、附件元数据、重定向、过滤后的设置；不含 R2 实体、AI 作者 / 文章 AI 关联、tokens 或 secrets，也没有完整恢复入口。未声称完整灾难恢复。
- 根与 worker 是两个独立 Bun 包 / lockfile；分别冻结安装。Next.js 自身 engines >=20.9，但当前 Wrangler engines >=22，因此完整工具链写 Node.js 22+。
- `migrate:local` 的 adapter 固定 localhost8787 与 test-secret；README 用同一组值和实际 Worker 包 binary。普通 R2 仍是远程桶。测试 runner 才覆盖 Worker、用本地 D1 / 文件 R2 / 模拟管理身份，并重建专用目录。
- 默认 `migrate` 和 `migrate:status` 都为 prod；status 内部调用 ensureMigrationsTable，不能当完全只读检查。历史 WordPress 脚本不是初始化流程。
- `docs/30-social-preview.md` 记录 lizheng.blog / Railway；GitHub homepage 为空。仓库只有 CI，无 Actions 网站 / Worker 自动部署步骤。保留有依据的 Railway 描述，托管配置留在部署说明。
- LICENSE 为 MIT。现有 Logo 原样保留，网站先于语言链接，双语全文对应，测试段无固定数量、门槛或 hook 制度。

## 验证

- 四份文档的链接、图片、尾部换行、bash 语法、八节顺序与脚本引用通过；中英文 bash 块相同，`git diff --check` 通过。
- 实际分别 `bun install --frozen-lockfile`，Husky 正常 prepare；未更改 manifest / lockfile。
- 实际启动 unchanged Worker + 临时 D1 state，执行 unchanged `bun run migrate:local`。19 份迁移全部通过，随后只读查询 `_migrations` 数目；自己的验证 Worker 已停止，临时状态已清理。真实 `.env`、已有开发数据和生产资源未修改。
- 发布时已执行正常 hooks 中的应用覆盖率、类型 / lint 与安全检查；未执行真实 Google OAuth / AI / R2 上传 / Backy 投递。

## 发布

Railway 自动部署设置在仓库外；本次发布已通过 GitHub commit status 与 deployment 状态分别确认，结果如下。

已按 `firefly.review.md` 批准发布 `bfa7e5259335d65fcc42936f59f134cef0650f39`。pre-commit按自身规则处理docs-only；pre-push覆盖率、类型、lint、自定义检查与安全扫描全部通过。发布前再次pull，只push本任务文档提交；main干净且远端对齐。中英文README按该SHA远端逐字节回读一致。CI [34226012749](https://github.com/nocoo/firefly/actions/runs/34226012749)已成功，GitHub deployment状态回读也确认为success。GitHub commit status中Railway的`lizheng.blog -  lizheng.blog`为success（Success - lizheng.blog），deployment ID `6327522943`，环境`lizheng.blog / production`。未主动部署Worker或运行远程迁移。
