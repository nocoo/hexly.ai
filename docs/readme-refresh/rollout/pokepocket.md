# Poké Pocket 调查与交付

- 工作区 `/Users/nocoo/workspace/personal/pokepocket`；调查前 main 干净，`git pull --ff-only` 成功。
- 基线 `461f4c3bb65480c43bdb5a8c27a054eba8da39ad`；状态 ready_for_review；版本 1.2.0 不变。
- 未发现仓库 AGENTS / CLAUDE；沿用 Snaky 公共 README 模板，保留现有 logo、截图与许可范围。

## 已核实内容

| 结论 | 证据 |
| --- | --- |
| React 拟物收藏盘，浏览器 mGBA WASM 执行卡带 | src/App.tsx、src/lib/emulator.ts、package.json |
| GB / GBC / GBA 宝可梦目录，未实现联机或后续主机支持 | src/data/editions.json、src/lib/catalog.ts、输入与模拟器源码 |
| 滤镜实际只有 crisp / lcd，旧 README 的三种已过时 | src/lib/settings.ts、App.tsx 设置 UI |
| ROM 按 SHA-256 区分，IndexedDB 保存 ROM / battery / snapshots | src/lib/cartridge.ts、src/lib/storage.ts |
| 导入 .sav 清除自动 slot 0，保留三个手动状态 | storage.replaceBattery、emulator.importBattery |
| 显示与键位偏好保存在 localStorage；快进、Gamepad、截图已实现 | settings.ts、input.ts、App.tsx、screenshot.ts |
| 开发仅扫描私有 roms / rom 第一层，按文件头识别并拒绝 symlinks | scripts/local-roms.ts |
| 生产与 preview 不读取私有卡带目录 | vite.config.ts、worker/index.ts |
| Worker 验证后交付 assets / 元数据，没有模拟服务或远端存档 | worker/index.ts、wrangler.jsonc |
| /api/live 唯一公开 API；所有其他路径仍需 Access | PRODUCTION_API_ROUTES、fetch 中 live 精确路径判断 |
| nocoo issuer 与团队检查硬编码，单改 env 不能迁移 | worker/index.ts authorized() |
| SharedArrayBuffer 需要隔离头；Worker / dev 已添加 COOP / COEP | vite.config.ts、worker/index.ts |
| 原创代码 MIT，mGBA 原样复制 MPL-2.0；ROM / 角色 / 商标不在 MIT | LICENSE、THIRD_PARTY_NOTICES.md、scripts/setup-emulator.mjs |

## 改写决策

- 双语正文按目标、功能、使用、开发、测试、技术栈、文档、许可证排序。保留 logo、截图、键位和存档迁移方法，删除固定包版本表、ROM 大小与总容量、个人证书绝对路径、质量门槛和 CI / Release 制度介绍。
- 不泛称全离线产品：ROM 和进度保存在浏览器，但站点和资源仍由服务器交付；明确跨设备导出 .sav。
- 自行托管部分说明 Access 团队代码绑定，不暗示只填写变量就可启动生产站点。未公开已有 audience 等不影响使用的配置值。
- 使用当前实际两种滤镜；不复用旧 README 的“三种”。保留浏览器、模拟器核心版本与存档范围限制，不承诺全部游戏已通关。
- 第三方素材、卡带参考源和编译工具出处链接到 THIRD_PARTY_NOTICES，保持现有许可边界与 Swift 项目致谢；未执行任何 ROM 构建或读取用户私有 ROM。
- docs/README.md 仅增加中英文 README 与现有 logo 使用入口，保留原质量 / 恢复记录。

## 测试前提与验证

- manifest 要求 Node >= 22.12；CI Bun 1.4.0；安装自动复制 mGBA 与许可证。
- 单元：bun run test / test:coverage；本地 ROM HTTP：test:http；生产 HTTP：quality:l2（名称是现有脚本，公共文档只解释测试用途）；浏览器：test:e2e / test:e2e:optional。
- 生产 HTTP runner 自动 build，端口 17048；browser 独立 27047，dev 7047 / preview 17047。
- **读取完整 run-l3 后修正前提**：本机 `chromium.launchServer({channel: 'chrome'})`，需安装 Google Chrome；CI 不指定 channel，安装 Playwright Chromium。不能一概写本机只需 install chromium。
- 必需浏览器使用原创 GB / GBC / GBA fixtures 和临时签名令牌，无需商业 ROM；可选套件需要本机完整支持集合，未执行，真实 SSO 也未验证。
- GitHub homepage 与 wrangler route 均为 pokepocket.hexly.ai；匿名 HEAD 返回 403，没有 Location。仅确认访问受限，不声称登录跳转或 Access 部署探针成功。
- 只对三份文档运行 Prettier。中英文各 135 行，全部相对链接、fences、script names 与 git diff --check 通过。

## 发布计划

等待 root 对双语 README / docs 索引 / overview 的书面 review。批准后正常 precommit 执行 lint / type / format / coverage，prepush 执行生产 HTTP 与安全扫描，不跳过 hooks、不降低规则、不改版本。推送前再次 pull；回读远端文档并记录 CI。若检查失败，保留日志交主代理 review，继续独立项目。

## 正常提交

首次 pre-commit 静态与覆盖率全部通过，commit-msg 要求首行全小写，原消息中的 README 被拒绝。保留全部文稿和检查规则，将消息改为 docs: standardize bilingual project readme 后完整重跑通过，提交 8698f1ac309b4f00d1cb5c5770fdfd79d212ff55。再次 pull 成功；确认 17048 空闲后正常 pre-push 已启动。

## 发布回执

- 正常小写提交 `8698f1ac309b4f00d1cb5c5770fdfd79d212ff55`；push 前已再次 pull，main 推送成功且工作区干净、与 origin/main 同步。
- 预提交静态检查与覆盖率通过；正常 pre-push 的构建、ROM 分发检查、OSV、gitleaks 与 40 个生产 HTTP 测试通过。没有运行私有 ROM 的可选浏览器测试。
- GitHub 同 SHA 的 README.md、docs/README.en.md、docs/README.md 已逐字节比对一致。
- CI 34230105197 success；现有自动 Release 34230523621 正在执行。未手工发版或部署，版本未改。
- 17048 已释放，可供本站 HTTP 检查使用。

自动 Release 补充：34230523621 最终 failure。L1 / G1、L2 / HTTP 与 G2 均 success，required Chromium L3 为29 pass /1 fail。失败是 GBA snapshot regression 的60000ms整例超时，最终位置 `tests/e2e/core-journeys.spec.ts:464` 的暂停按钮 click；按钮已找到且 visible / enabled / stable，日志停在 performing click，不能直接推断为按钮缺失或断言不符。聚合失败后 Deploy Worker skipped。

- 原失败日志 `/tmp/readme-refresh-20260908-apps-pokepocket-release-failure.log`。
- GitHub browser artifact：https://github.com/nocoo/pokepocket/actions/runs/34230523621/artifacts/10057765232 。
- 本轮只改三个文档，未改断言、超时、业务逻辑，也未自行重跑 Release。交 root 判断下一步；文档已发布并回读一致，完整自动发布尚未完成。

Trace 诊断补充：已下载原 browser-failure-artifacts 至 `/tmp/readme-refresh-20260908-apps-pokepocket-browser-artifacts`。test.trace 显示进入测试约6秒后到达暂停 click，随后该操作挂起约65.4秒，其他主要操作最长约2.1秒；并非此前步骤耗尽总体预算。底层 trace 的最终 `call@617` 没有正常 after。按钮可见 / enabled / stable，没有错误 selector 证据。`src/App.tsx` 的按钮处理先同步 `emulator.pause()`，其内部同步 `core.pauseGame()`，再异步 persist；该核心暂停路径可疑，但 trace 尚不足以证明底层原因。

按 root 要求处理既有发布路径，已对同一 Release run 的 failed jobs 原样重跑一次以判断暂态性；不重新创建 Release、不变更 SHA、断言、超时或源码。命令 `gh run rerun 34230523621 --repo nocoo/pokepocket --failed`；重跑结果待回填。

最终补充：同一run的attempt2于2026-09-08T13:30:11Z成功，required browser、汇总和Deploy Worker全部success。没有更改任何源码、断言、超时或版本；当前发布阻塞已解除。首次瞬时挂起证据保留，不能称为已修复代码缺陷。
