import { describe, expect, it } from "vitest";
import biome from "../../biome.json";
import root from "../../package.json";
import videoKit from "../../packages/video-kit/package.json";

describe("dependency alignment", () => {
	it("keeps all Remotion declarations on the Video Kit version", () => {
		const version = videoKit.dependencies.remotion;
		for (const declarations of [
			root.overrides,
			videoKit.dependencies,
			videoKit.devDependencies,
		]) {
			for (const [name, declared] of Object.entries(declarations)) {
				if (name === "remotion" || name.startsWith("@remotion/")) {
					expect(declared, name).toBe(version);
				}
			}
		}
	});

	it("keeps the Biome schema on the declared CLI version", () => {
		expect(biome.$schema).toBe(
			`https://biomejs.dev/schemas/${root.devDependencies["@biomejs/biome"]}/schema.json`,
		);
	});
});
