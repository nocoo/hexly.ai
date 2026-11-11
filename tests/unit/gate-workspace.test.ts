import { describe, expect, it } from "vitest";
import { workspacePackages } from "../../scripts/gate-workspace";

describe("gate workspace packages", () => {
	it("resolves every declared workspace to its source directory", () => {
		expect(workspacePackages(process.cwd())).toEqual([
			{ name: "@hexly/video-kit", directory: "packages/video-kit" },
		]);
	});
});
