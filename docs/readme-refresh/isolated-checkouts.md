# 独立调查副本

原仓库保留已有工作，本轮从 GitHub 最新 `main` 创建独立 clone，并分别执行 `git pull --ff-only`。原始工作区不做 reset、stash、rebase 或 push。

| 项目 | 原 main 提交 | 原状态 | 调查 main 提交 | 独立副本 |
| --- | --- | --- | --- | --- |
| giraffe | `d772268203e31098f7efa40a032afee2efa91916` | 已有未提交 UI / 文档变更 | `d772268203e31098f7efa40a032afee2efa91916` | `/Users/nocoo/workspace/personal/.readme-refresh-20260908/giraffe` |
| frogie | `e965214c3efe99f4c4b459e6716e2014184dc32d` | ahead / behind: 1 / 6 | `79e16babfb6067dcd90ad59b900fa76ad282f35c` | `/Users/nocoo/workspace/personal/.readme-refresh-20260908/frogie` |
| raven | `1a4031947fccb24b17cd1dc508774cc95f29044d` | ahead / behind: 3 / 8 | `a668dbf4fa318429e34686f7bf86731ca1494fd4` | `/Users/nocoo/workspace/personal/.readme-refresh-20260908/raven` |
| bogo | `77e211a294a885fff2830d0aba2e48a10299dff1` | ahead / behind: 4 / 0 | `2e2d986edffd9d320a3e172f37affe5e3406cabe` | `/Users/nocoo/workspace/personal/.readme-refresh-20260908/bogo` |

副本建立后已对照原始 HEAD 和 `git status --porcelain=v1`，确认四个原工作区均未变。发布记录写入各项目调查；结束时再次核对原工作区。

## Basalt：执行中出现并行 SEO 工作

Basalt 初始为干净 main；README 获批后原工作区出现本轮之外的 SEO 源码、页面和测试改动。独立 clone `/Users/nocoo/workspace/personal/.readme-refresh-20260908/basalt` 已 pull，基线仍为 `9b498d3feb8faaeee668229820801d527e07ccb3`。主代理仅迁移已批准的三份文档，并在精确字节 / 未暂存核对后从原库撤出本任务文档差异；其他代码和 index 未操作。原工作可继续变化，因此不将其后续 HEAD / 状态变化误报成本轮覆盖。发布与验证使用独立副本。

## Bat：保留个人开发配置

Bat 原 main 干净且已 pull，基线 `ab6984c18475e4c38723777f09f31e381d3e2f96`。API 测试 setup 会覆盖已有 `packages/worker/.dev.vars`，teardown 不会还原；原 checkout 有这份忽略配置。因此改在同 SHA 的独立 clone `/Users/nocoo/workspace/personal/.readme-refresh-20260908/bat` 调查、测试和发布，并再次 pull。原配置不读取值、不移动、不修改；独立副本测试创建的文件已清除。发布后可在原 main 仍干净且能安全快进时同步文档。

## Meowth：发布后出现独立 Hermes 功能工作

Meowth 的 README 提交 `b4adc3efa89cd44d353d2f0c7628b48873ff3b8b` 已正常发布、回读并通过 CI。收尾验证时，原 checkout 新增了 Hermes profile discovery 的 Go / OpenAPI / 文档改动，根 README 也新增一条指向该功能文档的链接；这些不是本轮 README 整理内容，未暂存、还原或推送。

为核对本轮已审核的精确字节，root 从远端 main 创建 `/Users/nocoo/workspace/personal/.readme-refresh-20260908/meowth` 并再次 pull，仍为上述已发布 SHA，工作区干净，双语摘要与审核快照完全一致。候选 checkout 改指此只用于最终验证的副本，保留原路径和发布后说明。原工作允许继续变化，不把其他任务的后续改动视为本轮未完成或被覆盖。

## Lyre：保留本地数据库与个人应用数据

Lyre 原 main 干净且已 pull，基线 `78b3a126f27a5adc53e4eaf4097b785ac7cb609e`；原 checkout 已有 `apps/api/.wrangler/state`。HTTP 与浏览器测试会在这个默认目录执行 DROP + CREATE，因此使用同 SHA 的独立 clone `/Users/nocoo/workspace/personal/.readme-refresh-20260908/lyre`，调查前再次 pull，并让两层测试顺序执行。原状态目录没有复制、读取内容或修改。

独立 Git 副本本身不能隔离 macOS 应用宿主：原生测试启动 Lyre.app 时仍会使用个人 Application Support、录音目录与 UserDefaults，权限已具备时还会实际录音。主代理在执行前停止该路径，安排独立调查与 review；具体方案、实施和验证记录见 [原生测试隔离诊断](rollout/lyre-native-isolation.md)。不修改 HOME、用户权限或真实配置；真实音频采集不属于本轮验证。
