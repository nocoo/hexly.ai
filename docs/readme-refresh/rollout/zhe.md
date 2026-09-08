# Zhe 调查与交付

- 工作区 `/Users/nocoo/workspace/personal/zhe`；调查前 clean main，`git pull --ff-only` 成功。
- 基线 `967f6e738440ab0739697659c242652408d7155c`；状态 published。
- 已读 CLAUDE.md。遵循用户要求不改版本、不开 release、不介绍质量制度；保留品牌图。

## 当前证据

| 结论 | 文件 |
| --- | --- |
| 应用已覆盖链接、想法、待办，而非单一 URL shortener | `components/sidebar-parts/nav-config.ts`、`actions/ideas.ts`、`actions/todos.ts` |
| Markdown 想法有 API 与 CLI，不是待实现设计 | `app/api/v1/ideas/`、`cli/src/commands/idea/`、`cli/src/index.ts` |
| 全局搜索覆盖链接、想法、待办 | `components/search-command-dialog.tsx` |
| AI 链接文件夹 / 标签建议为可选功能 | `app/api/ai/suggest-link-org/route.ts`、`lib/ai/create-model.ts`、建议确认组件 |
| D1 runtime 仅用 Worker 代理，不再有 REST fallback | `lib/db/d1-client.ts#getProxyCredentials` |
| KV 未命中走源站 lookup；Worker cron 同时清理与补偿 KV | `worker/src/index.ts`、`worker/src/redirect.ts` |
| 登录名单为空时任意完成 Google 登录的账号都可进入 | `lib/auth-allowlist.ts` |
| CLI API URL 写死 zhe.to，非可配通用自部署客户端 | `cli/src/api/client.ts#API_BASE` |
| 业务查询绑定用户 | `lib/db/scoped/`、`lib/auth-context.ts` |
| 本地测试栈包含真实本地 D1/KV、文件系统 R2 | `scripts/test-stack.ts`、`scripts/local-r2-server.ts`、`worker/wrangler.local.toml` |

## 文档漂移与修正

- 旧 README 的 Next.js / TypeScript badges 与当前 manifest 不符；删除易漂移版本 badges、固定测试数与性能断言。
- 旧 README 和 CLAUDE 部分段落仍写无 KV cron；当前 Worker scheduled 同时调用 cleanup 与 sync-kv，新 README 按实现写。
- `.env.example` 与 `docs/02-getting-started.md` 仍说必须远端 D1_TEST、R2_TEST、KV_TEST；当前 L2/L3 无须远端资源，新 README 明确本地测试条件。
- `.env.example` 对 D1 Proxy 的优先级说明已过时。当前运行必须提供 D1_PROXY_URL / D1_PROXY_SECRET，仅有账号/D1 REST 凭据不足以运行。
- `docs/18-cli-design.md` 开头仍写尚未实现；代码已实现链接、目录、标签与想法命令。主要使用入口指向 CLI README 与 --help。
- 默认应用数据库初始化存在历史迁移缺口：0014 / 0016 会 drop 手工添加而新库不存在的列，`analytics.source` 由 test-stack fixup 补齐。README 提醒新部署核对 schema，不把测试 bootstrap 冒充生产安装器；未改 schema/migrations。
- 没有根目录 LICENSE；仅 CLI 包元数据声明 MIT，未对根应用推断许可证。

## 验证与限制

- GitHub homepage=https://zhe.to，HTTPS HEAD 返回200。没有登录真实用户或修改线上数据。
- 中英文各124行，功能、示例、测试层与前置条件一致；相对链接、代码块与 `git diff --check` 通过。
- 本地 L2 使用17006、L3使用27006；两组共享8788 Worker与18788 R2 shim以及.test-storage，必须分别运行。
- 根、worker、cli分别有lockfile和包。安装示例逐个冻结安装；Wrangler需在PATH（test-stack用spawn直接查找wrangler）。
- 正常 precommit：unit coverage、integration、typecheck、lint-staged、gitleaks；prepush：API E2E、OSV。待批准后执行，不跳过、不改断言。
- 仅校验现有脚本与源码，没有提前重复完整重型测试。

## 发布

root批准并补充浏览器AUTH_SECRET前提、CLI Node运行时后，正常提交并发布 `ec4287860e953c489784f0939ea602740f910e15`。

- precommit各stage通过；prepush本地API端到端26文件/205用例通过，OSV无问题。确认8788/18788空闲后运行，结束已由runner清理。
- 推送前再次pull成功，待推送仅当前文档提交。正常push main成功，无版本更改。
- 远端README与英文README字节匹配。英文raw URL曾TLS EOF，改为GitHub contents API回读成功。
- [CI](https://github.com/nocoo/zhe/actions/runs/34225860218) 已 success。没有额外运行浏览器、CLI或Worker独立测试，不扩大已执行范围。
- 日志 `/tmp/readme-refresh-20260908-apps-zhe-{commit,push}.log`；本站正式JSON仍由root处理。
