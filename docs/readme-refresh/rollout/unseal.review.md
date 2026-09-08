# Unseal 主代理复核

2026-09-08，基线 `2f31f698e1de11409d48dcf9e543bbb8c0706a7b`。批准双语 README 与 overview，保持正常 hooks，提交后再次 pull 并 push main；不改版本、不发布 npm。

## 复核依据

- 全文核对双语 README、manifest、完整 CLI / scanner / prompt / sudo / unseal / exec 实现以及真实子进程测试。
- 扫描仅覆盖 /Applications 第一层 .app 条目。xattr 读取失败是 unknown；有隔离属性且 spctl 非零才列为候选；spctl 成功时仍可能保留属性。文稿没有沿用已签名应用不会误报的保证。
- 默认全选、空格切换、Enter 直接确认、选择完成后才检查 sudo、取消或空选退出，与 UI 流程一致。
- 实际修改为递归删除指定 quarantine 属性；README 说明它不修复签名、文件损坏或其他系统策略，也不构成应用可信性判断。
- 子进程封装把通常的执行失败转为退出码，批量操作逐项继续并打印结果；run 最后仍返回 0。文稿正确要求查看每项结果，没有承诺可靠的自动化批处理退出码。
- 发布入口为 Node ESM，Bun 用于开发和打包，测试为 Vitest；npm 链接标注明确。模块和组合流程使用注入 / mock，真实 exec 测试只调用 printf、false 和不存在的程序。

## 验证

主代理检查相对链接、双语命令、基线证据及空白；代理已完成 frozen install、完整 Vitest、Node bundle 的 help / version 与真实终端中的模拟失败场景。验证没有对安装的应用进行扫描或属性修改。提交和推送继续运行现有检查，并补远端 README 回读与 CI 回执。
