# Dogfight 调查与交付

- 工作区 `/Users/nocoo/workspace/personal/dogfight`；main 干净，调查前 pull 成功。
- 基线 `b5ab075a963a78516aaa351d6ca0178c64994729`；状态 ready_for_review；版本 1.0.0 不变。
- 没有 AGENTS / CLAUDE 或启用的 Git hooks。改根 README 并新增完整英文；现有 docs 仅 logo 说明，不新增冗余索引。

## 已核实内容

| 结论 | 证据 |
| --- | --- |
| 玩家固定 F-22 对三架 Su-35，自空中开始，完整胜负流程 | App.tsx、simulation.reset / step |
| 锁定角 21 度、3600 距离、1.1 秒，满血敌机两枚导弹 | simulation.ts 常量、enemy.health 100、damageEnemy 60 |
| 机炮无限但过热，1700 内轻度辅助瞄准 | simulation.updateGun |
| 敌方追击 / 导弹、热焰干扰与地形碰撞实际实现 | simulation.ts |
| 键盘 / 鼠标 / 触屏、横屏、暂停、画质与灵敏度设置 | engine.ts、App.tsx |
| 只有胜利最高分写入 localStorage | App.tsx aether-best-score |
| 当前任务与设置仅内存状态，页面刷新不续接 | App useState / EngineSettings / simulation |
| 机体、地形、云和音效程序化生成 | aircraft.ts、world.ts、clouds.ts、audio.ts |
| 浏览器测试不会自动起服务，AETHER_TEST_URL 可指定 | scripts/browser-smoke.mjs |
| macOS 优先本机 Chrome，否则 Playwright Chromium | browser-smoke 的 executablePath 分支 |
| CI 执行 build / unit / typecheck，未启用 browser | .github/workflows/ci.yml enable-l3=false |
| Worker 仅静态资产托管，无后端/API | wrangler.jsonc |

## README 决策

- 原文主要玩法准确。保留 logo、preview 与操作表，增加英文并统一章节顺序。
- 旧 README 用 AETHER · 霁蓝边界，当前 App header 则为 AETHER 空战纪元；正文仅使用稳定的 AETHER 名称，避免选择冲突的中文副标题。
- 强调街机游戏规则，不把机体或导弹名写成真实航空模拟能力。
- 补充实际持久化边界：最高胜利分保存，当前战役与设置不会跨刷新保留。
- 提供 npm ci、现有 build / preview，与 CI Bun 1.4.0 一并说明；不引入新包管理器配置。
- 浏览器先起本地 Vite，设置 AETHER_TEST_URL 匹配端口；不暗示 npm run test:browser 会自动起服务或 CI 已执行它。
- 删除旧无 package script 的裸 wrangler 部署命令，链接实际静态配置；不改部署文件。

## 验证

- 网站来源与 route 一致，HEAD 200。
- npm test：1 文件 / 8 用例通过；覆盖飞行、锁定、武器、干扰、胜負、碰撞与重置。
- npm run build：TypeScript + Vite 通过，无构建产物差异进入 Git。
- 浏览器脚本已完整核读，本轮文档变更不额外重复完整战役；没有把未跑的浏览器用例记为通过。
- 双语各 122 行，链接、fences、命令与 diff --check 通过。

## 发布计划

等待 root 对双语与候选 overview 复核。批准后正常 commit、再次 pull、push main，回读远端并跟踪 CI / 既有 Release。不加新测试、不改版本，不手动部署或创建 tag。

## 发布回执

- root 已批准并将锁定角修订为与机头方向夹角小于 21°，已保留该修订。
- 正常提交 `20748048b4688ec9618219aec4008aff0f2c895c`，push 前再次 pull，main 推送成功、干净且同步；双语 README 已从 GitHub 同 SHA 回读，逐字节一致。版本 1.0.0 未变。
- CI 34230692443 success。自动 Release 34230741603 的 Cloudflare 部署失败：服务 API 返回 Authentication error 10000，随后账户查询返回 Invalid access token 9109。Wrangler 缺失后的自动安装成功，不是最终失败原因。
- 原失败日志 `/tmp/readme-refresh-20260908-apps-dogfight-release-failure.log`；未改 secret、未手工部署或重跑发版。文档发布已完成，线上部署未完成。

## 自动部署鉴权对比（root 指定的只读调查）

四个项目均以 `production` environment 部署，Wrangler action 的输入名称完全相同：`secrets.CLOUDFLARE_API_TOKEN` 与 `secrets.CLOUDFLARE_ACCOUNT_ID`。没有发现 token 名称拼错或指向不同 secret 名称的问题。

| 项目 | Repo token 更新时间（UTC） | production token 更新时间（UTC） | 本次有效 token 来源 | 结果 |
| --- | --- | --- | --- | --- |
| Dogfight | 2026-09-05 03:03:19 | 2026-09-05 03:03:20 | production environment | Cloudflare 10000 / 9109 |
| Gaga | 2026-09-05 03:03:25 | 2026-09-05 03:03:26 | production environment | Cloudflare 10000 / 9109 |
| DreamRO | 2026-09-07 00:21:54 | 无 | repository | 自动部署成功 |
| Poké Pocket | 2026-09-05 05:25:52 | 无（production 无 secrets） | repository（尚未运行部署） | 浏览器阶段失败，Deploy skipped |

- Dogfight / Gaga 在 repository 和 production 都存在同名账号 ID；有效 ID 也取 environment。DreamRO production 只有账号 ID，没有 token；它使用较新的 repository token。以上均仅由 `gh secret list --json name,updatedAt` 读取，未读取或输出 token 内容。
- GitHub 当前 secrets 文档明确 environment 同名 secret 优先于 repository。因此直接只更新 repository 的 token 不会改变 Dogfight / Gaga 此 job 的有效值。
- 两次失败都已到达 Cloudflare API，先服务接口鉴权失败10000，随后 `/accounts` 报 `Invalid access token` 9109；不是缺少 Wrangler（该 action 已成功安装），也不是根本没有输入 token。日志指向当前有效凭据被判无效；不能仅凭更新时间判断它具体是过期、撤销还是错误内容，也不能从 GitHub 元数据判断授权 scope。
- 最小处理应发生在凭据配置：为两个项目的 **production environment** 提供经 Cloudflare 验证有效、属于目标账号并具备部署所需权限的 token，然后原样重跑现有失败 job。没有证据支持改 workflow、改版本或放松检查。若要去掉环境级重复值而改用 repo token，须先确认 repo token 有效，不能假设它们可用。
- 本工作线遵守 root 指令，没有修改 secrets，没有增加权限，没有本机部署。此证据与最小处理建议已交 root。

资料核验：

- GitHub 当前源文档 `github/docs/content/actions/reference/security/secrets.md`（main）明确环境优先级与读取时机；通过 GitHub API 回读。
- Cloudflare 当前 `cloudflare/cloudflare-docs/src/content/docs/fundamentals/api/get-started/create-token.mdx`（main）列出权限、资源范围、IP / TTL 与 token verify。直接开发者网站请求403，使用同一官方文档仓库当前来源回读成功。
- 官方指引的 user token verify 可报告 active 状态；本轮未使用真实 token 执行此验证，不能将该建议写成已验证。
