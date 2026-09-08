# Pika README 调查与交付

状态：published。基线 `02487858f8c567a7e3c780cf951abc957c54623d`；main 调查前干净、与 origin 同步并已 pull。主代理已批准四份文档与 overview，正常 hooks / 再次 pull / push 已完成；不改版本或运行配置。

## 范围

- `README.md`：中文根 README，保留品牌图片，站点在语言链接之前，统一八节。
- `docs/README.en.md`：完整英文对应文本，命令与条件一致。
- `docs/README.md`：新增索引，标明旧架构文档中启动 / 发布描述需以当前开发说明为准。
- `docs/01-development.md`：新增来源路径、登录 / 同步边界、配置、本地测试与部署说明。

## 核实结论

单个 Hono Worker 同时服务 React SPA 和 API，D1 元数据 / FTS5，R2 canonical 与 raw gzip；没有当前请求链路中的 Next.js、service binding 或 WORKER_SECRET。CLI 用 @nocoo/base-cli，四包结构与当前 manifests 一致。

当前 login 已改为浏览器 loopback 回调，旧 README 的手动复制 token 说明过时。生产地址和 --dev 地址固定于 config/manager.ts；--dev 指向 https://pika.dev.hexly.ai，不是 localhost，也没有 --api-url。生产 / 开发配置不同，但共用 cursors.json。npm 公共最新包目前为 0.8.4，仓库为 0.8.6；只在内存中读发布 tarball，确认 login / sync / source / force 示例在已发布包存在，不发布 npm、不改版本。

sync --no-upload 会让解析后的游标落盘，后续普通 sync 可能跳过未变化文件；文档明确其不是无副作用预览。内容上传失败仅回退相关本地文件游标，不回滚整个远端事务。上传包含元数据、标准化消息和 raw 内容，没有承诺自动脱敏。

sessions / projects / search / tags CLI 命令仅发送 Bearer，访问的 API 不在 accessAuth 的 /api/ingest/* 例外中；缺少 Access 集成使这些管理命令不能仅靠 pika login 在生产使用。Web 管理界面可用。App.tsx 的 trash 仍是 Placeholder，不能宣称完整回收站界面。

默认路径偏 macOS，VS Code / Insiders 使用 Library/Application Support；没有路径覆盖参数。OpenCode JSON / 只读 SQLite、Copilot CRDT JSONL 有当前 driver / parser 依据。未读取任何真实用户会话目录、CLI 配置值或 token，未运行 sync / login / status。

默认 dev:all 使用 remote=true 的 D1 与 R2，不能当成隔离本地数据库。DEV_USER_EMAIL 快捷路径依赖无 request.cf，本地 workerd 也可能设置它。API runner 以 --local、独立 .wrangler/e2e、合成用户和测试认证明确隔离。Release 是单独的 workflow，等待 main CI 成功并检出其对应提交，不会执行 D1 迁移；/api/live 的 200 / 401 检查只证明可达。

## 验证

已通过冻结依赖安装（正常 prepare）、main / login / sync 帮助、Bun 内存 SQLite 迁移测试、未改动 runner 的本地 API E2E、web 包 React / TSX 测试；全部仅使用源码与合成数据。API runner 完整应用六份 SQL，使用本地 17022，结束后已停止 Worker，测试变量文件已移除。

`/tmp/readme-refresh-pika-e2e.log` 记录 API 测试；`/tmp/readme-refresh-pika-web-tests.log` 记录 React 测试。React 套件 39 文件 / 336 用例通过。根 coverage、类型 / lint、Gitleaks、构建、API E2E 与 OSV 均已通过正常发布 hooks。现有 Vite native loader / __dirname 迁移提示不影响已执行测试，本轮不修改配置。

四份文档的链接 / 锚点 / 图片 / 末尾换行 / shell 语法 / manifest 命令已检查；中英文八节与 shell 示例一致，git diff --check 通过。候选 JSON 的全部 evidence 路径已用 git cat-file 在基线逐一验证。

未执行真实 Access 登录、用户会话扫描 / 上传、普通 remote-bound dev:all、远程 D1 迁移或手动 Worker 部署。已按主代理 review 正常发布，结果如下。

## 发布结果

文档提交 `4fd439659cb7fef855b2207ef6c6a6d0f34d46da` 已发布；main 干净且 origin/main 对齐，GitHub contents API 回读双语 README 逐字节一致。CI [34228650462](https://github.com/nocoo/pika/actions/runs/34228650462) 与自动 Worker Release [34228747466](https://github.com/nocoo/pika/actions/runs/34228747466) 均成功。首次 push 在完整正常检查通过后遇到 SSL transport disconnect，main 未更新；再次 pull 后重跑完整正常 push 成功，没有绕过 hooks。日志 `/tmp/readme-refresh-pika-commit.log`、`/tmp/readme-refresh-pika-push.log`、`/tmp/readme-refresh-pika-push-retry.log`。
