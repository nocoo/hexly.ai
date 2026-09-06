import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
	testDir: "tests/browser",
	fullyParallel: true,
	forbidOnly: true,
	retries: 0,
	workers: 3,
	reporter: "list",
	outputDir: ".test-results/browser",
	use: {
		baseURL: "http://127.0.0.1:27048",
		locale: "en-US",
		colorScheme: "light",
		reducedMotion: "reduce",
		trace: "retain-on-failure",
		screenshot: "only-on-failure",
	},
	projects: [
		{
			name: "desktop",
			use: {
				...devices["Desktop Chrome"],
				viewport: { width: 1440, height: 1000 },
			},
		},
		{
			name: "mobile",
			use: { ...devices["iPhone 13"], defaultBrowserType: "chromium" },
		},
	],
	webServer: {
		command:
			"bunx wrangler dev --env test --local --ip 127.0.0.1 --port 27048 --inspector-port 28048 --persist-to .wrangler/browser",
		url: "http://127.0.0.1:27048",
		reuseExistingServer: false,
		timeout: 60000,
		gracefulShutdown: { signal: "SIGTERM", timeout: 5000 },
	},
});
