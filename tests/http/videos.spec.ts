import { createHash } from "node:crypto";
import { expect, test } from "@playwright/test";
import { parseVideoManifest } from "../../packages/video-kit/src/schema";

test("serves the video manifest, independent pages, licensed fonts and hashed downloads", async ({
	request,
}) => {
	const response = await request.get("/videos/manifest.json");
	expect(response.ok()).toBe(true);
	expect(response.headers()["cache-control"]).toContain("must-revalidate");
	const manifest = parseVideoManifest(await response.json());
	for (const template of manifest.templates) {
		const page = await request.get(`/videos/${template.id}`);
		expect(page.ok()).toBe(true);
		expect(await page.text()).toContain(
			`<title>${template.title} — Hexly Video Kit</title>`,
		);
		const poster = await request.get(template.poster.src);
		expect(poster.headers()["content-type"]).toContain("image/webp");
		expect(poster.headers()["cache-control"]).toContain("immutable");
		expect(
			createHash("sha256")
				.update(await poster.body())
				.digest("hex"),
		).toBe(template.poster.sha256);
		for (const asset of [
			template.clip,
			template.deck.pptx,
			template.deck.pdf,
		]) {
			const file = await request.get(asset.src);
			expect(file.ok()).toBe(true);
			const bytes = await file.body();
			expect(bytes.length).toBe(asset.bytes);
			expect(createHash("sha256").update(bytes).digest("hex")).toBe(
				asset.sha256,
			);
			expect(file.headers()["content-type"]).not.toContain("text/html");
		}
	}
	const schema = await request.get("/videos/film-v1.schema.json");
	expect((await schema.json()).properties).toHaveProperty("scenes");
	const font = await request.get(
		`/video-kit/${manifest.kitVersion}/hexly/journey-cjk.woff2`,
	);
	expect(font.headers()["content-type"]).toContain("font/woff2");
	expect((await font.body()).byteLength).toBeGreaterThan(100_000);
});
