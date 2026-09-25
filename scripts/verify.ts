import process from "node:process";

const started = performance.now();
let active: ReturnType<typeof Bun.spawn> | undefined;

function stop(code: number) {
	if (active) process.kill(-active.pid, "SIGTERM");
	process.exit(code);
}

process.on("SIGINT", () => stop(130));
process.on("SIGTERM", () => stop(143));
const deadline = setTimeout(() => {
	console.error("Verification exceeded the 600-second budget.");
	stop(124);
}, 600_000);

const commands = [
	["bun", "run", "assets:check-tracked"],
	["bun", "run", "assets:prepare-test"],
	["bun", "scripts/verify-assets.ts"],
	["bun", "run", "video:check"],
	["bun", "run", "typecheck"],
	["bun", "run", "lint"],
	["bun", "run", "check:isolation"],
	["bun", "run", "check:security"],
	["bun", "run", "test:coverage"],
	["bun", "run", "build"],
	["bun", "run", "deploy:check"],
	[
		"node",
		"node_modules/@playwright/test/cli.js",
		"test",
		"--config",
		"playwright.http.config.ts",
	],
	["node", "node_modules/@playwright/test/cli.js", "test"],
];

for (const command of commands) {
	const stage = performance.now();
	console.info(`Verification: ${command.join(" ")}`);
	active = Bun.spawn(command, {
		stdout: "inherit",
		stderr: "inherit",
		detached: true,
		env: { ...process.env, VIPS_CONCURRENCY: "1", VITEST_MAX_WORKERS: "2" },
	});
	const code = await active.exited;
	active = undefined;
	console.info(
		`Stage completed in ${((performance.now() - stage) / 1000).toFixed(1)}s.`,
	);
	if (code !== 0) process.exit(code);
}
clearTimeout(deadline);
console.info(
	`Complete verification passed in ${((performance.now() - started) / 1000).toFixed(1)}s (budget: 600s).`,
);
