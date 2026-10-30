import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  snapshotDir: './tests/e2e/__baselines__',
  // Flat, platform-agnostic filenames so `toHaveScreenshot('home-light.png', ...)`
  // resolves to tests/e2e/__baselines__/home-light.png (matching the baselines
  // captured manually from the LWC app in capture-lwc-baselines.md), instead of
  // Playwright's default {testFile}-snapshots/{arg}-{project}-{platform}.png layout.
  snapshotPathTemplate: '{snapshotDir}/{arg}{ext}',
  fullyParallel: true,
  reporter: 'list',
  use: { baseURL: 'http://localhost:3000', viewport: { width: 1280, height: 900 } },
  // `devices['Desktop Chrome']` sets its own 1280x720 viewport, which
  // otherwise wins over the top-level `use.viewport` above (project-level
  // `use` is merged key-by-key over the global one). Re-assert 1280x900
  // here so screenshots actually come out at the size baselines were
  // captured at.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 900 } } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
