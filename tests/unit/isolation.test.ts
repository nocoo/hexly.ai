import { describe, expect, it } from "vitest";
import { assertStaticIsolation } from "../../scripts/isolation";

const isolated = {
	env: { test: { name: "hexly-ai-test", routes: [], workers_dev: false } },
};

describe("static test isolation", () => {
	it("allows a static-only project with an explicit test environment", () => {
		expect(() => assertStaticIsolation(isolated)).not.toThrow();
	});
	it.each([
		"d1_databases",
		"r2_buckets",
		"kv_namespaces",
		"services",
		"durable_objects",
		"remote",
	])("rejects %s until isolation is redesigned", (binding) => {
		expect(() => assertStaticIsolation({ ...isolated, [binding]: [] })).toThrow(
			"must not bind",
		);
	});
	it("allows the static asset gateway and rejects other workers", () => {
		expect(() =>
			assertStaticIsolation({ ...isolated, main: "worker/gateway.ts" }),
		).not.toThrow();
		expect(() =>
			assertStaticIsolation({ ...isolated, main: "worker/app.ts" }),
		).toThrow("must not bind");
	});
	it.each([
		{},
		{ env: {} },
		{ env: { test: {} } },
		{ env: { test: { name: "hexly-ai", workers_dev: false } } },
		{ env: { test: { name: "hexly-ai-test", workers_dev: true } } },
	])("rejects a missing or deployable test environment", (config) => {
		expect(() => assertStaticIsolation(config)).toThrow("must be isolated");
	});
	it.each([undefined, ["hexly.ai"]])(
		"rejects inherited production routes",
		(routes) => {
			expect(() =>
				assertStaticIsolation({
					env: { test: { ...isolated.env.test, routes } },
				}),
			).toThrow("production routes");
		},
	);
});
