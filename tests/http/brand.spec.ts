import { expect, test } from "@playwright/test";

test("serves Brand discovery, usage instructions and status-origin redirection", async ({
	request,
}) => {
	const response = await request.get("/brand");
	expect(response.status()).toBe(200);
	const html = await response.text();
	expect(html).toContain("<title>Brand — hexly.ai</title>");
	expect(html).toContain('rel="canonical" href="https://hexly.ai/brand"');
	expect(html).toContain("256 × 256 px");
	expect(html).toContain('id="surfaces"');
	expect(html).toContain("/agents/brand.md");
	expect(await (await request.get("/sitemap.xml")).text()).toContain(
		"<loc>https://hexly.ai/brand</loc>",
	);
	expect(await (await request.get("/llms.txt")).text()).toContain(
		"/agents/brand.md",
	);
	const guide = await request.get("/agents/brand.md");
	expect(guide.status()).toBe(200);
	expect(guide.headers()["content-type"]).toContain("text/markdown");
	expect(await guide.text()).toContain("Hexly brand usage");
	const redirect = await request.get("/brand", {
		headers: { Host: "status.hexly.ai" },
		maxRedirects: 0,
	});
	expect(redirect.status()).toBe(302);
	expect(redirect.headers().location).toBe("https://hexly.ai/brand");
});
