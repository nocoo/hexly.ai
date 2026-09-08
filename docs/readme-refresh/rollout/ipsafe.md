# IPSafe 调查与 README 草稿

## 基线

`/Users/nocoo/workspace/personal/ipsafe`，clean main、无 ahead。调查前 pull 成功，基线 `d8a28afb9ed85d4f3d1627738415a863f82b3629`。已读原 README、完整 lib/bin/public index、配置、集成文档/脚本、package scripts、Vitest 配置及各测试层。

## 功能与边界

| 旧资料或潜在误读 | 当前实现 | 证据 |
| --- | --- | --- |
| “Network safety”、IP 工具名称 | 默认只检查 Google 2xx；可设置响应内容匹配，没有自动出口 IP/地区/代理策略。只在命令启动前检查一次 | `lib/ipsafe.js`、`bin/ipsafe.js` |
| 配置逐级覆盖 | 按优先级使用首个能读且解析成功的 JSON 文件，仅与内置默认值合并；错误文件警告后尝试下一个 | `loadConfig` |
| 全局路径固定 ~/.config | 非 Windows 尊重 XDG_CONFIG_HOME；Windows 使用 APPDATA/fallback，再查 ~/.ipsafe.json | `getConfigPaths`、`getGlobalConfigPath` |
| 任意 shell 命令字符串 | 自有简易引号解析后直接 child_process.spawn，无 shell；管道/重定向应显式调用 sh 等 shell | `parseCommand`、`executeCommand` |
| HTTP 检查成功包含重定向 | 仅 2xx，无 redirect follow；重试次数是首次请求之外的次数，间隔 1s | `testConnectivity`、`checkNetworkWithRetries` |
| 子命令退出码透传 | CLI 失败统一 process.exit(1)，不保留子命令具体退出码 | `bin/ipsafe.js` |
| executeIfSafe 继承所有执行配置 | 当前 helper 只对网络检查应用配置，未将 commandTimeout 传给 executeCommand；IpSafe.run 会传配置 | `lib/check-safe.js`、`lib/ipsafe.js` |
| integrations/README 的 IPSAFE_CONFIG / IPSAFE_ENABLED | 源码未读取这些环境变量；独立脚本接受 argv config path，不自动注册 Claude hook | `integrations/claude-code.js`、源码全文 |
| 泛称所有交互工具支持完整 TTY | 仅列表内 claude/vim/nano/less/more/top/htop 直接继承 stdio；其他程序输出走 pipe | `executeCommand` |

README 将价值表述为“指定 HTTP 条件通过后执行命令”，保留内容匹配、配置、实时输出与脚本 API；明确真正影响使用的边界。没有复制旧文档对 IP 服务免费配额的承诺或未实现环境变量。集成部分链接当前可执行脚本而非旧配置说明。

## npm 与当前源码

npm 最新发布为 1.0.5，作者/maintainer 是 nocoo；当前 main 的 package.json 仍为 1.0.3。只读取公开 tarball、未执行包脚本，核对 bin/ipsafe.js、index.js、lib/check-safe.js 与当前源码一致；lib/ipsafe.js 的差异为 User-Agent 版本 helper、spawn 引用方式与覆盖/注释，核心网络和执行行为一致。README 可保留标准 npm 安装入口，开发与测试明确针对当前源码。未发布 npm、未改版本。仓库 homepage 和本站 website 均为空，头部只放语言链接。

## 验证结果

- `bun install --frozen-lockfile` 通过，锁文件不变，正常 Husky 安装。
- `bun run test`：89 tests / 3 files 通过。重复模拟命令触发已有 SIGINT/SIGTERM MaxListenersExceededWarning，exit 0；未修改代码或放宽检查。
- 隔离 CLI 验证：临时目录配置 + 127.0.0.1 临时 HTTP 服务。200 + 内容匹配时创建测试标记文件；切换 503 后 CLI 返回 1 且不创建标记，证明没有启动该命令。所有文件和服务在验证后清理，没有更改全局配置。
- 两种语言各 7 个本地引用有效，bash / JSON 示例相同，diff 检查通过。
- LICENSE 为 MIT（2025）；运行时只有 Node.js 内置模块，当前测试栈是 Vitest。未声称终端行为已跨操作系统验证。

## 下一步

`ipsafe.json` 和双语 README ready_for_review。主代理 review 后执行正常 hooks，再 pull、检查 only-task ahead、push main，回读文件与 CI。

## 发布回执

双语 README 正常提交 `8cbac66a06629c2d518fd735224e19fb72effcbe`，推送前再次 pull，只有本任务提交，main 已 push。两份远端 README 字节均与本地一致；工作区干净。CI 首次回读：[{"url": "https://github.com/nocoo/ipsafe/actions/runs/34225086087", "status": "completed", "conclusion": "success"}]。
