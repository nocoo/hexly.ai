# Otter README 调查与交付

状态：published。基线 `74276e49d667df345cac4d6590e01469f35c1115`；已按主代理书面批准发布 `18e5563515a2e7e7f4187c0b8a14464c47bddd7c`，main 干净对齐 origin/main。

## 文稿

中文根 README、完整英文 docs/README.en.md、新文档索引、新 docs/10-development.md；另修复 docs/03-development.md 指向已移除 README 标题的单个锚点。旧设计与命令文档保留为历史参考，不改 CLAUDE、代码、配置、依赖或版本。Logo、站点在语言前、八节结构和双语示例一致。

## 核实结果

单 Worker 嵌入 Hono createApp，D1 为用户 / Token / 索引，R2 为快照 JSON 与图标。packages/api 是库。顶层只把 /api/* 交给 createApp，/v1/* 即使出现在 Wrangler 的 run_worker_first 也没有实际转发；本地 /v1/live 实测404，文稿不沿用兼容接口承诺。

当前 CLI 为扫描 / 保存 / 云端上传 / 本地查看与比较，没有自动恢复。默认 registry 包括 Hermes。--slim 只传给 Claude 采集器，排除提示历史与会话摘要，Hermes 记忆、用户资料、其他配置仍在范围内。凭据遮盖按格式和规则且需采集器启用，Markdown 和会话摘要首条提示保留原文。全程未访问用户配置值、会话或运行真实 scan / backup。

snapshot diff 仅比较文件路径、大小和清单名称；scan --json 仍有 stdout 进度行，纯JSON使用保存文件或 Web 导出。backup 重新扫描，经 gzip 上传成功后才本地保存，然后尝试图标导出 / 上传。Web 分页与 JSON 导出已实现，主机名搜索框禁用。

CLI 当前使用 Bearer /api/snapshots 与 /api/icons，不需要先创建 Webhook；Settings 的 Webhook 服务旧 /ingest 接入。API 快照按邮箱隔离，删除先 R2 后 D1。登录经 /cli/connect → /api/auth/cli → loopback callback 的 token 参数；已有有效 Bearer 也能为该邮箱颁发 Token，未声称只能来自 Access 会话。

--dev 仅切换登录页与 config.dev.json；OTTER_API_URL 独立解析上传目标，未设置仍为生产 Worker，而且不会覆盖硬编码登录域名。本地 snapshots / icons 在模式间共用。Vite7019 默认代理生产 workers.dev，环境文件在 packages/web/.env；普通本地 Worker8787 不会自动改变代理目标。新指南提供已验证的本地 API runner17020 + 显式 Vite 代理方式。

当前 auth 中间件采用 Access JWT 校验与 Bearer 通路，无效 JWT 会拒绝，不沿用 CLAUDE 中旧的无条件 fallthrough 叙述。保留 CLAUDE 不改，仅正文据实际源码写实。

根 build 只构建 SPA，L2 前需按 CI 顺序构建 core / cli / api / Web。两套 Playwright 命令不同：test:e2e 用本地 Worker27019 与独立 D1/R2；test:e2e:bdd 启动 Vite，仅首页标题 smoke，后端仍受 Vite 代理影响。非 CI 都可能复用已有服务。

CI 后 Release 构建 SPA、部署单 Worker，不迁移 D1、不发布 npm。版本脚本同样不执行 npm publish。公开 npm latest2.0.3 的 metadata / tarball 在内存中核实了命令、上传地址和 Hermes 注册；其 base-cli 包名与当前源码不同，不据此改依赖或发布版本。

## 验证

冻结安装正常 prepare，core / CLI / API / Web 构建通过；编译后的 CLI --help 通过。本地 L2 正常 runner 通过（3文件 / 15用例），本地迁移、合成记录、临时用户目录，不执行真实备份。Playwright --list 仅验证发现，不宣称浏览器执行通过。

新指南中的 standalone API runner 已实际启动；/api/live=200、/api/me=200 且仅测试身份 dev@localhost，/v1/live=404。自有 runner 已停止，17020 / 27019 空闲，.dev.vars 未创建或覆盖。四份新 / 重写 docs 的链接、锚点、图片、换行、Bash语法、manifest命令、双语示例与八节顺序通过；旧开发指南的进入 README 锚点也已修复。所有候选 evidence 在基线存在，git diff --check通过。

日志：/tmp/readme-refresh-otter-install.log、/tmp/readme-refresh-otter-build.log、/tmp/readme-refresh-otter-l2.log、/tmp/readme-refresh-otter-browser-list.log、/tmp/readme-refresh-otter-local-runner.log。

正常 unit / typecheck / coverage 与 publication hooks 均已通过。未运行完整 Playwright、真实扫描 / 登录 / 上传 / 图标导出、npm publish、手动 Worker 部署或远程迁移。

## 发布

主代理批准见 `otter.review.md`。正常 pre-commit 的 unit / typecheck / lint / staged Gitleaks 与正常 pre-push 的 OSV、全历史 Gitleaks、coverage、本地 API / CLI 集成均通过。未绕过 hook、未改版本或实现。

提交 `18e5563515a2e7e7f4187c0b8a14464c47bddd7c` 仅包含批准的五份 docs。提交后再次 pull，确认仅领先这一个文档提交再 push；main 干净对齐，GitHub contents API 回读两份 README 与本地逐字节一致。

CI [34231884673](https://github.com/nocoo/otter/actions/runs/34231884673) 与自动 Release [34232009908](https://github.com/nocoo/otter/actions/runs/34232009908) 均已 success。日志：`/tmp/readme-refresh-otter-commit.log`、`/tmp/readme-refresh-otter-push.log`。
