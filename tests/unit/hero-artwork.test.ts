import { afterEach, expect, test, vi } from "vitest";
import { HeroArtwork } from "../../src/components/HeroArtwork";

afterEach(() => vi.unstubAllEnvs());

test("uses the approved extracted header artwork only in local-material development", () => {
	vi.stubEnv("DEV", true);
	vi.stubEnv("MODE", "development");
	vi.stubEnv("VITE_LOCAL_MATERIALS", "1");
	for (const page of ["projects", "templates", "brand", "status"] as const) {
		const image = HeroArtwork({ page });
		expect(image?.props).toMatchObject({
			src: `/brands/hexly-ai/v1.0.1/headers/${page}-960.webp`,
			width: 1536,
			height: 1024,
			alt: "",
			"aria-hidden": "true",
			fetchPriority: "high",
		});
	}
});

test.each([
	[true, "development", undefined],
	[true, "test", "1"],
	[false, "production", "1"],
] as const)(
	"keeps unpublished art out of DEV=%s MODE=%s local=%s",
	(dev, mode, local) => {
		vi.stubEnv("DEV", dev);
		vi.stubEnv("MODE", mode);
		vi.stubEnv("VITE_LOCAL_MATERIALS", local);
		expect(HeroArtwork({ page: "projects" })).toBeNull();
	},
);
