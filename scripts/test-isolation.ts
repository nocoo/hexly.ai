import type { ChildProcess } from "node:child_process";
import { lstatSync, readFileSync, realpathSync } from "node:fs";
import { basename, dirname, join } from "node:path";

export function assertOwnedTest(root: string, parent: string, runId: string) {
	if (
		realpathSync(root) !== root ||
		dirname(root) !== realpathSync(parent) ||
		!basename(root).startsWith("hexly-test-") ||
		!lstatSync(join(root, "owner")).isFile() ||
		readFileSync(join(root, "owner"), "utf8") !== runId
	)
		throw new Error("Test directory ownership does not match.");
}

export function assertMarker(value: unknown, runId: string) {
	if (!Array.isArray(value) || value.length !== 2)
		throw new Error("Missing test database marker.");
	const rows = Object.fromEntries(value.map((row) => [row.key, row.value]));
	if (rows.env !== "test" || rows.run_id !== runId)
		throw new Error("Database does not belong to this test run.");
}

export function assertTestCredentials(environment: NodeJS.ProcessEnv) {
	for (const [key, value] of Object.entries(environment)) {
		if (value && /^(CLOUDFLARE_|CF_|R2_|AWS_)/.test(key))
			throw new Error(`Production-capable environment is forbidden: ${key}`);
	}
}

export async function stopTestGroup(child: ChildProcess) {
	if (!child.pid) return;
	const pid = child.pid;
	const alive = () => {
		try {
			process.kill(-pid, 0);
			return true;
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
			return false;
		}
	};
	for (const [signal, timeout] of [
		["SIGTERM", 1500],
		["SIGKILL", 1500],
	] as const) {
		try {
			process.kill(-pid, signal);
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code !== "ESRCH") throw error;
		}
		const deadline = Date.now() + timeout;
		while (alive() && Date.now() < deadline)
			await new Promise((accept) => setTimeout(accept, 25));
		if (!alive()) return;
	}
	throw new Error("Owned test process group did not exit.");
}
