# Life.ai 主代理 review

2026-09-08：完整 README diff、英文全文、候选资料、数据库路径 / Auth.js 配置、三个初始化入口、年度刷新与 Apple Health 清理范围、测试 runner 已核对。功能、共享数据、空白邮箱名单以及示例参数均符合当前实现。

## 需要补齐的首次安装步骤

当前两份 README 只写“首次安装应确认 better-sqlite3 驱动已可用”，没有检查命令或失败时的入口。旧 README 中移出的 native binding 安装说明是实用开发内容，不能连同维护制度一起丢失。请在开发部分补一条对 `:memory:` 的检查命令，并链接简短的编号开发文档，说明仅在缺少 native binding 时如何针对已锁定的 better-sqlite3 运行安装 / 构建脚本，完成后如何复测。保留全局 ignoreScripts 配置与当前 manifest / lock，不建议删除整个 node_modules 或永久降低安装设置。

root 已在当前 Dashboard、Node 26.7 下执行 `new (require('./node_modules/better-sqlite3'))(':memory:')`，SELECT 1 与 close 成功；这只证明当前工作区的 binding 可用，不能说明每个全新安装都有 native 产物。可将此作为调查证据，不必重复运行完整测试。开发文档和索引、两份 README 补齐后交 root 快速复核，其余文稿和资料没有修改意见。

## 补充复核与批准

2026-09-08：已读两份 README 的新增检查、完整双语 `docs/07-development.md` 及索引差异。对照已锁定 better-sqlite3 13.0.3 的 package、`lib/binding.js` 与 `binding.gyp`，确认预编译模块优先加载、缺失时回退本地 build，无 install 生命周期脚本；文档使用实际的 getPrebuildPath 与 release / force_build 参数。备用构建限定到目标依赖，保留 manifest、锁文件及 ignoreScripts，且明确未在缺少 prebuild 的平台实测。内存诊断已在本机通过，无需为文档重复编译或读取个人数据库。

批准按当前四份文档及候选资料正常提交、再次 pull、push main，并记录 hooks、远端回读和 CI。无需修改版本。
