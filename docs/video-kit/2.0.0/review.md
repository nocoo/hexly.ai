# Video Kit 2.0.0 · 本地设计检查

检查日期：2026-09-12。检查人：Codex。当前改动仅在本地，未提交、push 或上线；网站版本仍为 v0.6.0。没有重新编码任何视频。这里记录实际看过的画面与本地导出证明，不代表用户已批准设计。

## 组件与主题

| 组成 | 当前设计 | 区分方式 |
| --- | --- | --- |
| 封面 | Signal / Frame / Index / Horizon / Stack | 居中焦点 / 产品窗口与标题带 / 大页码 / 纸色地平线 / 叠纸标题卡 |
| 正文 | Launch / Essential / Showcase / Columns / Bento | 左文右图 / 极简居中 / 大幅产品画面 / 观点与说明两栏 / 有主次的模块 |
| 片尾 | Signature / Line / Frame / Split / Colophon | 居中签名 / 红线与左下落款 / 项目纸卡 / 两片纸色 / 大字标与刊记 |

保留 Launch、Essential；另外三种正文是新实现。每个组件均有 light/dark 两个主题，封面 × 正文 × 片尾 × 主题可组成 250 种基础组合。项目资料来自同一个目录适配器，单页也可通过 `scene.template` 独立选择正文版式。

### 封面

![五种封面，左浅右深](openings.webp)

### 正文

![五种正文，左浅右深](templates.webp)

### 片尾

![五种片尾，左浅右深](endings.webp)

## 设计检查记录

- 对照实际站点的纸色、墨色、陶土强调色、Space Grotesk、Geist Mono、中文字体、圆角和细边线。所有主题使用同一家族 token；官方 mark 路径与 wordmark 比例没有重绘。字体与许可字节仍通过来源哈希检查，见 [CREDITS](../../../packages/video-kit/CREDITS.md)。
- 四周标识和边线使用 32 px 边距，正文横向 80 px，避免用内容安全区挤压角落装饰。浅深主题共用同一布局，项目原图保持原比例。
- Frame 封面采用大幅产品窗口和底部标题带；Showcase 把主区域交给产品；Columns 与 Bento 分别用两栏和模块表达不同信息密度。
- Line、Frame、Split 的片尾分别使用左下落款、纸卡内左右呼应和分区构图。Signature、Colophon 通过字标尺度与边缘刊记区分。
- 实际长文案检查发现过章节说明和部分封面裁剪，现由 `FitText` 等待真实字体后测量并缩放完整文字组。验证了中英文 500 字说明、长项目名以及横竖屏；没有以省略号或隐藏溢出的方式丢弃内容。
- 桌面导航压缩为 Index / Logos / Status / Video；中文为项目 / 标志 / 状态 / 视频。右侧跨站链接恢复为 Play / Journal / Résumé / Portfolio。移动端保留两字主导航文本，跨站链接支持横向滚动，组件选择器压紧排列，画面顺序可横向滚动。

站点画面：[桌面组件库](site-desktop.webp) · [320 px 中文预览](mobile-zh.webp)。

### 字标下伸部修正

根据 `hexly.ai` 的 `y` 下沿被截断的反馈，复查确认是共享 reveal 的 `overflow: hidden` 把字形裁到了单行行框内。Space Grotesk 的下伸部超出了这个行框；原来的 DOM 矩形越界检查无法发现这种丢失。

现改为水平裁剪、上下各放宽 25% 的遮罩。字体、字号、字距、基线位置与官方 mark 几何保持原样。新增像素回归比较完整展开的字标与放开遮罩后的字标，取景保留行框下方的空间：五种片尾和独立 Logo reveal，在浅深主题、桌面/手机及 Video/Deck 中共 24 组比较一致，包含竖屏字标。站点页眉、画布角落和独立 Vite 页眉也已复核。

下面左侧是原始裁剪，右侧是修复后的实际浏览器画面。组件图、动画定位帧与七页 PPTX/PDF 样张均已更新；旧样张保留在原 `.video-work/*-v2-final/` 目录，没有重新生成视频。

![字标修复前后，y 的下伸部完整保留](wordmark.webp)

## 动画检查

官方 mark 先独立居中，1.25 秒后移动并展开 wordmark，2.5 秒后显示项目文字。Line 的边线在签名落到左下方之后才开始绘制，避免在运动中穿过字标。下图来自浏览器实时画布的五次定位截图，未生成视频文件。

![Line：0.50、1.27、1.77、2.60、3.33 秒](motion.webp)

可在 `/videos/launch?project=bogo&ending=line&part=outro` 关闭减弱动画后，定位整条时间线的第 855、878、893、918、940 帧复核。Deck 与 reduced-motion 始终显示落稳后的布局。

## 实际 PPTX/PDF 导出

```sh
bun run video:render -- --project hexly-ai --template showcase \
  --theme dark --opening stack --ending split \
  --screenshot docs/screenshots/directory-light.png \
  --mode deck --scale 1 --out /tmp/hexly-deck-review
```

本次实际产物保留在 `.video-work/deck-proof-v2-wordmark/showcase/`：

- [deck.pptx](../../../.video-work/deck-proof-v2-wordmark/showcase/deck.pptx)：7 页，7 份可编辑的原生演讲者备注，备注含来源仓库。
- [deck.pdf](../../../.video-work/deck-proof-v2-wordmark/showcase/deck.pdf)：7 页。
- 7 张 1920×1080 PNG，及包含输入哈希、组件选择和文件哈希的 `render.json`。没有 MP4。

页面采用图像，备注可编辑；页面里的文字和图形不是独立的 PowerPoint 对象。上面的本地产物被 Git 忽略，复现时必须选新的输出目录。

![七页实际导出](deck.webp)

## 验证

| 检查 | 结果 |
| --- | --- |
| 冻结依赖安装 | 通过；没有新增依赖，锁文件未改变 |
| Biome / 根与 kit typecheck | 通过 |
| 根网站 / 独立 kit build | 通过 |
| 独立 Vite 预览 | 7440 实际启动；五个示例、主题、组件选择与 Deck 切换可用 |
| 单测 | 171 项；包括所有项目适配、250 种组合、严格 schema、官方品牌与运动顺序 |
| 本地 Workers HTTP | 69 项通过 |
| 浏览器 | 原有非视频 188 项通过；视频 14 项在桌面/手机通过，含主题、组合、下载配置、分类保留、长文案、无障碍与 24 组字形像素比较 |
| 静态视觉检查 | 30 张不同的组件/主题画面，无文字越界、无视频请求；三张 contact sheet 已检查 |
| 输出边界 | `video:check` 通过；根导出脚本拒绝写入网站 `public/` |

浏览器全量首轮有两项新增用例把章节说明误当成项目简介，修正测试期望后重跑整个视频集，10 项全部通过。排版实现未因该测试期望改变。Vite 构建有既存的未来 native 配置加载提示，独立 kit 单包有体积提示；构建均成功。

复核命令：

```sh
bun run lint
bun run typecheck
bun run test:coverage
bun run build
bun run video:build
bun run video:check
bun run check:isolation
bun x playwright test --config playwright.http.config.ts
bun x playwright test
bun run video:review -- --out /tmp/hexly-component-review
```

机器可读的产物与检查摘要：[verification.json](verification.json)。完整临时画面留在 `.video-work/`，本目录只保存小型参考图；两者都不进入部署产物。

## 与已发布版本的边界

旧 Studio、Editorial、Pulse 实现及当前预览的 MP4、海报、幻灯片下载、生成脚本和媒体缓存规则已移除。历史版本由 Git tag `v0.6.0` 保存。字体内容未变，静态品牌资产仍使用独立的 1.0.0 URL。

Hermes-on-Herdr 继续消费已固定的 `e1b220a7643e8275134b0bff0a11d703c047abbe`。本轮没有修改其独立制作目录，也没有把专属脚本、配音或成片纳入 Hexly。当前 v2 没有新的 published SHA。
