# README 全量推广记录

## 授权与目标

2026-09-08，用户确认 Snaky、Steed 试点，要求 agent team 完成其余 47 个未归档项目，由主代理负责 review。沿用[已确认模板](template.md)，根 README 中文，英文版位于 `docs/README.en.md`；站点链接在语言链接之前；测试只写基本运行方法，不介绍 6DQ。直接 main 提交、push，不改版本号。调查前和推送前分别 pull。

首批的两份 README 与本站展示已经发布。此阶段逐项目重新同步和核实，不将旧初筛记录直接当作最新结论。

## 团队与批次

| 工作线 | 初始批次 | 后续队列 |
| --- | --- | --- |
| 服务 / Workers | Echo、Noheir、Wooly、Dove | Ellie、Firefly、Backy、Pika、Surety、Bat、Otter、Lyre、signoff.now；同步状态处理后 Bogo、Frogie |
| 桌面 / CLI | Runner、Rooster、Gecko、Codo | Owl、Flow、Hooky、IPSafe、Shrike、clip、Arena、Deca、Meowth、Unseal；同步状态处理后 Raven |
| Web / 应用 | Xray、R2Shot、Neo、Pew Game | Life.ai、Zhe、GeekHub、Dotty、Basalt、Matrix、Pew、Fundly、Poké Pocket、DreamRO、Dogfight、Gaga；同步状态处理后 Giraffe |
| 主代理 | 复查同步例外；review 每个项目；合并本站资料 | 验证双语和证据、批准发布、跟踪 CI、生成本站 profiles、部署与线上检查 |

每个工作线逐项目交付，初始批次四个项目。准备完成即通知主代理，不必等待整批。代理只编辑分配的仓库 README、必要文档索引，以及本站 `docs/readme-refresh/rollout/<id>.md` / `<id>.json`。本站代码、正式项目 JSON、总表和 Git index 由主代理管理。

## 单项目流程与交付

1. 检查工作区、分支、已有待推送提交和适用说明；执行安全 pull，记录调查提交。遇到已有工作或分叉时，先交主代理处理同步，不覆盖或发布无关提交。
2. 读取当前功能入口、manifest、配置、测试脚本和必要文档，核实用途、技术栈、首次运行条件及网站来源。明确旧文档漂移、已实现范围和真实限制。
3. 根据 Snaky / Steed 模板写内容对应的中英文 README，修正英文相对路径。保留已有 Logo 和版本；必要的编号文档 / 索引遵循该仓库现有规则。
4. 核对链接、示例、脚本入口和语言对应；按实际影响运行必要验证。文档变更不重复执行无关重型测试；正常提交和推送 hooks 必须运行，不能通过放宽断言、跳过 hook 或自动改版本取得通过。
5. 提交 `<id>.md` 调查和 `<id>.json` 候选资料，通知主代理 review。主代理核对完整 README diff、关键代码依据和本站文案，明确批准后才提交 / 推送该项目。
6. 发布前再次 pull、确认仅有本轮提交，再 push main；回读远端 README，记录提交、CI、部署与实际限制。本站只合并已经 review 并发布的资料。

候选 JSON 包含 `projectId`、`repository`、`checkout`、`baselineRevision`、`status`、`overview`，以及 `validation`、`publication`。`overview` 使用正式 schema，`verified.sources` 为该项目实际文件路径，`verified.revision` 为同步后调查源码提交。`status` 按 `researching → ready_for_review → approved → published` 更新；真实无法继续时记录 `blocked` 和原因。不要往本站 JSON 里写未核实的候选资料。

## 主代理复核要求

- 逐项验证项目目标与主要技术是否有源码支持；分清已实现能力、配置存在、占位实现和历史代码。
- 检查首次安装 / 启动的命令、环境模板、路径、运行时和测试前提；英文版必须包含同一事实、同一组可执行示例。
- 检查根 / 英文 README 的 Logo、站点和语言链接；不推断许可证，不使用固定测试数量或营销词替代功能说明。
- 保持本站原有 `source`、Logo、色板、排序和描述来源不变；新增字段使用同一双语目标 / badges 格式。
- 记录逐项目批准、修订、发布状态和未解决限制。最终生成 profiles，执行本站必要检查，并核对公开页面上的双语目标、技术栈和语言链接。

## 同步例外

已复核 Giraffe 原有改动、Frogie / Raven 分叉和 Bogo 未推送提交，四项均保留原状态。已从最新远端 main 建立独立 clone 并 pull；路径、源提交和原始状态见[独立副本记录](isolated-checkouts.md)。对应工作线在这些副本处理 README，原仓库的工作区、分支和本地提交保持原样。

## 当前进度

试点 2 / 49 已完成。剩余 47 项已授权实施，三条工作线均已开始。逐项目调查与候选资料放在 [rollout/](rollout/)；主代理复核意见和必要执行修复见 [review 台账](review-ledger.md)，最终发布清单随实施更新。
