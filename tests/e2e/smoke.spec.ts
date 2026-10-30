import { test, expect } from '@playwright/test';

// React StrictMode logs legacy-lifecycle deprecation warnings as
// console.error for any component still using UNSAFE_componentWillMount /
// UNSAFE_componentWillReceiveProps / UNSAFE_componentWillUpdate. The vendored
// DSR fork's SLDSDataTable (first used on /app/contacts in Task 8) hits this.
// We can't patch the vendored `@salesforce/design-system-react` fork (it must
// stay a clean drop-in for the eventual npm-package swap) and we don't want
// to disable app-wide StrictMode to silence it. So we narrowly ignore only
// this known, third-party, React-authored deprecation shape when it names an
// SLDS/DSR component — every other console error (including app-code errors
// and any *other* kind of DSR warning) still fails the test.
const isKnownDsrStrictModeLifecycleWarning = (text: string) =>
  /UNSAFE_component(WillMount|WillReceiveProps|WillUpdate)/.test(text) && /SLDS/.test(text);

test('shell renders and navigation works without console errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.goto('/app');
  await expect(page.getByPlaceholder(/search/i)).toBeVisible();
  await page.getByRole('link', { name: /contacts/i }).click();
  await expect(page).toHaveURL(/\/app\/contacts/);
  const genuineErrors = errors.filter((e) => !isKnownDsrStrictModeLifecycleWarning(e));
  expect(genuineErrors).toEqual([]);
});
