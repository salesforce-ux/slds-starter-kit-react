import { defineConfig } from '@playwright/test';

declare const process: { env: Record<string, string | undefined> };
const base = process.env.DEPLOY_BASE || '/';
const baseURL = `http://localhost:4187${base}`;

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: 'routing.spec.ts',
  projects: [{ name: 'pages' }],
  use: { baseURL },
  webServer: {
    command: `npm run build:gh-pages && npm run preview -- --port 4187 --strictPort --base ${base}`,
    url: baseURL,
    reuseExistingServer: false,
  },
});
