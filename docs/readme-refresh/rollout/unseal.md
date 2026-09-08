# Unseal 调查与实施记录

## 基线与原子计划

- Checkout `/Users/nocoo/workspace/personal/unseal`；调查前 clean main，重新 `git pull --ff-only` 成功，基线 `2f31f698e1de11409d48dcf9e543bbb8c0706a7b`。
- 一个文档提交：中文 README + 英文 docs/README.en.md，保留既有 logo。主代理 review 后正常提交、再次 pull、push main；不发布 npm、不改版本。
- GitHub homepage 指向 npm 包页；npm 当前 unseal0.3.0 的 bin / engines 与仓库对应。头部使用明确标注的 npm 链接，排在语言链接之前。

## 当前代码事实

| 项目 | 源码核对与旧文档处理 |
| --- | --- |
| 扫描范围 | scanner.ts 只读取 /Applications 第一层后缀.app条目，不递归子目录，不默认检查 ~/Applications；可传dir是内部函数接口，不是CLI参数。 |
| 三态逻辑 | 无 quarantine 属性或 spctl退出0 -> unsealed；有属性且spctl非0 -> quarantined；xattr读取失败/异常 -> unknown。不能将spctl非0一概写成“确定被Gatekeeper阻止”。 |
| 没有误报保证 | 旧README“已签名应用不会误报”过强，改成按实际检测条件说明。unsealed可能仍有隔离属性。 |
| 交互即确认 | prompt.ts默认全选，空格切换，回车直接继续，无第二次确认；Ctrl+C/全不选退出。 |
| 修改范围 | unseal.ts 逐项 sudo xattr -rd，仅删除 quarantine 属性；无法修复签名、损坏内容或全部系统策略。 |
| 提权时机 | 选择完成才checkSudo，先sudo -n true再sudo -v；没有自动处理unknown。 |
| 失败与退出 | individual失败仍继续，最终打印明细；当前部分失败仍退出0。无TTY也提示后0退出，所以不宣传自动化批处理接口。 |
| 运行时 | Bun开发/打包，发布的是Node ESM；实际测试为Vitest，不是Bun原生测试器。Nodeengines与npm对应。 |
| 调试入口隔离 | debug.ts注入静态app列表与假的executor；with-failure可真正演示选择UI和部分失败结果，无sudo/xattr调用。 |
| 测试层真实范围 | 7个Vitest文件，模块mock/依赖注入的流程组合测试和真实printf/false/ENOENT子进程；没有真实应用属性修改的E2E。旧L1/G1/L2/G2和固定覆盖率不放README。 |

已读全部 src、manifests、Vitest配置、hooks/CI、架构文档、测试实现、实际license与logo用法。未发现仓库特定AGENTS/CLAUDE。

## 已验证

- Frozen Bun install通过，正常Husky。
- Vitest全部64项 /7files及现有覆盖率要求通过。
- Bun构建通过，Node执行打包产物 --help / --version通过（0.3.0）。没有运行真实交互入口。
- 真实TTY运行 `bun run debug with-failure`，默认两项已选，回车后输出Locked失败、Lyre成功、1 succeeded /1 failed，退出0；所有系统命令由假executor接管。
- 双语各7个本地引用有效，Bash代码块一致，npm链接在语言链接之前。npm maintainer 为 nocoo，description 与当前仓库一致。文稿与候选资料 ready_for_review。

## 发布回执

主代理批准后，正常提交 `c93334a2e6618ed4b6856c9af4d2e3c30be875dc`。pre-commit 的覆盖率、类型检查、lint，以及 pre-push 的测试、gitleaks、OSV 全部通过。未改变任何应用属性。

push 前再次 `git pull --ff-only` 并确认只领先本次 README 提交，正常推送 main。GitHub Contents API 回读两份文稿逐字节一致（中文 3913 bytes，英文 4346 bytes），工作区干净且与远端同步。CI [34228339499](https://github.com/nocoo/unseal/actions/runs/34228339499) 已 completed / success。
