# DreamRO 调查与交付

- 工作区 `/Users/nocoo/workspace/personal/dreamro`；main 干净，调查前 pull 成功。
- 基线 `07185e854a59e320f8b2a45f6d50484186753c57`；状态 published；版本 1.0.0 不变。
- 没有仓库 AGENTS / CLAUDE，也没有启用的 Git hooks。仅更新 README 并新增 docs/README.en.md；原 docs 没有索引，不为此新建冗余目录页。

## 已核实内容

| 结论 | 证据 |
| --- | --- |
| 完整浏览器单人游戏，不是在线 MMORPG / UI 模板 | main.ts、Game.ts、wrangler 仅 assets 配置 |
| 初心、基础、进阶职业都可直接创建，每类四技能 | jobs.ts、main.ts 角色创建与切换 |
| 治疗、护盾、冲刺、毒、陷阱、范围、召唤与吸血实际处理 | Game.cast 的各 skill.kind 分支 |
| 三个地图 / 顺序任务，完成最终任务获得长期波利伙伴 | World.MAPS、state.QUESTS、Game.claimQuest / makeFamiliar |
| A* 地面与大地图寻路，近战 / 远程追击和女王领地行为 | pathfinding.ts、Game.ts、main.ts 大地图 |
| 战斗、装备、药水、卡片、复活与自动存档已实现 | Game.ts、state.ts |
| 进度与偏好分别保存在 origin localStorage | state.ts loadHeroes / persistHero / preferences |
| Three.js 几何体、Canvas 纹理、Web Audio 合成 | Character.ts、World.ts、art.ts、Audio.ts |
| 字体有 OFL，背景为生成素材，代码 / 世界模型来源已说明 | CREDITS.md、LICENSE、public/fonts |
| 纯静态托管，没有服务端 API / 账号 / 数据库 | wrangler.jsonc、package.json、src network 查询 |

## README 改写

- 原文玩法基本准确，主要整理顺序、增加完整英文、删除数量与版本 badges 和 CI / Release 过程介绍。
- 保留 logo、preview.jpg、操作表、地图与技能价值，说明云端同步与多人边界。
- 默认语言继续中文；英文地图名使用 World.ts 的 Dawnlight Valley / Whispering Woods / Starfall Sanctuary，未自行创造新名称。
- 安装用 npm ci，符合现有 package-lock 和 CI；Node 22.12 来源于 CI 与 Vite 运行前提。没有环境变量、API key 或服务器初始化步骤。
- 5173 默认开发端口非 strict，遇占用会变；说明不同 origin 存档独立。
- 测试只列 Playwright 现有命令与 Chromium / 端口前提，不编造单元、API 层。5188 会在非 CI 复用服务，所以注明先确认空闲。
- 两语言保留 MIT、OFL 与 RO 权利说明，链接现有 gameplay / deployment / credits / changelog。

## 验证

- 官网 metadata / route 一致，匿名 HEAD 200。
- npm run build 通过，含 tsc 与 Vite；现有 Three.js chunk >500 kB warning 保留，没有改 bundle 配置。
- npm test -- --list 正确列出 2 文件 / 10 流程。未在本机重复完整三维浏览器游戏，CI 将按原配置执行；不把列表输出当作测试通过。
- 双语各 117 行，路径、图片、fences、命令和 diff --check 通过。只修改两份公共 README，构建产物未入 Git。

## 发布计划

等待 root 完整 review。批准后直接 main 正常 commit、再次 pull、push；远端回读两份 README 并跟踪 CI / 现有 Release。无版本修改、标签、手动部署或发布动作。

## 发布结果

root 复核后正常提交与再次 pull 成功，已推送 92c77722d86b93926d9f7d9d80eacc297c101c44。双语远端字节匹配，main 干净并同步；CI 34229891130 运行中，将补最终回执。仅两文档、版本未变。

CI 补充：34229891130 已 success，包含完整 Chromium 浏览器测试、typecheck / build 与 Worker 包校验；后续自动 Release 34230653965 success。
