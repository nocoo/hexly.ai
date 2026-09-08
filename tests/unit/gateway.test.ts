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
	it("serves static assets on the canonical host", async () => {
		const response = await worker.fetch(new Request("https://hexly.ai/"), {
			ASSETS: assets,
		});
		expect(response.status).toBe(200);
		expect(await response.text()).toBe("asset");
	});
});
