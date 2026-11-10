import { afterAll, beforeAll, vi } from "vitest";

beforeAll(() => {
	const realFetch = globalThis.fetch.bind(globalThis);
	vi.stubGlobal("fetch", (input: RequestInfo | URL, init?: RequestInit) => {
		const url = String(
			typeof input === "string"
				? input
				: input instanceof URL
					? input.href
					: input.url,
		);
		if (url.includes("h.no.mt")) {
			throw new Error(
				"L1 unit tests must not fetch CDN assets (h.no.mt). Use mocks or move the test to tests/assets.",
			);
		}
		return realFetch(input, init);
	});
});

afterAll(() => {
	vi.unstubAllGlobals();
});
