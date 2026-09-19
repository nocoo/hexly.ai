<p align="center"><img src="https://h.no.mt/shared/site/v1.0.0/hexly-ai-c69b5e7a341e.png" width="128" alt="hexly.ai logo" /></p>
<h1 align="center">hexly.ai</h1>
<p align="center">个人项目导航与视觉档案：浏览项目、收藏原标、查看色板与演示模板。</p>
<p align="center"><a href="https://hexly.ai">站点</a> · <a href="docs/README.en.md">English</a></p>

![项目导航站预览](https://h.no.mt/archives/sources/v1.0.0/35084de2cf9bff5ad2ebcdac662fef7bfdac088a48fbdc7aaa358753a0607d8c.png)

## 这是什么

hexly.ai 是个人项目导航站，也是项目视觉身份的档案库。从 [GitHub profile](https://github.com/nocoo) 整理项目名称、描述与 Emoji，保存实际 Logo、色板和来源证据，为工具、游戏与实验提供统一入口。

有独立图像的项目保留原始形状、颜色与字节，其余沿用已有 Emoji 并标明来源。品牌包提供明暗 Hero、手机构图、底纹、字标、图标、favicon 和可校验下载；本站宣发色系不替代各产品主题。Snail 已退出目录，收藏功能并入 [Zhe](https://hexly.ai/projects/zhe)，[历史品牌档案](https://hexly.ai/brands/snail/v2.0.0/review.html) 继续保留。

图像、字体和成片由 R2 经 `https://h.no.mt` 提供；Git 与站点 Worker 保存代码、元数据、许可和校验记录。

## 功能

- **独立底纹** — 在用项目按真实身份区分栖息地植物和工具工作材质，提供浅深完整图、轻量卡片图、原始 Prompt 和可核验的生成记录。新底纹通过 `brandTexture` 独立版本包维护，原始 Logo、品牌包和产品色板不变。归档项目仅做基础支持，保留已完成内容，默认不参加后续批量整理或素材创作。[设计与 R2 维护](docs/27-project-textures.md)。
- **项目** — `/` 按分类浏览、搜索中英文名称与描述；`/projects/<id>` 顶部集中选择项目、分类和搜索，下方依次展示项目介绍、可选成片/截图、技术概览与品牌档案。Hooky/R2Shot 提供官方 Chrome 商店安装入口。视频点击封面才加载；截图保持完整比例，点开高清 Lightbox，以底部缩略图或方向键切换、Esc 关闭。没有媒体时自然接到项目内容。[截图与 R2 维护方式](.agents/skills/hexly-r2-media/references/project-screenshots.md)。
- **模板** — 在 `/templates` 选择目录项目，自由组合 5 个封面、Launch / Essential / Showcase / Columns / Bento 五种正文、5 个片尾；各有官网明暗主题，支持 Video/Deck 双预览、截图和配置下载、离线 MP4/PPTX/PDF 导出。[5 个标准片尾](https://hexly.ai/templates#outros)可跨项目直接拼接使用，无需重新生成，提供原始 MP4、HTML 渲染的 4K 静帧和一键 Agent 交接说明。
- **Agent 使用** — 每个正式页面提供可复制的使用说明、纯 Markdown 与 HTML 发现链接；项目档案的原始 Prompt / 设计说明可直接复制。[维护约定](docs/25-agent-guides.md)。
- **服务状态** — 在 [status.hexly.ai](https://status.hexly.ai) 查看活跃网站的 `/api/live`，每 5 分钟检查一次，保留最近 7 天记录，支持小时历史、响应时间和异常筛选。
- **Logo 图鉴** — `/logos` 是项目下的图片墙，点击进入项目详情的 `#brand`。保留新旧对照、图标/透明/白底视图、实际尺寸、场景、色板、生成提示词和原始文件下载。
- **真实色板** — 展示项目的前景色、背景色与点缀色，点击复制颜色值。
- **原标备份** — 下载保留原始字节的图像，追溯来源路径、提交版本与 SHA-256。
- **中英文与明暗主题** — 首次访问跟随系统偏好，之后记住手动选择。
- **可分享的状态** — 搜索、分类、排序、视频筛选、项目与章节保存在 URL 中，支持刷新与浏览器返回；`#` 平滑滚动遵循减少动态效果偏好。

没有监测样本的时段显示为未知，不补造历史记录。

## 使用

直接访问 **[hexly.ai](https://hexly.ai)**，无需安装或登录。按分类浏览或搜索项目，进入详情查看介绍、媒体和品牌；在 `/logos` 对照图标与色板，在 `/templates` 组合演示模板，在 [状态页](https://status.hexly.ai) 查看网站可用性。

## 开发

需要 Bun 1.4.0 与 Node.js 24 以上；CI 使用 Node.js 26.7.0。

```sh
git clone https://github.com/nocoo/hexly.ai.git
cd hexly.ai
bun install --frozen-lockfile
bun run dev
```

```sh
bun run typecheck
bun run lint
bun run build
```

Vite 位于 `127.0.0.1:7048`，本地 Worker 位于 37048；Caddy 地址是 https://index.dev.hexly.ai。日常开发直接读取 CDN，不必下载历史图库。品牌修改、完整集成/浏览器测试或离线预览前运行 `bun run assets:hydrate`，按哈希恢复缺失素材，不覆盖已有改动。

本地 `/status` 使用真实 Worker API 和 SQLite，自动填充明确标注的模拟数据，不探测生产站点。项目源数据位于 `src/data/projects/`，浏览器加载的 `/data/projects.json` 由构建生成。`src/model/` 管纯逻辑，`worker/` 管路由、状态 API 与定时检查，`packages/video-kit/` 管共享模板与渲染。

Video Kit 使用真实 Logo、字体和主题，支持独立组合封面、正文、片尾；离线 PPTX/PDF 保留渲染图像，PPTX 附可编辑演讲者备注，视频导出需要 Chromium 与 FFmpeg。详细命令见 [Video Kit](packages/video-kit/README.md)。目录与 GitHub profile 同步、资源上传和发布见 [维护流程](docs/29-project-maintenance.md)。

## 测试

```sh
bun run assets:hydrate
bun run test:coverage
bun run test:http
bunx playwright install chromium
bun run test:browser
bun run video:check
```

Vitest 检查模型与逻辑；HTTP 测试启动本地 Worker，Playwright 覆盖桌面/移动端、语言、主题和画廊。安装完整 Chromium；素材恢复为完整测试提供本地资源。HTTP / 浏览器分别使用 17048 / 27048 和独立状态目录，无需生产凭据或真实站点探测。`video:check` 检查模板 manifest、素材哈希与体积。

## 技术栈

| 技术 | 用途 |
| --- | --- |
| [React](https://react.dev/) · [TypeScript](https://www.typescriptlang.org/) | 界面与类型约束 |
| [Vite](https://vite.dev/) · [Bun](https://bun.sh/) | 开发、构建与脚本 |
| [Cloudflare Workers](https://developers.cloudflare.com/workers/static-assets/) | 静态资源托管与自定义域名 |
| [Cloudflare R2](https://developers.cloudflare.com/r2/) | 图像、字体、品牌包与成片的 CDN 存储 |
| [Cloudflare D1](https://developers.cloudflare.com/d1/) · [Cron Triggers](https://developers.cloudflare.com/workers/configuration/cron-triggers/) | 状态记录、每 5 分钟探测和 7 天自动清理 |
| [Sharp](https://sharp.pixelplumbing.com/) | 图像尺寸转换与原图校验 |
| [Vitest](https://vitest.dev/) · [Playwright](https://playwright.dev/) | 单元、HTTP 与浏览器测试 |
| [Biome](https://biomejs.dev/) · [OSV](https://google.github.io/osv-scanner/) · [Gitleaks](https://github.com/gitleaks/gitleaks) | 格式、静态分析和安全检查 |

## 文档

- [文档索引](docs/README.md)
- [整体设计与架构](docs/01-overview.md)
- [身份与内容规则](docs/02-identity-rules.md)
- [测试说明](docs/03-quality.md)
- [本地开发](docs/04-development.md)
- [版本与发布](docs/05-release.md)
- [服务状态](docs/11-status-monitoring.md)
- [Video Kit API 与导出](packages/video-kit/README.md)
- [项目媒体](docs/17-project-media.md)
- [品牌档案与作用域](docs/19-family-brand-archives.md)
- [R2 存储与维护](docs/21-asset-storage.md)
- [历史与素材恢复](docs/23-git-history-recovery.md)
- [标准片尾](docs/24-standard-outro-examples.md)
- [Agent 使用说明](docs/25-agent-guides.md)
- [项目底纹](docs/27-project-textures.md)
- [维护流程](docs/29-project-maintenance.md)
- [项目档案与色板](docs/profiles/README.md)
- [来源快照](docs/sources/README.md)
- [更新记录](CHANGELOG.md)

## 许可证

[MIT](LICENSE) © 2026 Zheng Li
