import { type ChildProcess, spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import {
	mkdtempSync,
	readFileSync,
	realpathSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { assertLocalIsolation } from "./isolation";
import { localAssets } from "./local-assets";
import { seed } from "./local-status";
import {
	assertMarker,
	assertOwnedTest,
	assertTestCredentials,
	stopTestGroup,
} from "./test-isolation";

export async function runTestStatus(profile: "http" | "browser") {
	assertTestCredentials(process.env);
	const source = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));
	assertLocalIsolation(source);
	const checkout = realpathSync(process.cwd());
	const parent = realpathSync(tmpdir());
	const runId = randomUUID();
	const root = mkdtempSync(join(parent, "hexly-test-"));
	const controller = new AbortController();
	const interrupt = () => controller.abort();
	process.once("SIGINT", interrupt);
	process.once("SIGTERM", interrupt);
	const owned = () => assertOwnedTest(root, parent, runId);
	const directory = join(root, "persist");
	const config = join(root, "wrangler.json");
	const env = Object.fromEntries(
		Object.entries(process.env).filter(([key]) =>
			["PATH", "HOME", "TMPDIR", "LANG", "LC_ALL", "SystemRoot"].includes(key),
		),
	);
	Object.assign(env, {
		CI: "true",
		WRANGLER_SEND_METRICS: "false",
		CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: "false",
		XDG_CONFIG_HOME: join(root, "config"),
		CHOKIDAR_USEPOLLING: "1",
		CHOKIDAR_INTERVAL: "1000",
	});
	let child: ChildProcess | undefined;
	let marked = false;
	let failure: unknown;
	const command = async (args: string[], cleanup = false) => {
		owned();
		if (!cleanup) controller.signal.throwIfAborted();
		const worker = spawn(
			"node",
			[
				join(checkout, "node_modules/wrangler/bin/wrangler.js"),
				...args,
				"--config",
				config,
			],
			{
				cwd: root,
				env,
				stdio: ["ignore", "pipe", "inherit"],
				detached: true,
			},
		);
		let output = "";
		worker.stdout?.on("data", (chunk) => {
			output += chunk;
		});
		let timer: ReturnType<typeof setTimeout> | undefined;
		let abort: (() => void) | undefined;
		try {
			await new Promise<void>((accept, reject) => {
				worker.once("error", reject);
				worker.once("exit", (code) =>
					code === 0
						? accept()
						: reject(new Error(`Local command failed (${code}): ${output}`)),
				);
				timer = setTimeout(
					() => reject(new Error("Local command timed out.")),
					60000,
				);
				abort = () => reject(new Error("Test setup interrupted."));
				if (!cleanup)
					controller.signal.addEventListener("abort", abort, { once: true });
			});
			return output;
		} finally {
			clearTimeout(timer);
			if (abort) controller.signal.removeEventListener("abort", abort);
			await stopTestGroup(worker);
		}
	};
	const database = [
		"d1",
		"execute",
		"STATUS_DB",
		"--env",
		"test",
		"--local",
		"--persist-to",
		directory,
		"--json",
	];
	const verifyMarker = async (cleanup = false) => {
		const output = await command(
			[
				...database,
				"--command",
				"SELECT key,value FROM _test_marker ORDER BY key",
			],
			cleanup,
		);
		assertMarker(JSON.parse(output)[0]?.results, runId);
	};
	try {
		writeFileSync(join(root, "owner"), runId, { mode: 0o600, flag: "wx" });
		owned();
		const assets = await localAssets(profile, {
			directory: join(root, "assets"),
			assertOwned: owned,
		});
		const test = source.env.test;
		writeFileSync(
			config,
			JSON.stringify({
				name: "hexly-ai-test",
				main: resolve(checkout, source.main),
				compatibility_date: source.compatibility_date,
				compatibility_flags: source.compatibility_flags,
				assets: { ...source.assets, directory: assets },
				workers_dev: false,
				routes: [],
				triggers: { crons: [] },
				env: {
					test: {
						...test,
						d1_databases: [
							{
								...test.d1_databases[0],
								migrations_dir: join(checkout, "migrations"),
							},
						],
					},
				},
			}),
			{ mode: 0o600, flag: "wx" },
		);
		await command([
			...database,
			"--command",
			`CREATE TABLE _test_marker(key TEXT PRIMARY KEY,value TEXT NOT NULL); INSERT INTO _test_marker VALUES ('env','test'),('run_id','${runId}');`,
		]);
		await verifyMarker();
		marked = true;
		await command([
			"d1",
			"migrations",
			"apply",
			"STATUS_DB",
			"--env",
			"test",
			"--local",
			"--persist-to",
			directory,
		]);
		await verifyMarker();
		await seed("test", directory, async (args) => {
			await verifyMarker();
			await command(args);
		});
		await verifyMarker();
		controller.signal.throwIfAborted();
		child = spawn(
			"node",
			[
				join(checkout, "node_modules/wrangler/bin/wrangler.js"),
				"dev",
				"--config",
				config,
				"--env",
				"test",
				"--local",
				"--ip",
				"127.0.0.1",
				"--port",
				profile === "http" ? "17048" : "27048",
				"--inspector-port",
				profile === "http" ? "18048" : "28048",
				"--persist-to",
				directory,
				"--test-scheduled",
			],
			{ cwd: root, env, stdio: "inherit", detached: true },
		);
		console.info(`Owned ${profile} state: ${root}; run ${runId}`);
		await new Promise<void>((accept, reject) => {
			child?.once("error", reject);
			child?.once("exit", (code) =>
				code === 0
					? accept()
					: reject(new Error(`Local Worker exited: ${code}`)),
			);
			controller.signal.addEventListener("abort", () => accept(), {
				once: true,
			});
		});
	} catch (error) {
		failure = error;
	} finally {
		process.removeListener("SIGINT", interrupt);
		process.removeListener("SIGTERM", interrupt);
		let stopped = true;
		try {
			if (child) await stopTestGroup(child);
		} catch (error) {
			failure ??= error;
			stopped = false;
		}
		if (marked && stopped) {
			try {
				await verifyMarker(true);
				owned();
				if (!failure) rmSync(root, { recursive: true });
			} catch (error) {
				failure ??= error;
			}
		}
		if (failure || !marked || !stopped)
			console.error(`Test state retained for inspection: ${root}`);
	}
	if (failure) throw failure;
}
