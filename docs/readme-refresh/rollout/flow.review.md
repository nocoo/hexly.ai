# Flow 主代理 review

2026-09-08：已核对完整 README diff、英文全文、候选资料、各包 manifest、实际硬编码 API_BASE、模型 provider、SQLite、配置遮罩、拼音 / 润色 / chat 路由、前端状态和测试配置。浏览器实验定位、模型服务前提、单一选中 profile、润色 Prompt 范围、配置明文存储与 API 无认证、独立 API 托管及当前仅单元测试的说明准确。主代理将安装示例统一为本轮已验证的 `bun install --frozen-lockfile`。双语命令、相对引用和基线证据检查通过。批准修订后的两份文稿与候选资料。

执行正常 hooks，发布前再 pull、确认仅本任务提交、push main，记录远端双语回读与 CI。无需发送真实模型请求。
