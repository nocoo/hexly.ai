# Hooky 主代理 review

2026-09-08：已核对完整 README diff、英文全文、manifest / package、background / quicksend / rules / contextmenu / pagecontext / params / webhook、Puppeteer 入口和打包脚本。规则只在用户点击工具栏时触发；首条匹配规则的模板无效会打开弹窗。请求仅替换参数值，GET / DELETE 用 query，其他支持方法用 JSON，无自定义头部功能。右键链接 / 图片仍取页面上下文；脚本注入失败回退到标签信息。

中英文功能、权限和本地配置 / 外发数据边界一致；没有把规则描述成自动浏览采集。正常浏览器 E2E 的 34 项断言通过，使用隔离浏览器和临时 loopback 接收端。商店链接有原始来源和回读证据，打包不会提交商店。root 将两份安装示例统一为已验证可用的 frozen install；其余文稿和候选 overview 通过复核。

批准当前双语 README 与资料。正常 hooks、提交，推送前再次 pull，确认只有本任务提交，push main；补齐远端双语文件回读与 CI。版本不变。
