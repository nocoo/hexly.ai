# Poké Pocket 主代理复核

2026-09-08，基线 `461f4c3bb65480c43bdb5a8c27a054eba8da39ad`。批准双语 README、文档索引与 overview；保留版本，正常 hooks 后再次 pull 并 push main。

## 复核依据

- 全文核对中英文 README 与索引，读取 manifest、完整 Worker、Vite 配置、设置与默认键位、存档事务、本地卡带发现、模拟器主要流程、安装脚本及第三方声明。
- 支持范围为 GB / GBC / GBA 宝可梦目录，mGBA 在浏览器运行。当前滤镜为 crisp / lcd；键位、Gamepad、快进、截图和存档功能有实际入口。文稿没有把其他主机、联机或完整通关写成已验证能力。
- ROM 以 SHA-256 区分，IndexedDB 保存卡带和进度，localStorage 保存偏好；导入电池存档在同一事务中清除自动 slot 0，三个手动 slot 保留。源代码与测试程序的生成文件分开，Git 和分发资源检查禁止 ROM / save 路径。
- 开发插件只扫描私有目录第一层，通过文件头识别、拒绝目录和文件符号链接；生产 / preview 不启用。Worker 仅公开 `/api/live`，其他内容要求 Access，issuer 和团队校验固定为 nocoo。不能只改环境变量完成迁移，也不能将本地存档表述为整个产品无需网络。
- 原创代码 MIT 与 mGBA MPL / 游戏素材的许可边界保持一致。root 仅将安装说明润色为“准备模拟器文件与运行依赖许可证”：mGBA 许可证已经在仓库，脚本复制的是模拟器文件与其他运行依赖许可证。
- 单元、两类 HTTP、必需 / 可选浏览器命令均存在。完整 runner 在本机选择 Google Chrome，在 CI 使用 Playwright Chromium；必需流程使用原创测试程序与临时令牌，可选流程依赖本机卡带。没有宣称真实 SSO 或商业游戏验证通过。

## 验证

主代理静态校验通过：本地引用、代码块、双语示例、源码证据及文档范围正确。正常 pre-commit / pre-push 继续执行静态、覆盖率、HTTP 与安全检查，发布后补充精确 SHA、远端文稿回读和 CI 回执。Poké Pocket 的 HTTP 端口 17048 与本站相同；本站完整验证等其发布检查结束再运行。
