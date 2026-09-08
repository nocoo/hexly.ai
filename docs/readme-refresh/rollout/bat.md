# Bat README 调查与交付

状态：published。基线 `ab6984c18475e4c38723777f09f31e381d3e2f96`，已按主代理书面批准发布 `e47f762f986fa97ba686dc6df8518448b9e72542`。独立副本和原 checkout 均已干净对齐 origin/main，原个人配置保留。

## 独立副本原因

原 `/Users/nocoo/workspace/personal/bat` main 干净，调查前已 pull。安装依赖后发现 API global-setup 无条件覆盖现有 packages/worker/.dev.vars，而且 teardown 在文件原先存在时不会还原或删除。原目录有用户忽略配置，因此改用从 origin 新 clone 的同 SHA 独立副本执行验证和后续提交；原 .dev.vars 未读取值、未移动、未修改。独立副本再 pull、冻结安装并构建，normal prepare 保留。

## 文档与源码

根 / 英文 README、现有 docs 索引、新增 docs/21-development.md。保留 logo，站点位于语言链接之前，八节与示例对应；无固定测试数、门槛或资源占用宣传。

Rust Linux probe → Hono Worker → D1，单 Worker 提供 Vite SPA；生产 BAT_KV 是可选缓存，读取失败 / 缺失回退 D1。普通 Vite 固定代理 bat.hexly.ai 并注入 Access service token，本地并行启动的 37025 Worker 并不接收该代理流量。

基本采集默认 30 秒，扩展采集 30 分钟、深度磁盘周期更长；权限与主机命令决定发现内容。指标、拓扑、软件、端口、Docker / systemd、部分站点配置有实际 collectors。探针还使用硬编码 Echo 公网 IP 服务，失败不阻止本地采集。安装说明采用当前 unit（含 CAP_DAC_READ_SEARCH）；15M 是 unit 限额，不是实测 RSS。工具链跟随当前 stable，删除了不足以代表现状的 Rust1.85 下限。

机器域按 method/path 放行；探针 write key、监控 read key、事件 webhook token、assets 范围 CLI token 分开。私有 CLI workspace 不编造 npm 安装。service loop 重复调用方给定 running/stopped，不探测实际进程；macOS install 写 plist 并打印加载指令，未执行 launchctl，也不是 Linux probe 安装器。

当前 retention_days=1/7/30，默认7，对 raw/hourly/tier2/events 统一清理。没有沿用 constants.ts 中未被 purge 使用的 raw7/hourly90。UTC 每日维护窗口影响状态与监控呈现，不停止采集。Webhook 用于外部事件接收，没有把它写成告警通知投递器。

Release 在 main CI 成功后构建、先迁移 D1、再部署 Worker 并核对版本；probe-release 仅 tag push。只上传二进制及 SHA256，不上传 install.sh；VPS 升级仍手动。对 R2 latest 两架构二进制、checksum、install.sh 的 HEAD 在当前环境均为403，不把旧 README 的404或二进制可下载状态当作已验证事实，文稿给出 Linux 源码编译替代步骤。

## 验证

独立副本冻结安装与 shared/UI build 通过。`bun turbo test:e2e --filter=@bat/worker` 正常 runner 通过（19文件 / 168用例），完整应用本地迁移、合成数据和 SPA 入口；日志 `/tmp/readme-refresh-bat-e2e.log`。无远程 Cloudflare凭据；端口17025预先空闲，测试后创建的.dev.vars已删除。CLI --help 通过，没有真实登录、heartbeat或service install。

四文档链接 / 锚点 / 图片 / 换行 / shell语法 / manifest命令均已静态检查，双语 bash与TOML示例一致、git diff --check通过，所有JSON证据在基线存在。构建有现有大chunk提示，未改构建配置。可选 Rust metadata 预读下载非目标平台依赖时间过长，已停止自有进程，未更改 Cargo.lock；后续正常提交的 Rust coverage 完整通过。

未运行完整Playwright、真实probe/VPS安装、生产KV缓存验证、手动Worker部署或远程迁移。L3脚本有忽略SQL失败与非CI复用服务的行为，文档已说明测试前置边界。生产规则禁止笔记本wrangler deploy，后续只随已授权main push自动CD。

## 发布

主代理批准见 `bat.review.md`。正常 pre-commit 的 TypeScript / Rust coverage、类型、暂存区 secrets 与路由 / 页面检查通过；正常 pre-push 的本地 API E2E、JS / Rust OSV 和 Gitleaks 通过。未绕过 hook，未改版本或实现。

提交 `e47f762f986fa97ba686dc6df8518448b9e72542` 仅包含批准的四份文档。提交后再次 pull，确认只领先这一个文档提交再推送；GitHub contents API 回读中英文 README 与本地逐字节一致。原 checkout 仅 fast-forward 同步，个人 `.dev.vars` 的 inode、大小和修改时间均保持不变，未读取配置值。

日志：`/tmp/readme-refresh-bat-commit.log`、`/tmp/readme-refresh-bat-push.log`。CI [34230125377](https://github.com/nocoo/bat/actions/runs/34230125377) 与自动 Release [34230436071](https://github.com/nocoo/bat/actions/runs/34230436071) 均已 success。
