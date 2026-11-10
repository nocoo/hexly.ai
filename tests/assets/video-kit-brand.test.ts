import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import manifest from "../../packages/video-kit/brand-source.json";
import identity from "../../packages/video-kit/current-identity.json";

describe("Video Kit distributed brand bytes", () => {
	test("the approved native identity bytes match current-identity.json", () => {
		const bytes = readFileSync(
			new URL(
				`../../packages/video-kit/public${identity.path}`,
				import.meta.url,
			),
		);
		expect(createHash("sha256").update(bytes).digest("hex")).toBe(
			identity.sha256,
		);
	});
	test("distributed font and license bytes retain recorded provenance", () => {
		for (const asset of manifest.assets) {
			const bytes = readFileSync(
				new URL(
					`../../packages/video-kit/public/video-kit/1.0.0/hexly/${asset.file}`,
					import.meta.url,
				),
			);
			expect(createHash("sha256").update(bytes).digest("hex")).toBe(
				asset.sha256,
			);
		}
	});
});
