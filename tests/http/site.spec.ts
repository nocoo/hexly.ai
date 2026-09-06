import { expect, test } from "@playwright/test";

test("serves the built site through real Workers HTTP", async ({ request }) => {
	const response = await request.get("/");
	expect(response.status()).toBe(200);
	expect(response.headers()["content-type"]).toContain("text/html");
	expect(await response.text()).toContain("hexly.ai");
});
