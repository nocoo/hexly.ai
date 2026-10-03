import { spawn } from "node:child_process";
import {
	mkdtempSync,
	readFileSync,
	realpathSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	assertMarker,
	assertOwnedTest,
	assertTestCredentials,
	stopTestGroup,
} from "../../scripts/test-isolation";

describe("owned test state", () => {
	it("rejects foreign markers and incomplete database identity", () => {
		expect(() =>
			assertMarker(
				[
					{ key: "env", value: "test" },
					{ key: "run_id", value: "ours" },
				],
				"ours",
			),
		).not.toThrow();
		for (const value of [
			null,
			[],
			[{ key: "env", value: "test" }],
			[
				{ key: "env", value: "live" },
				{ key: "run_id", value: "ours" },
			],
			[
				{ key: "env", value: "test" },
				{ key: "run_id", value: "theirs" },
			],
		])
			expect(() => assertMarker(value, "ours")).toThrow();
	});
	it("rejects production-capable credentials before allocating test state", () => {
		expect(() => assertTestCredentials({ PATH: "/usr/bin" })).not.toThrow();
		for (const key of [
			"CLOUDFLARE_API_TOKEN",
			"CF_API_KEY",
			"R2_SECRET_ACCESS_KEY",
			"AWS_ACCESS_KEY_ID",
		])
			expect(() => assertTestCredentials({ [key]: "fixture" })).toThrow(
				"forbidden",
			);
	});
	it("refuses foreign owners, linked owner files, and redirected roots", () => {
		const parent = realpathSync(tmpdir());
		const root = mkdtempSync(join(parent, "hexly-test-"));
		const link = `${root}-link`;
		try {
			writeFileSync(join(root, "owner"), "ours");
			expect(() => assertOwnedTest(root, parent, "ours")).not.toThrow();
			expect(() => assertOwnedTest(root, parent, "theirs")).toThrow();
			symlinkSync(root, link);
			expect(() => assertOwnedTest(link, parent, "ours")).toThrow();
			writeFileSync(join(root, "other"), "ours");
			rmSync(join(root, "owner"));
			symlinkSync(join(root, "other"), join(root, "owner"));
			expect(() => assertOwnedTest(root, parent, "ours")).toThrow();
		} finally {
			rmSync(link, { force: true });
			rmSync(root, { recursive: true });
		}
	});
	it("reaps a stubborn descendant after its group leader exits", async () => {
		const root = mkdtempSync(join(realpathSync(tmpdir()), "hexly-test-"));
		const ready = join(root, "ready");
		const descendant = `process.on('SIGTERM',()=>{});require('node:fs').writeFileSync(${JSON.stringify(ready)},String(process.pid));setInterval(()=>{},1000)`;
		const leader = spawn(
			process.execPath,
			[
				"-e",
				`require('node:child_process').spawn(process.execPath,['-e',${JSON.stringify(descendant)}],{stdio:'ignore'}).unref()`,
			],
			{ detached: true, stdio: "ignore" },
		);
		try {
			await new Promise<void>((accept, reject) => {
				leader.once("exit", () => accept());
				leader.once("error", reject);
			});
			let pid = 0;
			const deadline = Date.now() + 3000;
			while (!pid && Date.now() < deadline) {
				try {
					pid = Number(readFileSync(ready, "utf8"));
				} catch {
					await new Promise((accept) => setTimeout(accept, 20));
				}
			}
			expect(pid).toBeGreaterThan(0);
			await stopTestGroup(leader);
			expect(() => process.kill(pid, 0)).toThrow();
		} finally {
			await stopTestGroup(leader);
			rmSync(root, { recursive: true });
		}
	});
});
