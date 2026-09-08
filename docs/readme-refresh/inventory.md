# 49 个未归档项目：README 比较与后续顺序

## 范围与调查方法

2026-09-08 的站点目录包含 49 个 `archived: false` 项目，全部在上一级目录有本地仓库；20 个归档项目与本站自身不纳入本轮。先读取原 README、manifest、当前入口、测试配置及文档，再记录可定位到源文件的差异。表中行数和语言均为整理前快照，行数仅辅助比较。

48 个项目的原始记录分为 [A–L](surveys/a-l.json) 与 [M–Z](surveys/m-z.json)，Snaky 有[单独的完整调查](snaky.md)。原始记录保留同步结果、SHA、用途、技术栈、测试命令、证据与缺口；初筛未执行这些非试点仓库的测试，不能据此宣称所有功能已经运行验证。`life.ai` / `signoff.now` 的仓库名在站点分别映射为 `life-ai` / `signoff-now`。

整理前默认 README：中文 30 个、英文 19 个；49 个项目均无独立英文 README。本轮只为 Snaky、Steed 新增双语版本和本站详细资料。优先级：首批 2 个、高 21 个、中 18 个、低 8 个。

## 第二个试点为何选 Steed

| 候选 | 原 README | 首次使用的主要缺口 | 本轮决定 |
| --- | --- | --- | --- |
| Steed | 40 行 | 几乎没有功能说明、启动条件、CLI 用法或测试；实现已迁移到 Vite / Workers / D1 | 选为第二个试点，与 Snaky 的 CLI / 原生应用形成对照 |
| Rooster | 29 行 | 已有 install / rebuild / dev 命令，但缺 Hermes / Python bridge 前提与具体使用入口 | 更短不代表更少可用信息；列入后续高优先级 |
| Wooly | 60 行 | 首次运行未交代 Worker / D1 持久化依赖 | 后续高优先级 |
| Giraffe | 63 行 | 已有目标、功能、栈；缺少完整初始化方法，且存在原有工作区改动 | 先保留现场 |
| Echo | 151 行 | monorepo 结构、根启动 / 测试命令、功能范围均过时 | 后续优先修正可执行入口 |
| Noheir | 105 行 | 应用、后端、MCP 路径与现有代码不符 | 后续优先修正架构与入门 |

## 全量比较

高：启动、功能范围或部署 / 测试前提有实质缺口。中：已有可用说明，仍有遗漏、漂移或过多维护规约。低：主要为模板、语言和少量事实校正。优先级表示文档整理收益，不评价项目本身的质量。

| 项目 | 原语言 / 行数 | 同步状态 | 优先级 | 主要差距 |
| --- | --- | --- | --- | --- |
| [Arena](https://github.com/nocoo/arena) | 英文 / 182 | 已 pull | 中 | 补齐 CLI / OAuth 入门；SQLite 运行时与许可证描述需要校正。 |
| [Backy](https://github.com/nocoo/backy) | 中文 / 253 | 已 pull | 中 | 首次运行配置不完整；Webhook 协议与质量制度篇幅过多，CLI 仍是占位。 |
| [Basalt](https://github.com/nocoo/basalt) | 英文 / 181 | 已 pull | 低 | 安装与组件示例较完整；简化品牌说明和固定数量，补双语。 |
| [Bat](https://github.com/nocoo/bat) | 中文 / 196 | 已 pull | 中 | 补主机事件、标签、资产与绑定；简化质量规约和未注明条件的性能数字。 |
| [Bogo](https://github.com/nocoo/bogo) | 英文 / 110 | 已 pull，保留 ahead 4 | 高 | 组织树、文档版本、字段和视图介绍不足；测试入口与许可证需校正。 |
| [clip](https://github.com/nocoo/clip) | 中文 / 182 | 已 pull | 中 | 补真实 E2E 与 fixture 启动；test:integration 只是占位，不能算有效测试。 |
| [Codo](https://github.com/nocoo/codo) | 英文 / 177 | 已 pull | 高 | 遗漏 Guardian；修正连续 cd 产生的错误路径，并明确安装包限制。 |
| [Deca](https://github.com/nocoo/deca) | 中文 / 166 | 已 pull | 高 | Agent 规约压过使用说明；重新核对 provider 配置、服务入口与测试分层。 |
| [Dogfight](https://github.com/nocoo/dogfight) | 中文 / 121 | 已 pull | 低 | 功能和控制较新；统一模板与双语，保持单人游戏范围。 |
| [Dotty](https://github.com/nocoo/dotty) | 英文 / 111 | 已 pull | 中 | 页面数量过时；明确 mock 数据的前端模板定位与后端边界。 |
| [Dove](https://github.com/nocoo/dove) | 中文 / 86 | 已 pull | 高 | 缺少可用 Webhook 请求与初始化路径；默认 D1 remote 配置需说明。 |
| [DreamRO](https://github.com/nocoo/dreamro) | 中文 / 155 | 已 pull | 低 | 功能、存档和启动较完整；去掉固定测试数，补双语。 |
| [Echo](https://github.com/nocoo/echo) | 英文 / 151 | 已 pull | 高 | 根目录启动 / 测试命令已失效；结构遗漏 DNS probe 与 collector。 |
| [Ellie](https://github.com/nocoo/ellie) | 中文 / 205 | 已 pull | 高 | 快速开始引用不存在的根环境模板；当前 API / 浏览器运行器未完整介绍。 |
| [Firefly](https://github.com/nocoo/firefly) | 英文 / 100 | 已 pull | 高 | 文章、媒体、搜索、MCP、备份等功能被开发配置和质量制度遮住。 |
| [Flow](https://github.com/nocoo/flow) | 中文 / 132 | 已 pull | 中 | 补中文润色能力、模型 provider 前置条件；收敛输出效果承诺。 |
| [Frogie](https://github.com/nocoo/frogie) | 中文 / 169 | 分叉，未合并 | 高 | 版本与存储描述过时；需区分消息文件与 SQLite 索引，并先处理分叉。 |
| [Fundly](https://github.com/nocoo/fundly) | 中文 / 164 | 已 pull | 中 | 已实现筛选仍列为计划；区分 Bun / SQLite 实际入口与历史 Worker 目录。 |
| [Gaga](https://github.com/nocoo/gaga) | 中文 / 115 | 已 pull | 低 | 内容与代码基本一致；补双语，保持本地存储与 WebGL 2 前置条件。 |
| [Gecko](https://github.com/nocoo/gecko) | 英文 / 158 | 已 pull | 高 | cd 路径错误；同步机制与技术栈已变化，云同步边界需明确。 |
| [GeekHub](https://github.com/nocoo/geekhub) | 中文 / 236 | 已 pull | 高 | clone 地址仍为占位；LICENSE 链接失效，README 混入大量 Agent 指南。 |
| [Giraffe](https://github.com/nocoo/giraffe) | 中文 / 63 | 保留未提交改动 | 高 | 已有目标、功能和栈；缺依赖、配置、初始化和浏览器测试方法。 |
| [Hooky](https://github.com/nocoo/hooky) | 英文 / 180 | 已 pull | 中 | 功能准确；压缩发布 / hooks 表，说明 Quick Send 的用户触发条件。 |
| [IPSafe](https://github.com/nocoo/ipsafe) | 英文 / 277 | 已 pull | 中 | clone 地址占位、篇幅重复；说明只检查命令启动前的网络条件。 |
| [Life.ai](https://github.com/nocoo/life.ai) | 中文 / 115 | 已 pull | 高 | 已实现健康 / CSV 导入与 Dashboard 被称为原型，维护规约占比较大。 |
| [Lyre](https://github.com/nocoo/lyre) | 英文 / 161 | 已 pull | 中 | deploy:test 不存在；栈信息漂移，缺少完整测试层入口。 |
| [Matrix](https://github.com/nocoo/matrix) | 英文 / 298 | 已 pull | 低 | 产品和启动较完整；校正 Router 版本，迁出 hooks 与 mocking 教程。 |
| [Meowth](https://github.com/nocoo/meowth) | 中文 / 93 | 已 pull | 中 | 启动较清楚；补 Go / Web / HTTP / 浏览器测试入口与当前运行要求。 |
| [Neo](https://github.com/nocoo/neo) | 中文 / 208 | 已 pull | 高 | 栈与开发工具过时；生产已是 GHCR / VPS 容器而非 README 中的 Railway。 |
| [Noheir](https://github.com/nocoo/noheir) | 中文 / 105 | 已 pull | 高 | 目录仍写旧前端 / Supabase；当前为 Next.js + Worker / D1，MCP 位置也已变化。 |
| [Otter](https://github.com/nocoo/otter) | 中文 / 248 | 已 pull | 中 | 更新采集器范围与栈信息；简化过时测试计数和质量制度。 |
| [Owl](https://github.com/nocoo/owl) | 中文 / 157 | 已 pull | 中 | 遗漏系统指标监测能力；Swift 工具链和测试说明需更新。 |
| [Pew](https://github.com/nocoo/pew) | 中文 / 207 | 复查干净后已 pull | 中 | 功能和测试较完整；根 build 实际不构建所有包，需校正。 |
| [Pew Game](https://github.com/nocoo/pew-game) | 英文 / 96 | 已 pull | 高 | README 仍把游戏链接到 pew.md；需核实当前游戏域名并补测试层入口。 |
| [Pika](https://github.com/nocoo/pika) | 中文 / 163 | 已 pull | 低 | 较完整；集中列出单元 / HTTP 测试，简化部署规约并补双语。 |
| [Poké Pocket](https://github.com/nocoo/pokepocket) | 中文 / 177 | 已 pull | 中 | 用户说明较清楚；压缩质量与发布制度，迁出个人基础设施细节。 |
| [R2Shot](https://github.com/nocoo/r2shot) | 英文 / 186 | 已 pull | 高 | 已支持整页截图却未介绍；dev 实为 watch build，栈与测试信息也需校正。 |
| [Raven](https://github.com/nocoo/raven) | 中文 / 493 | 分叉，未合并 | 中 | 长文重复配置 / 命令 / 测试；需提炼首次运行，并先处理分叉。 |
| [Rooster](https://github.com/nocoo/rooster) | 英文 / 29 | 已 pull | 高 | 虽已有开发命令，仍缺 Hermes / Python bridge 前置条件、入口和使用流程。 |
| [Runner](https://github.com/nocoo/runner) | 中文 / 132 | 已 pull | 高 | 默认存储已是 SQLite / GRDB；README 仍写 JSON，并含错误 cd 路径和测试工具。 |
| [Shrike](https://github.com/nocoo/shrike) | 英文 / 155 | 已 pull | 低 | 功能和安装较清楚；去掉固定版本 / 测试数，说明 Google Drive 客户端依赖。 |
| [signoff.now](https://github.com/nocoo/signoff.now) | 中文 / 230 | 已 pull | 中 | 运维细节压过产品流程；包表遗漏 collect CLI 与 domain，需明确测试范围。 |
| [Snaky](https://github.com/nocoo/snaky) | 中文 / 169 | 已 pull | 首批 | 首批：补已发布 macOS 应用、NDJSON、代理 / DNS 条件并校正运行要求。 |
| [Steed](https://github.com/nocoo/steed) | 中文 / 40 | 已 pull | 首批 | 首批：原文缺功能、使用、启动、测试；当前 Vite / Workers / D1 需与旧文档区分。 |
| [Surety](https://github.com/nocoo/surety) | 中文 / 224 | 已 pull | 中 | 更新栈和 Biome；补已实现的医院、医生、就诊记录能力。 |
| [Unseal](https://github.com/nocoo/unseal) | 中文 / 123 | 已 pull | 低 | 结构接近目标；测试只写实际命令，明确移除 quarantine 的操作含义。 |
| [Wooly](https://github.com/nocoo/wooly) | 英文 / 60 | 已 pull | 高 | 缺 Worker URL / API key、数据库迁移等持久化前提，技术栈遗漏 Worker / D1。 |
| [Xray](https://github.com/nocoo/xray) | 英文 / 75 | 已 pull | 高 | 未介绍关注列表、翻译等实际功能；缺本地采集生产者与测试入口。 |
| [Zhe](https://github.com/nocoo/zhe) | 英文 / 378 | 已 pull | 高 | 测试已转本地但文档仍要求远端资源；KV 同步、功能范围和栈多处过时。 |

## 同步例外与发布边界

- 46 个仓库成功 pull。Pew 初查时 `packages/web/next-env.d.ts`、`tsconfig.json` 有原有改动，先保留；复查工作区干净后执行 pull，结果无需更新，HEAD 未变，调查结论仍适用。
- Giraffe 有原有未提交变更，未 pull；该条目依据当时本地文件，不能当作确认同步后的最新状态。
- Frogie 本地领先 1、远端领先 6；Raven 本地领先 3、远端领先 8。两者 `pull --ff-only` 拒绝分叉，本轮未合并、变基或覆盖。
- Bogo pull 成功，但本地仍领先 4 个既有提交；这些提交不能随未来 README 改动顺带发布。
- 非试点仓库只调查与同步，没有改写 README、增加项目资料、提交或推送。调查前后可能出现使用者的并行工作，下一批需重新核对状态。

## 后续批次建议

1. 先由用户看 Snaky、Steed 的双语 README 和详情页，确认篇幅、顺序、功能表述与 badge 呈现。
2. 确认后优先处理 Echo、Noheir、Runner 等会误导启动或架构理解的项目，再处理 Rooster、Wooly、Xray 等缺少首次使用条件的项目。每批 3–5 个，逐个重新同步并核实。
3. 其余高优先级按表中的具体问题推进；之后处理中、低优先级的模板与语言统一。
4. Giraffe、Frogie、Raven、Bogo 先重新核对已有工作归属和同步状态，具备安全基线后再纳入对应批次。
5. 每个项目完成双语改写、链接 / 命令验证及 hooks 后再推送，本站只公布已核实资料。每批更新证据、提交、CI 与部署记录，不沿用过时的测试数字。

本文件保留试点前的调查快照。2026-09-08 用户已确认 Snaky、Steed 并授权 agent team 推广到其余 47 个项目；当前状态和复核结果见[推广记录](rollout.md)。
