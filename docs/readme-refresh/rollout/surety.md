# Surety README 调查与交付

状态：published。基线 `4deaf7e83ffb79a90eb1032a3a9cf91c35cdc767`；调查前 main 干净、与 origin 同步并已 pull。五份文档已获主代理批准，正常 hooks / 再次 pull / push 完成。版本与源码配置不变。

## 文档范围

中文根 README、完整英文 README、新建 docs 索引、新增 `docs/20-development.md`，以及现有 `apps/cli/README.md` 的必要纠错。保留原 logo、站点位于语言链接之前，统一八节且测试段不含固定计数或门槛。

## 关键事实与差异

一个 Hono Worker 同时托管 SPA 和 API；D1 使用 Drizzle binding，R2 ATTACHMENTS 保存 PDF / JPEG / PNG（每份保单 20 个，每文件 50 MiB）。成员、保单、资产、医院、医生和就诊均有网页及路由；终止 / 计划退保已实现，CLI 无专用转换子命令。受益人目前只读，附件上传在 Worker / Web 已存在，旧 CLI 文档称 API 缺失已纠正。

同实例用户共享一组家庭资料，业务表不按邮箱隔离。CLI 默认登录域 surety.hexly.ai 与数据 API surety-api.hexly.ai 分开；Worker 机器域判断写死后者，自行托管需同步适配。当前 base-cli 使用 config.dev.json，不是旧 CLI README 的 .surety-dev 目录。读取公开 npm tarball（当前 2.0.0，依赖仍为 @nocoo/cli-base），确认基本 login / URL / data 命令示例；没有安装或执行发布包。

默认 Vite 代理到生产 API，并可注入 SURETY_DEV_API_TOKEN，因此不再把直接启动列为隔离快速开始。Wrangler D1 / R2 本身没有 remote=true；本地空数据库和 cf/Host 认证判断仍需处理。根 .env.example 的 NextAuth / Worker proxy 部分过时，不推荐照抄。db:push 是远程 Drizzle 管理面；db:seed 是会清空数据的旧远程 proxy 脚本，当前初始化应从自己的 schema / 隔离 runner 入手。

JSON 导出包括全部业务表、附件元数据和 settings（可能包含 Backy 密钥），不含 R2 文件及 api_tokens。Backy 推送复用该 JSON，没有额外 R2 文件备份或自动 cron。续保是页面日历，没有邮件任务。

发现并复现两个已有实现缺口，仅记录，未改源码：

1. Worker backup route 调 restoreBackup 时没有 D1 batch executor，直接进入 BEGIN TRANSACTION。使用刚由正常 L2 runner 创建的独立本地状态、显式 --local、测试身份重新启动自己的 Worker，GET backup=200，POST 同一合成 payload=500（Restore failed: Failed query: BEGIN TRANSACTION）。诊断结束后停止自己的进程组。数据库恢复不能在 README 中描述成已经可用。
2. CLI logout 删除内存字段后调用 merge-writing ConfigManager，旧 token 会重新合入。用 /tmp 内独立 ConfigManager 和 synthetic token 验证保留现象；没有读取或改动 ~/.config/surety。文稿说明手动清理本地字段和浏览器会话撤销 API 的边界，不把 logout 成功当作 server revoke。

## 验证

冻结安装正常 prepare 通过；正常 `test:l2:http` 13 个用例通过，含真实本地 D1 / R2 的附件完整往返与保单状态。日志 `/tmp/readme-refresh-surety-l2.log`。恢复诊断 Worker 日志 `/tmp/readme-refresh-surety-restore-worker.log`。

CLI --help 通过；`bun run test:e2e:browser --list` 发现 77 项 / 16 文件，日志 `/tmp/readme-refresh-surety-browser-list.log`，未把发现测试等同于执行浏览器测试。未运行真实身份、生产数据、远程 seed / schema push 或 Backy 投递。

五份文稿已检查相对链接、锚点、图片、换行、bash 语法、manifest 脚本及 git diff --check。CLI 命令签名中的 <id> / 可选参数标为 text，避免被当作可直接执行脚本；缴费 JSON 示例修成当前必要字段。正常提交与推送检查已执行通过。候选 JSON 全部 evidence 路径在基线存在。

## 发布前提

主代理已复核并批准五份文稿、候选资料及上述限制。自动 Release 在 main CI 成功后构建 / 部署，不包含 schema push；tag 分支才核对严格版本。本轮不改版本、不发布 npm、不运行远程迁移。

## 发布结果

已发布 `9df59e70a7bef048bae8ef2ad1f04e926d5d2491`，main 干净且与 origin/main 对齐。双语 README 经 GitHub contents API 逐字节比对一致。正常 pre-commit 与 pre-push 均通过（类型 / lint、单元、内存 Hono E2E、本地 D1/R2 HTTP、Gitleaks / OSV），日志 `/tmp/readme-refresh-surety-commit.log` 与 `/tmp/readme-refresh-surety-push.log`。CI [34228768358](https://github.com/nocoo/surety/actions/runs/34228768358) 与 Worker Release [34229077544](https://github.com/nocoo/surety/actions/runs/34229077544) 均成功；未运行远程 schema push、seed 或真实家庭数据操作。
