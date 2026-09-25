import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";
import scope from "../../docs/brand-textures/2026-09-14/scope-update.json" with {
	type: "json",
};
import { readProjects } from "../../src/data/read-projects";
import { textureManifestProblems } from "../../src/model/brand-manifest";

const projects = readProjects();
test("discovers current independent textures for active and archived entries without new canonical routes", async ({
	request,
}) => {
	const catalogue = await (await request.get("/data/projects.json")).json();
	expect(
		catalogue.filter((p: { brandTexture?: unknown }) => p.brandTexture),
	).toHaveLength(scope.expectedNewPackCount);
	const schema = await (await request.get("/textures/schema-v1.json")).json();
	expect(
		schema.properties.scope.properties.officialIdentityRecolored.const,
	).toBe(false);
	const sitemap = await (await request.get("/sitemap.xml")).text();
	for (const project of projects)
		expect(sitemap).toContain(
			`<loc>https://hexly.ai/projects/${project.id}</loc>`,
		);
	expect(sitemap).not.toContain("<loc>https://hexly.ai/textures/");
	const archivedGuide = await (
		await request.get("/agents/projects/ccbackup.md")
	).text();
	expect(archivedGuide).toContain("Catalogue state: archived");
	expect(archivedGuide).toContain(
		"https://h.no.mt/projects/ccbackup/textures/v1.0.0/texture-dark.png",
	);
	const untouchedGuide = await (
		await request.get("/agents/projects/feedmaid.md")
	).text();
	expect(untouchedGuide).toContain("Catalogue state: archived");
	expect(untouchedGuide).not.toContain("/projects/feedmaid/textures/");
});

test("serves exact texture downloads and preserves raw review HTML while enhancing browser navigation", async ({
	request,
}) => {
	const root = "/textures/frogie/v1.0.0";
	const response = await request.get(`${root}/manifest.json`);
	expect(response.status()).toBe(200);
	const manifest = await response.json();
	expect(textureManifestProblems(manifest)).toEqual([]);
	for (const file of manifest.files) {
		const asset = await request.get(file.path, {
			headers: { Accept: "*/*" },
		});
		expect(asset.status(), file.path).toBe(200);
		const body = await asset.body();
		expect(body.length, file.path).toBe(file.bytes);
		expect(createHash("sha256").update(body).digest("hex"), file.path).toBe(
			file.sha256,
		);
		await asset.dispose();
	}
	const page = await request.get(`${root}/review.html`, {
		headers: { Accept: "text/html", "Sec-Fetch-Dest": "document" },
	});
	expect(page.headers()["cache-control"]).toBe("no-store");
	expect(page.headers().vary).toContain("Sec-Fetch-Dest");
	expect(await page.text()).toContain("/material-downloads.js");
	const native = await request.get(`${root}/review.html`, {
		headers: { Accept: "*/*" },
	});
	expect(await native.body()).toEqual(
		await readFile(`public${root}/review.html`),
	);
});
