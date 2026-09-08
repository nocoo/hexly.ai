# Life.ai 调查与交付

- 工作区 `/Users/nocoo/workspace/personal/life.ai`；调查前 clean main，`git pull --ff-only` 成功。
- 基线 `56df330ee15eada49dd0f926e4e9e73775fdcfea`；状态 published。
- 已读根 CLAUDE.md（指向 README）及 Dashboard AGENTS.md。用户要求英文 README 覆盖旧 README 的“文档统一中文”；不改 nested README 或版本。

## 当前证据

| 结论 | 文件 |
| --- | --- |
| Apple Health XML/ECG/GPX 已有实现，并非空占位 | `scripts/import/applehealth/cli.ts`、`load-xml.ts`、`load-ecg.ts`、`load-routes.ts` |
| footprint 与 Pixiu 已有导入与聚合 | 各自 `scripts/import/*/cli.ts`、`refresh.ts`、`aggregate.ts` |
| 日/月/年页面和API已实现，非前端雏形 | `dashboard/src/views/{day,month,year}/`、`dashboard/src/app/api/` |
| 一组 SQLite 数据供所有获准用户共享，没有用户数据隔离 | `dashboard/src/lib/db.ts`、各 service 查询、`dashboard/src/lib/auth.ts` |
| ALLOWED_EMAILS 为空时允许任何完成Google登录的账号 | `dashboard/src/lib/auth.ts#signIn` |
| 地图默认Carto，Google可选 | `dashboard/src/viewmodels/settings-store.ts`、`components/ui/google-map.tsx` |
| 根脚本需Bun SQLite，Dashboard根据runtime选择bun:sqlite/better-sqlite3 | `scripts/import/*/db.ts`、`dashboard/src/lib/db.ts` |
| 重新导入会清理对应年份 | footprint `load-gpx.ts`、applehealth `load-xml.ts#clearYear`、pixiu导入/刷新路径 |

## 修正与边界

- 原文只有数据梳理/前端雏形，按当前导入器和页面改写；`scripts/README.md` 的 Apple Health 空占位说法已过时，指向较新的 `docs/04-scripts.md`。
- 旧 `bun run db:load` 缺少必需年份参数；新示例显式传入年份与自己的数据路径。
- 初始化器不创建父目录，README 加上 `mkdir -p db` 并初始化三库，使首次页面读取有表结构。
- 不将 repo 默认数据路径写成用户必有的文件；未读取任何个人导出内容或真实数据库。
- 保留 logo；GitHub homepage 为空且本站没有 website，头部仅 English 链接。
- MIT 许可证来自 LICENSE。

## 验证

- Node preflight `bun run check:node` 成功；源码 manifest 要求 Node >=22。
- 静态核对CLI解析、初始化、数据库路径、OAuth callback和测试配置。
- API测试在 dashboard/tests/api 下模拟依赖；浏览器只验证/login，端口27011，测试配置注入占位OAuth配置。
- 未执行真实导入，避免替换用户数据。发布前正常 hooks 会运行既有测试与扫描；不得绕过。

## 发布

root 补充复核批准后，正常提交并发布 `a4febb040f6294b79be0bf4558ddb94596e6d1d6`。四份文档同一提交，无版本变更。

- precommit 与 prepush 的导入脚本 / Dashboard 测试、lint、gitleaks、OSV均通过；没有跳过或弱化检查。日志位于 `/tmp/readme-refresh-20260908-apps-life-ai-{commit,push}.log`。
- 推送前 `git pull --ff-only` 再次成功，origin/main..HEAD仅本次文档提交，`git push origin main`成功。
- 回读远端 main 的 README、英文 README、07开发说明，与本地字节完全相同。
- [CI](https://github.com/nocoo/life.ai/actions/runs/34225726261) 已完成，conclusion=success。未改本站正式项目JSON。

## Review 补充（2026-09-08）

- 已按 root 意见在两份 README 加入 `:memory:` / `SELECT 1` 原生驱动检查，新增双语 `docs/07-development.md`，更新 `00-overview.md` 导航与过时简介。
- 进一步读取当前安装的 `better-sqlite3` package 与 loader：13.0.3 无 `install` 脚本，`gypfile:false`，随包提供 N-API prebuilds；优先读取 `prebuilds/<platform>-<arch>.node`，缺失时才回退本地 build。
- 故障说明保留 `bunfig.toml` 和 manifest/lock，仅在缺少 prebuild 时用临时固定版 node-gyp 构建目标依赖。不能推荐 `npm rebuild`（没有 install 脚本）、删除所有 node_modules、永久开启生命周期脚本或给本项目添加构建依赖。
- root 已验证当前 Node 26.7 工作区的 `:memory:`、`SELECT 1`、close 成功；未重复执行已通过测试，也未执行不需要的编译。备用 node-gyp 命令参数对照实际 `build-release` 与 binding.gyp，尚未在无 prebuild 平台运行。
- 补充后：中英文各 114 行，07 文档 69 行；相对链接、代码块、`git diff --check` 通过。root 已完成补充复核，发布结果见上。
