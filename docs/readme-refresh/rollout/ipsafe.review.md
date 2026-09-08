# IPSafe 主代理 review

2026-09-08：已核对完整 README diff、英文全文、package / public exports、完整 CLI 与 lib/ipsafe.js、check-safe helper、独立集成脚本和候选 overview。已确认只接受 2xx、不跟随重定向，内容匹配忽略大小写，配置只合并首个有效文件和默认值，命令直接 spawn；shell 管道示例显式调用 sh。CLI 失败统一返回 1，executeIfSafe 不传 commandTimeout，文档均已如实说明。

root 将候选目标中可能暗示“可配置允许状态码”的措辞改成“指定 URL 返回成功响应”，两份安装示例统一为已验证可用的 frozen install。npm 已发布包与 main 存在版本差异，代理核对过公开包的实际入口和核心行为；本轮仅更新仓库文档，不执行 npm 发布。单元测试与独立临时 HTTP / 命令阻止验证通过；未宣称已跨平台验证全部终端行为。

批准当前双语 README 与资料。正常 hooks、提交，推送前再次 pull，确认只有本任务提交，push main；补齐远端双语文件回读与 CI。版本不变。
