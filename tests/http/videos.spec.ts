import { expect, test } from "@playwright/test";
import { brandAssetVersion } from "../../packages/video-kit/src/brand";
import { parseVideoManifest } from "../../packages/video-kit/src/schema";

test("serves the client-only composition manifest, five pages, v2 schema and licensed fonts", async ({
	request,
}) => {
	const response = await request.get("/templates/manifest.json");
	expect(response.ok()).toBe(true);
	expect(response.headers()["cache-control"]).toContain("must-revalidate");
	const manifest = parseVideoManifest(await response.json());
	expect(manifest.preview).toBe("client");
	expect(manifest.openings).toHaveLength(5);
	expect(manifest.endings).toHaveLength(5);
	expect(JSON.stringify(manifest)).not.toMatch(/\.(mp4|pptx|pdf|webp)/);
	for (const template of manifest.templates) {
		const page = await request.get(`/templates/${template.id}`);
		expect(page.ok()).toBe(true);
		expect(await page.text()).toContain(
			`<title>${template.title} — Hexly Video Kit</title>`,
		);
	}
	const schema = await request.get("/templates/film-v2.schema.json");
	const properties = (await schema.json()).properties;
	for (const key of ["theme", "opening", "ending", "scenes"])
		expect(properties).toHaveProperty(key);
	const font = await request.get(
		`/video-kit/${brandAssetVersion}/hexly/journey-cjk.woff2`,
	);
	expect(font.headers()["content-type"]).toContain("font/woff2");
	expect((await font.body()).byteLength).toBeGreaterThan(100_000);
});
