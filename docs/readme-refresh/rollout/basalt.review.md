# Basalt 主代理复核

2026-09-08，基线 `9b498d3feb8faaeee668229820801d527e07ccb3`。批准当前根 README、英文 README、docs 索引和候选 overview，按正常 hooks 提交、再次 pull 后 push main；不修改版本或发布 npm 包。

## 源码与文稿核对

- 全文核对双语 README、文档索引 diff、manifest、导出、样式源文件和示例站路由。React 组件库与私有示例站的目的、目录和构建产物区分正确，演示业务页面没有被描述成真实后端服务。
- `@nocoo/basalt` 的 React 19 / React DOM 19 与 Lucide peers、ESM 分路径、Tailwind / standalone 样式入口有实际 manifest 支持。独立 CSS 引入 theme / utilities，不包含全局 preflight reset。
- 根导出包含示例所用 Button、Input、LayerCard、ThemeProvider；DatePicker 从组件子路径导入。DatePicker / DataTable 当前没有依赖声明中的可选外部库，图表单独使用 Recharts，因此 badges 未把可选 peer 误写成内部实现。
- 主题 provider、色板、路由适配以及 `/ui` 目录 / 源码页已实现。Next.js 的客户端边界和 SSR 说明链接到当前集成文档。
- 测试命令与 consumer runner 相符；临时打包、npm 安装、Chromium、自动端口及 `consumer:docs` 先构建库的前提清楚。保留原有 `compile:readme-quickstart` 示例，其代码与两种语言完全一致，未降低文档代码检查要求。
- `/api/live` 只在 Vite 开发插件提供，Worker 托管静态产物。网站和 MIT 已有源码 / LICENSE 依据，版本保持 2.1.2。

## 验证与发布边界

主代理链接、命令对应、证据路径和空白检查通过。JSX 样例与原文相同，无需为文字调整新建镜像测试；继续执行正常 hooks 和既有 CI，记录最终结果。仅三份文档获批，不执行手动部署、tag、GitHub Release 或 npm 发布。

## 正常检查发现的锚点兼容修订

首次正常 pre-commit 发现生成的 public-surface manifest 与 npm registry 仍引用 `README.md#component-usage` 和 `#css-setup`。root 核对校验器支持显式 HTML id 后，在两种语言对应章节补回这两个稳定锚点，保留中文标题与既有引用。`bun run catalog-api:check` 通过；批准这项纯文档修订并更新精确快照。再次暂存修改后的三份文档后执行完整正常 hooks，不改 manifest、registry 或检查规则。
