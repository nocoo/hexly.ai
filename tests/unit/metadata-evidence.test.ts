import { describe, expect, it } from "vitest";
import { readProjects } from "../../src/data/read-projects";
import {
	catalogueProblems,
	projectReadmePath,
} from "../../src/model/catalogue";
import type { Project } from "../../src/model/project";

const original = readProjects().find((project) => project.id === "frogie");
if (!original?.overview) throw new Error("Missing project overview fixture");
const overview = original.overview;
const verified = overview.verified;

describe("project metadata evidence", () => {
	it("uses explicit evidenced README paths for both locales", () => {
		const project: Project = {
			...original,
			overview: {
				...overview,
				verified: {
					...verified,
					readmes: { en: "README.md", zh: "README.md" },
					sources: [...verified.sources, "README.md"],
				},
			},
		};
		expect(projectReadmePath(project, "en")).toBe("README.md");
		expect(projectReadmePath(project, "zh")).toBe("README.md");
		expect(catalogueProblems([project])).toEqual([]);
		for (const readmes of [
			{ en: "README.md" },
			{ en: "README.md", zh: "missing.md" },
			null,
		]) {
			const bad = {
				...project,
				overview: {
					...overview,
					verified: {
						...verified,
						sources: [...verified.sources, "README.md"],
						readmes,
					},
				},
			} as Project;
			expect(catalogueProblems([bad])).toContain(
				`Invalid README evidence: ${project.id}`,
			);
		}
	});
	it("requires a safe status-evidence path and complete digest", () => {
		const statusEvidence = {
			path: "docs/sources/checked-status.json",
			sha256: "a".repeat(64),
		};
		const project = {
			...original,
			source: { ...original.source, statusEvidence },
		};
		expect(catalogueProblems([project])).toEqual([]);
		for (const evidence of [
			null,
			{ ...statusEvidence, path: "../private.json" },
			{ ...statusEvidence, sha256: "missing" },
		]) {
			const bad = {
				...project,
				source: { ...project.source, statusEvidence: evidence },
			} as Project;
			expect(catalogueProblems([bad])).toContain(
				`Invalid repository status evidence: ${project.id}`,
			);
		}
	});
});
