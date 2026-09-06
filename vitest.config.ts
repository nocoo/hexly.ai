import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["tests/unit/**/*.test.ts"],
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
