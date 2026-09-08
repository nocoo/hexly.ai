# 首批验证与交付记录

## 范围

2026-09-08。仅发布 Snaky、Steed 的 README 与 hexly.ai 的首批项目资料展示。调查其余 47 个未归档项目后保留记录，扩展改写等待用户确认。

| 仓库 | 调查前同步 | 本轮内容 |
| --- | --- | --- |
| Snaky | 干净 main，pull 后 `5cd0790336d006f65555816fe29869d6e60ed376` | 双语 README；另有两个 DNS 测试的隔离修复，生产代码不变 |
| Steed | 干净 main，pull 后 `bcab1f113b9b7cde65898bbd23705c7dac339634` | 双语 README、编号入口文档及索引 |
| hexly.ai | 干净 main，pull 后 `29f1518d928ada5965400177b4ff7291e4ac0cc9` | 全量调查与计划；两份 overview JSON；双语目标 / 技术栈展示、静态快照和生成资料 |

版本保持不变：hexly.ai `0.4.6`，Snaky 根包与 CLI `1.0.6`；Steed 各 workspace manifest 均无改动。本轮不创建版本标签或 Release。

## README 检查

| 项目 | 中文 / 英文行数 | 本地引用 | 结构与示例 |
| --- | --- | --- | --- |
| Snaky | 176 / 176 | 每份 11 处，全部有效 | 八个对应章节；命令与 JSON 一致；18 种 CLI 参数形式通过解析检查 |
| Steed | 155 / 155 | 每份 12 处，全部有效 | 八个对应章节；命令示例一致；CLI 帮助与关键命令源码核对 |

两者都保留现有 Logo；有站点的 Steed 按「站点 · English」排列，无独立站点的 Snaky 仅放语言链接。英文版放在 `docs/README.en.md`，回链、图片、源码与许可证路径均已核对。测试只写实际层次的命令和前置条件，没有 6DQ、hooks 制度、覆盖率门槛或固定通过数量。

Snaky 的 DNS 失败用例原先受本机解析器影响，将 `.invalid` 改写为 `198.18.3.101` 后无法可靠触发目标分支。只调整两项测试的 fetch 错误输入，保留断言并恢复 spy；[详细诊断](snaky.md)保留失败与修复前后结果。

## 执行结果

本地环境为 Bun 1.4.0、Node.js 26.7.0，Snaky 使用 pnpm 10.34.4。

| 仓库 / 检查 | 当次结果 |
| --- | --- |
| Snaky build / lint / typecheck | 通过 |
| Snaky 单元测试 `pnpm test` | 314 / 314，通过；26 个文件 |
| Snaky CLI E2E `pnpm build && pnpm test:e2e` | 14 / 14，通过；测试含真实只读网络请求 |
| Snaky Swift | 本机仅 Command Line Tools，未运行需完整 Xcode 的测试；正常 hooks 自带相应环境检测 |
| Steed build / lint / typecheck | 通过；构建有原有的大 chunk 提示 |
| Steed 单元 / 组件 `bun run test` | 1009 / 1009，通过；98 个文件 |
| Steed HTTP `bun run test:e2e` | 59 / 59，通过；本地 Worker + 隔离 D1 |
| Steed 空数据库与 Web Worker | 完整迁移后首页、浏览器 API、分类数据与 API health 均返回 200；临时状态和自有进程已清理 |
| hexly.ai `assets:build → docs:profiles → assets:check` | 通过；69 份身份资料、414 份衍生图、54 份公开归档和 92 次 finishing 的记录均验证通过 |
| hexly.ai typecheck | 通过 |
| hexly.ai `bun run test:coverage` | 91 / 91，通过；statements 99.61%、branches 98.69%、functions 100%、lines 99.57% |
| hexly.ai `bun run test:browser` | 162 / 162，通过；含 desktop / mobile，新增 10 个项目资料用例 |
| hexly.ai 全量 lint | 通过；936 个文件，无修改或警告 |
| hexly.ai `bun run test:http` | 61 / 61，通过 |
| hexly.ai `bun run check:security` | OSV 无已知依赖问题；Gitleaks 无泄漏发现 |
| hexly.ai `bun run deploy:check` | Wrangler dry run 通过；静态资源与唯一 ASSETS binding 正常 |

资产生成后的 Git diff 只出现 Snaky / Steed 的生成 profile 文本变化，原始图像、衍生图片和社交图无字节变动。功能核实提交放在新的 `overview.verified` 中，原有 Logo 来源、SHA-256、色板与 profile 成员保持原值。

## 页面检查

资料块位于详情页第一组 Logo 大图下方、视觉设计说明上方。展示中英文目标，以及「技术名称 + 当前语言用途」的可换行 badges；阅读链接随语言切换指向中文或英文 README。核实日期与证据路径留在 JSON 和文档中，不出现在产品界面。

新增浏览器用例覆盖两个项目、两种主题、中英文切换、320 px 窄屏、技术用途与 README 链接、无资料项目 / 归档项目兼容、切换后的大图位置，以及资料块可访问性。成功运行时会附带资料块截图用于目视检查。

中英文目标、技术名称与用途、外链方向和明暗主题均通过截图复核。320 px 下 badges 保持在卡片内，长名称 / 用途允许换行；较长的英文 Steed 内容使用正常纵向滚动。桌面保持两栏，窄屏改为上下排列。原有切换项目的大图位置测试以及新旧资料切换测试均通过。

首次完整浏览器运行成功，但 list reporter 未落盘内存截图附件。随后只调整测试的截图输出路径，针对资料块重跑 10 个用例，全部通过，并生成 16 份截图供目视复核；生产组件与数据在此期间未改动。

保留的局部截图来自真实浏览器运行，桌面 viewport 为 1440 × 1000，移动 viewport 为 320 × 740（3 倍像素密度）：[Snaky 英文 / 浅色桌面](screenshots/snaky-en-light-desktop.png)、[Steed 中文 / 浅色桌面](screenshots/steed-zh-light-desktop.png)、[Snaky 中文 / 深色窄屏](screenshots/snaky-zh-dark-mobile.png)、[Steed 中文 / 深色窄屏](screenshots/steed-zh-dark-mobile.png)。截图用于保留本次视觉检查，公开页面仍以发布后的实际界面为准。

## 提交、推送和远端验证

提交按 Snaky DNS 测试修复、Snaky 文档、Steed 文档、hexly.ai 展示与调查记录分开。每次正常运行 hooks；推送前再 pull，确认仅包含本轮提交，直接 push main。

| 仓库 | 提交 / 推送 | 远端 CI / 部署 |
| --- | --- | --- |
| Snaky | [`a52d799`](https://github.com/nocoo/snaky/commit/a52d79904d5640c365839c021e2ddeb774c5da15) DNS 测试修复；[`5ef57af`](https://github.com/nocoo/snaky/commit/5ef57af407bc695ea710ae77eaa59432d6006373) 双语 README。再次 pull 无需更新，正常 hooks 通过后已 push main | [CI](https://github.com/nocoo/snaky/actions/runs/34214028335) 执行中 |
| Steed | [`107256b`](https://github.com/nocoo/steed/commit/107256b7104a067133029f7f4b5a60a86efd717b) 双语 README 与入口文档。再次 pull 无需更新，正常 hooks 通过后已 push main | [CI](https://github.com/nocoo/steed/actions/runs/34214050472) 执行中 |
| hexly.ai | 待提交 | 待验证；以成功 Deploy 和公开页面验证为准 |

Steed 的 Access 控制台不在本轮用真实账号进行业务操作。hexly.ai 页面公开，发布后核对 `/api/live` 的提交号及两个项目的双语资料。最终交付后，后续 47 个项目仍等待首批确认。
