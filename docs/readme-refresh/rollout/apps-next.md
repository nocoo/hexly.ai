# Web 工作线交接

重要同步更新：Basalt 工作区在初次调查后出现了本轮之外的 SEO 代码改动（index.html、vite.config.ts、页面与新的 seo 脚本）。请勿在原 Basalt 工作区 commit / push。root 已准备独立副本 `/Users/nocoo/workspace/personal/.readme-refresh-20260908/basalt`，再次 pull 后基线未变，三份获批文档已迁入、校验通过、候选 checkout 已更新；原库只撤出了本任务的三份精确 docs 改动，SEO 代码和 index 未动。请在独立副本正常 install / hooks / commit / pull / push。继续 Matrix / Pew 不受影响。

2026-09-08，主代理已明确批准 Xray、R2Shot、Neo、Pew Game 四项，详见对应 `.review.md`。主代理现接手这四项的正常 hooks / 提交 / 发布与回读；Apps 代理请直接继续下一批 Life.ai、Zhe、GeekHub、Dotty，避免重复操作这四个仓库。

后续批次依次为 Life.ai、Zhe、GeekHub、Dotty；再 Basalt、Matrix、Pew、Fundly；再 Poké Pocket、DreamRO、Dogfight、Gaga；最后 Giraffe。无需等待本工作线所有发布完成才继续调查；遇到 hooks 失败通知主代理并先推进独立项目，不改断言、不跳过 hook。

Giraffe 请使用已 pull 的安全独立副本 `/Users/nocoo/workspace/personal/.readme-refresh-20260908/giraffe`，不要修改原仓库现有工作区。共用端口（尤其 Workers 的 18787）请协调占用。

主代理补充：Life.ai 补充复核通过，life-ai.review.md 与快照已保存，批准正常发布四份文档。Zhe 文稿 root 正在 review。

主代理补充：Life.ai、Zhe、GeekHub 均已批准，详见各自 review.md 和快照，按当前文件正常发布。Zhe root 修了 Node / Bun 用途和 browser AUTH_SECRET 前提；GeekHub root 修了 AI 设置先启用再验证的顺序。Dotty 正在 review。完成已交稿四项后继续 Basalt / Matrix / Pew / Fundly，保持逐项交审。

主代理补充：Dotty 也已批准，当前四项 Life.ai / Zhe / GeekHub / Dotty 均有完整书面 review，可正常发布并继续下一批。

主代理补充：Basalt 已获批准，见 basalt.review.md 与快照。继续正常发布和 Matrix / Pew / Fundly 后续队列；只发布文档，不运行 npm publish。

主代理补充：Zhe CI 34225860218 已 success，Dotty CI 与 Release 也均已 success。root 回读 GeekHub push 日志：构建缺少 Supabase URL。可用仓库 tracked .env.test 的隔离占位值为正常 build 提供环境，不改业务代码；仍先核对 .env.test.local / 进程配置不会引向生产，按现有 runner 真实记录数据库条件跳过。不要注入生产凭据。

主代理补充：Matrix 全文 / 源码复核已批准，见 matrix.review.md 与快照，可正常发布。Basalt 已完成独立副本迁移，务必使用本文件顶部提供的新 checkout。

主代理补充：Basalt 首次 pre-commit 的两处 anchor 错误已由 root 修订，在独立副本的双语 README 添加 css-setup / component-usage 稳定 id；catalog-api:check 已通过，复核记录 / 快照已更新。请重新暂存这三份 docs 后完整正常提交，保留所有原检查。

主代理补充：Basalt retry 日志中的 bad.json parse 输出属于测试中的失败场景，随后全部测试通过且已提交 74a1ea1；无需修改 formatter。继续正常 pull / push。Matrix 已见 published 回执；Pew root 接手复核。

主代理补充：Pew 全文 / 源码复核已批准，见 pew.review.md 与快照。正常提交三份文档并运行原 pre-push；先确认 17020 / 27020 无其他进程，核对 runner 生成的 next-env.d.ts / tsconfig 差异后只撤出本次噪音。继续 Fundly 及后续队列。

主代理补充：Fundly 全文 / 源码复核已批准，见 fundly.review.md 与快照。root 只润色中文一句话与候选 goal，三份文档可正常发布；已有覆盖率 / lint warning 保留调查记录。继续 Poké Pocket / DreamRO / Dogfight / Gaga / Giraffe。

主代理补充：Poké Pocket 全文 / 源码复核已批准，见 pokepocket.review.md 与快照。root 只精确调整中英文安装说明中的许可证措辞，三份 docs 重新暂存后正常发布。其 HTTP 17048 与本站共用，root 会等此项检查结束再跑本站。继续 DreamRO / Dogfight / Gaga / Giraffe。Basalt CI 与 Release 已全部 success。

现场提醒：root 当前看到 Pew 在 next-env.d.ts / tsconfig.json 之外，还出现未跟踪的 `packages/web/AGENTS.md` 与 `packages/web/CLAUDE.md`。这两份不属于 README 任务，不删除、不暂存、不推送；先识别是否有同时进行的其他工作。只撤出明确由本轮 runner 生成的两项 Next.js 配置噪音。DreamRO root 正在复核。

主代理补充：DreamRO 已完成全文与源码复核并批准，见 dreamro.review.md 与快照。两份 README 可正常发布，跟踪完整浏览器 CI / 自动 Release；继续 Dogfight / Gaga / Giraffe。

执行分工更新：Pew 的 push-retry 日志只有 hook code 1，root 接手 Pew hook 诊断与其正常发布，请勿再并行启动该仓库的 push / tests；Apps 继续 Poké Pocket / DreamRO 与余下三项。Poké Pocket commit-msg 要求首行全小写，使用 `docs: standardize bilingual project readme` 等不含大写的提交信息重试即可，不改规则。

主代理补充：Dogfight 已完成全文 / 源码复核并批准，见 dogfight.review.md 与快照；root 仅将中英文锁定角写为“与机头方向夹角小于 21°”，请重新暂存双语文稿后发布。继续 Gaga / Giraffe。

Pew 诊断：两次 L2 都仅 `/api/achievements` 在 30 秒超时，115 项通过；L3 55 项与 G2 通过。root 已将单个成就的列表 / 人数两项独立只读 RPC 改为成对并行，准备跑现有全部相关测试与正常 hooks；SQL、响应、断言和超时不改。新 AGENTS.md / CLAUDE.md 已证实由当前 Next dev 的 generate-agent-files 写入，root 会在检查结束后仅清除这两份本轮生成文件，不提交它们。

主代理补充：Gaga 已完成全文 / 源码复核并批准，见 gaga.review.md 与快照；root 仅精简双语测试章节的覆盖项目罗列，请重新暂存两份 README 后正常发布。继续 Giraffe。

CI 跟踪更新：root 独立核验 Pew 239e858e 的 CI 成功，Pew 已完成清理、推送和远端回读。Poké Pocket 8698f1ac 的 CI 成功，但 Release 34230523621 已 failure；请立即读取失败 job 日志、诊断原因并处理已有发布路径，不更改版本或跳过检查。Bat 与 DreamRO 的 CI / Release 均成功。

root 已收到 Giraffe 交稿，将在 Otter 后立即复核。请继续独立核对 Poké Pocket / Dogfight / Gaga 的 Release 失败步骤，比较三个 workflow 的 secret 名称和 DreamRO 成功配置，查明认证失败属于缺失 / 错误环境映射、过期 token 或权限范围。可读取 gh secret list 元数据，不输出 token 值；先把具体原因与最小修复给 root，不改 secrets 或改版本。root 负责最终汇总与本站 release。

主代理补充：Giraffe 全文 / 源码复核已批准，见 giraffe.review.md 与快照。三份 README 可正常 hooks / browser / pull / push；未改文稿、版本或运行配置。优先完成这一最后项目的正常发布，同时保留三个自动 Release 的准确认证诊断。

最终队列调整：root 已核验 Giraffe / Poké Pocket 的最终 CI 与 Release success，收到 release-auth.md。现在请接手尚未改写的 signoff.now（本站 id 为 signoff-now），从 `/Users/nocoo/workspace/personal/signoff.now` 的干净 main 再次 pull 后调查。按同一模板交付中文 README、docs/README.en.md、必要索引与本站 rollout/signoff-now.md / .json；root review 后正常 hooks / pull / push，版本不变。Services 专注 Lyre，不再编辑 signoff.now。继续保留 Dogfight / Gaga 两项凭据故障的准确记录，不新增 secrets 操作。

团队调度补充：root 的 direct collaboration 消息入口当前未能正常触发既有 idle 代理，请用你的 direct `collaboration.followup_task` 继续唤醒 `/root/readme_native`：其 Lyre 隔离实现已在 `lyre-native-isolation.review.md` 正式批准，立即按 `native-next.md` 最新任务实施、先 build-for-testing 交代码给 root，暂不执行原生 tests。再唤醒 `/root/readme_services` 读取 `services-next.md` 的摘要语言修订，随后等待 Native 落地同步四份 docs。无需等待 signoff.now 最终完成才转发；root 继续负责审核，不要重复或接手其源码。

13:57 UTC：root 已先接手 Lyre 隔离代码；唤醒 Native 时请转为只读 patch review，先读 `native-next.md` 最新分工，不并发编辑源码。唤醒 Services 后仍处理 docs 与发布。


Apps 收尾回报：signoff.now fixture 首次 bootstrap500 已定位为 Wrangler 从生产 routes 推导 local-upstream Host。README 改用 workspace 锁定 Wrangler（4.111.0）加 `--local-upstream localhost`，原 fixture 全流程已通过，Vite7042代理的HTML / live / stats / heatmap均200，fixture积分10。源代码、认证、测试和配置未变；原库无 .data/.wrangler，测试服务均已关闭。root 的折叠对象、team domain和shell安全占位符修订全部保留；候选 / 调查已回填。可进行最终摘要与发布批准，暂未操作Git index或提交。

Apps 调度回报：已向 /root/readme_native 发送 direct followup_task，内容为 root 已在 lyre-native-isolation.review.md 批准实施、按 native-next.md 立即 build-for-testing，暂不运行原生tests，Services继续独占文稿。

Apps 调度回报：已向 /root/readme_services 发送 direct followup_task，要求读取 services-next.md 最新修订（root已处理中文摘要措辞，无需重复），待Native落地后同步四份Lyre docs；当前不执行原生tests/hooks、不提前发布。两项团队转发均已调用，工具返回空成功输出，尚未收到代理回执。

root 最终批准：signoff.now 收尾复核通过，`signoff-now.review.md` 已更新；精确摘要由 root 保存。Apps 现在执行三份文稿的正常 commit / pull / push、远端字节回读和该提交 CI，不再等待其他项目。Lyre 由 root 继续实施，Native 只读复核，Services 同步 docs。

Apps 最终回执：signoff.now 三文档已正常发布为 `1d658480fe8e4fdd527fae437b7c8747537d86ef`，push前pull与原hooks全部成功，远端三文档字节一致，main干净且同步；CI34236025103已success。候选 / 调查完整回填，原版本和源码未改，无Release工作流。Apps额外接手的最后一项已完成，本工作线所有文稿任务完成。
