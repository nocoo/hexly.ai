# Lyre 原生隔离补丁的 Native 复核

状态：2026-09-08 14:02 UTC，进行中的只读 review，root 正在实施。本文件不是最终通过结论。

已看到 native-next.md 的 13:57 UTC 分工更新，Native 已停止实现，转为只读复核；一次 apply_patch 在第一项发现 @main 已被 root 移除后校验失败，没有写入任何文件。后续不会并发编辑 Lyre 源码，也不运行 build / tests / hooks。

## 当前草稿中的即时发现

1. `apps/macos/project.yml` 的 `schemes:` 插在 Lyre target 的 DEVELOPMENT_TEAM 后、ENABLE_HARDENED_RUNTIME 前，后续 app settings 被错误放进 LyreTests scheme 的 environmentVariables，原 LyreTests target 也落在 schemes 下。请将完整 schemes 段移到原 targets 块之后，再 xcodegen。否则不只是生成格式差异，会丢失 / 改变 target 定义。
2. `scripts/test-macos.ts` 的 finally 无条件删除 DerivedData，失败时也会丢失 xctestrun / 构建中间物，且与本次 review 要求保留失败诊断相冲突。建议仅成功且无需继续 test-without-building 时清理 DD；失败 / spawn error 保留整个本轮目录，并始终保留 result bundle。
3. runner 目前没有向 xcodebuild 转发 SIGINT / SIGTERM、等待 child 退出的逻辑。后续显式 live 入口尤其需要保证 wrapper 被中止时不会留下采集进程；普通测试也应使用同一清理路径。不能只依赖进程退出码或终端进程组。

## 已复核的方向

Debug 入口在 LyreApp 构造之前调用空 Settings App；Release 分支直接 LyreApp.main，方向符合批准。原 LyreApp 目前只有删除 @main 的一行差异。nativeTestEnvironment 会覆盖带 / 不带 TEST_RUNNER_ 的 live 变量，并保留 DEVELOPER_DIR；普通路径不受继承的 live=1 影响。两个 hook 仍保留 SwiftLint 与其他原检查；Vitest 只增加 scripts test include，未改覆盖门槛。

后续等待 root 完成 RecordingE2ETests 和生成工程后，继续核对全部录音结果断言、前置 opt-in、等待停止的清理、xctestrun env、Release 构建可用性与精确文件摘要。

## root 修复与验证收尾

上列三项发现均已修复：schemes 位于完整 targets 之后，xcodegen 的原 settings / version 保留；runner 失败/中断保留 DerivedData，并转发 SIGINT / SIGTERM、等待 child close。root 已在无真实 Xcode 的替身进程上逐一验证失败退出和两种信号。安全/live build-only、空宿主 sentinel、完整默认 native tests 及 Release build 均通过，详见 `lyre.review.md`。这是主代理的验证结论，保留 Native 原始草稿发现以供追溯。
