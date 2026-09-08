# 自动 Release 诊断与交接

2026-09-08，Apps 工作线。最终复核时间：2026-09-08 13:34 UTC。

本组曾失败的三个任务中，**Poké Pocket 已通过同一任务的原样重跑，最终检查与部署均成功**。Dogfight 与 Gaga 仍因生效的 Cloudflare token 被判无效而无法部署；两者的文档都已发布、远端回读一致、CI 成功。没有未结束的本机测试进程或占用端口。

## 任务结果与失败步骤

| 项目 | 文档提交 | CI | 自动 Release 当前结果 | 具体失败步骤 / 结论 |
| --- | --- | --- | --- | --- |
| Dogfight | `20748048b4688ec9618219aec4008aff0f2c895c` | 34230692443 success | [34230741603](https://github.com/nocoo/dogfight/actions/runs/34230741603) failure | Deploy Worker (main) / Deploy Worker：服务 dogfight API 鉴权10000，随后账户 API 报 token 无效9109。 |
| Gaga | `a6a8ddfeafe94d784bea83a8fbd4a674c009d701` | 34230957684 success | [34230984895](https://github.com/nocoo/gaga/actions/runs/34230984895) failure | Deploy Worker (main) / Deploy Worker：服务 gagaya API 鉴权10000，随后账户 API 报 token 无效9109。 |
| Poké Pocket | `8698f1ac309b4f00d1cb5c5770fdfd79d212ff55` | 34230105197 success | [34230523621](https://github.com/nocoo/pokepocket/actions/runs/34230523621) **attempt 2 success** | 首次 required browser 的一个 GBA 存档流程超时，未到部署；原样重跑失败 job 后 browser、汇总及 Deploy Worker 全部 success。不是认证失败。 |
| DreamRO（对照） | `92c77722d86b93926d9f7d9d80eacc297c101c44` | 34229891130 success | [34230653965](https://github.com/nocoo/dreamro/actions/runs/34230653965) success | 完整浏览器与构建通过，部署成功。 |

### Dogfight / Gaga 的实际错误

两份失败日志都先尝试检查 Wrangler，发现不存在后由 wrangler-action 成功安装。最终失败在 Cloudflare API：

- `/accounts/***/workers/services/dogfight` 或 `/accounts/***/workers/services/gagaya`：`Authentication error [code: 10000]`。
- 随后的 `/accounts` 查询：`Invalid access token [code: 9109]`。

因此，不能把安装阶段的 `Script not found "wrangler"` 当成最终失败原因，也没有证据表明需改 npm / Bun 或应用代码。

## Workflow 与 secret 元数据

四个项目的 deployment job 都进入 `production` environment，并向 wrangler-action 传相同的输入名：

```yaml
apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
```

只使用 `gh secret list --json name,updatedAt` 读取下表，未读取或输出 secret 值。时间均为 UTC。

| 项目 | Repository token 更新时间 | production token 更新时间 | 有效 token 来源 |
| --- | --- | --- | --- |
| Dogfight | 2026-09-05T03:03:19Z | 2026-09-05T03:03:20Z | production environment |
| Gaga | 2026-09-05T03:03:25Z | 2026-09-05T03:03:26Z | production environment |
| DreamRO | 2026-09-07T00:21:54Z | 无该 key | repository |
| Poké Pocket | 2026-09-05T05:25:52Z | production 无 secrets | repository |

账号 ID 的元数据：

| 项目 | Repository CLOUDFLARE_ACCOUNT_ID | production CLOUDFLARE_ACCOUNT_ID | 有效来源 |
| --- | --- | --- | --- |
| Dogfight | 2026-09-05T03:03:22Z | 2026-09-05T03:03:23Z | production environment |
| Gaga | 2026-09-05T03:03:28Z | 2026-09-05T03:03:29Z | production environment |
| DreamRO | 2026-09-07T00:19:41Z | 2026-09-07T00:19:11Z | production environment |
| Poké Pocket | 2026-09-05T05:21:21Z | 无 | repository |

GitHub 当前文档明确 environment 同名 secret 优先于 repository。因此 Dogfight / Gaga 的环境级 token 覆盖仓库级 token。DreamRO 没有环境级 token，使用9月7日更新的仓库 token。secret 名称和 environment 名称均映射正确，并非缺少 key。

可确定的是 Cloudflare 拒绝当前生效凭据；**不能仅凭更新时间区分过期、吊销或错误内容，也不能读取 GitHub 元数据来确认 token scope 或两个层级的值是否相同**。日志报告的是 token 无效，不应改写为已经证实的权限范围不足。DreamRO 较新 token 可部署只作为对照，不能推断两个失败项目的 repo token 也有效。

### 交给 root review 的最小处理

1. 在 Cloudflare 侧验证拟用凭据的状态与目标账户 / 所需部署资源权限。
2. 为 Dogfight 和 Gaga 的 **production environment** 配置经验证的 token，以及与之对应的账号 ID。若选择移除环境级重复 token 改用 repo token，须先确认 repo token 有效；只更新 repo token 会继续被现有 environment key 覆盖。
3. 原样重跑已有失败部署 job。无需修改 README、业务代码、workflow、版本或测试规则。

Apps 未修改任何 secret、环境策略或 Cloudflare 资源；配置处理留给 root review。没有对这两个确定的认证失败反复重跑。

## Poké Pocket：已解决的首次 browser 失败

首轮 required Chromium：29 pass / 1 fail。失败点为 `tests/e2e/core-journeys.spec.ts:464` 的暂停按钮 click，整例60000ms超时。按钮已找到且 visible / enabled / stable，不是 selector 缺失。

原 trace 显示约6秒就执行到暂停 click，随后该操作挂起约65.4秒；其余主要操作最多约2.1秒。不是此前步骤累计耗尽预算。点击处理会进入同步 `emulator.pause()` / `core.pauseGame()` 再发起异步存储，该路径可疑，但原 trace 不足以证明底层根因。

按 root 要求处理既有发布路径，执行一次：

```bash
gh run rerun 34230523621 --repo nocoo/pokepocket --failed
```

保持同一 SHA、全部原断言和超时，没有新建 Release / tag / workflow_dispatch，没有代码修改。attempt 2 最终于2026-09-08T13:30:11Z完成，Browser Quality、Aggregate Quality Gates 和 Deploy Worker 均 success；其余已通过的阶段保留原结果。当前不再有发布阻塞，首次瞬时挂起作为历史证据保留，不声称已定位和修复了代码缺陷。

## 证据位置

- `/tmp/readme-refresh-20260908-apps-dogfight-release-failure.log`
- `/tmp/readme-refresh-20260908-apps-gaga-release-failure.log`
- `/tmp/readme-refresh-20260908-apps-pokepocket-release-failure.log`
- `/tmp/readme-refresh-20260908-apps-pokepocket-release-retry.log`
- `/tmp/readme-refresh-20260908-apps-pokepocket-browser-artifacts/`（原 trace、报告与截图，未入项目提交）
- [Poké Pocket 首轮原始 artifact](https://github.com/nocoo/pokepocket/actions/runs/34230523621/artifacts/10057765232)
- 每项目 `.md` / `.json` 已记录完整提交、验证与发布历史。

核实的当前官方来源：

- [GitHub secrets reference source](https://github.com/github/docs/blob/main/content/actions/reference/security/secrets.md)：环境优先级与读取时机，已通过 GitHub API 回读。
- [Cloudflare API token creation source](https://github.com/cloudflare/cloudflare-docs/blob/main/src/content/docs/fundamentals/api/get-started/create-token.mdx)：权限、资源范围、IP / TTL 与 token 状态验证。直接开发者网站请求403，已从官方文档仓库回读当前内容。

Giraffe 为随后完成的最后一项：`deb25d07c634c5122629346ddbc8741fde17e9e9` 的正常本机检查与三文档推送 / 回读全部成功；CI 34232364966 与自动 Release 34232475587 均 success。本组剩余的自动部署失败仅为上文 Dogfight / Gaga 两个有效 token 配置问题。
