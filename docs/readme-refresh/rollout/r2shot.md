# R2Shot README 调查与交付

## 同步基线

- 仓库：`https://github.com/nocoo/r2shot`。
- 工作区：`/Users/nocoo/workspace/personal/r2shot`。
- 2026-09-08 调查前工作区干净、main 同步；`git pull --ff-only` 返回 Already up to date。
- 调查提交：`7df57635f6efa955cd35ca9ee8de7c438c6450d6`。
- 已阅读 `CLAUDE.md`。按本轮用户要求不改 manifest/package 版本，不执行 release。

## 当前实现证据

| 事实 | 证据 |
| --- | --- |
| 可见区域截图和 Full Page 纵向拼接均已接入弹窗 | `src/popup/Popup.tsx`、`src/background/message-handler.ts`、`src/core/full-page-screenshot.ts` |
| 整页高度默认 5，范围 1–100 个视口；JPEG 质量默认 90，范围 1–100 | `src/core/r2-config.ts`、`src/settings/Settings.tsx` |
| 上传后需要用户点击 Copy URL，不是自动写入剪贴板 | `src/popup/Popup.tsx#handleCopy` |
| R2 使用 S3 SDK，UTC 日期目录 + UUID，对外 URL 自动加 https:// | `src/core/uploader.ts`、`src/core/s3-client.ts` |
| Custom Domain 需填写不带协议的域名 | `src/core/uploader.ts#buildPublicUrl`、`src/settings/Settings.tsx` 的 placeholder |
| 连接检查使用 HeadBucket，不核实公开域名访问 | `src/core/connection.ts` |
| 凭据明文写入 chrome.storage.local | `src/core/storage.ts`、`PRIVACY.md` |
| Manifest V3，activeTab/storage/scripting；React、Tailwind、Vite | `public/manifest.json`、`package.json` |
| dev 是 Vite watch build、使用红色图标 | `package.json#scripts.dev`、`vite.config.ts` |
| test:e2e 是 happy-dom 下的工作流集成，Chrome API 和 S3 均模拟 | `vitest.e2e.config.ts`、`e2e/workflow.test.ts` |

## 旧信息修正与限制

- 补充原 README 缺失的整页截图和高度上限；不把纵向拼接写成任意横纵页面截图。
- 修正原文自动复制的暗示，说明成功后点击 Copy URL。
- 删除固定测试数、覆盖率 badge/门槛、hooks 及商店发布流程；仅保留实际分层测试命令。
- 原文声称界面 i18n 10 语言，但 `Popup.tsx` / `Settings.tsx` 文本为英文；本地化资源用于扩展名称与描述，README 分清两者。
- 原文 Vite 6 / Vitest 3 已过时，当前依赖为 Vite 8 / Vitest 5；README 用不易过时的技术名称。
- Node 22.12+ 建议来自已安装 Vite manifest 的 `engines.node: ^20.19.0 || >=22.12.0`；Bun 用于安装与运行仓库脚本。
- 没有独立产品站点，保留已发布的 Chrome Web Store 入口并置于 English 之前；2026-09-08 GET 返回 200，GitHub homepage 为空。
- 许可证为根 `LICENSE` 中的 MIT，版权 2026 Zheng Li。
- PRIVACY.md 仍有“仅可见区域”及 permissions 缺 scripting 的旧段落，本轮未改该文件，README 按代码描述并记录后续文档债。
- 本站历史 description 也存在“一次完成 / 链接放剪贴板”表述；本候选 goal 采用实际点击复制的说法，不擅自改动历史来源字段。

## 验证与发布

- `bun run test:e2e` 成功：7 项模拟工作流测试。未上传到真实 R2、未使用生产凭据。
- Vite 输出现有 `__dirname` 将在未来原生 config loader 下不兼容的提示；当前测试通过，不属本轮改动。
- 两份 README 各 126 行，相对路径与代码块完整，无 6DQ；`git diff --check` 通过。
- 状态：ready_for_review。主代理批准后再 commit，正常 hooks、重新 pull、push main；不发布扩展 ZIP、不改版本。

## 正常发布结果

主代理发布 `876ee4bfeebd80f4de4a9db6b99827e438cfecf6`。Frozen install 正常设置现有可执行 hooks，pre-commit 的 TypeScript / Biome / 159 测试 / staged Gitleaks 全部通过；pre-push 的生产构建 / 覆盖率测试 / Biome / OSV 全部通过，完整日志未见被末项成功掩盖的前序失败。发布前再次 pull，无远端更新，只有 README 提交。GitHub Contents API 回读两份 README 与批准内容一致。CI：<https://github.com/nocoo/r2shot/actions/runs/34222786038>。未发布新的扩展版本。
