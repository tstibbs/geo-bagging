import {defineConfig, devices} from '@playwright/test'

const baseURL = 'http://localhost:3000'

const CI = !!process.env.CI

export default defineConfig({
	testDir: './test/e2e',
	// Fail the build on CI if you accidentally left test.only in the source code.
	forbidOnly: CI,
	// Retry on CI only
	retries: CI ? 2 : 0,
	workers: 1,
	reporter: [['list'], ['html', {open: 'never'}]],
	timeout: 60000,
	use: {
		baseURL: baseURL,
		trace: 'on-first-retry',
		// Timeout for actions like .click() or .fill()
		actionTimeout: 3000
	},
	webServer: {
		command: CI ? 'pnpm run serve' : 'pnpm run start',
		url: baseURL,
		reuseExistingServer: !CI,
		timeout: 120 * 1000
	},
	projects: [
		{
			name: 'chromium',
			use: {...devices['Desktop Chrome']}
		}
	]
})
