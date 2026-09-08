# Shrike 调查与实施记录

## 基线与范围

- Checkout：`/Users/nocoo/workspace/personal/shrike`；调查前 main 干净，pull 成功。基线 `0fec187fc22742664925897400d0c1a62b2478bb`。
- 仅重写中文根 README 并新增 `docs/README.en.md`；保留头部 `assets/brand/icon-rounded.png`。没有经过核实的站点。
- 主代理 review 后正常提交，push 前再次 pull，补全双语远端回读与 CI。

## 源码证据与旧文档差异

| 结论 | 证据 / 处理 |
| --- | --- |
| Google Drive 是桌面客户端的本地目录 | `types.rs` 自动发现 CloudStorage/GoogleDrive-*；Shrike 不调用 Drive API，不把本地复制完成等同于上传完成。多账号需要核对目录。 |
| 目标按机器区分 | `AppSettings.destination_path()`：gdrive_path / backup_dir_name / machine_name，默认 ShrikeBackup + hostname。 |
| 真正 rsync 参数包含显式递归 | `sync/executor.rs`：`-avrR --files-from <tmp> / <dest>/`。旧文档的 -avR 漏掉 --files-from 场景的 -r；README 不复制错误参数。 |
| 无镜像删除、版本快照、恢复界面或附加加密 | 没有 --delete；移除只改 items。文件原样复制，开发配置可能包含凭据。 |
| 验证不是全面预先拒绝无效条目 | `pre_sync_check` 只有全无有效条目才拒绝；README 不承诺全部预检。 |
| 本机 HTTP 两条路由均 Bearer 鉴权 | `webhook.rs`：127.0.0.1，GET /status、POST /sync；POST 同步返回 200。全局 atomic guard 防止重叠。 |
| 端口需重启生效 | `lib.rs` 启动时读取 settings 启动 listener；update_settings 不重启服务。release 7015 / debug 7023。 |
| Tauri 内嵌静态 Next.js | next.config.mjs output=export，tauri frontendDist=../out；仅开 Next dev 没有 native IPC。 |
| 设置和列表本地保存 | Tauri plugin store shrike_data.json；token 为默认 UUID，需在设置页获取。 |
| 数据量显示不可视为真实统计 | bytes_transferred 恒为 0；README 不宣传字节统计。 |
| 现有发布不包含最新安装包 | GitHub v0.1.3 assets=[]；旧 README 直接建议下载最新 dmg 不可靠。现在提供源码构建、让使用者查看具体 release 附件。 |
| 测试是文件和 handler 集成 | tests 用 tempfile + 真实 rsync，webhook 走 tower::oneshot + mock store，并非 TCP 或完整 Tauri UI。 |

已读 README、CLAUDE、package/Cargo/Next/Tauri 配置、Rust 入口/类型/命令/同步/HTTP 实现、前端 file list / sync hooks / settings、现有架构和同步设计，以及测试入口。旧设计文档有过期版本、测试数量、参数和过强验证表述，仅保留仍有用的架构链接，关键使用事实按代码重写。

## 验证

- Frozen Bun 安装成功。前端 198 tests / 12 files，Rust 单元 117 tests 均通过。
- Rust 集成测试正常入口通过；使用临时目录与内存 router，未打开个人应用、扫描个人配置或写 Google Drive。
- 具体链接与双语代码块检查在提交前完成；完整 hook 检查仍按仓库正常流程执行。
- 不改版本、锁文件、CLAUDE 或业务代码。

补充验证：`bun run build` 成功完成编译、TypeScript 和静态导出；有既有 Node deprecation warning。双语各 8 个引用均有效，所有 bash 代码块一致。等待主代理全文 review。

## 发布回执

README 提交 `847c03e03ba773255a099f79a26de97e490ae58b`，正常 pre-commit / pre-push 全部通过（前端/Rust测试、静态检查、覆盖率、gitleaks、OSV），既有OSV忽略未修改，有unused ignores提示。next-env构建变化已恢复，提交仅双语README。push前再pull，main已发布，双语远端回读一致且工作区干净。CI首次回读：[{"url": "https://github.com/nocoo/shrike/actions/runs/34226029547", "status": "in_progress", "conclusion": null}]。

CI 最终结果：`34226029547` completed / success。
