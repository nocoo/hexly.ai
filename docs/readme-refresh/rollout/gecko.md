# Gecko README 调查与交付

## 同步与状态

- 日期：2026-09-08；checkout `/Users/nocoo/workspace/personal/gecko`。
- 初始 main 干净，无 ahead；调查前 `git pull --ff-only` 成功。
- 基线 `f259be7fe740ce260c9257e2870b57dec8d9e7b3`。
- 根 README 中文和 `docs/README.en.md` 已准备，待主代理 review；尚未提交/push。
- 已读 CLAUDE；按用户本次明确指令不采用默认版本升级/发 tag 流程，不改 CLAUDE。

## 实现与证据

| 结论 | 代码 / 配置 |
| --- | --- |
| Mac 14+、SwiftUI / AppKit / Swift 5.10 项目、Xcode 16 配置 | `apps/mac-client/project.yml` |
| 本地窗口会话、闲置/锁屏/睡眠状态、事件+timer | `Gecko/Sources/Services/TrackingEngine.swift` 与扩展 |
| 支持的浏览器为 Chrome/Safari/Edge/Brave/Arc/Vivaldi | `Gecko/Sources/Services/BrowserURLFetcher.swift` |
| SQLite 默认路径、Keychain、默认同步域名仍为 dev | `Gecko/Sources/Services/SettingsManager.swift` |
| API key / HTTPS / 批量同步 | `Gecko/Sources/Services/SyncService.swift` |
| Web React+vinext / Vite，生产为 Node 容器 | `apps/web-dashboard/package.json`、`Dockerfile` |
| D1 为 REST 客户端，D1_LOCAL_PATH 选择本地 SQLite | `src/lib/d1.ts` |
| Google OAuth；ALLOWED_EMAILS 空时放行完成 OAuth 的账号 | `src/auth.ts` |
| 本地库初始化脚本会重建目标文件，默认用于测试 | `scripts/init-local-db.ts` |
| 每日统计与模型调用、提示词编辑 | `src/services/daily-stats.ts`、`analyze-core.ts`、`app/api/settings/ai/route.ts` |
| 自动分析、可选 Dove 邮件 | `src/lib/auto-analyze.ts`、`src/services/email-notification.ts` |
| API snapshot 返回计算统计和已有分析 | `src/app/api/v1/snapshot/route.ts` |
| Backy 导出、推送、恢复 | `src/app/api/backy/`、`src/lib/backy*.ts` |

## 修正与范围

- 删除无本次实测依据的 80–95% 节能宣传和固定测试数量。
- 删除“所有数据留在本机”的绝对表述，按不开同步/开启同步/请求 AI 分析说明数据去向。
- 不把窗口活动评分说成完整工作产出评价。
- 修正 Mac 开发 cd 后继续进入错误 Web 相对目录的问题，各段起点明确。
- 最新 Vite 已为 8，README 用稳定技术名称，不沿用 Vite 7 旧说法。
- 明确 Mac 默认同步域名为 dev，接线上需要手动设置。
- 最新 GitHub release v1.12.0 assets 为空；给源码构建路径，不编造 DMG 下载。
- 当前 Node 生产运行时由 Dockerfile 证实；未将项目误标为 Cloudflare Worker，仅 D1 数据存储。
- 测试仅列基础命令、真实端口和隔离前提；不介绍 6DQ。

## 站点与许可证

- `https://gecko.hexly.ai` 请求到 `/login`，HTTP 200；源码邮件链接 fallback 也使用该域名。
- 顶部顺序为站点、英文 README；Logo 原样保留。
- LICENSE 为 MIT，版权 2026 Zheng Li。

## 验证

- 根目录和 Web `bun install --frozen-lockfile` 均成功，版本/锁文件未改；Web 子目录 prepare 输出找不到 .git，根 Husky 已正常安装。
- Web `bun run --cwd apps/web-dashboard test` 通过：62 文件、849 测试。
- 两份 README 各 14 个本地引用存在，bash 示例一致。
- HTTP 测试脚本使用 `.local/gecko-test.db` 和 17018，Playwright 使用同库和 27018，文档写明顺序执行、停止其他 vinext。实际 hook / CI 待 review 后执行。
- 默认选中 Command Line Tools，首次 `xcodebuild -version` 失败；主代理已确认 `/Applications/Xcode.app/Contents/Developer` 可用。后续 normal hooks 使用进程级 DEVELOPER_DIR，当前 Mac 构建/测试尚未执行，不标记通过。
- 没有运行个人跟踪、同步、真实 AI 或邮件/备份操作。

## Review 与发布

待主代理审阅。批准后原 hooks 提交、再次 pull / ahead 核对、push main，并补回执。

## 发布检查（2026-09-08）

正常 pre-commit 已通过 Web 类型检查、lint、toolchain smoke、849 项 coverage 测试；完整 Xcode 环境下 strict SwiftLint 与 xcodebuild 原生单元测试通过。README 提交为 `b81e284aece4f2d21594c3282fdcb126e3f8fb4e`。发布前重新 pull 成功，仅该任务提交 ahead。

正常 pre-push 的 HTTP 集成测试 88 pass / 6 skip（可选真实 AI），gitleaks 通过；OSV 因 `image-size@2.0.2` 的 `GHSA-5p2g-fcmc-qvqq`、`GHSA-w3rx-r6r6-pgpr` 拒绝推送，报告无已修复版本并提示现有 ignores unused。日志 `/tmp/readme-gecko-push.log`。未 bypass、未改依赖或忽略规则，待主代理 review 现有扫描配置。README 提交仍仅保留在本地 main，未推送。

## 发布回执（2026-09-08）

README 提交 `b81e284aece4f2d21594c3282fdcb126e3f8fb4e` 已按正常 hooks 发布到 main。另含主代理 review 后的独立检查修复 `14b43d95b0b901c0ca219a824a7ec84e7f0d541c`：复核既有 image-size 补丁，将对应限期例外续至 2026-10-08，并强制每次扫描前运行现有补丁回归；未更换依赖或应用版本。发布前再次 pull 成功，核对仅本任务提交 ahead。远端 GitHub API 回读中英文 README 与本地一致。CI：<https://github.com/nocoo/gecko/actions/runs/34224329253>，in_progress / 待完成。

补充远端验证：本轮 CI https://github.com/nocoo/gecko/actions/runs/34224329253 已 completed / success。两份 README 再次回读仍与本地完全一致。
