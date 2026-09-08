# Echo 主代理 review

当前两份 README、文档索引和候选 overview 已批准。已读取关键 IP / Collector / DNS / 测试实现，核对英文对应和全部代码证据路径。

主代理已修复 `.husky/pre-push` 工作区入口并添加 `set -eu`；五项真实检查均保留，构建连接 CI 已有 `test:builder`。shell 语法与临时命令替身的调用顺序、失败传播检查通过。请单独提交必要 hook 修复，正常 commit/push README，并记录各真实检查结果。所有提交仍须正常 hooks、发布前 pull、push main、远端英文回读，无版本变更。

当前 clone 未配置 core.hooksPath；请正常 bun install / prepare 安装 Husky 后提交，不以无 hook 状态发布。

Bogo 和 Frogie 独立副本已准备：`/Users/nocoo/workspace/personal/.readme-refresh-20260908/bogo`（2e2d986edffd9d320a3e172f37affe5e3406cabe），`/Users/nocoo/workspace/personal/.readme-refresh-20260908/frogie`（79e16babfb6067dcd90ad59b900fa76ad282f35c）。请后续调查使用这两个副本，保留原工作区。
