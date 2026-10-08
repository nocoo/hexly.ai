import type { ChildProcess } from "node:child_process";
import {
	mkdtempSync,
	realpathSync,
	rmSync,
	symlinkSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
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
	it("escalates cleanup after the group leader exits and rejects permission errors", async () => {
		const child = { pid: 12345, exitCode: 0 } as ChildProcess;
		const missing = Object.assign(new Error("Missing process group"), {
			code: "ESRCH",
		});
		const denied = Object.assign(new Error("Permission denied"), {
			code: "EPERM",
		});
		let killed = false;
		const kill = vi
			.spyOn(process, "kill")
			.mockImplementation((_pid, signal) => {
				if (killed) throw missing;
				if (signal === "SIGKILL") killed = true;
				return true;
			});
		vi.useFakeTimers();
		try {
			const cleanup = stopTestGroup(child);
			await vi.runAllTimersAsync();
			await cleanup;
			expect(kill).toHaveBeenCalledWith(-12345, "SIGTERM");
			expect(kill).toHaveBeenCalledWith(-12345, "SIGKILL");
			kill.mockImplementation(() => {
				throw missing;
			});
			await expect(stopTestGroup(child)).resolves.toBeUndefined();
			kill.mockImplementation(() => {
				throw denied;
			});
			await expect(stopTestGroup(child)).rejects.toBe(denied);
		} finally {
			kill.mockRestore();
			vi.useRealTimers();
		}
	});
});
