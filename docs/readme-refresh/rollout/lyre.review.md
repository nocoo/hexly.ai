# Lyre 主代理复核

2026-09-08。调查基线 `78b3a126f27a5adc53e4eaf4097b785ac7cb609e`，隔离副本 `.readme-refresh-20260908/lyre`，版本 1.8.0。

## 文稿与资料

主代理已全文阅读双语 README、当前开发说明及 Services 调查，并对照 API / Web manifests、Wrangler、转写 job processor、AI prompt、逐词播放器、原生 downmix、认证、OSS 和备份源码。当前使用 React / Vite / Basalt / SWR、Hono / Workers / D1 / Drizzle、阿里云 OSS / DashScope 及 Swift / SwiftUI；没有沿用旧文档的 Next.js / Railway / TanStack Query 说法。

已核对并保留限制：上传后由用户发起转写，浏览器上传上限 500 MiB；原始词结果归档是尽力而为；摘要 prompt 固定为简体中文，主代理已同步精确措辞；原生 token 保存在配置文件，Teams 提醒可关闭且须确认录音；备份含配置中可能存在的服务凭据，但不含 OSS 对象。说明了本地 HTTP / 浏览器共用 D1 schema、需独立副本顺序运行，未把配置错误响应当成真实云服务验收。

中英文顶部站点与语言链接、相对文档 / 图片链接、命令对应及禁止项静态检查通过。四份文档只包含当前能力、运行方法和必要前提，README 不介绍 6DQ、门槛或 hook 制度。

## 正常原生测试的必要修复

原 hosted tests 会构造日常 LyreApp，读取个人配置与录音目录、启动 Teams 检测；三项录音 E2E 在已有权限时会真实采集。修复设计由 Native 调查、主代理批准，root 实施。详见 `lyre-native-isolation.md`、其 `.review.md` 与 `lyre-native-patch-review.md`。

- Debug 测试入口在构造 LyreApp 前进入空宿主；正常 Run 与 Release 仍使用原应用。Release 编译通过，未运行用户应用。
- project.yml 保留原 target、版本、签名与编译设置，新增两套 shared TestAction；生成工程仅增加必要 source / test references 与默认录音开关。
- 两个 hooks 复用默认 runner，仍保留原全部其他检查。默认覆盖调用环境的录音开关为 0；真实录音须显式命令和值为 1 的环境变量。没有使用 HOME 覆盖或修改权限。
- 三项真实录音 suite 在权限检查前关闭；显式运行缺少权限或显示器时报失败。保留原 M4A、音轨、时长、sidecar、双 start 和命名断言。临时目录在 await stop 后清理。
- runner 转发 SIGINT / SIGTERM 至自身 xcodebuild 进程组，等待 close；成功仅删除本轮 DerivedData，失败或中断保留诊断，全部结果保留 xcresult。

## 主代理验证

1. Safe 与 live 两套 `build-for-testing` 通过；实际 xctestrun 的 host 均为 1、recording 分别为 0 / 1。后者只编译，绝未执行真实录音。两套 RunAction 无测试标志。
2. 先运行空宿主 / 策略 sentinel：6 项、9 个参数实例全部通过，确认 hostedTestsUseEmptyApplication 确实执行；假权限计数验证默认路径连 permission probe 也不进入。
3. 完整默认 `bun run test:macos`：231 项通过、0 失败，只有 3 项真实录音用例跳过，0 expected failure；从 xcresult 逐项核对，未将空选择运行当成成功。
4. 新增 runner 环境单元测试 6 项通过；真实子进程替身验证默认覆盖、显式 live 值转发、退出 65、SIGTERM143、SIGINT130、等待退出及 DerivedData 保留 / 清理均通过。替身未调用真实 Xcode 或采集音频。
5. 补丁 SwiftLint 通过，Release 应用编译通过；保留既有 deprecated API / redundant internal(set) 编译 warning，没有借文稿整理扩大修复范围。
6. Services 已验证 frozen install、Web build、单元与本地 HTTP、虚构 backup insert / update；浏览器只做 discovery，真实 OSS / ASR / 模型 / Backy 和录音未测试，明确保留此边界。

证据：`/tmp/readme-refresh-lyre-native-{build-environments,full-summary}.json`、`/tmp/readme-refresh-lyre-runner-fixture-results.json`、各 build / sentinel / full 日志及隔离副本的 test-results。

## 决定

批准四份文稿与独立原生测试隔离修复。保存文稿、overview 与必要代码文件的精确摘要；正常 hooks、commit 后 fresh pull、push main、远端字节回读及该提交 CI / Release 均仍需完成并写入候选发布回执。所有 workspace 和 macOS 版本、CLAUDE、原 checkout 的 Wrangler 状态保持不变。

提交检查补充：首次 lint 遍历了本轮保留的 Xcode DerivedData 生成 JSON，导致格式报错。为支持 runner 明确保留失败诊断，在 Biome includes 排除已被 Git 忽略的 `test-results` 与 `playwright-report` 生成目录，后者是本轮 browser discovery 留下的压缩报告；与已忽略的 apps/macos / build 同类；所有源码检查保持原样。此最小配置补充纳入独立修复与精确摘要，不删除诊断或绕过 hook。

排除生成报告后，原完整 `bun run lint` 检查 190 个源文件通过，没有自动修正或关闭规则。

发布回执：已正常推送3acc9494（含独立测试修复0e50ca0a），四份文档远端字节与16项修复摘要均核对通过。CI34237051889经原样重试外部下载失败job后成功，自动Release34237649853成功；详细失败/重试记录见lyre.md。
