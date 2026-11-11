import { describe, expect, it } from "vitest";
import { violations } from "../../scripts/test-focus";
import { collectTests } from "../../scripts/test-focus-files";

const only = ["it", ".on", 'ly("runs", () => {});'].join("");
const pending = ["describe", ".to", 'do("later");'].join("");
const legacy = ["f", 'it("runs", () => {});'].join("");
const skip = ["test", ".sk", 'ip("name", () => {});'].join("");

describe("test focus guard", () => {
	it("rejects focused and pending tests", () => {
		expect(violations("a.test.ts", only)).toEqual([
			"a.test.ts:1: focused test (.only)",
		]);
		expect(violations("a.test.ts", pending)).toEqual([
			"a.test.ts:1: pending test (.todo)",
		]);
		expect(violations("a.test.ts", legacy)).toEqual([
			"a.test.ts:1: focused/skipped suite (fit/xit/fdescribe/xdescribe)",
		]);
	});

	it("rejects unconditional skips but keeps conditional ones", () => {
		expect(violations("a.spec.ts", skip)).toEqual([
			"a.spec.ts:1: unconditional skip (.skip)",
		]);
		expect(violations("a.spec.ts", "test.skip(isMobile);")).toEqual([]);
		expect(
			violations("a.spec.ts", 'test.skip(process.env.CI, "reason");'),
		).toEqual([]);
	});

	it("ignores comments and passes on clean suites", () => {
		expect(
			violations("a.test.ts", `\t// ${only}\n\tit("runs", () => {});`),
		).toEqual([]);
	});

	it("scans every shipped suite", () => {
		const paths = collectTests();
		expect(paths).toContain("tests/unit/test-focus.test.ts");
		expect(paths.some((path) => path.startsWith("tests/browser/"))).toBe(true);
		expect(paths.every((path) => /\.(?:test|spec)\.tsx?$/.test(path))).toBe(
			true,
		);
	});
});
