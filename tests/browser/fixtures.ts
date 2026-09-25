import { test as base, devices, expect } from "@playwright/test";
import { readInventory } from "../../scripts/asset-storage";
import storage from "../../src/data/media-storage.json" with { type: "json" };
import { readProjects } from "../../src/data/read-projects";
import examples from "../../src/data/template-examples.json" with {
	type: "json",
};

const assets = new Map(readInventory().files.map((file) => [file.key, file]));
const posters = new Set([
	...readProjects().flatMap(
		(project) => project.media?.videos?.map((video) => video.poster) ?? [],
	),
	...examples.examples.map((example) => example.video.poster),
]);

/** Exercise production CDN URLs using verified local bytes; no live service dependency. */
export const test = base.extend<{ assetFixtures: undefined }>({
	assetFixtures: [
		async ({ context }, use) => {
			await context.route(`${storage.origin}/**`, async (route) => {
				const file = assets.get(
					new URL(route.request().url()).pathname.slice(1),
				);
				if (!file)
					return posters.has(route.request().url())
						? route.fulfill({
								contentType: "image/svg+xml",
								headers: { "Access-Control-Allow-Origin": "*" },
								body: '<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><rect width="1920" height="1080" fill="#f0f0e9"/></svg>',
							})
						: route.fulfill({
								status: 404,
								body: "Unregistered local CDN fixture. Playback tests must provide their own clips.",
							});
				await route.fulfill({
					path: file.source,
					contentType: file.contentType,
					headers: {
						"Access-Control-Allow-Origin": "*",
						"Cache-Control": "public, max-age=31536000, immutable",
					},
				});
			});
			await use(undefined);
		},
		{ auto: true },
	],
});
export { expect };

// Browser selection is worker-scoped; describes only override context options.
export const desktop = {
	userAgent: devices["Desktop Chrome"].userAgent,
	viewport: { width: 1440, height: 1000 },
	deviceScaleFactor: 1,
	isMobile: false,
	hasTouch: false,
};
export const touch = {
	userAgent: devices["iPhone 13"].userAgent,
	viewport: devices["iPhone 13"].viewport,
	deviceScaleFactor: 3,
	isMobile: true,
	hasTouch: true,
};
