import { expect, test } from "@playwright/test";
import { parseStatusSnapshot } from "../../src/model/status";

test("retires Snail discovery and monitoring while directing saved project URLs to Zhe", async ({
	request,
}) => {
	for (const [path, target] of [
		["/projects/snail", "/projects/zhe"],
		["/logos/snail", "/brands/snail/v2.0.0/review.html"],
	] as const) {
		const response = await request.get(path, { maxRedirects: 0 });
		expect(response.status()).toBe(301);
		expect(
			new URL(response.headers().location ?? "", response.url()).pathname,
		).toBe(target);
	}
	const catalogue = await (await request.get("/data/projects.json")).json();
	expect(
		catalogue.some((project: { id: string }) => project.id === "snail"),
	).toBe(false);
	expect(
		catalogue.find((project: { id: string }) => project.id === "zhe").website,
	).toBe("https://zhe.to");
	for (const path of ["/sitemap.xml", "/llms.txt"])
		expect(await (await request.get(path)).text()).not.toContain(
			"projects/snail",
		);
	const snapshot = parseStatusSnapshot(
		await (await request.get("/api/status")).json(),
	);
	expect(snapshot.services.some((service) => service.id === "snail")).toBe(
		false,
	);
	expect(
		snapshot.services.find((service) => service.id === "zhe")?.endpoint,
	).toBe("https://zhe.to/api/live");
});
