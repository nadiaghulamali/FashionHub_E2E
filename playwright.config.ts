import { defineConfig, devices } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load ENV
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

// Load after env
import { Config } from './src/config/envLoader';

// BASE URL validation
if (!Config.baseUrl) {
  throw new Error(`BASE URL is missing for environment: ${Config.environment}`);
}

// Local debug slow mode
const isSlow = process.env.PLAYWRIGHT_SLOW === 'true';

// Detect Docker or CI
const isDocker = process.env.DOCKER === 'true';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? '50%' : undefined,

  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  // Excel generation
  globalTeardown: './global-teardown.ts',

  use: {
    baseURL: Config.baseUrl,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    actionTimeout: 15000,

    // Headless ALWAYS when Docker/CI to avoid X11 errors
    headless: isDocker || isCI ? true : !(isSlow || process.env.EXECUTE_TYPE === 'local'),

    launchOptions: {
      slowMo: isSlow ? 400 : 0,
    },
  },

  // Run all 3 browsers
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'WebKit',
      use: { ...devices['Desktop Safari'] }
    }
  ],

  outputDir: 'test-results/',
});
