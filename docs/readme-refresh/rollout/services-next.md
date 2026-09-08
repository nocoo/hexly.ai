# Services 工作线交接

2026-09-08 主代理已批准 Echo 和 Noheir，详见对应 `.review.md`；Echo 发布结果请补齐。Wooly / Dove 复核中。

接着调查 Ellie、Firefly、Backy、Pika，再 Surety、Bat、Otter、Lyre，再 signoff.now、Bogo、Frogie。每项交 review，收到书面批准再正常 hooks / pull / push；遇到执行失败先记录并报告 root，继续其他独立项。

Bogo 使用 `/Users/nocoo/workspace/personal/.readme-refresh-20260908/bogo`；Frogie 使用 `/Users/nocoo/workspace/personal/.readme-refresh-20260908/frogie`。独立副本已从远端 main clone 并 pull，原目录存在无关待推送提交或分叉，保持原样。

团队调度：Apps 工作线当前已完成首批并处于 idle。请顺手用 direct collaboration.followup_task 向 `/root/readme_apps` 转达 `apps-next.md` 中的 root 批准与下一批任务（root 接手 Xray / R2Shot / Neo / Pew Game 发布；Apps 直接继续 Life.ai / Zhe / GeekHub / Dotty）。这一交接无需另行 review；root 继续核对其完整文稿。

主代理恢复更新：Apps 已通过 followup_task 唤醒并显示 running。Dove 当前 main 干净且与 origin/main 对齐，请补齐实际发布回执；继续 Ellie / Firefly / Backy / Pika。

主代理补充：Firefly 四份文档与资料已批准，root 只把 MCP full 范围写成实际的文章 / 标签 / 分类。可正常发布；不触发 Worker 发布或远程迁移。Ellie CI 成功、Release 仍跟踪中；后续继续 Backy / Pika。

主代理补充：Ellie 的 CI 34224755255 与 Release 34225174210 均已 success，root 已独立核验，记录在 publication-audit.json。补齐 published 回执后即可资料集成。

主代理补充：Backy 已完成全文 / 源码复核并批准，见 backy.review.md 与快照。继续正常发布并处理 Pika / Surety / Bat / Otter / Lyre / signoff.now / Bogo / Frogie。

主代理补充：Firefly CI 34226012749 已独立核验 success，补齐 published 回执即可集成。

主代理分工调整：Bogo / Frogie 转交 Native 工作线，在其完成 Unseal / Raven 后处理；你负责其余 Pika、Surety、Bat、Otter、Lyre、signoff.now 和已批准项目发布。不要重复调查或编辑 Bogo / Frogie。

主代理补充：Pika 已完成全文 / 源码复核并批准，见 pika.review.md 与快照。root 仅修正开发说明的默认 Vite 代理地址，并澄清调查中的 Release 依赖关系；请正常发布四份 docs 后继续 Surety / Bat / Otter / Lyre / signoff.now。

主代理补充：Surety 全文 / 源码复核已批准，见 surety.review.md 与快照。root 修正了四份文稿中附件 rm 的表述：它删除元数据并尝试删 R2，而非只删元数据；五份 docs 请重新暂存后正常发布。继续 Bat / Otter / Lyre / signoff.now。

主代理补充：Bat 四份文稿 / 源码复核已批准，见 bat.review.md 与快照；独立副本避免覆盖原 `.dev.vars` 的处理正确，正常 hooks 后发布。root 已回读 API E2E 全通过日志。继续 Otter / Lyre / signoff.now。

主代理补充：Otter 五份 docs / 源码复核已批准，见 otter.review.md 与快照；root 已回读 L2 日志并核实本地联调命令。正常提交、pull、push 后继续 Lyre / signoff.now。17020 与 Pew 共用，Pew 现已结束全部测试并推送，端口已释放，可独占运行 Otter；Bat 的 CI 与 Release root 已核验 success。

主代理接手 Lyre 原生 hooks 的隔离分析：已读 lyre.md 中的真实录音和 hosted app 启动边界。在 root 给出可复核的隔离方案前，请保持不启动原生 tests / hooks，继续完成 Lyre 文稿以及 signoff.now 的独立调查与改写；不必停等本问题。Otter CI / Release 已由 root 独立确认并集成本站。

最终队列调整：Apps 工作线已完成且空闲，signoff.now 从现在起交给 Apps 独立完成，避免 Lyre 耽误最后一项。root 检查 signoff.now 原 checkout 仍干净。Services 只继续 Lyre 文稿 / TS 与 API 验证；若已有 signoff.now 调查发现，请直接发 Apps，勿再编辑其文件。Native 完成 Frogie 发布后协助 Lyre 原生隔离方案，仍由 root review。

root 收尾复核补充：已核对 Lyre job-processor、AI summary prompts、转写播放器与 native downmix，正文主要功能 / 边界准确。`packages/api/src/services/ai.ts` 固定要求简体中文摘要，请在双语功能段把“生成摘要”精确为“生成中文摘要” / “generate Chinese summaries”，docs/08-development.md 对应补一句当前输出语言。其余正文暂不改动；原生测试段等 Native 隔离方案落地再同步。继续不启动原生 tests / hooks，root 尚未批准 Lyre 发布。

root 已直接完成上述三处摘要语言修订，Services 恢复后无需重复；继续负责 native runner 落地后的四文档同步和发布回执。

14:08 UTC root 确认可以同步 docs：project.yml 已修复，安全与 live 两种 build-only 的实际 env 分别 host=1/live=0 与 host=1/live=1；空宿主 sentinel6项全部通过。可以应用 /tmp/readme-refresh-lyre-native-doc-draft.md 到4份 docs，注意 DerivedData 只在成功时删除，失败/中断与所有 .xcresult 保留。root 正在全默认 native tests，暂不提交/push。请更新后交最终摘要供 root 批准。
