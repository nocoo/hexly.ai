# Native 工作线交接

2026-09-08 主代理已批准 Runner、Rooster、Gecko，详见对应 `.review.md`。Runner hook 修复独立提交。使用进程级 `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer` 执行正常检查、commit / push；280 个 Runner 单元测试已由 root 验证。

Gecko 已有明确 `.review.md`，无需继续等待；先完成正常发布与回读。Codo review 正在进行。继续 Owl、Flow、Hooky、IPSafe，再 Shrike、clip、Arena、Deca，再 Meowth、Unseal、Raven。

Raven 使用 `/Users/nocoo/workspace/personal/.readme-refresh-20260908/raven`；原 checkout 存在无关未推送提交和分叉，不修改或推送原目录。

Codo 也已正式批准（`codo.review.md` 已写）。Runner 完整 Swift 测试存在 stderr 并发捕获挂起，允许诊断 `swift test --no-parallel` 保留完整用例；请把最小 hook 改动先给主代理核对后再提交，不等待一个永不结束的检查。

团队调度：Apps 工作线当前已完成首批并处于 idle。请顺手用 direct collaboration.followup_task 向 `/root/readme_apps` 转达 `apps-next.md` 中的 root 批准与下一批任务（root 接手 Xray / R2Shot / Neo / Pew Game 发布；Apps 直接继续 Life.ai / Zhe / GeekHub / Dotty）。这一交接无需另行 review；root 继续核对其完整文稿。

更新：Owl / Flow 已有正式批准文件；Flow 安装示例已由 root 统一成 frozen。Runner 的完整串行测试已获批准，root 已更新两处 hooks、CI 与 README 命令，见 runner.review.md。Gecko 的已有补丁例外也完成复核，root 已加入补丁回归前置检查、限期续期及源仓库复核文档，见 gecko.review.md。请分别正常发布，继续后续队列。

主代理恢复更新：Apps 已通过 followup_task 唤醒并显示 running，无需继续转发。Runner / Gecko / Owl / Flow 的书面批准均有效，继续正常发布和后续调查；若四项仍卡在同一 hook，请带最新日志通知主代理。

12:10 UTC root 更新：Hooky / IPSafe 已完成全文和源码 review 并批准，安装示例已改 frozen；IPSafe overview 目标做了精确措辞修订，快照已保存。Gecko / Owl / Flow 远端 main 的本轮 CI 均 success，记录在 publication-audit.json；三仓库已推送且干净，但候选 JSON 的 published 回执待补齐，方便 root 纳入本站。Runner 已有两项 task commit；继续正常发布。

主代理补充：Runner CI 34224762540 已全部 success，root 已核验并将资料并入本站。Runner 调查对 SQLite 偶发竞争的记录准确，保留此限制。继续 Hooky / IPSafe 正常发布及后续队列。

主代理补充：Shrike 全文 / 源码 review 已批准，root 仅补 Node 开发前提。发布前还原本轮生成的 next-env.d.ts 差异，不把它纳入文档提交。Hooky / IPSafe 回执已见，root 接手资料集成；继续 clip / Arena / Deca。

主代理补充：Arena 的完整复核已批准并保存快照，可正常发布；Deca 已交稿，root 正在 review。

主代理补充：Deca 已完成全文 / 源码复核并批准，见 deca.review.md 与快照；root 已回读三个本地集成测试日志全部通过。Shrike 的 CI 34226029547 已 success，可补回执。继续正常发布、Meowth / Unseal / Raven。

主代理补充：Meowth 全文 / 源码复核已批准，见 meowth.review.md 与快照。继续正常发布、Unseal / Raven。为平衡工作量，完成 Raven 后再接手 Bogo 和 Frogie 的调查、双语文稿与候选资料，仍由 root review 后正常发布；使用已准备的 `.readme-refresh-20260908/bogo` 与 `frogie`，进入前再次安全 pull，勿动原 checkout。Services 不再处理这两项。

主代理补充：Unseal 全文 / 源码复核已批准，见 unseal.review.md 与快照，可正常发布。Backy / Deca / Matrix 当前提交 CI 全部成功，Backy / Matrix 的 Release 也成功，root 已独立核验；继续 Raven / Bogo / Frogie。

主代理补充：Raven 全文与剩余认证 / count_tokens / hooks 源码复核已批准，见 raven.review.md 与快照。继续补齐 frozen 安装、模拟测试、构建和正常 hooks 后发布；不可将待完成检查记为通过。随后接手隔离 Bogo / Frogie。用户追加的本站 v0.5.0 发布由 root 处理，其他项目继续不改版本。

主代理补充：Bogo 全文 / 源码复核已批准，见 bogo.review.md 与快照。root 额外修订 docs/README.md，增加双语入口，标记旧设计文档与当前共享权限的差异并去掉治理简介；共三份 README 请一并暂存。完成 CLI 生成、浏览器及正常 hooks 后发布，确保 clip 实际运行而非软跳过；继续 Frogie。

主代理补充：Raven 两项测试补丁已完整 review 并批准，详见 raven.review.md 新节；root 已回读 deterministic-gate-2 通过日志。当前 app.test.ts 与 lib/utils.test.ts 可作为单独修复提交，随后正常发布双语 README；两个文件精确摘要已记录，不改业务、断言、基线或 hooks。Bogo / Otter checkout 已显示干净并对齐远端，若 Bogo 已完成请及时补 publication 回执；继续 Frogie 最后一项。

主代理补充：Frogie 全文 / 源码 review 已批准，见 frogie.review.md 与快照。三份 README 不需再改，可正常提交、pull、push；root 仅在调查 / candidate 补记构建日志中的 Vite 配置加载 warning。原 pre-push 的 scanner 失败不能当成功，请完成实际独立安全扫描并如实记录；不运行指向个人实例的浏览器套件。完成 Bogo / Raven / Frogie 发布回执后本工作线即可收束。

新增独立诊断任务（完成上述发布后）：Lyre 的正常原生 hooks 使用 hosted LyreTests，会启动 LyreApp、读个人 config / recordings 并默认启用 Teams 检测；RecordingE2ETests 仅查既有权限，有授权时会真录音。请在独立副本 `.readme-refresh-20260908/lyre` 只读审查最小持久化修复方案，写 `hexly.ai/docs/readme-refresh/rollout/lyre-native-isolation.md` 给 root review。可考虑与现有 live ASR 一致的明确录音 opt-in，以及正常 hook 内共享隔离 runner / test host 专用实例；不使用 HOME 覆盖、不修改用户权限、不运行真录音、不减任何纯测试断言。无需先编辑产品 / hooks；root 负责最终实现审查，Services 继续双语文稿和 signoff.now。

root 已全文读 LyreApp / AppConfig / RecordingManager / RecordingsStore / PermissionManager / RecordingE2ETests / project.yml / hooks，确认初始化风险。优先考虑“真实录音明确 opt-in + Debug test host 专用临时 config / recordings / UserDefaults + 禁止 test host 的 Teams / UI onAppear 副作用”；以可验证的启动环境标志检测为准，不能只假定 Xcode 会透传某个变量。真实录音用例保留为显式人工入口，其他纯测试全跑，报告明确区分。root 继续复核 Lyre 文稿与 API 源码，请尽快给最小方案，不重复已完成 README 调查。

root 补充源码确认：RecordingPipelineIntegrationTests 使用 fake capture 和合成 PCM；AppConfig / MeetingDetectionSettings 等纯测试已有临时路径或 suite 注入。注意两个不同层级的默认值：实际 LyreApp 注入 AppConfig 的 Music 路径；RecordingManager 独立构造的 fallback 仍为 Documents，因此其 defaultOutputDirectory 测试是准确的，不能据 README 的应用默认路径改测试。Frogie / Raven / Bogo 的最终 CI root 已独立审计成功，Frogie overview 已并入本站。

最新执行任务：root 已 review 并批准 Lyre 隔离方案，详见 `lyre-native-isolation.review.md`。请立即在独立副本实施并 build-for-testing，保持不跑完整 native / live tests；给 root 代码 diff 与 xctestrun 环境证据，静态复核后再依序跑无录音 sentinel 和完整普通 suite。Services 继续独占四份 docs。此任务无需再等方案许可，但发布仍需最终 review。

13:57 UTC 分工调整：Native 仍 idle，root 先接手隔离代码实施以继续推进。Native 被唤醒后请先做只读 patch review，不要同时编辑 Lyre 源码或运行原生测试；root 会提供构建与 sentinel 证据。Services 仍负责四份文稿和批准后的发布。

14:08 UTC root 进展：已修复 project.yml，并生成完整两套 shared schemes；真实录音三项已在 suite trait + helper 双层 opt-in 前置关闭，保留全部结果断言，异常路径 await stop 后才删临时目录。runner 已转发 SIGINT / SIGTERM 至独立 xcodebuild 进程组，等待 close，失败/中断保留 DerivedData。安全与 live 两种 build-for-testing 均通过，xctestrun 确认 host=1，recording 分别0/1；live 仅编译，未运行。隔离 sentinel 的6项（9个参数实例）全部通过，已确认 hostedTestsUseEmptyApplication 实际执行；SwiftLint4个补丁文件通过。root 正在跑完整默认 runner，请 Native 继续只读最终 patch review，不编辑/不重复运行。证据 /tmp/readme-refresh-lyre-native-build-environments.json、native-sentinel.log、各 .xcresult。
