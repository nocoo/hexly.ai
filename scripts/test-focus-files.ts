import { readdirSync } from "node:fs";
import { join } from "node:path";

const roots = [
	"tests/unit",
	"tests/assets",
	"tests/http",
	"tests/browser",
	"packages/video-kit/tests",
];

function collect(directory: string): string[] {
	const paths: string[] = [];
	for (const entry of readdirSync(directory, { withFileTypes: true })) {
		const path = join(directory, entry.name);
		if (entry.isDirectory()) paths.push(...collect(path));
		else if (/\.(?:test|spec)\.tsx?$/.test(entry.name)) paths.push(path);
	}
	return paths;
}

export function collectTests(): string[] {
	return roots.flatMap((root) => collect(root));
}
