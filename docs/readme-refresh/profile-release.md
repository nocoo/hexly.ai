# Profile 排序与本站发布

2026-09-08，用户在 README 全量实施期间追加要求：全部完成后执行本站 `/su-release Y+1`；GitHub `nocoo/nocoo` profile 的入口按本站顺序调整，Games 放第二个项目区域；所有涉及仓库改完 push。

## 依据与范围

- 发布规范：`../workflow/agents/commands/su-release.md`。Y 增加时 Z 归零；优先使用仓库已有 `scripts/release.ts`。本站当前为 0.4.6，目标 0.5.0。
- Profile 维护：`../workflow/agents/skills/zhengli-update-github-readme/SKILL.md`。保留原有分区、项目内容与身份资料，并同步本站记录。
- 排序直接调用本站 `filterProjects` 的 curated 排序，使用 `src/data/project-order.json` 当前快照与稳定目录顺序，不重新采集 stars 或更改本站排序。
- Recent Projects 为第一个项目区，Games 为第二个，其后仍为 CLI Tools、Skills & MCP Servers、Legacy Projects。各区内匹配项目按本站相对顺序排列。
- hexly.ai 自身已从本站目录排除，Profile 仍保留此入口并放在 Recent Projects 开头。其他文案、链接、个人介绍、博客和既有重复入口原样保留。

## Profile 基线

原 checkout main 干净，包含一个已有本地提交 `880737d35ff74923cc0c96873fccf9e09ea5e569`，只增加 clip、Fundly、Meowth 三个入口；它们已经进入本站，现有 `docs/sources/nocoo-readme-2026-09-07-additions.json` 也引用该 SHA。此次用户要求与本站同步并全部 push，因此这三项既有目录补充属于本次发布范围，不重写该提交或丢失其来源。

调查前 `git pull --ff-only` 成功，无新增远端差异。主代理以本地 README 为基线，只移动整条项目行和两个分区；校验前后行多重集合相等、入口集合与内容不变。Games 顺序为 Gaga、Poké Pocket、Dogfight、Pew Game、DreamRO，与本站 Games 筛选的相对顺序一致。

## 完成步骤

1. 完成 Profile 排序 diff 复核，正常提交，再次 pull 后 push main；保存新 profile 快照、精确 SHA 与校验结果。
2. 等待 47 个后续项目全部通过 root review、发布并回读，完成 49 个有效 overview 的本站集成。
3. 运行素材 / profiles 生成与检查，完整核验本站双语内容、badges、移动布局和归档页面兼容性，正常提交全部本站改动。
4. 再次 pull 后执行 `bun run release -- minor`；确认 exact commit 的 CI / Deploy、`/api/live`、全部公开项目页面、tag 和 GitHub Release。
5. 发布成功后持续跟踪检查，在发布后五分钟复查 CI 状态。记录具体提交、版本与验证结果，不以本地构建或 push 成功代替上线验收。

## Profile 发布结果

排序提交 `7a6b6e35d589e326e71912a68dfb2240eaaf2738`（`docs: align profile project order with hexly.ai`）已通过正常提交与推送，包含先前明确记录的三项本地补充。提交后再次 `git pull --ff-only` 成功，再 push main。

主代理核对远端 main 与本地 HEAD 相同，工作区干净；通过 GitHub Contents API 按精确 SHA 回读 README，字节与已复核本地文件一致，SHA-256 为 `25d630914840211048818351f43c348891870a7bcf6459a43fdcb5e6076e4ca0`。新[公开快照](../sources/nocoo-readme-2026-09-08-order.md)与[排序 / 校验记录](../sources/nocoo-readme-2026-09-08-order.json)保留此次结果。

当前状态：Profile 已发布并回读；49 个非归档仓库的双语 README 与本站资料已完成，本站进入 0.5.0 发布验收，详见 [发版记录](release-0.5.0.md)。
