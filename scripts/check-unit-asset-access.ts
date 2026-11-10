import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { assertUnitPathAllowed } from "../tests/unit/asset-path-policy";

const roots = ["tests/unit", "packages/video-kit/tests"];

const patterns: Array<{ re: RegExp; label: string }> = [
	{
		re: /readFile(?:Sync)?\([^)]*[`'"](?:public\/|\.\.\/.*public)/,
		label: "readFile on public/",
	},
	{ re: /sharp\([^)]*[`'"]public/, label: "sharp on public/" },
	{
		re: /sharp\([^)]*[`'"]packages\/video-kit\/public/,
		label: "sharp on video-kit public",
	},
	{ re: /artwork\/logo-family\/[^'"`]+\/raw\//, label: "logo-family raw path" },
];

let problems = 0;
for (const root of roots) {
	for (const name of readdirSync(root)) {
		if (!name.endsWith(".test.ts") || name === "guard-no-assets.ts") continue;
		const path = join(root, name);
		const source = readFileSync(path, "utf8");
		for (const { re, label } of patterns) {
			if (re.test(source)) {
				console.error(`${path}: forbidden asset access pattern (${label})`);
				problems++;
			}
		}
		try {
			for (const match of source.matchAll(
				/readFile(?:Sync)?\([^,)]*[`'"]([^`'"]+)[`'"]/g,
			)) {
				const literal = match[1];
				if (!literal) continue;
				if (literal.startsWith("/") || literal.includes("://")) continue;
				try {
					assertUnitPathAllowed(literal);
				} catch (error) {
					console.error(`${path}: ${(error as Error).message}`);
					problems++;
				}
			}
		} catch {
			// static scan only
		}
	}
}

if (problems > 0) process.exit(1);
console.info("Unit test asset-access scan passed.");
