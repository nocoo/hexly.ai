import { describe, expect, it } from "vitest";
import { assetUrl } from "../../src/model/assets";
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
	it("redirects legacy materials directly to R2 in production while keeping archived HTML/code and page routes", async () => {
		const live = Object.assign(Object.create(env), {
			STATUS_MODE: "live",
		}) as Env;
		for (const host of ["hexly.ai", "www.hexly.ai", "status.hexly.ai"]) {
			for (const path of [
				"/logos/originals/pew.png",
				"/brands/snail/v2.0.0/manifest.json",
				"/video-kit/1.0.0/hexly/space-grotesk.woff2",
			]) {
				for (const method of ["GET", "HEAD"]) {
					const response = await worker.fetch(
						new Request(`https://${host}${path}?ref=old`, { method }),
						live,
					);
					expect(response.status).toBe(302);
					expect(response.headers.get("Location")).toBe(
						assetUrl(`${path}?ref=old`),
					);
					expect(response.headers.get("Cache-Control")).toBe(
						"public, max-age=300",
					);
				}
			}
		}
		const write = await worker.fetch(
			new Request("https://hexly.ai/brands/snail/v2.0.0/mark-light.png", {
				method: "POST",
			}),
			live,
		);
		expect(write.status).toBe(405);
		for (const path of [
			"/projects/snail",
			"/brands/snail/v2.0.0/review",
			"/brands/snail/v2.0.0/",
			"/brands/snail/v2.0.0/review.html",
			"/logos/family/frogie/batch/review",
			"/brands/snail/v2.0.0/review.js",
			"/brands/snail/v2.0.0/review.css",
		])
			expect(
				(await worker.fetch(new Request(`https://hexly.ai${path}`), live))
					.status,
			).toBe(200);
	});
	it("redirects www to the apex and keeps path and query", async () => {
		const response = await worker.fetch(
			new Request("https://www.hexly.ai/projects/frogie?q=1"),
			env,
		);
		expect(response.status).toBe(301);
		expect(response.headers.get("Location")).toBe(
			"https://hexly.ai/projects/frogie?q=1",
		);
	});
	it("redirects when the Host header is www", async () => {
		const response = await worker.fetch(
			new Request("https://hexly.ai/projects/frogie?q=1", {
				headers: { Host: "www.hexly.ai" },
			}),
			env,
		);
		expect(response.status).toBe(301);
		expect(response.headers.get("Location")).toBe(
			"https://hexly.ai/projects/frogie?q=1",
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
			"https://hexly.ai/projects/frogie",
		);
		const www = await worker.fetch(
			new Request("https://www.hexly.ai/frogie?ref=1"),
			env,
		);
		expect(www.headers.get("Location")).toBe(
			"https://hexly.ai/projects/frogie?ref=1",
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
	it("moves legacy pages and manifests with their query, leaving logo files intact", async () => {
		for (const [before, after] of [
			["/logos/frogie?q=frog&sort=az", "/projects/frogie?q=frog&sort=az#brand"],
			["/videos?project=pew", "/templates?project=pew"],
			["/videos/launch?mode=deck", "/templates/launch?mode=deck"],
			["/videos/manifest.json", "/templates/manifest.json"],
		]) {
			const response = await worker.fetch(
				new Request(`https://hexly.ai${before}`),
				env,
			);
			expect(response.status).toBe(301);
			expect(response.headers.get("Location")).toBe(`https://hexly.ai${after}`);
		}
		for (const path of [
			"/logos",
			"/logos/originals/pew.png",
			"/logos/family/pew/manifest.json",
			"/logos/display/pew-64.webp",
			"/logos/emoji/uptime-kuma-skill.png",
		]) {
			const response = await worker.fetch(
				new Request(`https://hexly.ai${path}`),
				env,
			);
			expect(response.status).toBe(200);
			expect(response.headers.get("Location")).toBeNull();
		}
	});
	it("leaves canonical identity paths unchanged", async () => {
		const response = await worker.fetch(
			new Request("https://hexly.ai/projects/frogie"),
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
