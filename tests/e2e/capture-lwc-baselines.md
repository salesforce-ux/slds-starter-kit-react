# Capturing LWC baselines for Home visual regression

`tests/e2e/__baselines__/home-light.png` and `home-dark.png` are screenshots of
the **original LWC app** (`../slds-starter-kit-lwc`, a clone of [salesforce-ux/slds-starter-kit-lwc](https://github.com/salesforce-ux/slds-starter-kit-lwc)), captured at
1280×900. `tests/e2e/home.spec.ts` diffs the React app's Home page against
these with `expect(page).toHaveScreenshot(...)`.

## Procedure

1. In the LWC repo, install deps (if not already) and start the dev server:

   ```bash
   cd ../slds-starter-kit-lwc
   npm install
   npm run dev
   ```

   Vite picks the first free port starting at 3000; if the React app's dev
   server is already running on 3000, the LWC app will come up on 3001 (or
   the next free port) and print its URL. The Home route is `/app` in both
   apps (`apps.config.js` pathPrefix `/app` for the "standard" app; `routes.config.js`
   maps `path: '/'` → `navPage: 'home'`).

2. Dark mode: the LWC app's **current** preference key is
   `slds-ui-color-mode` (see `src/modules/shell/app/app.js`,
   `STORAGE_KEY_COLOR_MODE`), accepting `'light' | 'dark' | 'system'`. There
   is also a legacy `slds-ui-dark-mode` key, but it's only read once as a
   migration and only recognizes the strings `'true'`/`'false'` — setting it
   to `'dark'` does **not** enable dark mode. Do not confuse it with the
   React app's `slds-ui-dark-mode` key (Task 5's `useColorMode`), which
   stores the mode value directly and is a deliberate simplification, not a
   port of the LWC key. Use `localStorage.setItem('slds-ui-color-mode', 'dark')`
   against the LWC app, then reload.

3. Using a throwaway Playwright script (not committed — see below), against
   the LWC dev URL from step 1:
   - Launch Chromium, open a page at viewport 1280×900.
   - `goto('http://localhost:<port>/app')`, wait for `networkidle`, screenshot
     to `tests/e2e/__baselines__/home-light.png`.
   - `page.evaluate(() => localStorage.setItem('slds-ui-color-mode', 'dark'))`,
     `page.reload()`, wait for `networkidle`, screenshot to
     `tests/e2e/__baselines__/home-dark.png`.

   Example script (run with `node` from the React repo root, so
   `@playwright/test` resolves; delete afterwards — it's a one-off capture
   tool, not part of the test suite):

   ```js
   import { chromium } from '@playwright/test';

   const OUT_DIR = './tests/e2e/__baselines__';
   const browser = await chromium.launch();
   const page = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage();

   await page.goto('http://localhost:3001/app');
   await page.waitForLoadState('networkidle');
   await page.screenshot({ path: `${OUT_DIR}/home-light.png` });

   await page.evaluate(() => localStorage.setItem('slds-ui-color-mode', 'dark'));
   await page.reload();
   await page.waitForLoadState('networkidle');
   await page.screenshot({ path: `${OUT_DIR}/home-dark.png` });

   await browser.close();
   ```

4. Commit the two PNGs under `tests/e2e/__baselines__/`.

## Re-capturing

Re-run this procedure whenever the LWC Home page's markup/styling changes
upstream. `tests/e2e/home.spec.ts` will start failing its diff otherwise —
that's the signal to re-capture.
