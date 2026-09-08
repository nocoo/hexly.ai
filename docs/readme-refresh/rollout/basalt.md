# Basalt 调查与交付

- 工作区 `/Users/nocoo/workspace/personal/basalt`；main干净，首次pull遇到GitHub TLS断连，直接重试成功。
- 基线 `9b498d3feb8faaeee668229820801d527e07ccb3`；状态 published。
- 已读CLAUDE和当前文档规范；01–03为计划归档，现行集成以INTEGRATION和npm包说明为依据。不改版本/lock、不发布npm、不从本机部署。

## 已核实内容

| 结论 | 证据 |
| --- | --- |
| 仓库包含npm库和独立静态示例站 | 根workspaces、packages/basalt/package.json、src/App.tsx |
| React19/ReactDOM19与lucide-react为必要peers | package peerDependencies |
| 两种CSS入口，standalone不依赖Tailwind构建 | package exports、styles源码、packages/basalt/README.md |
| 根导出是常用控件，复杂控件/图表使用分路径 | packages/basalt/src/index.ts、package exports |
| DatePicker/DataTable不调用声明的可选外部库 | 对应组件源码、fixtures/README.md |
| Recharts用于图表子路径 | packages/basalt/src/charts/ |
| 主题、色板、LinkProvider与UI目录已实现 | src/App.tsx、SitePaletteProvider、src/pages/ui/ |
| Showcase是模拟数据场景，非真实聊天/财务/健康服务 | src/pages、src/models及mock来源 |
| 公共TSX文档有可编译分类要求 | scripts/docs-gate.ts REQUIRED_DOC_FILES / scanDocFences |
| 不同消费者有真实临时打包、安装、类型和浏览器检查 | scripts/consumer-gate.ts、scripts/docs-gate.ts、fixtures/README.md |

## 改写决策

- 保留Bun workspace结构、站点/库区别、两种CSS安装方式、SSR客户端前提和示例代码；去除固定组件/页面/场景计数与质量制度。
- README的 `compile:readme-quickstart` JSX与原文逐字相同，英文也使用同一示例；不删除doc-gate依赖的可编译样例。
- 不从peerDependencies推断底层实现或强制安装：DatePicker/DataTable当前独立，charts才需要Recharts；本站技术栈不写未被实现使用的react-day-picker/TanStack Table。
- 新增docs/README.en.md，并在docs/README.md顶部导航链接英文与应用集成；不将公共README套用内部计划文档的编号/质量章节要求。
- 技术目标围绕React组件库的复用价值，示例站的业务页面有明确边界。

## 验证

- 基线源码、logo、MIT LICENSE与网站均已核实；basaltui.com响应200。
- 中英文各154行，路径、代码块、入口命令核对通过；git diff --check通过。
- 运行 `scanDocFences()`，正确识别README-md-readme-quickstart为compile。
- JSX示例没有功能变更，未重复执行整个package:prepublish。文档仍提供各层实际运行方法。
- consumer:docs本身不先build库，README明确先运行packages/basalt build；其他consumer流程自动build/pack到临时目录，依赖npm/网络。
- browser/consumer/showcase前需匹配的Playwright Chromium（bun run playwright:install），不建议机器Chrome替代。
- 发布前正常hooks执行typecheck/lint/test/gitleaks、build/coverage/lint/OSV；失败不跳过也不削减断言。

## 发布

等待 `basalt.review.md`；批准后正常commit、再次pull与push main。仅变更三份文档，无npm发布、无版本号变化。本站候选暂不合并正式JSON。

## 发布前工作区复核

2026-09-08，root 已批准当前三份文档。准备提交时发现原仓库出现其他工作线的 SEO / 页面标题源码与测试修改（index.html、DashboardLayout、页面文件、vite.config.ts、scripts/seo*、src/lib/site* 等），这些不属于 README 任务。为保留其工作区与索引，README 发布改用 `.readme-refresh-20260908/basalt` 独立 clone 的 main；只复制已复核三份文档，不携带其他更改。新副本会正常 pull、安装锁定依赖、运行原 hooks、提交和推送。

## 调查后的并行改动

主代理 review 后，原 Basalt 工作区出现其他工作产生的 SEO 源码与测试改动。主代理从远端 main 建立 `/Users/nocoo/workspace/personal/.readme-refresh-20260908/basalt` 并再次 pull；基线仍为 9b498d3。已按 SHA-256 核对后迁移获批的三份文档，候选 checkout 指向独立副本。原库仅撤出本任务精确匹配的 README / docs 改动，保留其他文件与 Git index，不在原工作区提交或推送。正常发布在独立副本继续。

## 补充复核请求：保留公共文档锚点

独立副本正常 precommit 的 catalog-api:check 检出 README 标题翻译导致 `README.md#component-usage` 不存在；源码还引用 `README.md#css-setup`。这是文稿问题，已在双语对应章节前补回显式 HTML id；校验器本身支持 id/name，无需修改生成 manifest、测试断言或业务源码。请 root 在 `.readme-refresh-20260908/basalt` 复核这四个锚点后重新批准。首次 hook 日志 `/tmp/readme-refresh-20260908-apps-basalt-commit.log`。

## Hook 输出复核

补锚点后的正常 precommit 退出 0，已提交 `74a1ea142b3df65b34b02cb0747c9c7989482ebc`。207 文件通过，1825 用例通过 / 3 既有跳过。日志中的 bad.json parse error 来自 `scripts/package-registry.test.ts:176`，该测试明确断言格式化无效 JSON 会 throw，是预期输出；没有修改 formatter。再次 pull 后唯一领先提交为本次文档，正常 prepush 已启动（日志 `/tmp/readme-refresh-20260908-apps-basalt-push.log`）。

## 发布结果

root 对稳定锚点补充复核通过后，正常提交、再次 pull 与 pre-push 全部完成。已从独立副本推送 `74a1ea142b3df65b34b02cb0747c9c7989482ebc`；三份文档远端字节匹配，main 干净且与 origin/main 同步。build、coverage、lint 与 OSV 检查通过，版本 2.1.2 未变，没有 npm 发布或本机部署。CI [34228117408](https://github.com/nocoo/basalt/actions/runs/34228117408) 记录时仍在运行，后续回填最终结论。

CI 34228117408 与仓库既有 Release 34229128858 均已 success；package / consumer 与单元安全检查均完成。
