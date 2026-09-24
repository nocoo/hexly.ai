import type { Plugin } from "vite";
import { readProjects } from "../src/data/read-projects";
import { projectApi, projectOwner } from "../src/model/project-api";
import { readInventory } from "./asset-storage";

export function projectApiAssets(): Plugin {
	return {
		name: "project-api-assets",
		generateBundle() {
			const inventory = readInventory();
			const urls = new Set(
				inventory.files.map((file) => `${inventory.origin}/${file.key}`),
			);
			const repos = new Set<string>();
			for (const project of readProjects()) {
				const repo = project.repo.toLowerCase();
				const owner = projectOwner(project).toLowerCase();
				const key = `${owner}/${repo}`;
				if (
					!/^[a-z0-9](?:[a-z0-9-]{0,37}[a-z0-9])?$/.test(owner) ||
					!/^[a-z0-9_-][a-z0-9._-]{0,99}$/.test(repo) ||
					repos.has(key)
				) {
					throw new Error(`Invalid or duplicate API repository: ${key}`);
				}
				repos.add(key);
				const response = projectApi(project);
				for (const logo of response.logos) {
					if (!urls.has(logo.url))
						throw new Error(`Unregistered API logo: ${logo.url}`);
				}
				this.emitFile({
					type: "asset",
					fileName: `data/project-api/${key}.json`,
					source: JSON.stringify(response),
				});
			}
		},
	};
}
