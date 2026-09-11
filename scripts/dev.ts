import { startLocalStatus } from "./local-status";

// The Worker needs the catalogue manifest; Vite serves source files with HMR.
const build = Bun.spawn(["bun", "run", "build"], {
	stdout: "inherit",
	stderr: "inherit",
});
if ((await build.exited) !== 0) process.exit(1);
const worker = await startLocalStatus("dev");
const vite = Bun.spawn(["bunx", "vite"], {
	stdout: "inherit",
	stderr: "inherit",
});
const stop = () => {
	worker.kill();
	vite.kill();
};
for (const signal of ["SIGINT", "SIGTERM"] as const) process.on(signal, stop);
const code = await Promise.race([worker.exited, vite.exited]);
stop();
process.exit(code);
