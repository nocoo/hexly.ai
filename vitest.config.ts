import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		maxWorkers: 4,
		allowOnly: false,
		setupFiles: ["tests/unit/guard-no-assets.ts"],
		include: [
			"tests/unit/**/*.test.ts",
			"packages/video-kit/tests/**/*.test.ts",
		],
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
			"**/packages/video-kit/public/**",
			"**/packages/video-kit/vendor/**",
		],
		coverage: {
			provider: "v8",
			include: [
				"src/model/**/*.ts",
				"worker/status.ts",
				"scripts/gate-refs.ts",
				"scripts/gate-runtime.ts",
				"scripts/isolation.ts",
				"scripts/release-model.ts",
				"scripts/test-focus.ts",
				"scripts/test-focus-files.ts",
			],
			exclude: [
				// Byte, fingerprint and manifest integrity: tests/assets + verify-assets.
				"src/model/brand-manifest.ts",
				"src/model/social-card.ts",
			],
			reporter: ["text", "json-summary", "html"],
			thresholds: { statements: 95, branches: 95, functions: 95, lines: 95 },
		},
	},
});
