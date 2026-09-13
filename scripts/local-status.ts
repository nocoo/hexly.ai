import { mkdir, writeFile } from "node:fs/promises";
import { readProjects } from "../src/data/read-projects";
import { CHECK_INTERVAL, RETENTION, statusTargets } from "../src/model/status";
import { localAssets } from "./local-assets";

const profiles = {
	dev: { env: "dev", port: 37048, inspector: 38048 },
	preview: { env: "dev", port: 37048, inspector: 38048 },
	http: { env: "test", port: 17048, inspector: 18048 },
	browser: { env: "test", port: 27048, inspector: 28048 },
} as const;

type LocalProfile = keyof typeof profiles;
const wrangler = ["node", "node_modules/wrangler/bin/wrangler.js"];

async function execute(args: string[]) {
	const child = Bun.spawn([...wrangler, ...args], {
		stdout: "pipe",
		stderr: "inherit",
		env: { ...process.env, CI: "true", WRANGLER_SEND_METRICS: "false" },
	});
	const output = await new Response(child.stdout).text();
	if ((await child.exited) !== 0) throw new Error(output);
}

async function seed(env: string, directory: string) {
	const lastSlot =
		Math.floor((Date.now() - 10_000) / CHECK_INTERVAL) * CHECK_INTERVAL;
	const quote = (value: string) => `'${value.replaceAll("'", "''")}'`;
	const statements = statusTargets(readProjects()).flatMap((target, index) => {
		// A never-sampled service, a stale service, and gaps are intentional fixtures.
		if (target.id === "pew-game") return [];
		return [
			`WITH RECURSIVE samples(i) AS (
			SELECT 0 UNION ALL SELECT i + 1 FROM samples WHERE i < ${RETENTION / CHECK_INTERVAL - 1}
		), fixture AS (
			SELECT i, CASE
				WHEN ${quote(target.id)} = 'gaga' THEN 'unconfigured'
				WHEN ${quote(target.id)} = 'pika' AND i < 12 THEN 'down'
				WHEN ${quote(target.id)} = 'bogo' AND i < 7 THEN 'degraded'
				WHEN ${index % 4} = 0 AND i BETWEEN ${36 + index * 17} AND ${42 + index * 17} THEN 'down'
				WHEN ${index % 3} = 0 AND i BETWEEN 1400 AND 1420 THEN 'degraded'
				ELSE 'operational' END AS status
			FROM samples
			WHERE NOT (${quote(target.id)} = 'giraffe' AND i < 4)
			AND NOT (${index % 5} = 0 AND i BETWEEN 280 AND 310)
		)
		INSERT INTO checks (project_id, endpoint, slot, checked_at, status, http_status, latency_ms, error_code, version)
		SELECT ${quote(target.id)}, ${quote(target.endpoint)},
			${lastSlot} - i * ${CHECK_INTERVAL}, ${lastSlot} - i * ${CHECK_INTERVAL} + 1000, status,
			CASE status WHEN 'down' THEN 503 WHEN 'unconfigured' THEN 404 ELSE 200 END,
			CASE status WHEN 'degraded' THEN 1600 ELSE ${80 + ((index * 47) % 280)} + (i * 13) % 64 END,
			CASE status WHEN 'down' THEN 'http_error' WHEN 'unconfigured' THEN 'not_found' WHEN 'degraded' THEN 'reported_degraded' ELSE NULL END,
			'demo.1.0' FROM fixture;`,
		];
	});
	const file = `${directory}/status-demo.sql`;
	await writeFile(file, ["DELETE FROM checks;", ...statements].join("\n"));
	await execute([
		"d1",
		"execute",
		"STATUS_DB",
		"--env",
		env,
		"--local",
		"--persist-to",
		directory,
		"--file",
		file,
		"--json",
	]);
}

export async function startLocalStatus(profile: LocalProfile) {
	const { env, port, inspector } = profiles[profile];
	const directory = `.wrangler/${profile}`;
	// Vite serves development pages/material URLs; its Worker only needs the small build and D1.
	const assetsDirectory =
		profile === "dev" ? "dist" : await localAssets(profile);
	await mkdir(directory, { recursive: true });
	await execute([
		"d1",
		"migrations",
		"apply",
		"STATUS_DB",
		"--env",
		env,
		"--local",
		"--persist-to",
		directory,
	]);
	await seed(env, directory);
	console.info(
		`Local SQLite D1 ready (${directory}); seven days of demo data, no live probes.`,
	);
	const child = Bun.spawn(
		[
			...wrangler,
			"dev",
			"--env",
			env,
			"--local",
			"--assets",
			assetsDirectory,
			"--ip",
			"127.0.0.1",
			"--port",
			String(port),
			"--inspector-port",
			String(inspector),
			"--persist-to",
			directory,
			"--test-scheduled",
		],
		{
			stdout: "inherit",
			stderr: "inherit",
			env: { ...process.env, WRANGLER_SEND_METRICS: "false" },
		},
	);
	if (env === "dev") {
		// Keep the local preview useful during long design sessions. Tests remain fixed.
		const timer = setInterval(() => {
			void seed(env, directory).catch(console.error);
		}, CHECK_INTERVAL);
		void child.exited.then(() => clearInterval(timer));
	}
	return child;
}

if (import.meta.main) {
	const profile = process.argv[2] ?? "preview";
	if (!(profile in profiles))
		throw new Error("Expected dev, preview, http, or browser.");
	const child = await startLocalStatus(profile as LocalProfile);
	for (const signal of ["SIGINT", "SIGTERM"] as const)
		process.on(signal, () => child.kill(signal));
	process.exit(await child.exited);
}
