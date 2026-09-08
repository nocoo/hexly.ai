# Bogo 调查与实施记录

## 基线与计划

- 仅使用隔离 checkout `/Users/nocoo/workspace/personal/.readme-refresh-20260908/bogo`。原目录有四个无关未推送提交，保持原样。
- 详细调查前确认 clean main，重新 `git pull --ff-only` 成功，基线 `2e2d986edffd9d320a3e172f37affe5e3406cabe`。
- 一个 README 提交：中文根 README 与完整英文 `docs/README.en.md`，保留 logo；主代理 review 后正常提交、重新 pull、push main、远端双语回读与 CI。版本、CLAUDE、业务代码不改。
- 已应用 Cloudflare / Workers / Wrangler 技能，读取最新官方最佳实践与命令参考、核验已安装 Wrangler 4.103.0 schema；另在临时目录取得并校验当日最新 Workers types 5.20260908.1，未改项目依赖。

## 源码核实与旧文档差异

| 事实 | 证据与 README 处理 |
| --- | --- |
| 单个可信知识库，多 workspace 整理内容 | workspaces.ts 的列表没有 owner 条件，创建时固定 default-owner；入口没有 workspace ownership guard，middleware 只认证身份。旧架构文档按 sub 隔离 owner / 每用户 workspace 的说法不符合现状。README 明确所有已授权用户共用数据，不能宣传多租户权限。 |
| 人物关系与文档是核心对象 | persons 路由支持主 / 虚线汇报、头像 URL、移动及主树环检测；文档与人物多对多关联，有人物文档时间线。根人物随 workspace 创建。 |
| 组织图与人员表都已实现 | React Flow / Dagre，拖拽修改主汇报对象；show_on_chart 字段呈现。TablePage + table-view routes 保存列、单列排序、筛选和默认视图；实际排序筛选在客户端执行。 |
| 文档保存与版本范围 | documents.ts 每次 PUT 增加版本，D1 batch 存标题 / 正文快照；类型 / 日期变更也递增版本，但标签和人物关联不在快照中。VersionDiff 懒加载相邻版本正文。不写一键回滚、实时协作或全部元数据版本化。 |
| 列表不带正文，也没有通用分页 | documents list / versions list 只发摘要，全文按单项读取；源码没有旧架构承诺的 cursor / limit 统一分页。 |
| 标签 / 字段已实现 | tags 按 person / document scope；字段有 text / number / date / select / boolean，可选择显示在组织图。field values 以字符串保存，不夸大为强类型数据库约束。 |
| 当前 UI 没有 @nocoo/basalt 依赖 | Vite / React / Tailwind，自有 CSS 的 Basalt 风格 token；不把设计名称误写成实际组件包。React Query、React Router、marked、js-yaml、@pierre/diffs 真实使用。 |
| D1 是业务存储 | wrangler.toml 只有 DB 和静态 ASSETS；无 R2 绑定。头像 URL，文档正文存 D1，不把架构图标记 future 的 R2 当已实现附件。 |
| Browser / CLI 分开认证 | 浏览器站点经 Access，CLI API host 不经 Access app；Worker 先验证 bogo_ bearer 摘要，再本机开发捷径，再 JWT。不能把 API host 无 Access 等同无认证。 |
| CLI token 生命周期 | auth.ts 浏览器确认后签发；同邮箱前一 cli-login token 被撤销，新 token 默认无 expires_at。D1 只存 SHA-256，CLI 仍需本地明文。没有 token 管理 UI，直接链接操作说明。 |
| CLI 发布与源码存在差距 | npm @nocoo/bogo 当前 latest 0.5.0，repo 0.8.1；maintainer nocoo、bin / repo 信息一致。README 提醒新命令检查 --help，需要最新 schema 则从源码生成，不硬编码包版本。 |
| 本地 quick start 要先 build shared | shared 的 exports 指向 dist，turbo dev 无前置 build；先 bun run build 会构建 shared 与 UI。seed 只写本 checkout 的 local D1，重跑会重置名称 Northwind Labs 或固定 ID 的本地示例 workspace。 |
| 测试命令按实际文件 | Worker test:integration 指向不存在的 vitest.integration.config.ts，README 不列。实际 L1、local Wrangler L2、Playwright、生成 CLI E2E；UI / CLI 同用 27036 必须逐项运行。 |
| 许可证旧文案错误 | 根 LICENSE 与 packages/cli/LICENSE 都是 MIT，旧 README 的 Private 删除。 |

阅读范围：CLAUDE、根与四 package manifests、README、入口与认证、workspace / people / document / fields / tags / table views 路由、共享 schemas、UI 路由 / 组织图 / 文档编辑 / 差异 / 表格 viewmodels、Markdown renderer、migrations、clip.yaml、CLI build 与 E2E、local seed、测试配置、hooks、CI 与部署说明。

## 验证计划与当前状态

- `bun install --frozen-lockfile` 成功，正常 Husky 安装，无锁文件变更。
- `bun run build` 构建 shared 与 UI 成功；现有大 chunk 提示保留，未改配置。
- 现有完整 shared / Worker / UI 覆盖率检查通过，local seed 成功应用全部 migrations 并加载示例。后续正常 hooks 将验证静态检查、local API、security 与生成 CLI。
- 原个人 checkout、线上数据库、Access 配置和远程写入不在此次操作范围；测试使用该隔离副本与临时凭据目录。
- 站点 HEAD 返回 Access 登录跳转，仅用于确认链接；未登录或读取个人知识库。npm 信息通过公开 registry 核实。

下一步：完成双语草稿和候选 overview，检查示例 / 链接，交 root review。正常检查通过后才发布。

中文与完整英文文稿已完成，15 个本地引用逐语言验证成功，全部 Bash 示例一致，无治理内容。候选资料 ready_for_review；CLI build / 浏览器与正常 hooks 结果待补齐。

## 验证续接：CLI 与浏览器

主代理已经批准双语 README 与 docs/README.md 索引修订。CLI 使用进程级临时 clip 入口完成构建，生成的 `--help` 成功。`CI=1 bun run test:e2e:pw` 在隔离本地 D1 和 27036 端口通过全部四项浏览器用例（13.8 秒）；运行前确认端口空闲并移除进程内 Cloudflare 部署凭据。前端开发端口由 Vite 配置核实为 7036，Worker 37036，README 无端口差异。后续执行原有 hooks，不把这些结果替代为推送检查。日志 `/tmp/readme-bogo-cli-build.log` 与 `/tmp/readme-bogo-browser-tests.log`。

## 发布回执

主代理批准的三份README已通过原有pre-commit与pre-push，并于重新pull后推送main：`dfadc0a85813bef2caa67dfe1e97aa270f59940c`。77项本地API用例、clip schema生成、全部3项CLI登录/CRUD/撤销用例均实际执行通过，未软跳过。工作区干净且对齐远端。GitHub Contents回读三份README与本地逐字节一致（5921 / 6351 / 2531字节）。CI运行34231654680及34231548174均completed/success，版本仍0.8.1。

推送时OSV无问题；gitleaks虽然exit0，日志存在一次promisor blob下载失败，不据此宣称完整扫描。已补齐该对象，再用`git fetch --refetch --no-filter origin main`获取完整可达历史内容，并单独重跑原有`gate:security`，结果待补。此网络修复没有改变任何提交或门槛。

完整安全复验已通过：原`gate:security`扫描391个依赖无问题，gitleaks扫描全部332个提交、2.10MB内容，无泄漏也无对象下载错误。日志 `/tmp/readme-bogo-security-complete.log`。推送回执、两次成功CI与远端字节验证均已补齐。
