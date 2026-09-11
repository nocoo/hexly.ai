import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import manifest from "../../package.json";
import { verifyDeployment } from "../../scripts/verify-deployment";
import identity from "../../src/data/site-identity.json";

const origin = new URL("https://deployment.example.test");
const revision = "a".repeat(40);
const retry = { attempts: 3, delayMs: 0 };
const logoPath = identity.logo.original;
const logo = readFileSync(`public${logoPath}`);
const status = {
	mode: "live",
	generatedAt: 1,
	windowStart: 0,
	intervalSeconds: 300,
	retentionDays: 7,
	services: [],
};

function serve(
	override: (path: string) => Response | undefined = () => undefined,
) {
	const requests: string[] = [];
	vi.spyOn(console, "info").mockImplementation(() => {});
	vi.stubGlobal(
		"fetch",
		vi.fn(async (input: URL) => {
			const path = input.pathname;
			requests.push(path);
			const replacement = override(path);
			if (replacement) return replacement;
			if (path === "/api/status") return Response.json(status);
			if (path === "/status")
				return new Response("<title>Service status — hexly.ai</title>");
			if (path === "/api/live")
				return Response.json(
					{
						status: "ok",
						name: manifest.name,
						version: manifest.version,
						revision,
					},
					{ headers: { "cache-control": "no-store" } },
				);
			if (path === "/")
				return new Response(
					'<link href="https://hexly.ai/"><script src="/assets/main.js"></script><link href="/assets/main.css"><div id="root"><h1>Small ideas</h1></div>',
					{ headers: { "content-type": "text/html" } },
				);
			if (path === "/assets/main.js")
				return new Response("export {};", {
					headers: { "content-type": "application/javascript" },
				});
			if (path === "/assets/main.css")
				return new Response(":root { color: black; }", {
					headers: { "content-type": "text/css" },
				});
			if (path === logoPath) return new Response(logo);
			return new Response("Not found", { status: 404 });
		}),
	);
	return requests;
}

afterEach(() => {
	vi.restoreAllMocks();
	vi.unstubAllGlobals();
});

describe("production deployment verification", () => {
	it("rechecks the whole release when CSS is not ready after metadata", async () => {
		let cssRequests = 0;
		const requests = serve((path) => {
			if (path === "/assets/main.css" && cssRequests++ === 0)
				return new Response("<html>Not ready</html>", {
					headers: { "content-type": "text/html" },
				});
		});
		await verifyDeployment(origin, revision, retry);
		for (const path of [
			"/api/live",
			"/api/status",
			"/status",
			"/",
			"/assets/main.css",
			"/assets/main.js",
		])
			expect(requests.filter((request) => request === path)).toHaveLength(2);
		expect(requests).toContain(logoPath);
	});

	it("still rejects persistent HTML fallbacks for compiled CSS", async () => {
		const requests = serve((path) => {
			if (path === "/assets/main.css")
				return new Response("<html>Fallback</html>", {
					headers: { "content-type": "text/html" },
				});
		});
		await expect(
			verifyDeployment(origin, revision, retry),
		).rejects.toMatchObject({
			cause: {
				message: "Invalid production asset: /assets/main.css (text/html)",
			},
		});
		expect(requests.filter((path) => path === "/api/live")).toHaveLength(3);
	});

	it("waits for the requested metadata revision", async () => {
		let metadataRequests = 0;
		serve((path) => {
			if (path === "/api/live" && metadataRequests++ === 0)
				return Response.json({
					status: "ok",
					name: manifest.name,
					version: manifest.version,
					revision: "b".repeat(40),
				});
		});
		await verifyDeployment(origin, revision, retry);
		expect(metadataRequests).toBe(2);
	});

	it("rejects changed logo bytes despite correct metadata and asset types", async () => {
		serve((path) =>
			path === logoPath ? new Response("Incorrect logo") : undefined,
		);
		await expect(
			verifyDeployment(origin, revision, retry),
		).rejects.toMatchObject({
			cause: {
				message: "The production logo does not match the archived original.",
			},
		});
	});

	it("rejects a malformed revision before making network requests", async () => {
		const requests = serve();
		await expect(verifyDeployment(origin, "abc", retry)).rejects.toThrow(
			"full Git revision",
		);
		expect(requests).toEqual([]);
	});
	it("rejects demo data on production and a missing status view", async () => {
		serve((path) =>
			path === "/api/status"
				? Response.json({ ...status, mode: "demo" })
				: undefined,
		);
		await expect(
			verifyDeployment(origin, revision, retry),
		).rejects.toMatchObject({
			cause: { message: "Production must not serve demo status data." },
		});
		serve((path) =>
			path === "/status" ? new Response("<title>Directory</title>") : undefined,
		);
		await expect(
			verifyDeployment(origin, revision, retry),
		).rejects.toMatchObject({
			cause: { message: "The production status page is missing." },
		});
	});
});
