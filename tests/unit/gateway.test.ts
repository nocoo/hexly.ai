import { afterEach, describe, expect, it, vi } from "vitest";
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

afterEach(() => vi.unstubAllGlobals());

describe("single-project API gateway", () => {
	it("caches successful GET bodies for HEAD reuse without forwarding client headers", async () => {
		const stored = new Map<string, Response>();
		const match = vi.fn(async (key: Request) => stored.get(key.url)?.clone());
		const put = vi.fn(async (key: Request, value: Response) => {
			stored.set(key.url, value);
		});
		vi.stubGlobal("caches", { default: { match, put } });
		const fetchAsset = vi.fn(async (_request: Request) =>
			Response.json({ repo: "life.ai" }),
		);
		const live: Env = Object.assign(Object.create(env), {
			STATUS_MODE: "live",
			ASSETS: { ...assets, fetch: fetchAsset },
		});
		const pending: Promise<unknown>[] = [];
		const ctx = {
			waitUntil(p: Promise<unknown>) {
				pending.push(p);
			},
		} as ExecutionContext;
		const response = await worker.fetch(
			new Request("https://hexly.ai/api/projects/NOCOO/LIFE.AI", {
				headers: { Cookie: "ignored=1", "If-None-Match": "unrelated" },
			}),
			live,
			ctx,
		);
		expect(await response.json()).toEqual({ repo: "life.ai" });
		expect(response.headers.get("Cache-Control")).toBe("public, max-age=3600");
		await Promise.all(pending);
		expect(put).toHaveBeenCalledOnce();
		const forwarded = fetchAsset.mock.calls[0]?.[0] as Request | undefined;
		expect(forwarded?.url).toBe(
			"https://hexly.ai/data/project-api/nocoo/life.ai.json",
		);
		expect(forwarded?.headers.get("Cookie")).toBeNull();
		expect(forwarded?.headers.get("If-None-Match")).toBeNull();
		const head = await worker.fetch(
			new Request("https://hexly.ai/api/projects/nocoo/life.ai", {
				method: "HEAD",
			}),
			live,
			ctx,
		);
		expect(await head.text()).toBe("");
		expect(fetchAsset).toHaveBeenCalledOnce();
		const get = await worker.fetch(
			new Request("https://hexly.ai/api/projects/nocoo/life.ai"),
			live,
			ctx,
		);
		expect(await get.json()).toEqual({ repo: "life.ai" });
		await worker.fetch(
			new Request("https://hexly.ai/api/projects/another-owner/life.ai"),
			live,
			ctx,
		);
		await Promise.all(pending);
		expect(fetchAsset).toHaveBeenCalledTimes(2);
		expect([...stored.keys()]).toEqual([
			"https://hexly.ai/api/projects/nocoo/life.ai",
			"https://hexly.ai/api/projects/another-owner/life.ai",
		]);
	});
	it("returns JSON errors for missing assets, SPA fallthrough and unavailable storage", async () => {
		for (const [asset, status] of [
			[new Response("html", { headers: { "Content-Type": "text/html" } }), 404],
			[new Response(null, { status: 404 }), 404],
			[new Response(null, { status: 500 }), 503],
		] as const) {
			const testEnv: Env = Object.assign(Object.create(env), {
				ASSETS: { ...assets, fetch: async () => asset },
			});
			const response = await worker.fetch(
				new Request("https://hexly.ai/api/projects/nocoo/unknown"),
				testEnv,
			);
			expect(response.status).toBe(status);
			expect(response.headers.get("Cache-Control")).toBe("no-store");
			expect(await response.json()).toHaveProperty("error");
		}
		const unavailable: Env = Object.assign(Object.create(env), {
			ASSETS: {
				...assets,
				fetch: async () => {
					throw new Error("offline");
				},
			},
		});
		expect(
			(
				await worker.fetch(
					new Request("https://hexly.ai/api/projects/nocoo/rio"),
					unavailable,
				)
			).status,
		).toBe(503);
	});
});

describe("the static asset gateway", () => {
	it("redirects legacy materials directly to R2 in production while keeping archived HTML/code and page routes", async () => {
		const live = Object.assign(Object.create(env), {
			STATUS_MODE: "live",
		}) as Env;
		for (const host of ["hexly.ai", "www.hexly.ai", "status.hexly.ai"]) {
			for (const path of [
				"/logos/originals/pew.png",
				"/brands/snail/v2.0.0/manifest.json",
				"/textures/frogie/v1.0.0/texture-light.webp",
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
			"/textures/frogie/v1.0.0/review.html",
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
});
