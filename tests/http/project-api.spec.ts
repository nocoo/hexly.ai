import { expect, test } from "@playwright/test";
import sharp from "sharp";
import { readProjects } from "../../src/data/read-projects";
import { projectApi, projectApiPath } from "../../src/model/project-api";

test("returns exactly one repository with CORS and one-hour caching", async ({
	request,
}) => {
	for (const p of readProjects()) {
		const response = await request.get(projectApiPath(p));
		expect(response.status(), p.repo).toBe(200);
		expect(response.headers()["content-type"]).toContain("application/json");
		expect(response.headers()["access-control-allow-origin"]).toBe("*");
		expect(response.headers()["cache-control"]).toBe("public, max-age=3600");
		expect(await response.json()).toEqual(projectApi(p));
	}
	const uppercase = await request.get("/api/projects/NOCOO/LIFE.AI");
	const body = await uppercase.json();
	const head = await request.head("/api/projects/nocoo/life.ai");
	const options = await request.fetch("/api/projects/nocoo/life.ai", {
		method: "OPTIONS",
		headers: {
			Origin: "https://consumer.example",
			"Access-Control-Request-Method": "GET",
		},
	});
	const post = await request.post("/api/projects/nocoo/life.ai");
	const getAgain = await request.get("/api/projects/nocoo/life.ai");
	const canonical = await getAgain.json();
	const fields = {
		repo: "life.ai",
		id: "life-ai",
		github: "https://github.com/nocoo/life.ai",
	};
	expect(body).toMatchObject(fields);
	expect(canonical).toMatchObject(fields);
	expect(head.status()).toBe(200);
	expect(await head.body()).toHaveLength(0);
	expect(options.status()).toBe(204);
	expect(options.headers()["access-control-allow-methods"]).toBe(
		"GET, HEAD, OPTIONS",
	);
	expect(post.status()).toBe(405);
});

test("rejects lists, missing owners, queries and unknown names with JSON errors", async ({
	request,
}) => {
	for (const [path, status] of [
		["/api/projects", 400],
		["/api/projects/", 400],
		["/api/projects/nocoo/pew,rio", 400],
		["/api/projects/pew", 400],
		["/api/projects/nocoo", 400],
		["/api/projects/other-owner/pew", 404],
		["/api/projects/nocoo/pew?repo=rio", 400],
		["/api/projects?repos=pew,rio", 400],
		["/api/projects/nocoo/no-such-repository", 404],
		["/api/projects/nocoo/life-ai", 404],
		["/api/projects/nocoo/%ZZ", 400],
		["/api/projects/nocoo/pew%2Frio", 400],
	] as const) {
		const response = await request.get(path);
		expect(response.status(), path).toBe(status);
		expect(response.headers()["cache-control"]).toBe("no-store");
		expect(response.headers()["access-control-allow-origin"]).toBe("*");
		expect(await response.json()).toEqual({ error: expect.any(String) });
	}
	for (const method of ["POST", "PUT", "PATCH", "DELETE"]) {
		const response = await request.fetch("/api/projects/nocoo/rio", { method });
		expect(response.status()).toBe(405);
		expect(response.headers().allow).toBe("GET, HEAD, OPTIONS");
	}
});

test("returned logo URLs resolve to their actual dimensions and alpha behavior", async ({
	request,
}) => {
	for (const id of ["rio", "basalt", "express-spa", "pokepocket"]) {
		const p = readProjects().find((p) => p.id === id);
		if (!p) throw new Error(id);
		for (const logo of projectApi(p).logos) {
			const response = await request.get(new URL(logo.url).pathname);
			expect(response.status(), logo.url).toBe(200);
			const image = sharp(await response.body());
			const metadata = await image.metadata();
			expect([metadata.width, metadata.height], logo.url).toEqual([
				logo.width,
				logo.height,
			]);
			if (logo.background !== "original") {
				expect((await image.stats()).isOpaque, logo.url).toBe(
					logo.background === "opaque",
				);
			}
		}
	}
});
