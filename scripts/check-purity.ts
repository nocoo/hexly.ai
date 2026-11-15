import { existsSync, readdirSync } from "node:fs";
import { basename } from "node:path";
import process from "node:process";

const FORBIDDEN_BASENAMES = [
	/^package\.json(\.txt)?$/i,
	/^wrangler\./i,
	/^vite\.config\./i,
	/^tsconfig.*\.json$/i,
	/^Package\.swift$/,
	/^requirements\.txt$/,
	/^herdr-plugin\.toml$/,
	/^AGENTS\.md(\.txt)?$/i,
	/^Info\.plist$/,
];

const FORBIDDEN_INPUT_DIRS =
	/\/input\/(?:adopted|verified|catalogue|src|Sources|worker|docs|scripts|examples)\//;

const FORBIDDEN_INPUT_EXT =
	/\.(?:ts|tsx|js|jsx|mjs|py|swift|sh|css|html|md|txt|toml|ya?ml)$/i;

export function findPurityViolations(paths: readonly string[]): string[] {
	const problems: string[] = [];
	for (const path of paths) {
		if (path.startsWith("docs/sources/")) {
			const rest = path.slice("docs/sources/".length);
			if (rest.includes("/") || !rest.endsWith(".json")) {
				problems.push(
					`${path}: only top-level JSON provenance receipts belong in docs/sources/`,
				);
			}
			continue;
		}
		if (!path.startsWith("artwork/")) continue;
		const name = basename(path);
		if (FORBIDDEN_BASENAMES.some((pattern) => pattern.test(name))) {
			problems.push(
				`${path}: external project configuration/doc file is not allowed in artwork/`,
			);
			continue;
		}
		if (
			path.startsWith("artwork/logo-family/") &&
			path.includes("/input/") &&
			(FORBIDDEN_INPUT_DIRS.test(path) ||
				FORBIDDEN_INPUT_EXT.test(path) ||
				/^README\.md(\.txt)?$/i.test(name))
		) {
			problems.push(
				`${path}: external source/doc snapshot is not allowed under artwork/logo-family/*/input/`,
			);
		}
	}
	return problems;
}

function walkFiles(dir: string): string[] {
	if (!existsSync(dir)) return [];
	const results: string[] = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		const full = `${dir}/${entry.name}`;
		if (entry.isDirectory()) {
			results.push(...walkFiles(full));
		} else if (entry.isFile()) {
			results.push(full);
		}
	}
	return results;
}

if (import.meta.main) {
	const files = [...walkFiles("docs/sources"), ...walkFiles("artwork")];
	const problems = findPurityViolations(files);
	if (problems.length) {
		for (const problem of problems) console.error(problem);
		console.error(
			`Purity guard failed: ${problems.length} external project artifact(s) found.`,
		);
		process.exit(1);
	}
	console.info(
		"Purity guard passed: no external project source or snapshot artifacts.",
	);
}
