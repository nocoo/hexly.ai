# clip 调查与实施记录

## 基线与范围

- Checkout `/Users/nocoo/workspace/personal/clip`；调查前 clean main，pull 成功。基线 `071d10dd71f913814a47a68047265883642c851c`。
- 保留 root logo.png，只改中文 README 和新增 docs/README.en.md。private CLI 包按源码安装，不假定 npm 包。
- 主代理 review 后正常提交，push 前再次 pull，补全双语远端回读与 CI。

## 源码核对

| 事实 | 证据 / 旧文档差异 |
| --- | --- |
| clip.yaml 生成可编辑 CLI | validator + generator + templates；不是 OpenAPI 导入工具。每个 endpoint 独立文件。重新生成直接 writeFile 覆盖同名文件。 |
| 三种鉴权 | schema/validator.ts 与 commands/auth.ts 的 header、browser-login、cf-access；旧 schema 设计文档只列 header。 |
| 凭据是明文权限隔离 | auth/storage.ts 使用 CLIP_HOME 或 ~/.clip、dir700/file600；不承诺加密。show 遮罩，真实 key 建议交互输入。 |
| browser-login 依赖配套服务端 | @nocoo/base-cli；默认 /api/auth/cli，回调 tokenParam 默认 api_key。生成 CLI 内置 login，clip auth login 需要 cwd 的 clip.yaml。 |
| API 基本 JSON 行为 | templates 用 fetch，response.json，query/body 标量 flags，Number 与 true 字符串转换；数组、非 JSON 响应需要手改，不把 schema 可接受字段等同于完整 runtime 支持。 |
| 安装会产生全局链接 | install.ts 生成、bun install、bun link；验证只在临时 BUN_INSTALL，不改个人 bin。 |
| 产品 test 命令请求 live API | command/test.ts 会配置 CLIP_TEST_BASE_URL 和 CLIP_TEST_API_KEY，生成测试可能 CRUD；README 明确使用独立测试服务。cf-access 生成测试被跳过。 |
| 仓库实际测试只有 unit + process/HTTP E2E | test:integration 仍是 echo 占位；README 不把占位脚本列为真实层，也不列不存在的浏览器 UI 测试。 |
| 示例可落地 | packages/example-api/clip.yaml，默认 localhost3456 + X-API-Key test-api-key；内存 Todo fixture。 |
| 无已证实站点 | GitHub homepage null，hexly 原记录 null；Astro site=clip.dev 不能单独证明部署与归属。 |

已读取 CLAUDE、README、工作区 manifests、CLI 入口/生成/鉴权/测试/安装、实际模板和 validator、凭据存储、fixture API/示例、仓库 E2E 隔离 helper 与安装测试、旧 schema/codegen 设计文档。旧设计文档仍留作背景，README 指向当前 schema 源码和有效示例。

## 验证

- Frozen Bun install 成功，正常 hooksPath=scripts/hooks。
- `bun run test:unit`：13 files /217 tests，覆盖率正常通过。
- `bun run test:e2e`：16 tests 通过，真实生成 CLI、HTTP、回调、隔离安装。临时 CLIP_HOME/BUN_INSTALL，不用个人凭据或生产 API。
- 双语文稿和使用示例待主代理完整复核，随后执行正常 hooks；不改版本、依赖、CLAUDE 或业务行为。

补充验证：双语各 8 个引用均有效，全部 bash 示例一致。clip.dev GET 有 HTTP200 响应（大页传输20s超时），已下载内容标题为日本公司的「CLIP Inc. — IPに、第二の成長曲線を。」且无 nocoo 链接，确认不作为项目站点。Astro 当前 engines >=22.12.0，文稿推荐 Node24。

补充验证：Astro 文档站 build 完成，5 条静态路由全部生成。

## 发布回执

主代理全文 review 后，正常提交 `1c7e3e5c4ade8d65ec1850c9eeb2f57f2a083417`；仅包含两份 README。pre-commit 的 lint、typecheck、217 项覆盖率测试，以及 pre-push 的 16 项隔离 E2E、gitleaks、OSV 均通过。push 前再次 pull，确认只领先本次 README 提交，再推送 main。

两份 README 均通过 GitHub Contents API 与本地逐字节比对，工作区干净并与 origin/main 同步。CI [34226167974](https://github.com/nocoo/clip/actions/runs/34226167974) completed / success。
