# Pew 主代理复核

2026-09-08，基线 `6eeccb962fe41a03e43c543592900673b9795211`。批准当前双语 README、文档索引及 overview；正常 hooks 提交、再次 pull 后 push main，不运行版本发布脚本或 npm publish。

## 复核依据

- 全文核对中英文文稿、索引、当前 manifests、CLI 入口、driver registry、会话上传转换、SQLite 适配器、登录与 notifier 注册、Web 查询 / 写入与价格来源，以及测试环境检查。
- token 与 session 来源集合不同，Hermes 和 VS Code Copilot 当前没有 session driver。正文列出实际支持来源，不沿用固定工具数量。
- 上传 token 为半小时聚合；会话 payload 包含精确时间、消息数和项目引用，不包含对话正文。项目引用是截断 SHA-256；README 未把它描述为匿名性或不可逆性保证。
- Node shebang、base-cli、Bun 工作区，以及 SQLite 来源使用 bun:sqlite / node:sqlite 的条件均有源码支持。根 build 只构建 core 与 Web，CLI 构建命令单独列出。
- 浏览器 / 一次性代码登录、固定 CLI 主机和七类自动同步配置与当前实现相符；默认注册邀请码可由设置关闭。
- read Worker 是查询必需依赖，批量统计写入 Worker 与其余 D1 REST 写入分开。KV 查询 / 价格缓存、R2 团队及组织 Logo、Basalt / Next.js / Auth.js 均属当前链路。
- 成本说明保留价格表估算及日志字段完整度限制；没有把用量当作生产力或准确账单。旧 PRIVACY.md 的 never parsed、irreversible 绝对措辞已经登记为历史文档差异，本轮 README 没有复用这些保证。
- CLI 流程测试使用临时数据；API / 浏览器 runner 验证独立 D1 和 Worker 地址并检查测试标记。README 列出必要配置和端口，没有介绍质量门槛。

## 验证与发布条件

双语 shell、链接、基线证据与空白静态检查通过。代理已核对测试配置完整性且资源与应用环境不同，只输出布尔结果。正常 pre-push 继续执行原有 API / 浏览器 / 安全检查，先确认 17020 / 27020 空闲；不修改 hooks 或断言。测试产生的 next-env.d.ts / tsconfig 差异仅在确认属于 runner 生成后撤出，不纳入文档提交。

## 发布检查中的必要修复

两次完整 pre-push 都只有 GET /api/achievements 在原有 30000ms 超时；其余 115 项 API、55 项浏览器与安全检查通过。root 阅读路由和数据库适配器后确认，每个成就的用户列表与人数是两项独立只读 RPC，却逐项串行等待。

root 只在 `packages/web/src/app/api/achievements/route.ts` 将这两项查询改为 `Promise.all`。各个成就仍然串行处理，同一时刻至多两项社交查询；SQL、隐私条件、返回结构和失败处理保持现有语义。改动为 4 行增加、2 行删除，没有修改 hooks、测试断言或时限。先阅读该 Next 版本随包文档，再完成代码审核。

现有四组相关测试共 88 项通过，完整 pre-commit 的单元覆盖率与静态检查通过，形成 `239e858e68bc696175f5406317bad0716b544a65`。再次 pull 后的完整正常 pre-push：116 项 API、55 项浏览器与安全检查全部通过；此前超时的成就请求为 24418.67ms，低于原时限。结果是本次隔离环境的观测，不作为性能保证。

文档提交 `5926727bbdf303e4dd9a922c7ed8d2a427299fab` 与此修复一并 push main；所有包版本仍为 2.29.1。root 只撤出精确的 Next 输出目录差异；两个未跟踪的 agent 文件与安装版本生成器输出逐字节一致后清除，未修改已有 CLAUDE / AGENTS。代码文件摘要与远端 README 摘要保存在审核快照和候选回执中；日志为 `/tmp/hexly-pew-fix-commit.log` 与 `/tmp/hexly-pew-fix-push-retry.log`。
