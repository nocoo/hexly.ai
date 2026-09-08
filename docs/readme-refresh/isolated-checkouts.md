# 独立调查副本

原仓库保留已有工作，本轮从 GitHub 最新 `main` 创建独立 clone，并分别执行 `git pull --ff-only`。原始工作区不做 reset、stash、rebase 或 push。

| 项目 | 原 main 提交 | 原状态 | 调查 main 提交 | 独立副本 |
| --- | --- | --- | --- | --- |
| giraffe | `d772268203e31098f7efa40a032afee2efa91916` | 已有未提交 UI / 文档变更 | `d772268203e31098f7efa40a032afee2efa91916` | `/Users/nocoo/workspace/personal/.readme-refresh-20260908/giraffe` |
| frogie | `e965214c3efe99f4c4b459e6716e2014184dc32d` | ahead / behind: 1 / 6 | `79e16babfb6067dcd90ad59b900fa76ad282f35c` | `/Users/nocoo/workspace/personal/.readme-refresh-20260908/frogie` |
| raven | `1a4031947fccb24b17cd1dc508774cc95f29044d` | ahead / behind: 3 / 8 | `a668dbf4fa318429e34686f7bf86731ca1494fd4` | `/Users/nocoo/workspace/personal/.readme-refresh-20260908/raven` |
| bogo | `77e211a294a885fff2830d0aba2e48a10299dff1` | ahead / behind: 4 / 0 | `2e2d986edffd9d320a3e172f37affe5e3406cabe` | `/Users/nocoo/workspace/personal/.readme-refresh-20260908/bogo` |

副本建立后已对照原始 HEAD 和 `git status --porcelain=v1`，确认四个原工作区均未变。发布记录写入各项目调查；结束时再次核对原工作区。
