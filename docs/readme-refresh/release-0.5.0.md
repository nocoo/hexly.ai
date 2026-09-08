# 0.5.0 发布验收记录

用户要求 `/su-release Y+1`，本站从 0.4.6 升到 0.5.0，其他项目版本不变。本文件记录发布前的完成状态；发布后的精确提交、CI / Deploy、公开页面和五分钟复查结果随 [v0.5.0 GitHub Release](https://github.com/nocoo/hexly.ai/releases/tag/v0.5.0) 保存，避免为了追加验收日志再次部署站点。

## 已完成的交付

- 49 个非归档项目均已完成双语 README；Snaky / Steed 试点 2 项与推广 47 项均在 main 推送，并按精确提交回读。推广文稿、overview 与必要支持性修复的摘要见 [review-snapshots.json](review-snapshots.json)，逐项发布见 [review 台账](review-ledger.md) 与 [publication-audit.json](publication-audit.json)。
- 49 个项目 JSON 均包含双语目标、技术栈名称及双语用途、调查日期 / 源提交 / 证据路径。详情页在首组 Logo 大图下方展示，README 入口随语言切换。生成 profiles 已同步。
- 20 个归档记录以及所有项目原有身份、颜色、排序、来源和素材保持不变。本站图库仍有69个项目，未把本站自身重新加入目录。
- GitHub profile 提交 `7a6b6e35d589e326e71912a68dfb2240eaaf2738` 已推送与回读。Recent 在前、Games 第二；各区匹配入口按本站相对顺序排列，内容与入口集合保留。详见 [profile 记录](profile-release.md)。
- Giraffe、Frogie、Raven、Bogo 原 checkout 的 HEAD 与工作区状态已对照调查前快照再次核实；未推送其无关工作。Basalt 并行 SEO、Meowth 既有配置与 Lyre 原本地 D1 保留，隔离副本使用方式见 [记录](isolated-checkouts.md)。

## 发布前验证

| 检查 | 结果 |
| --- | --- |
| 静态资料复核 | 全部47份推广候选通过双语命令、相对路径、基线证据、批准摘要、远端字节和变更范围校验；两份试点的历史验收仍有效 |
| 素材生成与校验 | 69个来源校验和、414个派生素材、54份当前/历史family档案、92轮finishing记录通过；无素材/排序变更 |
| 单元与覆盖率 | 11文件、92项通过；statements99.61%、branches98.69%、functions100%、lines99.57% |
| HTTP | 61项通过，本地隔离环境，无远端存储绑定 |
| 浏览器 | 162项通过，桌面/移动、浅深主题、无障碍、加载/失败恢复及归档兼容性 |
| 全部49个详情页 | 每项核对中英文目标、技术名、双语用途、README链接；1440px读取与320px横向溢出检查通过 |
| 类型 / lint / 隔离 | 已通过，最终暂存检查仍由正常hooks执行 |
| 安全 | OSV无已知依赖问题，Gitleaks无泄露发现 |
| 部署预演 | `bun run deploy:check`成功，仅ASSETS绑定，未实际部署 |

本地详细日志位于 `/tmp/hexly-readme-*`；完整49项矩阵在 `/tmp/hexly-readme-local-matrix/production-overviews.json`。可复用 [逐页核查脚本](verify-overviews.ts)：

```bash
# 替换为已构建或已发布的完整 Git SHA；省略其后参数默认核查线上0.5.0。
bun docs/readme-refresh/verify-overviews.ts FULL_GIT_SHA

# 本地：先构建并启动仓库既有 test 环境，指定实际版本。
bun docs/readme-refresh/verify-overviews.ts FULL_GIT_SHA http://127.0.0.1:27048 0.4.6 /tmp/hexly-readme-local-matrix
```

## 发布顺序与发布后证据

1. 完成正常commit，工作区干净后fresh pull，运行 `bun run release -- minor`。
2. 发布脚本升级唯一版本源和CHANGELOG，保留冻结lockfile验证与所有hooks，push main，等待该完整SHA的CI与Deploy成功。
3. 确认 `/api/live` 返回0.5.0及该完整SHA、公开HTML/JS/CSS与原Logo均可用，再创建不可移动的tag与GitHub Release。
4. 使用同一脚本复核线上49个详情页、双语和320px布局。结果附为 [production-overviews.json](https://github.com/nocoo/hexly.ai/releases/download/v0.5.0/production-overviews.json)。
5. 从正式Release完成时开始计时至少五分钟，再执行 `gh run list --limit 5`，回读精确CI/Deploy、远端main/tag/Release及生产版本。最终证据附为 [release-verification.json](https://github.com/nocoo/hexly.ai/releases/download/v0.5.0/release-verification.json)。

## 已知边界

Gaga与Dogfight的文稿推送、源码CI成功，自动Release因现有Cloudflare生产凭据返回9109失败；没有可用的新凭据，也未修改secrets。此限制不影响本站发版，详见 [诊断](rollout/release-auth.md)。Poké Pocket先前浏览器偶发失败已在原样重试后成功，与凭据故障无关。

Lyre支持性修复保留全部原生结果断言，正常测试使用空宿主，真实录音显式opt-in。本轮不采集真实音频、不运行真实云端ASR/模型/备份写入；完整浏览器由该仓库CI验证。首次远端HTTP job仅在依赖镜像下载时失败，原样重跑后CI和自动Release均成功，完整过程见 [Lyre记录](rollout/lyre.md)。
