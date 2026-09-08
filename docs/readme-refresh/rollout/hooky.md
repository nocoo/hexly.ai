# Hooky 调查与 README 草稿

## 基线

`/Users/nocoo/workspace/personal/hooky`，clean main、无 ahead。调查前 `git pull --ff-only` 成功，基线 `8ebc6aa82c51ad0bed4b6684c1c12d9e7b2a3f5a`。阅读 README、CLAUDE、manifest、package、隐私说明、background / Quick Send / rules / store / page context / webhook / params、选项/弹窗测试、Puppeteer 和打包脚本。

## 核实结果

| 内容 | 当前事实 | 证据 |
| --- | --- | --- |
| Quick Send “automatically fire” | 只在用户点击工具栏图标时匹配规则，不是浏览/导航事件自动发送 | `background.js`、`quicksend.js` |
| Quick Send 配置（旧 CLAUDE） | 当前使用 quickSendRules 列表；first enabled match wins，模板无效或没有匹配时弹窗回退 | `store.js`、`rules.js` |
| 页面变量 | 变量替换只用于参数值；可取 URL/title/selection/description/OG，受 Chrome 脚本注入权限限制 | `pagecontext.js`、`template.js`、`params.js` |
| HTTP 格式 | GET/DELETE 使用 query，其他支持方法发送 JSON 字符串值对象；没有自定义请求头 UI/API | `webhook.js`、`params.js` |
| “无 host permissions”（旧 CLAUDE） | manifest 明确包含 <all_urls>，用于用户指定地址请求；其他权限 activeTab/storage/contextMenus/scripting | `manifest.json` |
| “所有数据不传出”式隐私表述 | 配置保存在 chrome.storage.local；用户触发时，参数中引用的页面信息会发送至配置的 Webhook | `store.js`、`webhook.js`、`PRIVACY.md` 后半段 |
| 测试/覆盖固定数字及 hooks 发布制度 | README 只列单元、DOM、浏览器测试命令和前提，不复制过时数量、阈值或发布治理 | package scripts、tests |
| 版本来源 | 运行/打包版本来自 manifest，和 package.json 开发包版本不同；本轮均不修改 | `scripts/build.sh`、`manifest.json` |

模板支持在页面、选区、链接和图片右键上下文触发，但采集值仍是当前页面，不承诺额外 link/image 变量。规则对 URL/title 支持 contains/equals/startsWith/endsWith/matches，忽略大小写。界面使用原生 JavaScript/HTML/CSS，无 React/Vite UI 构建依赖。basic-ftp 虽在 package 中，不用于浏览器运行能力，未作为产品栈宣传。

## 安装与站点

本站 website 和原 README 都指向真实 Chrome Web Store listing。已 GET 验证 HTTP 200 且 URL 不变；头部保留商店入口，再显示英文链接。也可直接从仓库根目录 load unpacked。Bun 用于开发依赖/scripts；实际 engines 核对后 README 推荐 Node 24，满足 Vitest 5、Puppeteer 25 与 ESLint 10 的交集。ZIP 只包含 manifest、_locales、src，版本来自 manifest，不自动发布商店。

## 验证

- `bun install --frozen-lockfile` 通过，未改锁文件，正常 Husky 安装。
- `bun run test`：277 tests / 14 files 通过。
- `bun run test:e2e`：34 assertions 通过；Puppeteer 使用新浏览器临时 profile 和临时本地 Webhook 服务，覆盖加载、编辑/保存、发送、规则编辑与删除。日志 `/tmp/readme-hooky-e2e.log`。没有访问个人浏览器数据或发送外部 Webhook。
- 两种语言各 13 个本地引用均有效，bash / JSON 示例一致，diff 检查通过。
- 真实 LICENSE 为 MIT；版本不变，未做 Chrome Web Store 发布。

## 下一步

双语 README 与 `hooky.json` ready_for_review；主代理 review 后正常提交，重新 pull，确认只有本任务提交，push main 并回读文件与 CI。

## 发布回执

双语 README 正常提交 `44c66401dfe78fbfc1ebd80d545ce62eff048e35`，推送前再次 pull，只有本任务提交，main 已 push。两份远端 README 字节均与本地一致；工作区干净。CI 首次回读：[{"url": "https://github.com/nocoo/hooky/actions/runs/34225085452", "status": "completed", "conclusion": "success"}]。
