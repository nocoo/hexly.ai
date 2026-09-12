import assert from "node:assert";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";
import { describe, expect, it, vi } from "vitest";

const bundle = readFileSync(
	"node_modules/wrangler/wrangler-dist/ProxyWorker.js",
	"utf8",
);
const source = bundle
	.slice(0, bundle.lastIndexOf("\nexport {"))
	.replace('import assert from "node:assert";', "")
	// Node's equivalent of the Workers-only legacy cookie accessor.
	.replace('headers.getAll("Set-Cookie")', "headers.getSetCookie()");

function proxy() {
	const upstream = vi.fn<(url: URL, request: Request) => Promise<Response>>();
	const controller = vi.fn(async () => new Response(null, { status: 204 }));
	const Worker = runInNewContext(`${source}\nProxyWorker;`, {
		assert,
		URL,
		Request,
		Response,
		Headers,
		fetch: upstream,
	}) as new (
		state: object,
		env: object,
	) => {
		proxyData: object;
		fetch(request: Request): Promise<Response>;
	};
	const worker = new Worker(
		{},
		{
			PROXY_CONTROLLER_AUTH_SECRET: "test-controller",
			PROXY_CONTROLLER: { fetch: controller },
		},
	);
	worker.proxyData = {
		userWorkerUrl: { protocol: "http:", hostname: "127.0.0.1", port: "9999" },
	};
	return { worker, upstream, controller };
}

const url = "http://127.0.0.1:27048/assets/example.css";
const disconnected = () => new Error("Network connection lost.");

describe("the installed Wrangler development proxy", () => {
	it.each(["GET", "HEAD"])(
		"recovers one disconnected %s request",
		async (method) => {
			const { worker, upstream } = proxy();
			upstream.mockRejectedValueOnce(disconnected()).mockResolvedValueOnce(
				new Response(method === "GET" ? "body {}" : null, {
					headers: { "Content-Type": "text/css" },
				}),
			);
			const response = await worker.fetch(new Request(url, { method }));
			expect(response.status).toBe(200);
			expect(await response.text()).toBe(method === "GET" ? "body {}" : "");
			expect(upstream).toHaveBeenCalledTimes(2);
		},
	);

	it("returns 502 after the single retry also disconnects", async () => {
		const { worker, upstream } = proxy();
		upstream.mockRejectedValue(disconnected());
		const response = await worker.fetch(new Request(url));
		expect(response.status).toBe(502);
		expect(await response.text()).toContain("Network connection lost.");
		expect(upstream).toHaveBeenCalledTimes(2);
	});

	it.each(["POST", "PUT", "DELETE"])(
		"does not replay %s requests",
		async (method) => {
			const { worker, upstream } = proxy();
			upstream.mockRejectedValue(disconnected());
			expect((await worker.fetch(new Request(url, { method }))).status).toBe(
				502,
			);
			expect(upstream).toHaveBeenCalledTimes(1);
		},
	);

	it("preserves actual HTTP failures without retrying them", async () => {
		const { worker, upstream } = proxy();
		upstream.mockResolvedValue(new Response("unhealthy", { status: 503 }));
		const response = await worker.fetch(new Request(url));
		expect(response.status).toBe(503);
		expect(await response.text()).toBe("unhealthy");
		expect(upstream).toHaveBeenCalledTimes(1);
	});

	it("does not retry unrelated fetch errors", async () => {
		const { worker, upstream } = proxy();
		upstream.mockRejectedValue(new Error("Certificate rejected."));
		expect((await worker.fetch(new Request(url))).status).toBe(502);
		expect(upstream).toHaveBeenCalledTimes(1);
	});

	it.each([
		{ signal: AbortSignal.abort() },
		{ headers: { Upgrade: "websocket" } },
	])("does not retry canceled requests or upgrades: %j", async (init) => {
		const { worker, upstream } = proxy();
		upstream.mockRejectedValue(disconnected());
		expect((await worker.fetch(new Request(url, init))).status).toBe(502);
		expect(upstream).toHaveBeenCalledTimes(1);
	});

	it("keeps response-processing defects fatal", async () => {
		const { worker, upstream, controller } = proxy();
		const response = new Response(null);
		Object.defineProperty(response, "body", {
			get() {
				throw new Error("Response processing failed.");
			},
		});
		upstream.mockResolvedValue(response);
		await expect(worker.fetch(new Request(url))).rejects.toThrow(
			"Response processing failed.",
		);
		expect(upstream).toHaveBeenCalledTimes(1);
		expect(controller).toHaveBeenCalledTimes(1);
	});
});
