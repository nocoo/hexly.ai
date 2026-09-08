# Backy README 整理记录

## 状态

待主代理 review，未提交 / 推送。调查基线 `5b23349c94ac6778f2242a857386e8b01dac4f1c`；开始时 main 干净、0 ahead / behind，已 pull。仅修改根 README、英文全文、现有 docs 索引、新增 `docs/10-development.md`。

## 源码核实

- 当前是 Hono Worker + Vite / React SPA，生产一次 Worker 部署同时提供静态文件。D1 元数据 / R2 文件，业务在 packages/api。apps/cli 仍只输出 placeholder，不编造 CLI 用法。
- 普通网页 / webhook 上传 50 MiB；R2 直传上限 5,000,000,000 bytes，必须 init → 按返回 headers PUT 临时 key → complete 复制到最终 key并登记。上传原文件不局限于旧 README 的 ZIP/JSON，识别 gzip/tgz 并允许未知格式保存。
- JSON inline 限 5 MiB；解压有 50 MiB 原压缩 / 解压限制与 10 MiB JSON 提取限制。提取一个 JSON，不能称完整压缩包浏览。
- Restore 用项目 token 与可选IP限制返回 900秒签名 URL，不自动恢复业务数据库。R2 binding 没有 presign；要配置 S3 凭据与同桶账号 / bucket，还用于 complete CopyObject。
- GET webhook环境过滤只影响最近记录，total_backups仍是项目总量，文稿明确。HEAD/GET也会写审计日志，未去生产调用验证。
- 每小时触发按 UTC小时对1/12/24取模；发送应用回调，应用再推文件。回调HTTP成功不能证明已收备份。scheduled虽有binding-only旧注释，实际传 CRON_SECRET 调用同一handler；缺失 secret 时自动备份返回500，但GC仍尝试运行。
- 默认 `bun dev`没有 `--local`，D1 / R2两处 `remote=true` 会访问远程。交互开发须先配置自己资源与Access入口，不提供测试绕过教程。现有.env无公开模板；未读取任何秘密值，只确认本地vars字段名。
- `isLocalhost` 依赖 request.cf 为空；本地 workerd也可能提供cf。E2E_SKIP_AUTH仅用于隔离runner，与CLAUDE invariant保持一致。
- 实际当前 Wrangler4.129.0源码：args.local将dev.remote设false，LocalRuntimeController仅在dev.remote!==false时创建remote proxy，因此测试显式--local会覆盖配置remote=true，不依赖猜测。测试S3签名借域名再重写回127.0.0.1，只访问本地模拟服务。
- `_test_marker`在 initializeSchema 中无条件写入，不能仅凭marker判断安全；先有--local隔离再检查marker。
- CD在mainCI成功后build、增量migration、deploy。migration依赖projects/backups基础表，不能完整初始化fresh production；测试schema初始化与生产增量流程分开记录。未新建生产库或执行现有remote初始化接口。
- 网站来自wrangler路由和Release验证地址backy.hexly.ai；实际MIT。保留原Logo、八节双语对应，无固定测试数量/门槛/hook制度。

## 验证

- 文档链接、图片、换行、bash语法、脚本引用与双语示例通过，`git diff --check`通过。
- workspace冻结安装且正常prepare，无配置/依赖变更。
- 正常 `bun run test:e2e:api` 全部通过（43cases）；端口17018事先确认空闲。runner使用本地D1/R2，验证schema/marker、上传、直传、complete与restore回读，自动停止自己的Worker。没有操作生产资源或现有用户开发服务。
- 完整单元覆盖率与正常发布 hooks 已通过；未单独运行浏览器 E2E。无真实 Access / 生产回调验证。

## 发布

已按 `backy.review.md` 批准，以正常 hooks 提交并发布 `59d53952558914c9bd0cfb5a950ecfe31598a86b`。推送前再次 pull，确认只推本轮四份文档；main 干净且远端对齐。两个 README 已按该提交逐字节回读一致。版本不变，CI [34227241522](https://github.com/nocoo/backy/actions/runs/34227241522) 与自动 Worker Release [34227335089](https://github.com/nocoo/backy/actions/runs/34227335089) 均已成功；首次 run-list 连接重置后，重试已确认最终状态。

首次 pre-commit 在现有 S3 copy 测试的 5 秒超时处失败；该测试使用 dummy account / credentials。未改动的单文件重跑通过，随后完整正常 pre-commit（类型、staged 检查、secret、route / page checks、coverage）通过。pre-push OSV 通过；没有修改测试、环境或 bypass hook。日志为 `/tmp/readme-refresh-backy-commit.log`、`/tmp/readme-refresh-backy-ctx-retry.log`、`/tmp/readme-refresh-backy-commit-retry.log` 与 `/tmp/readme-refresh-backy-push.log`。
