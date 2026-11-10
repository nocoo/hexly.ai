import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		maxWorkers: 4,
		include: ["tests/assets/**/*.test.ts"],
		forceRerunTriggers: [
			"**/bun.lock",
			"**/docs/assets/inventory.json",
			"**/scripts/prepare-test-assets.ts",
			"**/public/**",
			"**/packages/video-kit/public/**",
			"**/artwork/**",
		],
	},
});
