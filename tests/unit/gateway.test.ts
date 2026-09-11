import { describe, expect, it } from "vitest";
import worker from "../../worker/gateway";

const assets = {
	fetch: async () => new Response("asset", { status: 200 }),
	connect: () => {
		throw new Error("No network connections in gateway tests");
	},
};
const env: Env = {
	ASSETS: assets,
	STATUS_MODE: "test",
	get STATUS_DB(): D1Database {
		throw new Error("Static routes must not access D1");
	},
};

describe("the static asset gateway", () => {
	it("redirects www to the apex and keeps path and query", async () => {
		const response = await worker.fetch(
			new Request("https://www.hexly.ai/logos/frogie?q=1"),
			env,
		);
		expect(response.status).toBe(301);
		expect(response.headers.get("Location")).toBe(
			"https://hexly.ai/logos/frogie?q=1",
		);
	});
	it("redirects when the Host header is www", async () => {
		const response = await worker.fetch(
			new Request("https://hexly.ai/logos/frogie?q=1", {
				headers: { Host: "www.hexly.ai" },
			}),
			env,
		);
		expect(response.status).toBe(301);
		expect(response.headers.get("Location")).toBe(
			"https://hexly.ai/logos/frogie?q=1",
		);
	});
	it("redirects legacy project paths to canonical URLs", async () => {
		const projects = await worker.fetch(
			new Request("https://hexly.ai/projects"),
			env,
		);
		expect(projects.status).toBe(301);
		expect(projects.headers.get("Location")).toBe("https://hexly.ai/");
		const frogie = await worker.fetch(
			new Request("https://hexly.ai/frogie"),
			env,
		);
		expect(frogie.status).toBe(301);
		expect(frogie.headers.get("Location")).toBe(
			"https://hexly.ai/logos/frogie",
		);
		const www = await worker.fetch(
			new Request("https://www.hexly.ai/frogie?ref=1"),
			env,
		);
		expect(www.headers.get("Location")).toBe(
			"https://hexly.ai/logos/frogie?ref=1",
		);
	});
	it("allows cross-origin reads of share metadata", async () => {
		const pew = await worker.fetch(
			new Request("https://hexly.ai/api/share/pew.json"),
			env,
		);
		expect(pew.status).toBe(200);
		expect(pew.headers.get("Access-Control-Allow-Origin")).toBe("*");
		const missing = await worker.fetch(
			new Request("https://hexly.ai/api/share/not-a-project.json"),
			env,
		);
		expect(missing.status).toBe(404);
		expect(missing.headers.get("Access-Control-Allow-Origin")).toBe("*");
	});
	it("leaves canonical identity paths unchanged", async () => {
		const response = await worker.fetch(
			new Request("https://hexly.ai/logos/frogie"),
			env,
		);
		expect(response.status).toBe(200);
		expect(await response.text()).toBe("asset");
	});
	it("serves static assets on the canonical host", async () => {
		const response = await worker.fetch(new Request("https://hexly.ai/"), env);
		expect(response.status).toBe(200);
		expect(await response.text()).toBe("asset");
	});
});
