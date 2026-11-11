import { describe, expect, it } from "vitest";
import { historyRange, parsePushRefs } from "../../scripts/gate-refs";

const oid = (character: string) => character.repeat(40);

describe("pre-push ref selection", () => {
	it("selects each pushed commit once and ignores deletions", () => {
		const refs = parsePushRefs(
			[
				`refs/heads/main ${oid("a")} refs/heads/main ${oid("b")}`,
				`refs/heads/feature ${oid("a")} refs/heads/feature ${oid("0")}`,
				`(delete) ${oid("0")} refs/heads/old ${oid("c")}`,
				"",
			].join("\n"),
		);
		expect(refs).toEqual([{ localOid: oid("a"), remoteOid: oid("b") }]);
	});

	it("marks a new branch as having no remote parent", () => {
		expect(
			parsePushRefs(`refs/heads/new ${oid("d")} refs/heads/new ${oid("0")}`),
		).toEqual([{ localOid: oid("d"), remoteOid: null }]);
	});

	it("keeps the remote parent when one alias reports a deletion", () => {
		const refs = parsePushRefs(
			[
				`refs/heads/main ${oid("a")} refs/heads/main ${oid("0")}`,
				`refs/tags/v1 ${oid("a")} refs/tags/v1 ${oid("b")}`,
			].join("\n"),
		);
		expect(refs).toEqual([{ localOid: oid("a"), remoteOid: oid("b") }]);
	});

	it("ranges a tracked branch and excludes every remote ref for a new branch", () => {
		expect(historyRange({ localOid: oid("a"), remoteOid: oid("b") })).toBe(
			`${oid("b")}..${oid("a")}`,
		);
		expect(historyRange({ localOid: oid("a"), remoteOid: null })).toBe(
			`${oid("a")} --not --remotes`,
		);
	});

	it("ignores malformed lines", () => {
		expect(parsePushRefs("garbage\n\nrefs/heads/x\n")).toEqual([]);
	});
});
