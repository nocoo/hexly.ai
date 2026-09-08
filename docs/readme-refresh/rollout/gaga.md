# Gaga 调查与交付

- 工作区 `/Users/nocoo/workspace/personal/gaga`；main 干净，调查前 pull 成功。
- 基线 `76260f08329784eead9b30912c7692b8ea0d3d56`；状态 ready_for_review；版本 1.0.0 不变。
- 无 AGENTS / CLAUDE 或启用的 Git hooks；新增 docs/README.en.md（此前无 docs 目录），修改根 README，不修改代码、品牌资产或版本。

## 已核实内容

| 结论 | 证据 |
| --- | --- |
| 普通 DOM + Three.js 的单页虚拟玩耍空间，无 React 或服务器逻辑 | main.ts、AppUI.ts、Playroom.ts、package.json |
| 八类玩具、对应动作与可见模型响应 | toys/index.ts、各玩具 create / actorRoute、actions.ts |
| 本地规则选择下站、A* 避障，非模型推理 | Explorer.ts、navigation.ts |
| 城堡和木马 actorRoute 完成后再转场，select 在暂停时恢复 | Explorer.select / pendingDeparture |
| 默认静音，Web Audio 合成旋律与木琴，隐藏页停止排新音符 | Soundscape.ts |
| 单指 orbit、双指 zoom、跟随、日夜、后墙隐藏 | Playroom.ts、AppUI.ts |
| 每日足迹为 toyId + time，最多近期记录，载入过滤本地日期 | AppUI.loadJournal / visit |
| 足迹保存但角色当前位置与动作不保存，无云账号 | main / Explorer / AppUI 的状态链路 |
| reduced-motion 默认暂停 | Explorer.running、AppUI CSS |
| 开发诊断接口仅 DEV 导出 | main.ts import.meta.env.DEV |
| browser runner 自动启动临时 loopback Vite，或使用显式 dev URL | scripts/smoke.mjs |
| CI 目前只 build/typecheck，没有运行 browser | workflow test-command=true、enable-l3=false |
| Worker 名为 gagaya，不等于 repo名；wrangler 未入 package依赖 | wrangler.jsonc、package.json |

## README 决策

- 保留品牌 logo 与 preview，增加完整英文并按统一模板整理。描述虚拟角色与具体玩法，不引入教育、育儿或治疗效果承诺。
- 原文大体正确；删除 60平方米等装饰数字与版本徽章，保留玩具类别与操作。
- 旧文 '+ / −' 易被理解为键盘快捷键，源码只接 Space / R / T / M / N；缩放使用 OrbitControls、滚轮、触屏或界面按钮，新文明确“缩放按钮”。
- 写清仅当天足迹持久化；不会暗示完整模拟状态或历日档案保存。
- 使用 npm ci 与实际 lockfile。测试无需提前手动起服务；PLAYWRIGHT_BASE_URL 必须是开发服务，不能指向没有 __TAOTAO__ 的生产预览。外部服务分支不检查 HMR。
- 提醒部署脚本的 Wrangler 前提（不改 manifest 或添加依赖），不将单一 npm run deploy 当作无需准备的首次部署。
- 品牌文档与实际 OFL 许可链接保留，不生成新图或运行图标重建。

## 验证

- 官网 metadata / route 一致，HEAD 200。
- npm run build 通过，含 TypeScript 与 Vite。
- 确认 PLAYWRIGHT_BASE_URL / PLAYWRIGHT_CHROMIUM_EXECUTABLE 均未设置后，运行原 npm run test:e2e：全部浏览器流程通过，无 page/console errors。自动临时 Vite 与新浏览器由 runner 正常关闭；使用合成场景，不涉及用户真实数据。
- 浏览器覆盖玩具路线、动作 / 拾取、队列、暂停、镜头、音效、日夜、journal重载、HMR、触屏与减少动态；未改断言或时间上限。
- 日志 /tmp/readme-refresh-20260908-apps-gaga-{build,browser}.log；截图在原忽略目录 artifacts/。
- 双语各 121 行，链接、fences、命令与 git diff --check 通过。

## 发布计划

等待 root 完整 review。批准后 main 正常 commit、再次 pull 与 push，回读双语并跟踪 CI / 既有 Release。保持版本 1.0.0，不手动部署。

## 发布回执

- root 已批准并精简双语测试章节，修订已保留。正常提交 `a6a8ddfeafe94d784bea83a8fbd4a674c009d701`，push 前再次 pull，main 推送成功、干净且同步。版本 1.0.0 未变。
- GitHub 同 SHA 的 README.md 与 docs/README.en.md 已逐字节回读一致；CI 34230957684 success。
- 自动 Release 34230984895 失败：Worker gagaya 的 API 返回 Authentication error 10000，账户 API 随后报告 Invalid access token 9109。Wrangler 自动安装已成功，不是最终原因。
- 失败日志 `/tmp/readme-refresh-20260908-apps-gaga-release-failure.log`；第一次下载遭网络 reset，原样读取重试成功。未改 secrets / 配置、未手工部署。

鉴权对比补充：与 Dogfight 相同，production environment 中的 CLOUDFLARE_API_TOKEN 覆盖 repository 同名值，生效 token 更新时间2026-09-05T03:03:26Z；DreamRO production 仅有 account ID，使用2026-09-07更新的 repo token。详情与最小配置建议见同目录 dogfight.md 的自动部署鉴权对比。未修改任何 secret。
