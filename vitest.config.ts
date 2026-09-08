import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["tests/unit/**/*.test.ts"],
		forceRerunTriggers: [
			...configDefaults.forceRerunTriggers,
			"**/bun.lock",
			"**/bunfig.toml",
			"**/tsconfig*.json",
			// These inputs are read through a subprocess or fs, outside the import graph.
			"**/src/data/projects/**",
			"**/scripts/release.ts",
			"**/artwork/logo-family/tools/**",
			"**/public/logos/originals/hexly-ai.*",
		],
		coverage: {
			provider: "v8",
			include: [
				"src/model/**/*.ts",
				"scripts/isolation.ts",
				"scripts/release-model.ts",
			],
			reporter: ["text", "json-summary", "html"],
			thresholds: { statements: 90, branches: 90, functions: 90, lines: 90 },
		},
	},
});
