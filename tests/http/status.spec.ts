import { expect, test } from "@playwright/test";
import { readProjects } from "../../src/data/read-projects";
import { parseStatusSnapshot, statusTargets } from "../../src/model/status";

test("reads the actual local SQLite D1 through the status API", async ({
	request,
}) => {
	const response = await request.get("/api/status");
	expect(response.status()).toBe(200);
	expect(response.headers()["content-type"]).toContain("application/json");
	expect(response.headers()["cache-control"]).toBe("no-store");
	const snapshot = parseStatusSnapshot(await response.json());
	expect(snapshot.mode).toBe("demo");
	expect(
		snapshot.services.map(({ id, endpoint }) => ({ id, endpoint })),
	).toEqual(statusTargets(readProjects()));
	expect(
		snapshot.services.find((service) => service.id === "pew-game")?.latest,
	).toBeNull();
	expect(
		snapshot.services.find((service) => service.id === "pika")?.latest?.status,
	).toBe("down");
	expect(
		snapshot.services.reduce(
			(sum, service) =>
				sum + service.history.reduce((total, hour) => total + hour.total, 0),
			0,
		),
	).toBeGreaterThan(50_000);
	const head = await request.head("/api/status");
	expect(head.status()).toBe(200);
	expect(await head.body()).toHaveLength(0);
	const write = await request.post("/api/status", { data: {} });
	expect(write.status()).toBe(405);
	expect(write.headers().allow).toBe("GET, HEAD");
});

test("serves both status entry points and keeps family logo assets on the status domain", async ({
	request,
}) => {
	for (const [path, headers] of [
		["/status", {}],
		["/", { Host: "status.hexly.ai" }],
	] as const) {
		const response = await request.get(path, { headers, maxRedirects: 0 });
		expect(response.status()).toBe(200);
		expect(await response.text()).toContain(
			"<title>Service status — hexly.ai</title>",
		);
	}
	const project = readProjects().find((project) => project.id === "pika");
	const logo = await request.get(`${project?.family?.root}/icon-160.webp`, {
		headers: { Host: "status.hexly.ai" },
		maxRedirects: 0,
	});
	expect(logo.status()).toBe(200);
	expect(logo.headers()["content-type"]).toContain("image/webp");
	const gallery = await request.get("/logos/pika", {
		headers: { Host: "status.hexly.ai" },
		maxRedirects: 0,
	});
	expect(gallery.status()).toBe(302);
	expect(gallery.headers().location).toBe("https://hexly.ai/logos/pika");
});
