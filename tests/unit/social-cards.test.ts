import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";
import { readInventory } from "../../scripts/asset-storage";
import { copy } from "../../src/data/copy";
import identity from "../../src/data/projects/hexly-ai.json";
import { readProjects } from "../../src/data/read-projects";
import socialCards from "../../src/data/social-cards.json" with {
	type: "json",
};
import { projectShareCard, siteShareCard } from "../../src/model/discovery";
import type { Project } from "../../src/model/project";
import {
	siteCardKey,
	socialCardFingerprint,
	socialCardIconPath,
	socialCardRendererSha,
} from "../../src/model/social-card";

const projects = readProjects();
const sha = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");
const stem = (path: string) =>
	(path.split("/").pop() ?? "").replace(/\.jpg$/, "");
const render = (id: string) =>
	`Run \`bun run social:build --project ${id}\` (or \`bun run social:build\`) and publish the new file.`;
const records = socialCards.projects as Record<
	string,
	{ path: string; bytes: number; sha256: string; fingerprint: string }
>;

const rendererSha256 = await socialCardRendererSha();

async function fingerprintFor(project: Project) {
	return socialCardFingerprint({
		key: project.id,
		title: project.title,
		description: project.description.en,
		category: project.category,
		archived: project.archived,
		iconSha256: sha(await readFile(socialCardIconPath(project))),
		rendererSha256,
	});
}

describe("share cards", () => {
	it("registers exactly one card per catalogue project", () => {
		expect(Object.keys(records).toSorted()).toEqual(
			projects.map((project) => project.id).toSorted(),
		);
	});

	it("keeps every card's inputs and bytes current", async () => {
		const stale: string[] = [];
		for (const project of projects) {
			const record = records[project.id];
			if (!record) {
				stale.push(`${project.id}: not registered. ${render(project.id)}`);
				continue;
			}
			if (record.fingerprint !== (await fingerprintFor(project)))
				stale.push(`${project.id}: inputs changed. ${render(project.id)}`);
			const bytes = await readFile(`public${record.path}`).catch(() => null);
			if (!bytes) {
				stale.push(
					`${project.id}: missing ${record.path}. ${render(project.id)}`,
				);
				continue;
			}
			if (sha(bytes) !== record.sha256 || bytes.length !== record.bytes)
				stale.push(
					`${project.id}: ${record.path} differs. ${render(project.id)}`,
				);
		}
		expect(stale).toEqual([]);
	});

	it("registers the home card from the hexly.ai identity", async () => {
		const expected = socialCardFingerprint({
			key: siteCardKey,
			title: `${copy.en.heroFirst} ${copy.en.heroSecond}`,
			description: "",
			category: "portfolio",
			archived: false,
			iconSha256: sha(await readFile(socialCardIconPath(identity as Project))),
			rendererSha256,
		});
		expect(socialCards.site.fingerprint).toBe(expected);
		const bytes = await readFile(`public${socialCards.site.path}`);
		expect(sha(bytes)).toBe(socialCards.site.sha256);
	});

	it("uses dated content-addressed names that the inventory published", () => {
		const inventory = readInventory();
		const problems: string[] = [];
		const names = [
			socialCards.site.path,
			...Object.values(records).map((record) => record.path),
		];
		expect(new Set(names).size).toBe(names.length);
		for (const path of names) {
			if (!/^\/og\/[a-z0-9-]+-\d{8}-[a-f0-9]{6}\.jpg$/.test(path))
				problems.push(`${path}: name is not <id>-<date>-<hash6>.jpg`);
		}
		const all: [string, { path: string; sha256: string }][] = [
			["site", socialCards.site],
			...Object.entries(records),
		];
		for (const [id, record] of all) {
			const row = inventory.files.find((file) => file.path === record.path);
			if (!row)
				problems.push(
					`${id}: ${record.path} is unpublished. Run \`bun run assets:r2 inventory\` then publish.`,
				);
			else if (row.sha256 !== record.sha256)
				problems.push(`${id}: inventory hash differs from the card record`);
		}
		expect(problems).toEqual([]);
	});

	it("serves the registered card through share metadata", () => {
		expect(siteShareCard().image.url).toContain(stem(socialCards.site.path));
		for (const project of projects) {
			const record = records[project.id];
			if (!record) throw new Error(`Missing card record: ${project.id}`);
			expect(projectShareCard(project).image.url, project.id).toContain(
				stem(record.path),
			);
			expect(Object.hasOwn(project, "socialImage"), project.id).toBe(false);
		}
	});
});
