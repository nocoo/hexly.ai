export function assertLocalIsolation(config: Record<string, unknown>): void {
	if (
		/"(?:r2_buckets|kv_namespaces|services|durable_objects|remote)"/.test(
			JSON.stringify(config),
		)
	) {
		throw new Error(
			"Local tests must not bind remote resources or unreviewed storage.",
		);
	}
	if (config.main !== "worker/gateway.ts")
		throw new Error("Only the reviewed gateway may run in local tests.");
	const environments = config.env as
		| Record<string, Record<string, unknown>>
		| undefined;
	for (const name of ["dev", "test"] as const) {
		const env = environments?.[name];
		if (env?.name !== `hexly-ai-${name}` || env.workers_dev !== false) {
			throw new Error(
				`The ${name} environment must be isolated as hexly-ai-${name}.`,
			);
		}
		if (!Array.isArray(env.routes) || env.routes.length !== 0)
			throw new Error("Local environments must not have production routes.");
		const triggers = env.triggers as { crons?: unknown[] } | undefined;
		const vars = env.vars as Record<string, unknown> | undefined;
		if (
			!Array.isArray(triggers?.crons) ||
			triggers.crons.length !== 0 ||
			vars?.STATUS_MODE !== (name === "dev" ? "demo" : "test")
		) {
			throw new Error(
				"Local environments must disable live probing and Cron triggers.",
			);
		}
		const databases = env.d1_databases as Record<string, unknown>[] | undefined;
		if (
			!Array.isArray(databases) ||
			databases.length !== 1 ||
			databases[0]?.binding !== "STATUS_DB" ||
			databases[0].database_name !== `hexly-status-${name}` ||
			databases[0].database_id !==
				`00000000-0000-0000-0000-00000000000${name === "dev" ? 4 : 5}`
		) {
			throw new Error(
				"Local D1 requires a dedicated name and a local-only database ID.",
			);
		}
	}
}
