# 主代理复核台账

本表记录主代理对完整 README 改写、英文对应、源码依据及站点候选字段的人工复核。发布结果以各项目调查和候选 JSON 为准；本站仅纳入已发布项目。

| 项目 | Review | 关键核对 / 修订 | 发布 |
| --- | --- | --- | --- |
| Echo | 已批准 | IP 查询 key 回退、Collector token / TTL、Go UDP / A 边界、包目录命令、双语示例；修复 pre-push 的工作区入口并 fail-fast | 代理执行正常 hooks、pull、push 中 |

## 必要执行修复

### Echo 推送 hook

原 `.husky/pre-push` 在根目录串联 `build / test / lint / test:e2e`，而迁移后的根脚本只提供 lint。此 `&&` 组合后仍有独立 OSV 命令，前项失败也可能被最后一次扫描成功覆盖。

主代理将构建检查连接到现有 `packages/ip-service` 的 `test:builder`（与 CI 相同的 Vercel Lambda 构建验证），单元和 HTTP 测试连接到该包的现有脚本；保留根 lint 与 OSV，并添加 `set -eu`。不修改断言、覆盖率门槛、依赖或版本。

已执行 shell 语法检查，以及临时命令替身检查：正常路径按顺序运行全部五项；单元测试返回 23 时立即以 23 结束，不继续 lint / HTTP / OSV。这项检查只验证 shell 路由与失败传播，不能替代正常提交和推送时运行真实检查。
