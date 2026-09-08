# Dotty 调查与交付

- 工作区 `/Users/nocoo/workspace/personal/dotty`；调查前 clean main，`git pull --ff-only` 成功。
- 基线 `1becb8026f44a20d9827cd5b4f100b6fb09836fe`；状态 published。
- 已读 CLAUDE.md 与实际 hooks：静态 SPA / mock 数据，无真实后端；不从本机 wrangler deploy，不添加 docs/01，不改版本。

## 证据与改写

| 结论 | 文件 |
| --- | --- |
| React Router 下已实现各种示例页面 | `src/App.tsx`、`src/pages/` |
| Dashboard / 账户 / 持仓等读取 mock 数据 | `src/data/mock.ts`、`src/viewmodels/usePortfolioViewModel.ts` |
| Wearable / Banking / Network 已有图表页面，不是空布局stub | 对应 `src/pages/*DashboardPage.tsx` |
| 各场景页面仍是示例，不是真实服务 | 页内常量、mock数据；`LoginPage.tsx` form仅preventDefault |
| 双层卡片、冷灰主题、像素柱图 | `src/index.css`、`src/components/PixelBarChart.tsx` |
| 英中文案与浏览器语言设置 | `src/i18n/index.ts`、locales/en.json、zh.json |
| 7002开发端口、开发用/api/live | `vite.config.ts` |
| Workers静态资源、SPAfallback | `wrangler.toml`、`.github/workflows/release.yml` |

旧 README 说有28页面且 Blocks/Scenarios 是stubs，与路由和现有实现不符。新稿不保留固定页面计数，用实际路由分类；明确产品是界面模板。保留原有视觉特色和品牌图，不把账户、健康、网络页面写成实际业务能力。

## 验证与限制

- 双语各101行，路径/路由/命令对应，git diff --check及相对链接/代码块检查通过。
- homepage=https://dotty.hexly.ai；HTTPS返回200。首次GraphQL有连接重置，正常直接重试成功。
- 测试层只有Vitest；无API/L3入口，不编造命令。coverage范围是models/viewmodels/lib，README只说报告范围。
- 无env或生产数据访问需求，文档无需重复完整测试；批准后正常hooks会跑typecheck/lint/test以及build/coverage/OSV。
- LICENSE实际为MIT，保留版权人及年份。
- No laptop deployment：只在main正常提交与push，由现有工作流处理静态站部署。

## 发布

root 批准后正常提交并发布 `f13a3aa2d2b3211c2f16537f3d6c0c5dfde8e4c1`。

- precommit 的 typecheck、lint、Vitest、gitleaks 通过；prepush 的生产构建、coverage、lint、OSV 通过。Vitest 21 文件 / 118 用例通过。
- 推送前再次 pull 成功，只有本次已复核文档提交领先。main 推送成功，版本未变。
- 远端中英文 README 字节匹配，main 与 origin/main 同步。
- [CI](https://github.com/nocoo/dotty/actions/runs/34226384424) 和现有 [Release 工作流](https://github.com/nocoo/dotty/actions/runs/34226433824) 均 success；没有本机部署或手动创建 release。
- 日志 `/tmp/readme-refresh-20260908-apps-dotty-{commit,push}.log`。本站正式项目 JSON 仍由 root 处理。
