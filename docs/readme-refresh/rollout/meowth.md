# Meowth 调查与实施记录

## 基线与范围

- Checkout `/Users/nocoo/workspace/personal/meowth`；调查前再次确认 clean main，`git pull --ff-only` 成功。基线 `803b5b59d3dd0f24a0ffaa5e896c76567a40c1d7`。
- 中文根 README 与 `docs/README.en.md` 一个原子提交，保留 `assets/brand/icon-rounded.png`。版本、维护文档和业务代码不变。
- 先完成源码核对和双语草稿，再请主代理 review；批准后正常提交、再次 pull、push main，远端回读双语与 CI。

## 当前事实与旧文档差异

| 结论 | 证据与处理 |
| --- | --- |
| 调用本机五种 coding CLI | agent.SupportedTypes、ProductionFactory；claude / codex / copilot / hermes / pi，经 PATH 发现，登录与模型服务由对应 CLI 提供。发现可执行文件不等于模型可用。 |
| 真实执行使用 NDJSON | handlers/exec.go + pump；请求上下文控制生命周期，可取消，有 session_started / message / session_ended。不是 SSE，也不是与客户端断开无关的持久任务队列。 |
| Chat 与 HTTP 的参数不同 | models/chat.ts、useChatViewModel；Chat 提供续聊和取消，基础请求有固定超时；cwd / custom_args 等属于 API，不把全部 API 参数宣传为界面选项。 |
| 默认具有本机工具权限 | claude bypassPermissions、codex --yolo / danger-full-access、copilot --allow-all、Hermes auto-approval；此层不提供项目沙箱。token 全权限无 scope。 |
| daemon 数据是本地 SQLite | home/home.go、store/open.go；~/.meowth/meowth.db 保存 token 摘要、会话和事件。CLI 自身的凭据与历史仍依其目录，不能说所有后端数据都在 ~/.meowth。 |
| 服务器 token 摘要与浏览器明文不同 | store/secret.go 是 Argon2id；dashboard lib/localStorage.ts 保存使用中的 bearer。不写成端到端加密或所有地方都不保存明文。 |
| init 只适用于新安装 | initcmd 拒绝非空 home；init 输出一次 root token，serve 默认 127.0.0.1:7040。没有 start 子命令；远程设计文档中的 meowthd start 过时。 |
| 远程模式是明确配置 | remoteaccess 支持 local / tailscale / ssh_tunnel / https_proxy，非 local 要 acknowledged_by；按模式关闭首次 mint，不能只开外部反代仍保留 local。Settings 当前只读。 |
| UI 已是可构建的 Vite + Basalt | apps/dashboard/package.json 与 Vite config；旧 hooks / CI 注释中的 placeholder 是过时注释。构建将静态资源嵌入 Go 二进制。 |
| Node / Go 旧 badges 过时 | Go module 要求 1.26.6，当前 Vite 与 pnpm11 应使用受支持 Node（README 推荐24LTS）。不用旧Go1.26.4 / Node20任意版本承诺。 |
| 无公开站点或 release 附件 | GitHub homepage null；v0.7.0 assets=[]。meowth.dev.hexly.ai 是本机 Caddy 域名，不作网站头部链接。按源码构建。 |
| Windows 仅实验性 | 实际 PowerShell 脚本提供 native build，CI Windows 项仅编译测试；运行与权限语义不等价于 macOS，Linux 未作为支持平台。 |
| 混合许可证须保留 | 根 MIT，daemon/pkg/agent 原文 Modified Apache2.0。删去旧 README 对上游额外条件一概“不适用”的推断，直接指向原文和 UPSTREAM。 |

阅读范围：维护说明、根与工作区 manifest、Go module、daemon 入口 / init / home / server / exec / agent factory、backend 启动参数、token 摘要与浏览器存储、Dashboard 路由 / Chat / Settings、Vite 与嵌入构建脚本、Playwright 项目、L2 与真实后端测试入口、项目概要及相关架构 / 功能文档、上游授权文件。

## 验证计划与当前结果

- Frozen pnpm install 成功，退出码 0；版本更新元数据请求有网络警告，不影响依赖安装。正常 hooksPath 为 `.husky/_`。
- `pnpm daemon:build` 成功：Vite 产物、嵌入复制与 Go 编译全部完成。仅已有 bundle size 提示，无 tracked build diff。
- Go 基础测试全部通过（20 个有测试的包，1 个生成代码包无测试）；真实模型 smoke 保持默认未启用。Dashboard 511 项 / 81 files 与 shared 1 项 / 1 file 全部通过；Node26 有既有 localStorage experimental warnings。
- 不启动已有个人 daemon、不读取或重建个人 token、不改 Caddy。隔离 HTTP / 浏览器测试按实际脚本核对；完整正常 pre-push 保留。

双语各 15 个本地引用均有效，Bash / PowerShell 代码块逐项一致，无 6DQ / 门禁内容。已核对 Vite 与 React plugin 实际 Node engines 为 ^20.19.0 || >=22.12.0，推荐 Node24LTS 适配。完整草稿与候选资料 ready_for_review。

## 发布回执

主代理全文批准后，正常提交 `b4adc3efa89cd44d353d2f0c7628b48873ff3b8b`。正常 pre-commit / pre-push 通过：vet/typecheck、Go与前端覆盖率、默认本地HTTP集成、OSV、gitleaks、govulncheck。govulncheck没有受影响调用路径；提示所依赖模块有4项未调用漏洞，未改依赖或例外。测试的 MEOWTH_TEST_HOME 指向本任务临时目录，完成后清理；未启用真实 CLI smoke，也未接触个人daemon。

push前再次pull并确认只领先此README提交，正常推送main。双语文件GitHub Contents逐字节回读一致，工作区干净并同步。CI [34228091267](https://github.com/nocoo/meowth/actions/runs/34228091267) 最新回读 completed / success。
