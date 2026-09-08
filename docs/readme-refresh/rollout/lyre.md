# Lyre README 调查与交付

状态：published。双语文稿与原生测试隔离修复已正常提交、fresh pull 后推送；远端回读、CI 与自动部署全部通过。基线 `78b3a126f27a5adc53e4eaf4097b785ac7cb609e`，独立 checkout `/Users/nocoo/workspace/personal/.readme-refresh-20260908/lyre`。四份 docs 与 overview 已批准；下述 native 调查为修复前基线，当前结论见末尾。

主代理已完成中文摘要输出语言的文稿修订，并在 `lyre-native-isolation.review.md` 批准空测试宿主 / 共享 runner 的实施。该批准尚不允许直接运行原生 tests / hooks 或发布；Services 保持四份文稿所有权，待实际 runner 与验证结果落地后同步原生测试入口。最新分工由 root 实施源码，Native 只读复核。 Services 同步文稿前只读检查了新 runner；临时观察记录在 `/tmp/readme-refresh-lyre-doc-sync-observation.md`，请 root 先核对 project.yml 的 schemes / targets 分组后再生成工程。

## 原生测试隔离的初始发现（修复前）

正常 pre-commit 与 pre-push 都运行整个 LyreTests scheme。`RecordingE2ETests.swift` 的三个用例只检查已有 Screen Recording / Microphone 权限：已授权时会真实录音，未授权才记录 known issue 并跳过，没有显式测试 opt-in。此次 README 工作未授权采集用户当前声音，所以尚未启动这些测试或相关 hooks。

scheme 是 hosted tests，project.pbxproj 的 TEST_HOST 指向 Lyre.app。LyreApp.init() 会读取默认 AppConfig，并初始化默认开启的 Teams 检测设置；RecordingsStore 构造只保存目录 URL，但 SwiftUI 场景启动后可能扫描个人录音目录。正常 native hooks 还需隔离应用用户目录，避免触碰用户实际配置和录音。没有改测试、实现或 hooks，没有自行禁用 gate 或更改系统权限。Native 工作线正在独立完善方案，见 lyre-native-isolation.md。

已验证原样 macOS 应用可编译。系统 xcode-select 指向 Command Line Tools；完整 Xcode 位于 /Applications/Xcode.app，使用仅当前命令的 DEVELOPER_DIR 与 /tmp/readme-refresh-lyre-derived 后 build 成功，没有启动应用或录音，也没有全局修改工具链配置。

## 文稿与实现

根中文 README、完整 docs/README.en.md、新 docs/08-development.md、现有 docs 索引。保留 logo、站点在语言前、八节与双语示例一致。去除不存在的 deploy:test、固定测试数和供应链制度正文；不改版本、CLAUDE、依赖或实现。

单 Hono Worker 同时服务 API 与 SPA，构建产物实际是 apps/api/static。Vite7016 固定代理本地 Worker7017；worker:dev 使用仅本地 test 环境。当前栈为 SWR / Basalt、Vite6，不沿用旧的 TanStack Query / Vite7 宣传。

浏览器先预签名、直传 OSS、创建资料；上传完成不自动转写。500MiB 是网页限制，presign 仅检查 audio MIME。DashScope 无 Key 时使用 mock，这并不替代 OSS 配置。生产 cron 每分钟轮询，单任务 GET 也推进状态；词级高亮依赖尽力归档在 OSS 的原始时间戳。摘要可手动 / 自动，失败独立于转写状态。

macOS15+ / Swift6 / Xcode16+。当前默认双轨录制，上传前尝试单轨降混，失败回退原文件；原本地录音保留。配置为 Application Support/Lyre/config.json，Token 明文JSON而非 Keychain。Teams提醒默认启用、可以关闭，开始/停止录音需要用户确认。

JSON 导出含资料、文字、设置和设备Token哈希；设置可能含AI/Backy Key，不含OSS文件和Worker secrets。导入按ID合并/更新。Backy pull 触发生成并推送备份，不是从Backy导入数据。Storage页面扫描整个OSS bucket，清理仅检查已登录与对象孤立状态，无独立admin角色；文稿写明受信任管理场景。

main CI 后自动 Release 构建 / 部署 Worker，不迁移D1，不自动附DMG。生产SQL在packages/api/migrations，wrangler.toml没有migrations_dir；旧文档新库遍历全部SQL不能反复用于已有库。GitHub latest v1.8.0 目前无二进制附件，因此只给源码打包方式，未声称可下载DMG。

## 独立副本与验证

原 main 干净并已 pull。原 apps/api/.wrangler/state 存在，L2/L3重建默认测试D1表；因此创建同基线独立clone，不触碰原本地数据。首次clone遇GitHub SSL中断，正常重试clone/pull成功。首次冻结安装网络连接停滞，核对自有PID/cwd后停止，仅重试正常冻结安装，normal prepare通过；没有改lockfile或配置。

Web build通过，原样Vitest单元通过（25文件 / 253用例）。原样本地API E2E输出45 pass / 0 fail，其中真实ASR probe明确因未启用LYRE_RUN_LIVE_ASR而提前返回；不将此算作真实ASR验证。Playwright --list仅验证发现。

额外在自有本地Worker与合成D1中执行JSON导出、删除新建合成文件夹、导入恢复、再次导入更新，均200，验证记录恢复后清理自己的fixture。原样native build通过。自有Worker已停止，7017/27016的IPv4/IPv6端口均释放。

四文档链接、锚点、图片、换行、Bash语法、双语命令、八节顺序与修改范围检查通过；所有evidence在基线存在，git diff --check通过。未执行完整浏览器、真实录音、native启动、真实OSS/DashScope/模型/Backy请求、DMG打包或生产写入。

日志：/tmp/readme-refresh-lyre-{install,install-retry,web-build,unit,e2e,browser-list,macos-build,macos-build-retry,backup-worker}.log；合成备份结果 /tmp/readme-refresh-lyre-backup-result.json。

## 主代理实施与验证收尾

Native 方案与草稿 review 提出了空宿主、显式录音 opt-in、schemes 结构、失败诊断与信号清理要求。root 完成代码后，先编译两种配置并检查实际 xctestrun，再运行空宿主 sentinel，最后运行全部默认测试。231 项通过，0 失败；只有原三项真实录音用例关闭，全部原结果断言保留；新增6个策略测试包含在通过结果。Release 编译通过。没有实际录音、启动日常应用或修改个人配置/权限。

共享 runner 的6个 Vitest 用例通过，另用模拟 xcodebuild 子进程验证成功清理、失败保留、SIGINT / SIGTERM 转发与等待退出。两种 build-only 的录音值分别0/1，live从未执行。Services 的文稿同步草案已由 root 在验证后应用：默认 root 命令、工具链、结果位置与单独 live 前提均与实现一致。

首次提交检查发现 lint 扫描本轮保留的生成构建文件和 Playwright 报告；Biome 仅排除 Git 已忽略的 test-results / playwright-report，源文件规则未改，完整 lint随后通过。详细批准和各日志见 [主代理复核](lyre.review.md)。此支持性修复独立提交，README另提交，正常hooks不绕过，所有版本和 CLAUDE不变。

## 远端发布与首次 CI

原生测试隔离提交 `0e50ca0a07d2d383a4755047da4db2f9956106a3` 与 README提交 `3acc9494a246cc5e86888b42dc15535737390337` 已推送main。两次正常pre-commit和最终pre-push均通过；主代理按GitHub精确SHA回读4份文档，逐一核对16份代码/配置摘要。四个workspace版本仍为1.8.0，main干净同步。

首次CI `34237051889` 的单元/静态/安全与完整浏览器job均成功；HTTPjob在安装阶段遇到两个既有Microsoft npm镜像tarball的HTTP4xx（micromark-core-commonmark2.0.3、baseline-browser-mapping2.11.19），未执行测试。其他两个job用同一lockfile安装成功，证据支持一次外部下载故障；主代理仅重跑失败job，没有改依赖、registry、lockfile或测试。原自动Release因CI失败跳过，重试结果另行记录。

最终结果：原样重跑失败job后，CI34237051889第二次attempt成功；自动Release34237649853成功。原Release34237190167的skipped记录保留为首次CI失败后的历史结果。没有再提交代码、改依赖或版本。
