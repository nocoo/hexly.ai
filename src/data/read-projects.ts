import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import type { Project } from "../model/project";

export const projectsDirectory = "src/data/projects";
const indexFile = join(projectsDirectory, "index.json");

export function readProjectIndex(): string[] {
	const ids: unknown = JSON.parse(readFileSync(indexFile, "utf8"));
	if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
		throw new Error("Project index must be a JSON array of ids.");
	}
	return ids;
}

export function readProjects(): Project[] {
	const ids = readProjectIndex();
	const files = new Set(
		readdirSync(projectsDirectory).filter(
			(name) => name.endsWith(".json") && name !== "index.json",
		),
	);
	const expected = new Set(ids.map((id) => `${id}.json`));
	for (const name of files) {
		if (!expected.has(name)) throw new Error(`Unlisted project file: ${name}`);
	}
	return ids.map((id) => {
		if (!files.has(`${id}.json`))
			throw new Error(`Missing project file: ${id}`);
		const project = JSON.parse(
			readFileSync(join(projectsDirectory, `${id}.json`), "utf8"),
		) as Project;
		if (project.id !== id) throw new Error(`Project id mismatch: ${id}`);
		return project;
	});
}

export function writeProjects(projects: Project[]): void {
	const ids = readProjectIndex();
	const byId = new Map(projects.map((project) => [project.id, project]));
	if (ids.length !== byId.size || ids.some((id) => !byId.has(id))) {
		throw new Error("Project write set must match index.json.");
	}
	for (const id of ids) {
		const project = byId.get(id);
		if (!project) throw new Error(`Missing project: ${id}`);
		writeFileSync(
			join(projectsDirectory, `${id}.json`),
			`${JSON.stringify(project, null, "\t")}\n`,
		);
	}
}
