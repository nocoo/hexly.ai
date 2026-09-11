import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { assertLocalIsolation } from "../../scripts/isolation";

const config = () => JSON.parse(readFileSync("wrangler.jsonc", "utf8"));

describe("local test isolation", () => {
	it("allows the reviewed config with isolated local D1 environments", () => {
		expect(() => assertLocalIsolation(config())).not.toThrow();
	});
	it.each([
		"r2_buckets",
		"kv_namespaces",
		"services",
		"durable_objects",
		"remote",
	])("rejects unreviewed %s bindings", (binding) => {
		expect(() => assertLocalIsolation({ ...config(), [binding]: [] })).toThrow(
			"must not bind",
		);
	});
	it("rejects an unreviewed entry point and missing environments", () => {
		expect(() =>
			assertLocalIsolation({ ...config(), main: "worker/other.ts" }),
		).toThrow("reviewed gateway");
		expect(() => assertLocalIsolation({ ...config(), env: undefined })).toThrow(
			"must be isolated",
		);
	});
	it.each([
		{ name: "hexly-ai" },
		{ workers_dev: true },
		{ routes: undefined },
		{ routes: ["hexly.ai"] },
		{ triggers: undefined },
		{ triggers: { crons: ["*/5 * * * *"] } },
		{ vars: undefined },
		{ vars: { STATUS_MODE: "live" } },
		{ d1_databases: undefined },
		{ d1_databases: [] },
		{ d1_databases: [{}] },
		{ d1_databases: [{ binding: "STATUS_DB", database_name: "hexly-status" }] },
		{
			d1_databases: [
				{
					binding: "STATUS_DB",
					database_name: "hexly-status-test",
					database_id: "production-id",
				},
			],
		},
	])("rejects inherited or production test settings: %j", (patch) => {
		const value = config();
		Object.assign(value.env.test, patch);
		expect(() => assertLocalIsolation(value)).toThrow();
	});
});
