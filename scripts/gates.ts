import process from "node:process";

const groups: Record<string, string[][]> = {
	static: [
		["bun", "run", "typecheck"],
		["bun", "run", "lint"],
		["bun", "run", "check:isolation"],
	],
	security: [
		["osv-scanner", "scan", "source", "--lockfile", "bun.lock"],
		["gitleaks", "git", ".", "--no-banner", "--redact"],
	],
	commit: [
		["bun", "run", "assets:check-tracked"],
		["bun", "run", "assets:prepare-test"],
		["bun", "run", "typecheck"],
		["bun", "run", "lint"],
		["bun", "run", "test:coverage"],
	],
	push: [
		["bun", "run", "test:http"],
		["bun", "run", "check:security"],
	],
};

const group = process.argv[2] ?? "";
const commands = groups[group];
if (!commands)
	throw new Error("Expected gate: static, security, commit, or push.");

const runSequential = group === "commit";

if (runSequential) {
	for (const cmd of commands) {
		const code = await Bun.spawn(cmd, { stdout: "inherit", stderr: "inherit" })
			.exited;
		if (code !== 0) process.exit(1);
	}
} else {
	const codes = await Promise.all(
		commands.map(
			(cmd) => Bun.spawn(cmd, { stdout: "inherit", stderr: "inherit" }).exited,
		),
	);
	if (codes.some((code) => code !== 0)) process.exit(1);
}
