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
		["bun", "run", "lint:staged"],
		["bun", "run", "test:changed"],
	],
	push: [
		["bun", "run", "test:http"],
		["bun", "run", "check:security"],
	],
};

const group = groups[process.argv[2] ?? ""];
if (!group)
	throw new Error("Expected gate: static, security, commit, or push.");
const codes = await Promise.all(
	group.map(
		(cmd) => Bun.spawn(cmd, { stdout: "inherit", stderr: "inherit" }).exited,
	),
);
if (codes.some((code) => code !== 0)) process.exit(1);
