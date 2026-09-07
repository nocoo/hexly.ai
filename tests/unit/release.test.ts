import { execFileSync } from "node:child_process";
import {
	mkdtempSync,
	readFileSync,
	realpathSync,
	rmSync,
	writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
	chooseVersion,
	parseVersion,
	releaseNotes,
	releaseOptions,
	updateChangelog,
} from "../../scripts/release-model";

const now = Date.parse("2026-09-06T00:00:00Z");
const baseline = {
	current: "0.1.0",
	previous: { version: "0.1.0", releasedAt: now },
	changedLines: 1,
	now,
};

describe("release version policy", () => {
	it("publishes an untagged first version without inventing a bump", () => {
		expect(chooseVersion({ ...baseline, previous: null })).toBe("0.1.0");
		expect(chooseVersion({ ...baseline, current: "0.2.0" })).toBe("0.2.0");
	});
	it("defaults to patch and uses strict day/line thresholds for minor", () => {
		expect(chooseVersion(baseline)).toBe("0.1.1");
		expect(
			chooseVersion({
				...baseline,
				changedLines: 500,
				now: now + 3 * 86_400_000,
			}),
		).toBe("0.1.1");
		expect(chooseVersion({ ...baseline, changedLines: 501 })).toBe("0.2.0");
		expect(chooseVersion({ ...baseline, now: now + 3 * 86_400_000 + 1 })).toBe(
			"0.2.0",
		);
	});
	it("honors explicit bump types and versions over automatic policy", () => {
		expect(
			chooseVersion({ ...baseline, requested: "patch", changedLines: 900 }),
		).toBe("0.1.1");
		expect(
			chooseVersion({ ...baseline, current: "2.3.4", requested: "minor" }),
		).toBe("2.4.0");
		expect(
			chooseVersion({ ...baseline, current: "2.3.4", requested: "major" }),
		).toBe("3.0.0");
		expect(chooseVersion({ ...baseline, requested: "0.1.0" })).toBe("0.1.0");
		expect(chooseVersion({ ...baseline, requested: "2.0.0" })).toBe("2.0.0");
	});
	it("rejects malformed versions, unsafe integers, and downgrades", () => {
		for (const value of [
			"v1.0.0",
			"1.0",
			"1.0.0-beta",
			"01.2.3",
			"--unknown",
		]) {
			expect(() => parseVersion(value)).toThrow("X.Y.Z");
		}
		expect(() => parseVersion("9007199254740992.0.0")).toThrow("safe integers");
		expect(() => chooseVersion({ ...baseline, requested: "0.0.9" })).toThrow(
			"lower",
		);
		expect(parseVersion("10.20.30")).toEqual([10, 20, 30]);
	});
	it("accepts Bun argument separators and rejects ambiguous commands", () => {
		expect(releaseOptions(["--", "minor", "--dry-run"])).toEqual({
			requested: "minor",
			dryRun: true,
		});
		expect(releaseOptions(["0.1.0"])).toEqual({
			requested: "0.1.0",
			dryRun: false,
		});
		expect(releaseOptions([])).toEqual({ requested: undefined, dryRun: false });
		expect(() => releaseOptions(["patch", "minor"])).toThrow("one bump");
		expect(() => releaseOptions(["--oops"])).toThrow("X.Y.Z");
	});
});

describe("release notes and retry behavior", () => {
	it("groups real commits and excludes bookkeeping releases", () => {
		const notes = releaseNotes([
			{ hash: "a123456789", subject: "feat(ui): add gallery" },
			{ hash: "b123456789", subject: "feat: add search" },
			{ hash: "c123456789", subject: "fix: repair download" },
			{ hash: "d123456789", subject: "docs: explain setup" },
			{ hash: "e123456789", subject: "test: cover release" },
			{ hash: "f123456789", subject: "chore: release v0.1.0" },
			{ hash: "g123456789", subject: "chore: configure deployment" },
			{ hash: "h123456789", subject: "Initial commit" },
		]);
		expect(notes.match(/### Features/g)).toHaveLength(1);
		for (const section of [
			"Features",
			"Fixes",
			"Documentation",
			"Tests",
			"Maintenance",
		])
			expect(notes).toContain(`### ${section}`);
		expect(notes).toContain(
			"add gallery ([a123456](https://github.com/nocoo/hexly.ai/commit/a123456789))",
		);
		expect(notes).toContain("Initial commit");
		expect(notes).not.toContain("release v0.1.0");
		expect(releaseNotes([])).toBe("- Initial release.");
	});
	it("replaces a failed release section while preserving earlier releases", () => {
		const existing =
			"# Changelog\n\nRelease history.\n\n## [0.2.0] - 2026-09-05\n\nOld notes.\n\n## [0.1.0] - 2026-09-01\n\nFirst release.\n";
		const updated = updateChangelog(
			existing,
			"0.2.0",
			"2026-09-06",
			"New notes.",
		);
		expect(updated.match(/## \[0.2.0\]/g)).toHaveLength(1);
		expect(updated).toContain("Release history.");
		expect(updated).toContain("First release.");
		expect(updated).toContain("New notes.");
		expect(updated).not.toContain("Old notes.");
		expect(updateChangelog("", "0.1.0", "2026-09-06", "First.")).toBe(
			"# Changelog\n\n## [0.1.0] - 2026-09-06\n\nFirst.\n",
		);
	});
	it("runs the real dry-run command without changing files or Git refs", () => {
		const directory = mkdtempSync(join(tmpdir(), "hexly-release-test-"));
		const script = resolve("scripts/release.ts");
		const repositoryVariables = new Set(
			execFileSync("git", ["rev-parse", "--local-env-vars"], {
				encoding: "utf8",
			})
				.trim()
				.split("\n"),
		);
		const env = Object.fromEntries(
			Object.entries(process.env).filter(
				([name]) => !repositoryVariables.has(name),
			),
		);
		const git = (...args: string[]) =>
			execFileSync("git", args, {
				cwd: directory,
				encoding: "utf8",
				env,
			}).trim();
		try {
			git("init", "-b", "main");
			expect(git("rev-parse", "--absolute-git-dir")).toBe(
				realpathSync(join(directory, ".git")),
			);
			git("config", "user.name", "Release Test");
			git("config", "user.email", "release@example.test");
			writeFileSync(
				join(directory, "package.json"),
				'{"name":"hexly.ai","version":"0.1.0"}\n',
			);
			git("add", "package.json");
			git("commit", "-m", "feat: create a fixture");
			const before = {
				head: git("rev-parse", "HEAD"),
				manifest: readFileSync(join(directory, "package.json"), "utf8"),
				tags: git("tag"),
			};
			const result = execFileSync("bun", [script, "0.1.0", "--dry-run"], {
				cwd: directory,
				encoding: "utf8",
				env,
			});
			expect(result).toContain("Release 0.1.0 → 0.1.0");
			expect(result).toContain("no files, refs, or remote resources changed");
			expect(git("status", "--porcelain")).toBe("");
			expect(git("rev-parse", "HEAD")).toBe(before.head);
			expect(git("tag")).toBe(before.tags);
			expect(readFileSync(join(directory, "package.json"), "utf8")).toBe(
				before.manifest,
			);
		} finally {
			rmSync(directory, { recursive: true, force: true });
		}
	});
});
