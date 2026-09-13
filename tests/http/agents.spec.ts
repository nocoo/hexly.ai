import { expect, test } from "@playwright/test";
import { readProjects } from "../../src/data/read-projects";
import { agentFiles } from "../../src/model/discovery";

test("serves the exact Markdown handoff for every canonical page without JavaScript", async ({
	request,
}) => {
	for (const file of agentFiles(readProjects())) {
		const response = await request.get(`/${file.fileName}`);
		expect(response.status(), file.fileName).toBe(200);
		expect(response.headers()["content-type"], file.fileName).toContain(
			"text/markdown",
		);
		expect(response.headers()["cache-control"], file.fileName).toContain(
			"must-revalidate",
		);
		expect(await response.text(), file.fileName).toBe(file.source);
	}
});

test("advertises page-specific agent guides in HTML and the crawler index", async ({
	request,
}) => {
	for (const [path, guide] of [
		["/", "/agents/index.md"],
		["/logos", "/agents/logos.md"],
		["/projects/frogie", "/agents/projects/frogie.md"],
		["/templates/launch", "/agents/templates/launch.md"],
		["/status", "/agents/status.md"],
	]) {
		const response = await request.get(path ?? "/");
		const html = await response.text();
		expect(html).toContain(
			`<link rel="alternate" type="text/markdown" href="${guide}" title="Agent guide"`,
		);
		expect(html).toContain('id="agent-guide"');
	}
	const head = await request.head("/agents/templates.md");
	expect(head.status()).toBe(200);
	expect(await head.body()).toHaveLength(0);
	const index = await (await request.get("/llms.txt")).text();
	expect(index).toContain("/agents/templates.md");
	expect(index).toContain("/templates/outros.json");
});
