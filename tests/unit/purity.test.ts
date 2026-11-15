import { describe, expect, it } from "vitest";
import { findPurityViolations } from "../../scripts/check-purity";

describe("findPurityViolations", () => {
	it("allows JSON provenance receipts and approved artwork inputs", () => {
		expect(
			findPurityViolations([
				"docs/sources/onboarding-ag-cli-2026-11-15.json",
				"artwork/logo-family/mao/2026-11-12-02/input/previous.svg",
				"artwork/logo-family/bogo/2026-09-07-02/input/framing-guide.png",
				"artwork/logo-family/ag-cli/2026-11-14-01/finishing/01/tool-snapshot.mjs",
			]),
		).toEqual([]);
	});

	it("rejects external project source, config, and markdown dumps", () => {
		const violations = findPurityViolations([
			"docs/sources/kite-2026-09-25-publication/package.json",
			"docs/sources/01-github-profile.md",
			"artwork/logo-family/ocelot/2026-09-11-01/input/adopted/package.json",
			"artwork/logo-family/sleepy/2026-10-09-02/input/package.json.txt",
			"artwork/logo-family/hermes-gateway-herdr/2026-09-11-01/input/src/cli.py",
		]);
		expect(violations).toHaveLength(5);
	});
});
