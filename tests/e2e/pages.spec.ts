import { test, expect } from '@playwright/test';

// Self-regression guard (see home.spec.ts for the full rationale): baselines
// captured from THIS app's own corrected render, not cross-framework LWC
// parity. Same tolerance as home.spec.ts.
const DIFF = { maxDiffPixelRatio: 0.01, threshold: 0.2 };

test('Icons page render', async ({ page }) => {
  await page.goto('/app/icons');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('icons.png', DIFF);
});

test('Contacts page render', async ({ page }) => {
  await page.goto('/app/contacts');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('contacts.png', DIFF);
});

test('Contacts page render — dark', async ({ page }) => {
  // Guards the Dark-mode table parity fixes (C19 themed name links, C21 muted
  // body/row-number text, C23 white standard-icon glyph) that the Light
  // baseline can't see.
  await page.addInitScript(() => localStorage.setItem('slds-ui-color-mode', 'dark'));
  await page.goto('/app/contacts');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('contacts-dark.png', DIFF);
});

test('Contact detail (record-home) render', async ({ page }) => {
  await page.goto('/app/contacts/1');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('contact-detail.png', DIFF);
});

test('Home with a docked panel open', async ({ page }) => {
  // Guards the A01 docked-panel layout: the panel occupies the right edge and
  // narrows the content area.
  await page.goto('/app');
  await page.waitForLoadState('networkidle');
  await page.getByRole('button', { name: 'Agentforce' }).click();
  await expect(page.getByRole('complementary', { name: 'Agentforce' })).toBeVisible();
  await expect(page).toHaveScreenshot('home-panel-open.png', DIFF);
});

test('Console app (object switcher) shell render', async ({ page }) => {
  await page.goto('/console');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('console-shell.png', DIFF);
});

test('Builder app (full-screen) render', async ({ page }) => {
  await page.goto('/builder');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('builder.png', DIFF);
});

test('Vertical nav shell render', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('slds-ui-vertical-nav', 'true'));
  await page.goto('/app');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('shell-vertical-nav.png', DIFF);
});
