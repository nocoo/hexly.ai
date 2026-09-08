export function assertStaticIsolation(config: Record<string, unknown>): void {
	const serialized = JSON.stringify(config);
	const forbidden =
		/"(?:d1_databases|r2_buckets|kv_namespaces|services|durable_objects|remote)"/;
	if (forbidden.test(serialized)) {
		throw new Error(
			"Static-site tests must not bind storage, remote services, or Worker code.",
		);
	}
	if ("main" in config && config.main !== "worker/gateway.ts") {
		throw new Error(
			"Static-site tests must not bind storage, remote services, or Worker code.",
		);
	}
	const environments = config.env as
		| Record<string, Record<string, unknown>>
		| undefined;
	const test = environments?.test;
	if (test?.name !== "hexly-ai-test" || test.workers_dev !== false) {
		throw new Error("The test environment must be isolated as hexly-ai-test.");
	}
	if (!Array.isArray(test.routes) || test.routes.length !== 0) {
		throw new Error("The test environment must not have production routes.");
	}
}
