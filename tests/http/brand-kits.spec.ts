import { createHash } from "node:crypto";
import { expect, test } from "@playwright/test";
import retiredSnail from "../../docs/sources/snail-retired-2026-09-13.json" with {
	type: "json",
};

test("serves every versioned Snail asset with the published checksum and immutable caching", async ({
	request,
}) => {
	const project = retiredSnail;
	if (!project?.brandKit) throw new Error("Missing Snail brand kit");
	for (const [root, version, method] of [
		[project.brandKit.root, "2.0.0", "gpt-image-2"],
		["/brands/snail/v1.0.0", "1.0.0", "original-vector"],
	]) {
		const manifestResponse = await request.get(`${root}/manifest.json`);
		expect(manifestResponse.status()).toBe(200);
		const manifest = await manifestResponse.json();
		expect(manifest).toMatchObject({
			project: "snail",
			version,
			method,
		});
		for (const file of manifest.files) {
			const response = await request.get(file.path);
			expect(response.status(), file.path).toBe(200);
			expect(response.headers()["cache-control"]).toContain("immutable");
			if (file.path.endsWith(".svg"))
				expect(response.headers()["content-type"]).toContain("image/svg+xml");
			const body = await response.body();
			expect(body.byteLength).toBe(file.bytes);
			expect(createHash("sha256").update(body).digest("hex"), file.path).toBe(
				file.sha256,
			);
		}
	}
});

test("keeps Pi's historical SVG textures downloadable after the raster surface release", async ({
	request,
}) => {
	const root = "/brands/pi-agent-policy/v1.0.2";
	const response = await request.get(`${root}/manifest.json`);
	expect(response.status()).toBe(200);
	expect(response.headers()["cache-control"]).toContain("immutable");
	const manifest = await response.json();
	expect(manifest).toMatchObject({
		project: "pi-agent-policy",
		version: "1.0.2",
		method: "archived-artwork",
	});
	for (const theme of ["light", "dark"]) {
		const path = `${root}/texture-${theme}.svg`;
		const file = manifest.files.find(
			(file: { path: string }) => file.path === path,
		);
		if (!file) throw new Error(`Missing historical texture: ${path}`);
		const asset = await request.get(path);
		expect(asset.status(), path).toBe(200);
		expect(asset.headers()["content-type"]).toContain("image/svg+xml");
		expect(asset.headers()["cache-control"]).toContain("immutable");
		const body = await asset.body();
		expect(body.byteLength, path).toBe(file.bytes);
		expect(createHash("sha256").update(body).digest("hex"), path).toBe(
			file.sha256,
		);
		await asset.dispose();
	}
});
