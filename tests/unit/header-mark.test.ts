import { afterEach, expect, it, vi } from "vitest";
import { BrandMark } from "../../src/components/Icon";
import identity from "../../src/data/projects/hexly-ai.json";

const candidate = "/logos/family/hexly-ai/2026-11-13-02/02/transparent-128.png";
const published = `https://h.no.mt${identity.family.root}/transparent-64.png`;

afterEach(() => vi.unstubAllEnvs());

it.each([
	[true, "development", "1", candidate],
	[true, "development", undefined, published],
	[true, "test", "1", published],
	[false, "production", "1", published],
] as const)(
	"isolates the header candidate with DEV=%s MODE=%s local=%s",
	(dev, mode, local, source) => {
		vi.stubEnv("DEV", dev);
		vi.stubEnv("MODE", mode);
		vi.stubEnv("VITE_LOCAL_MATERIALS", local);
		expect(BrandMark().props).toMatchObject({
			src: source,
			width: 36,
			height: 36,
			className: "brand-mark",
			alt: "",
			"aria-hidden": "true",
		});
		expect(BrandMark({ size: 256 }).props).toMatchObject({
			src: source.replace(/transparent-\d+\.png$/, "transparent-512.png"),
			width: 256,
			height: 256,
			className: "brand-mark",
		});
	},
);
