import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// Pages builds use a relative asset base, so one build works at a domain root
// or under any repo subpath (hash routes keep the document at index.html).
// Set DEPLOY_BASE to override it with an absolute base.
declare const process: { env: Record<string, string | undefined> };
const PAGES_BASE = process.env.DEPLOY_BASE || './';

export default defineConfig(({ mode }) => ({
  base: mode === 'gh-pages' ? PAGES_BASE : '/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          // Copies the SLDS icon sprites. NOTE: vite-plugin-static-copy v4
          // (bumped from v2 to support vite 7) recreates the full source path
          // under `dest`, so these are served at
          //   /assets/node_modules/@salesforce-ux/design-system/assets/icons/**
          // in BOTH dev and build — not /assets/icons/**. IconSettings.iconPath
          // in src/main.tsx is set to match. (v2 flattened to /assets/icons; the
          // plugin has no dest option to strip the node_modules/... prefix.)
          src: 'node_modules/@salesforce-ux/design-system/assets/icons',
          dest: 'assets',
        },
      ],
    }),
  ],
  server: { port: 3000 },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    // TEMPORARY (DSR PR #3195 / floating-ui migration): opening a DSR menu
    // Dialog runs @floating-ui/dom's computePosition, which leans on jsdom's
    // very slow getComputedStyle. Even with autoUpdate mocked (see
    // tests/setup.ts) a single menu-open can take several seconds in jsdom
    // (it is instant in a real browser). Raise the per-test timeout from the
    // 5s default so these menu tests don't spuriously time out. Revert to the
    // default once DSR's Dialog positioning is fixed upstream. See
    // tests/setup.ts for the full explanation.
    testTimeout: 60000,
  },
}));
