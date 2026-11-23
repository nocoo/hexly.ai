import { expect, test } from "@playwright/test";

test("serves active brand kit manifests and lean WebP/SVG assets with immutable caching", async ({
	request,
}) => {
	const root = "/brands/pi-agent-policy/v1.0.3";
	const manifestResponse = await request.get(`${root}/manifest.json`);
	expect(manifestResponse.status()).toBe(200);
	expect(manifestResponse.headers()["cache-control"]).toContain("immutable");
	const manifest = await manifestResponse.json();
	expect(manifest).toMatchObject({
		project: "pi-agent-policy",
		version: "1.0.3",
		method: "archived-artwork",
	});
	for (const [path, contentType] of [
		[`${root}/wordmark-light.svg`, "image/svg+xml"],
		[`${root}/lockup-light.webp`, "image/webp"],
		[`${root}/mark-512.webp`, "image/webp"],
		[`${root}/texture-light.webp`, "image/webp"],
		[`${root}/texture-dark.webp`, "image/webp"],
	] as const) {
		const asset = await request.get(path);
		expect(asset.status(), path).toBe(200);
		expect(asset.headers()["content-type"], path).toContain(contentType);
		expect(asset.headers()["cache-control"], path).toContain("immutable");
		await asset.dispose();
	}
});
