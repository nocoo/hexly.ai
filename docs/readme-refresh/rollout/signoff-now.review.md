# signoff.now 主代理复核

2026-09-08，基线 `51b679fba85d1a0cc81641e41f377ad77f867dd0`。已完成双语 README、索引和主要源码的全文 / 入口复核；下列收尾项已解决，批准正常提交发布。

## 已核实

- 当前实现是本地 Bun CLI 采集 ADO、Hono Worker 写入 D1、React SPA 管理实体与显示活动；pulse 的 GitHub 查询是独立辅助 CLI，没有将其误记为主管线 provider。
- 对照 Worker 入口、entry-control、Access / pipeline / principal 认证：机器域名首标签、管理接口与管线分离、Service Auth / common_name、开发回环与受信开发域名均有源码依据。真实 Access、ADO 与生产写入没有在本轮执行。
- 对照 collector、flags、ingest-normalized：active PR 全量、逐 PR 线程 / 迭代、项目级工作项、artifact 摘要与数量、manifest、scope 完成后的游标、全量重算清 stale 均准确。保留单写者和跨环境 ID 限制。
- 对照 score / identity、Dashboard / Activity：八类活动、配置时区、alias@suffix 匹配、7 / 28 / 92 天、按日对比、分页明细与 stale 数字抑制均为已实现能力；没有把积分当作质量或产出的充分度量。
- 运行 / 测试命令来自实际 scripts；Vite7042、Worker37042、先 build:web、default local D1 fixture、Settings1 和独立副本前提准确。当前没有 browser suite 或自动 Release workflow。
- 技术栈使用实际 dependencies，无 @nocoo/basalt 依赖；保留现有图源、MIT、站点在前的语言链接与运维锚点。

## 收尾发现与处理记录

1. root 已直接修订双语功能中的折叠对象、完整 Access team domain 前提，以及 shell 中会被当成重定向的尖括号占位符；请保留当前三份文稿并重新暂存，不覆盖这些修订。
2. root 已回读现有 fixture 日志：首次在 bootstrap 得到 HTTP500。请诊断实际 Worker 日志，区分运行环境与代码问题，补齐 README 启动条件或先交最小修复 review；不能将此 fixture 记为成功。
3. root 的工具入口未能正常唤醒 idle 的 Native / Services，请先按 `apps-next.md` 的最新团队调度用你的 direct followup_task 转发。Lyre 具体隔离实施已正式批准，需要 Native 继续执行；无需等待 signoff.now 发布。

## 最终批准

- root 重新核对双语启动、迁移与 fixture 命令，确认使用 workspace 锁定 Wrangler 和 `--local-upstream localhost`。未变更源码、认证或测试断言。
- root 回读原 fixture 重试日志：本地 migrations、bootstrap、ingest、热力图积分 10 和 timeline 全部通过；初次 Host 误判的失败过程保留在调查记录。Vite 与 Worker 代理的 200 结果、隔离副本及原 checkout 无 `.data/.wrangler` 的检查均有回执。
- 相对路径、fences、文稿禁止项及差异范围检查通过。保留 root 对折叠对象、Access team domain 和 shell-safe 占位符的修订。
- 批准 Apps 重新暂存三份文稿，执行全部正常 hooks，提交后再次 pull，再 push main，回读远端字节并核对该提交的 CI。版本、源代码与 CLAUDE 保持不变。
