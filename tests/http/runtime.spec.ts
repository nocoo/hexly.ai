import { createConnection } from "node:net";
import { setTimeout } from "node:timers/promises";
import { expect, test } from "@playwright/test";

test("keeps serving after clients abandon request bodies", async ({
	baseURL,
	request,
}) => {
	if (!baseURL) throw new Error("The isolated test server needs a base URL.");
	const url = new URL(baseURL);
	for (let attempt = 0; attempt < 3; attempt += 1) {
		await new Promise<void>((resolve, reject) => {
			const socket = createConnection(Number(url.port), url.hostname, () => {
				socket.write(
					`POST /api/live HTTP/1.1\r\nHost: ${url.host}\r\nContent-Type: application/octet-stream\r\nContent-Length: 2000000\r\n\r\n`,
				);
				socket.write(Buffer.alloc(64 * 1024), () => socket.destroy());
			});
			socket.once("error", reject);
			socket.once("close", () => resolve());
			socket.setTimeout(5000, () => {
				socket.destroy(new Error("The abandoned connection did not close."));
			});
		});
		// Let the disconnect propagate through both local Wrangler proxy hops.
		await setTimeout(500);
		const response = await request.get("/api/live");
		expect(response.ok()).toBe(true);
		expect(await response.json()).toMatchObject({ status: "ok" });
	}
});
