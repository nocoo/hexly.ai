import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "tests/http",
	fullyParallel: true,
	workers: 3,
	forbidOnly: true,
	retries: 0,
	reporter: "list",
	outputDir: ".test-results/http",
	use: { baseURL: "http://127.0.0.1:17048" },
	webServer: {
		command: "bun scripts/local-status.ts http",
		url: "http://127.0.0.1:17048",
		reuseExistingServer: false,
		timeout: 60000,
		gracefulShutdown: { signal: "SIGTERM", timeout: 5000 },
	},
});
