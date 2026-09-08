# Shrike 主代理 review

2026-09-08：已核对完整中英文 README、候选资料、package / Cargo / Tauri / Next 配置，以及 rsync 执行、同步互斥、Google Drive 自动发现、目标路径、设置保存与本机 HTTP 处理。

文稿准确区分本地复制与 Drive 上传、原样副本与历史快照；rsync 不使用 --delete，移除列表条目不删除备份。HTTP 两路由都鉴权，POST 等待结果，端口变更需要重启。Next 界面为静态导出，文件功能依赖 Tauri IPC；测试说明正确区分真实临时文件复制、内存 router 和人工桌面检查。MIT 文件存在，不承诺 Release 一定有安装附件。

主代理补上 Next / ESLint 工具需要的 Node.js 开发前提，建议当前兼容的 Node 24+。批准当前两份 README 与资料正常提交、再次 pull、push main，不改版本。

检查时看到 `next-env.d.ts` 的路径从 .next/dev/types 切换到 .next/types，为构建生成变化；此项不属于获批文档变更。发布前仅恢复本轮生成的该差异并确认 staged paths，不提交它。保留实际 hooks / CI 结果及未运行的原生 UI 范围。
