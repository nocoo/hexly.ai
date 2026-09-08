# GeekHub 调查与交付

- 工作区 `/Users/nocoo/workspace/personal/geekhub`；调查前 clean main，重新 `git pull --ff-only` 成功。
- 基线 `ca7042dc77e4c64e317793b97a1c080c6fa8e567`；状态 published。
- CLAUDE.md 只指向 README，按当前源码和 manifest 重写，无版本/配置变更。

## 当前证据

| 结论 | 文件 |
| --- | --- |
| 数据在 Supabase PostgreSQL，登录为 Supabase Google OAuth | `src/lib/supabase-server.ts`、`src/contexts/AuthContext.tsx`、migrations |
| 订阅 / 文章 / 已读 / 收藏 / 稍后阅读实现 | `src/lib/article-repository.ts`、`src/app/api/feeds/`、`src/app/api/articles/` |
| RSS / Atom 解析及 RSSHub URL | `src/lib/rss.ts`、`src/lib/feed-fetcher.ts`、`src/lib/rsshub.ts` |
| 中文摘要和标题/描述/全文翻译 | `src/app/api/ai/{summarize,translate,translate-content}/route.ts`、`src/lib/translation-queue.ts` |
| AI 请求使用浏览器传入 aiSettings | `src/lib/settings.ts`、AI routes；包含 apiKey 的设置存于 localStorage |
| 手动触发抓取，SSE推送日志 | `src/contexts/FeedFetchContext.tsx`、`src/app/api/feeds/[id]/fetch/route.ts`、`src/app/api/logs/stream/route.ts` |
| API 测试会条件跳过数据库场景 | `scripts/run-api-e2e.sh`、`tests/e2e/db-available.ts` |

## 文档修正与范围

- 删除“数据完全本地化”：默认后端是 Supabase，可云托管或自托管。
- 源码检索没有 OPML 导入导出 / 独立后台cron，旧功能文档仍有这些说法；新 README 不将它们写为已有功能。
- 修正 yourusername 克隆 URL。开发说明要求按顺序执行 migrations 全部文件，旧部署文档漏掉 20260113000400_add_feeds_site_url.sql。
- AI 默认关闭，接口参数来自浏览器 aiSettings；`OPENAI_*` 在源码没有读取，新 README明确不能只设置这些环境变量。
- 配置存浏览器不等于多设备同步，未承诺“无厂商锁定”或无外部服务。
- 原 README MIT 链接不存在，package也无许可证声明；新稿说明无许可证文件。
- 保留品牌图。GitHub homepage 与本站均指向 geekhub.vercel.app；访问跳转 /login 后200。
- 不新增没有实现的浏览器测试，也不把 HTTP API 测试称为浏览器层。

## 验证与发布前提

- 双语各101行，相对链接 / 代码块 / 脚本入口核对和 git diff --check通过。
- Node建议24+；实际安装依赖 engines：Next>=20.9、Vitest支持20/22/24+、jsdom要求20.19/22.13/24+、Undici>=20.18.1。
- API脚本会创建固定测试用户并写入/清理数据。默认.env.test为localhost:54321及占位key；只有独立测试Supabase才能配置.env.test.local。
- 如无可达测试DB，现有脚本将数据库用例skip；报告必须保留这个实际范围，不能把绿色hook写作完整数据库测试通过。
- 发布前应确认测试脚本的Supabase目标为隔离环境；不读出或回显service key。未登录线上、未运行真实抓取或AI调用。
- precommit含typecheck/lint/test/gitleaks；prepush含build/coverage/API E2E/OSV。待root批准后正常执行，保留失败证据。

## 发布

待 `geekhub.review.md`；正常commit后再次pull、检查仅本轮提交、push main并回读，资料暂不进本站正式JSON。

## 最终发布结果

root 批准后，已发布 `89c1de129c984bed83d71669f22860cf32f7577d` 到 main。

- 正常 precommit 通过；Vitest 23 文件通过 / 1 文件既有跳过，346 用例通过 / 6 用例跳过（AuthContext 原有 describe.skip，未修改）。
- 首次正常 push 因生产构建缺少 Supabase URL 失败。root 批准按 tracked .env.test 提供隔离占位环境；按 runner 优先级检查 .env.test.local 与进程环境，最终 URL 为 http://127.0.0.1:54321，没有真实 service key。没有读取或注入生产凭据。
- 再次 pull 后，使用 dotenv-cli 包装正常 git push；构建、coverage、API E2E、OSV 通过，未修改脚本或跳过 hook。
- API E2E 实际 5 文件通过 / 5 跳过，21 用例通过 / 46 跳过。Supabase 不可用，数据库相关测试由既有 runner 自行跳过；不能据此声称数据库读写已验证。其余 HTTP / mock API 测试通过，13000 / 14000 由 runner 清理。
- 中英文 README 远端字节匹配，main 同步；[CI](https://github.com/nocoo/geekhub/actions/runs/34226944052) success。
- 日志 `/tmp/readme-refresh-20260908-apps-geekhub-{commit,push,push-retry}.log`。本站正式 JSON 由 root 处理。
