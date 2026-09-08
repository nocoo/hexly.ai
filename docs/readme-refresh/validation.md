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
| Snaky | [`a52d799`](https://github.com/nocoo/snaky/commit/a52d79904d5640c365839c021e2ddeb774c5da15) DNS 测试修复；[`5ef57af`](https://github.com/nocoo/snaky/commit/5ef57af407bc695ea710ae77eaa59432d6006373) 双语 README。再次 pull 无需更新，正常 hooks 通过后已 push main | [CI 成功](https://github.com/nocoo/snaky/actions/runs/34214028335) |
| Steed | [`107256b`](https://github.com/nocoo/steed/commit/107256b7104a067133029f7f4b5a60a86efd717b) 双语 README 与入口文档。再次 pull 无需更新，正常 hooks 通过后已 push main | [CI 成功](https://github.com/nocoo/steed/actions/runs/34214050472)；[自动部署成功](https://github.com/nocoo/steed/actions/runs/34214174101) |
| hexly.ai | [`63279af`](https://github.com/nocoo/hexly.ai/commit/63279afc0321934ab8877ad9a1a5a93c115207d8) 展示、首批资料与全量调查；再次 pull 无需更新，正常 hooks 通过后已 push main | [Quality & Deploy 成功](https://github.com/nocoo/hexly.ai/actions/runs/34214404700/attempts/2)；同一提交第二次运行的浏览器 162 / 162 通过，自动部署与公开页面验证通过 |

发布后通过 GitHub contents API 回读 Snaky、Steed 的四份 README，其 SHA-256 均与本地文件一致。三个仓库的包 manifest 和根锁文件与调查基线逐字节相同；Steed 各 workspace 的 manifest 也未改动。

hexly.ai 第一次推送在 GitHub TLS 握手阶段失败，未触发远端更新。再次 pull 确认无需更新后重试成功，HTTP 与安全 hooks 正常执行，没有修改 Git 配置或跳过检查。

### hexly.ai 首次 CI 的下载中断

提交 `63279af` 的首次 CI 中，单元 / 静态 / 安全及 HTTP 检查通过，浏览器测试 161 / 162 通过，10 个新增资料用例全部通过。失败的是既有的桌面 Steed 原图下载用例（`tests/browser/gallery.spec.ts:180`）：`download.failure()` 返回 `"canceled"`，部署因此未执行。

已下载该次运行的 `browser-failure-evidence` artifact（ID `10051314814`），核对 Playwright trace、页面快照和 `.wrangler/browser-ci.log`。以下时间均为 2026-09-08 UTC：

- `10:16:58.479`：定位正确的 `steed-transparent.png` 下载链接；`10:16:58.510` 点击完成。
- `10:16:59.170`：Wrangler 收到 `/logos/family/steed/2026-09-07-02/01/transparent.png` 请求，记录 `Could not proxy request to the UserWorker … Network connection lost.`。
- `10:16:59.171`：浏览器发出 URL 和文件名均正确的 download 事件；`10:16:59.176` 报告取消。browser context 到 `10:17:00.222` 才开始关闭。

记录支持 Wrangler 本地代理链路中的一次连接中断，不能确定由哪一端首先断开。trace 没有页面 JavaScript 异常；其中 41 个普通网络请求均为 200，但下载没有进入 network HAR，不能据此宣称它的响应或字节完整。Wrangler 后续 isolate ID 一致，未见重启或崩溃记录。

在不改代码的情况下，原桌面下载用例本地连续运行 10 次均通过（`bunx playwright test tests/browser/gallery.spec.ts --project=desktop --grep 'compares refined steed ' --repeat-each=10`）。保留下载逻辑和断言，于 `10:23:30 UTC` 对原提交重跑失败 job；`10:28:39 UTC` 浏览器记录 162 / 162 通过，随后自动部署和整次 workflow 均成功。没有为这次中断修改组件、下载资源、断言或 CI 配置。

### 公开站点核验

2026-09-08 `10:31 UTC`（北京时间 18:31）对已发布的 `63279afc0321934ab8877ad9a1a5a93c115207d8` 执行以下只读检查：

- `bun run verify:production` 通过：`https://hexly.ai/api/live` 返回版本 `0.4.6` 和预期完整提交号；页面、编译后的 JavaScript / CSS、原始 Logo 校验均通过。
- 使用 Playwright 打开公开的 [Snaky](https://hexly.ai/logos/snaky) 和 [Steed](https://hexly.ai/logos/steed) 详情页。分别核对英文及切换后的中文目标、全部技术名称与本地化用途，与对应 JSON 一致。
- 两种语言的 README 链接分别指向 `docs/README.en.md` 和根 `README.md`；两个页面在 320 px 视口下均无横向溢出。

Steed 的 Access 控制台不在本轮用真实账号进行业务操作。后续 47 个项目仍等待首批确认。

### 补充记录提交的浏览器验证

收尾文档提交 [`48e51b2`](https://github.com/nocoo/hexly.ai/commit/48e51b2fc260d114f733fc0581f2eeda80ad92b6) 只修改四份调查记录。它的[首次 CI](https://github.com/nocoo/hexly.ai/actions/runs/34216043001) 中，单元 / 静态 / 安全和 HTTP 检查通过，浏览器 161 / 162 通过。此前的 Steed 下载用例与 10 个资料展示用例全部通过；此次失败为既有移动端 `site.spec.ts:250` 的外链 / 中键新标签流程，30 秒内没有等到 `context.waitForEvent("page")`。

该次 `browser-failure-evidence` 的 trace 和网络记录显示：`10:37:55.438 UTC` GitHub popup 正常创建并通过 URL 断言，`10:37:55.557` 关闭；随后先注册 page 事件，再中键点击正确的 `/logos/pew` 链接。`10:37:55.650` 已有新 pageId 发起该 URL 的 GET，HAR 记录 200、28.514 ms 和 bodySize 1566，但没有对应 page 事件、快照或后续资源请求。HAR 未保存解码正文，不能证明页面完成正文解析。全部 32 条网络记录均为 200，没有页面 JavaScript 或 console 错误。

Wrangler 的最后一次 `Broken pipe` 出现在 `10:37:40.916 UTC`，比该用例开始早约 13.7 秒；用例期间没有这类错误、`Could not proxy` 或下载取消记录。isolate ID 保持不变。现有证据只能定位到新页面初始化或 Playwright 事件交付阶段，不能区分 Chromium 与 Playwright 的责任，也不能把这次失败归为前一次下载中断。

原移动端用例在本地不改代码连续运行 12 次均通过：`bunx playwright test tests/browser/site.spec.ts --project=mobile --grep 'keeps repository clicks separate' --repeat-each=12`。保留原交互、测试断言、30 秒超时和零自动重试配置。本节通过单独文档提交补齐，后续提交的检查和部署结果可在 [main 的 Quality & Deploy 历史](https://github.com/nocoo/hexly.ai/actions/workflows/ci.yml?query=branch%3Amain) 按提交号定位；上面的公开页面检查对应已经部署成功的功能提交 `63279af`。
