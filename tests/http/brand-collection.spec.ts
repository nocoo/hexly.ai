import { createHash } from "node:crypto";
import { expect, test } from "@playwright/test";
import { readProjects } from "../../src/data/read-projects";
import { brandManifestProblems } from "../../src/model/brand-manifest";

const targets = readProjects().filter(
	(project) => project.brandKit?.method === "archived-artwork",
);

test("publishes the scoped schema and all 55 active brand archives through canonical discovery", async ({
	request,
}) => {
	expect(targets).toHaveLength(54);
	const schema = await request.get("/brands/schema-v2.json");
	expect(schema.status()).toBe(200);
	expect(
		(await schema.json()).properties.scope.properties.officialIdentityRecolored
			.const,
	).toBe(false);
	const sitemap = await (await request.get("/sitemap.xml")).text();
	const catalogue = await (await request.get("/data/projects.json")).json();
	expect(
		catalogue.filter((p: { archived: boolean }) => !p.archived),
	).toHaveLength(55);
	for (const project of targets)
		expect(sitemap).toContain(
			`<loc>https://hexly.ai/projects/${project.id}</loc>`,
		);
});

for (const project of targets) {
	test(`${project.id} serves exact campaign files, original identity and compatible historical URLs`, async ({
		request,
	}) => {
		const kit = project.brandKit;
		if (!kit || !project.family) throw new Error("Incomplete target archive");
		const response = await request.get(`${kit.root}/manifest.json`);
		expect(response.status()).toBe(200);
		const manifest = await response.json();
		expect(brandManifestProblems(manifest)).toEqual([]);
		for (const file of manifest.files) {
			const asset = await request.get(file.path);
			expect(asset.status(), file.path).toBe(200);
			expect(asset.headers()["cache-control"], file.path).toContain(
				"immutable",
			);
			const body = await asset.body();
			expect(body.byteLength, file.path).toBe(file.bytes);
			expect(createHash("sha256").update(body).digest("hex"), file.path).toBe(
				file.sha256,
			);
			if (file.path.endsWith(".svg"))
				expect(asset.headers()["content-type"]).toContain("image/svg+xml");
			await asset.dispose();
		}
		const original = await request.get(project.logo.original);
		expect(original.status()).toBe(200);
		expect(
			createHash("sha256")
				.update(await original.body())
				.digest("hex"),
		).toBe(project.logo.sha256);
		const historical = await request.get(
			`${project.family.root}/manifest.json`,
		);
		expect(historical.status()).toBe(200);
		const page = await request.get(`/projects/${project.id}`);
		expect(page.status()).toBe(200);
		expect(await page.text()).toContain(
			`https://hexly.ai/projects/${project.id}`,
		);
		const legacy = await request.get(`/logos/${project.id}`, {
			maxRedirects: 0,
		});
		expect(legacy.status()).toBe(301);
		const location = new URL(legacy.headers().location ?? "", legacy.url());
		expect(`${location.pathname}${location.hash}`).toBe(
			`/projects/${project.id}#brand`,
		);
	});
}
