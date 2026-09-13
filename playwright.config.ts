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
		// Exercise native tabs in the full Chromium browser's current headless mode.
		channel: "chromium",
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
		command: "bun scripts/local-status.ts browser",
		url: "http://127.0.0.1:27048",
		reuseExistingServer: false,
		timeout: 60000,
		gracefulShutdown: { signal: "SIGTERM", timeout: 5000 },
	},
});
