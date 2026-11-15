import { describe, expect, it } from "vitest";
import biome from "../../biome.json";
import root from "../../package.json";

describe("dependency alignment", () => {
	it("keeps the Biome schema on the declared CLI version", () => {
		expect(biome.$schema).toBe(
			`https://biomejs.dev/schemas/${root.devDependencies["@biomejs/biome"]}/schema.json`,
		);
	});
});
