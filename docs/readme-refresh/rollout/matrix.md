# Matrix 调查与交付

- 工作区 `/Users/nocoo/workspace/personal/matrix`；调查前 clean main，`git pull --ff-only` 成功。
- 基线 `f349c07e0a7ac73e337b54014a4c45790a20da94`；状态 published。
- 已读 CLAUDE.md、原 README、manifest、路由、主要组件和数据访问；仅重写 README 与创建英文版，版本 1.3.0 不变。

## 当前证据

| 结论 | 文件 |
| --- | --- |
| 绿黑终端视觉与 Tailwind 变量 | `src/index.css` |
| React Router 下的控制台、表单、图表和页面示例 | `src/App.tsx`、`src/pages/` |
| 账户、流水、健康数据是 mock | `src/data/mock.ts`、`src/viewmodels/useAccountsViewModel.ts`、`useLifeAiViewModel.ts` |
| 任务状态与运行记录是界面示例 | `src/components/ui/RunnerComponents.tsx` |
| 图表实际采用原生 SVG | `src/components/ui/DataVizComponents.tsx` |
| MatrixRain 是 Canvas 动画 | `src/components/ui/MatrixExtras.tsx` |
| 登录表单和启动记录没有真实认证服务 | `src/pages/LoginPage.tsx` |
| 中英文由 i18next / react-i18next 切换 | `src/i18n/index.ts`、`src/i18n/locales/` |
| 7013 开发端口与仅开发存在的 /api/live | `vite.config.ts` |
| Workers 托管 dist 静态资源并提供 SPA fallback | `wrangler.toml` |

## 文档整理

- 根 README 改为中文，保留原图标、名称、终端风格与 VibeUsage Matrix-A Design System 来源致谢。
- 顶部按站点、English 顺序放链接；英文版 `docs/README.en.md` 对应全部章节并反链根 README。
- 不沿用固定页面和组件数量，用当前路由表分组说明。
- 控件、图表、金融 / 健康 / 任务场景定位为可复用界面模板，没有宣称真实账户同步、健康服务、后台任务或登录功能。
- 主题目前仅深色；旧 CSS token 表不再作为实现依据，示例使用当前 Tailwind 的 text-matrix-primary / bg-matrix-panel。
- 开发安装命令采用冻结 lockfile；未加入生产部署命令。只在 main 正常 push，由现有工作流处理发布。

## 验证与边界

- 双语各 107 行。相对链接、测试文件路径、路由、manifest 脚本、代码块与 git diff --check 通过。
- GitHub homepage 与 https://matrix.hexly.ai 一致，HTTPS 返回 200。
- 当前测试入口仅 Vitest 单元 / 组件；没有 API 或浏览器 E2E 入口。README 说明 test / watch / coverage 的基础运行方法。
- vitest.config.ts 的 coverage 范围是可复用 UI 与 src/lib，不声称覆盖全部页面和 viewmodel。
- LICENSE 实际为 MIT，版权 2026 Zheng Li。
- 文字修改不新增测试；批准后执行正常 commit / push hooks，记录构建、测试与 CI 结果。

## 发布

等待 root 的 matrix.review.md。批准后正常提交、再次 pull 并核对仅本任务提交，然后 push main、回读远端 README 与 CI。本站正式项目 JSON 由 root 合并。

## 最终发布结果

root 批准后正常提交并发布 `252403134a2166e33d73d1dfbf730ccb33b79d31` 到 main。precommit 的 typecheck / lint / tests / gitleaks 与 prepush 的生产构建 / coverage / lint / OSV 通过，Vitest 14 文件 / 638 用例通过。再次 pull 后只有本次文档提交领先；推送成功，版本未变。

远端中英文 README 字节匹配，main 同步。[CI](https://github.com/nocoo/matrix/actions/runs/34227361152) 与既有 [Release 工作流](https://github.com/nocoo/matrix/actions/runs/34227502342) success，没有本机部署或手动 release。OSV 仅提醒现有忽略项已无对应问题，没有修改扫描配置。日志 `/tmp/readme-refresh-20260908-apps-matrix-{commit,push}.log`。
