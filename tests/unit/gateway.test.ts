import { describe, expect, it } from "vitest";
import worker from "../../worker/gateway";

const assets = {
	fetch: async () => new Response("asset", { status: 200 }),
};

describe("the static asset gateway", () => {
	it("redirects www to the apex and keeps path and query", async () => {
		const response = await worker.fetch(
			new Request("https://www.hexly.ai/logos/frogie?q=1"),
			{ ASSETS: assets },
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
			{ ASSETS: assets },
		);
		expect(response.status).toBe(301);
		expect(response.headers.get("Location")).toBe(
			"https://hexly.ai/logos/frogie?q=1",
		);
	});
	it("redirects legacy project paths to canonical URLs", async () => {
		const projects = await worker.fetch(
			new Request("https://hexly.ai/projects"),
			{ ASSETS: assets },
		);
		expect(projects.status).toBe(301);
		expect(projects.headers.get("Location")).toBe("https://hexly.ai/");
		const frogie = await worker.fetch(new Request("https://hexly.ai/frogie"), {
			ASSETS: assets,
		});
		expect(frogie.status).toBe(301);
		expect(frogie.headers.get("Location")).toBe(
			"https://hexly.ai/logos/frogie",
		);
		const www = await worker.fetch(
			new Request("https://www.hexly.ai/frogie?ref=1"),
			{ ASSETS: assets },
		);
		expect(www.headers.get("Location")).toBe(
			"https://hexly.ai/logos/frogie?ref=1",
		);
	});
	it("leaves canonical identity paths unchanged", async () => {
		const response = await worker.fetch(
			new Request("https://hexly.ai/logos/frogie"),
			{ ASSETS: assets },
		);
		expect(response.status).toBe(200);
		expect(await response.text()).toBe("asset");
	});
	it("serves static assets on the canonical host", async () => {
		const response = await worker.fetch(new Request("https://hexly.ai/"), {
			ASSETS: assets,
		});
		expect(response.status).toBe(200);
		expect(await response.text()).toBe("asset");
	});
});
