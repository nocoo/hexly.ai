# Bat 主代理复核

2026-09-08，隔离 checkout 基线 `ab6984c18475e4c38723777f09f31e381d3e2f96`。批准四份文档与 overview；正常 hooks 后再次 pull 并 push main，不改版本。原 checkout 的个人 `.dev.vars` 保留。

## 复核依据

- 全文核对双语 README、开发安装说明与索引，读取 manifest、Vite 代理、入口控制、Setup、Worker 路由和小时任务、KV 读取回退、保留设置 / 清理 SQL、CLI 心跳与 plist 安装、Rust 配置 / 采集主流程、systemd unit 及 Release 配置。
- Rust Linux probe 采集，Hono Worker 提供 API / SPA，D1 持久化，KV 为可选缓存。默认基本采集 30 秒、扩展采集 30 分钟，深度磁盘扫描更久；主机命令与权限影响可发现的内容。没有沿用旧资源占用或固定 Rust 下限承诺。
- Vite `/api` 固定指向生产浏览器域名并注入 Access service token，同时启动的本地 Worker 不会自动成为目标。浏览器、write key、read key、事件 token、assets 范围 CLI token 的用途有区别，机器域名按方法和路径放行。
- CLI 为私有 workspace。心跳循环复用调用方给定状态，macOS 安装只写 plist 并打印加载命令，不执行 launchctl 或安装 Linux probe。
- 实际 retention 为 1 / 7 / 30 天、默认 7 天，对 raw、hourly、tier2、events 统一清理。小时定时任务使用该设置，旧 raw 7 / hourly 90 常量不驱动清理。Webhook 接收事件，不是通用告警投递渠道。
- 当前 systemd unit 包含 `CAP_DAC_READ_SEARCH`，15M 为配置限额而非测量结果。Release 的 main CI 成功路径先迁移再部署；probe 仅由版本 tag 构建，发布二进制与 checksum，没有发布安装脚本。下载可用性未验证，说明提供 Linux 本机编译替代步骤。

## 验证

主代理回读独立副本 API E2E 日志，19 个文件、168 个用例通过，测试显式本地迁移、合成数据与静态资源。静态校验通过，双语 Bash / TOML 和引用对应。

API setup 确实无条件覆盖 `.dev.vars`，且只删除原先不存在的文件；使用独立副本避免改写用户配置。文稿准确说明独立 checkout、端口、远程凭据和 L3 服务复用前提。继续正常 TypeScript / Rust 检查与 hooks，不运行真实 probe / VPS 安装或手动生产部署；发布后补回读和 CI 结果。
