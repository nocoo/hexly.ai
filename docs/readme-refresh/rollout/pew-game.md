# Pew Game README 调查与交付

## 同步基线

- 仓库：`https://github.com/nocoo/pew-game`；工作区 `/Users/nocoo/workspace/personal/pew-game`。
- 2026-09-08 调查前为干净、同步 main；执行 `git pull --ff-only`，结果 Already up to date。
- 调查提交：`71b4b8165874e1986f993706c6830cc60a8107bf`。
- 未发现适用的仓库 AGENTS.md / CLAUDE.md；读取了 normal commit/push hooks 与 CI。本轮不改版本。

## 当前代码证据

| 事实 | 证据 |
| --- | --- |
| 单人键盘移动，沿最后方向持续自动射击，移动增加少量射速 | `src/game/input.ts`、`src/game/player.ts` |
| Space/Enter 开始与重新开始，三条命，受伤后短暂无敌 | `src/game/engine.ts`、`src/game/player.ts` |
| 波次递增；basic/fast/tank 敌人逐步出现 | `src/game/wave.ts`、`src/game/enemy.ts` |
| Spread/Rapidfire/Pierce/Nuke，道具从第三波开始，Nuke 第五波起 | `src/game/powerup.ts` |
| 320×320 逻辑画布，OffscreenCanvas 绘制并按2倍显示 | `src/game/engine.ts`、`src/game/types.ts`、`src/game/sprites.ts` |
| 排行榜前10，名字1–6字母数字 | `src/components/Leaderboard.tsx`、`src/components/NameInput.tsx`、`src/app/api/scores/route.ts` |
| SQLite 数据库存储，首次访问自动建表，可设置 DATABASE_PATH | `src/lib/db.ts` |
| HMAC 会话签名 + 内存重复记录 + 分数合理性；并非服务端权威对局 | `src/lib/anticheat.ts`；分数由 `GameCanvas.tsx` 提交 |
| Next.js + React + Tailwind 外壳，TypeScript 游戏逻辑独立于React | `package.json`、`src/game/*` |

## 修正和限制

- 旧 README 称 twin-stick，但没有独立瞄准输入；改为键盘移动、最后方向自动射击。
- 补充按 Space/Enter 开始、静止也射击、Nuke 从第五波出现；不再只写“朝移动方向射击”。
- 区分游戏像素图由代码绘制与仓库品牌/截图图片，保留现有 logo 和游戏截图。
- 删除固定测试数量；标明 `test:e2e` 是无 Canvas 模拟帧测试，Playwright 是页面冒烟，不写成完整实机游玩验证。
- 增补 DATABASE_PATH、生产 ANTICHEAT_SECRET 与持久卷前置条件。现有默认签名值是源码公开的开发默认值，README 不复制其字符串。
- 反重复提交只作用于当前服务进程内存，不将其描述为完整防作弊系统。
- 当前游戏画布固定640px，未实现触屏控制；README 定位桌面键盘浏览器。
- `https://pew.md` 来自旧 README 与产品命名，本轮 GET 200；保留的 s.zhe.to 游戏截图也返回200。
- LICENSE 为 MIT，2026 Zheng Li。

## 验证与发布

- `bun run test:e2e` 成功：9 项游戏循环集成测试，无真实排行榜写入。
- 安装需 better-sqlite3 原生模块，与 CI `trusted-native-deps` 一致；Bun lock 与补丁保持不动。
- 两份 README 各 126 行，相对链接、代码块、候选证据文件存在性与无 6DQ 检查通过，`git diff --check` 通过。
- 状态：ready_for_review。待主代理批准后 commit，正常 hooks、重新 pull，确认仅本任务提交后 push main，回读远端 README。

## 正常发布结果

主代理发布 `f6bdd1fe647ac082bd901e2d4f77a7ad579d7ca6`。Frozen install 通过；因 package 没有 prepare，显式运行已安装 Husky 以启用仓库正常 hooks。pre-commit 完成类型、lint、覆盖率测试和 Gitleaks；pre-push 完成 Next.js 构建、单元测试、lint、游戏循环集成测试和 OSV。再次 pull 后仅有 README 提交，push 成功且远端双语字节一致。CI <https://github.com/nocoo/pew-game/actions/runs/34223154090> 成功；没有更改版本、游戏或排行榜数据。
