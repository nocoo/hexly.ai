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
		command:
			"bunx wrangler dev --env test --local --ip 127.0.0.1 --port 17048 --inspector-port 18048 --persist-to .wrangler/http",
		url: "http://127.0.0.1:17048",
		reuseExistingServer: false,
		timeout: 60000,
		gracefulShutdown: { signal: "SIGTERM", timeout: 5000 },
	},
});
