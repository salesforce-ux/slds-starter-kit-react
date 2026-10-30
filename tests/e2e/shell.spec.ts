import { test, expect } from '@playwright/test';

// Browser-level guard for the shell dropdowns. The DSR `Dropdown`
// (MenuDropdown) will not open in `npm run dev` when the app is wrapped in
// React.StrictMode — its `triggerRendered` state does not survive
// StrictMode's dev double-mount, so `isOpen` never becomes true (see
// src/main.tsx). jsdom unit tests do NOT catch this: they render <App/>
// without StrictMode. These tests run against the real dev server, so they
// fail if StrictMode is ever restored around the app.

test('profile menu opens, applies a selection, and stays open for the next', async ({ page }) => {
  await page.addInitScript(() => localStorage.clear());
  await page.goto('/app');
  await page.waitForLoadState('networkidle');

  // Opens on trigger click.
  await page.getByRole('button', { name: /open profile menu/i }).click();
  await expect(page.getByRole('menuitem', { name: 'Dark' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Enabled' })).toBeVisible();

  // Selecting a row applies the change AND leaves the menu open so another
  // setting can be changed immediately (parity A07). DSR flips the selected
  // row's role from menuitem → menuitemcheckbox, so after picking Dark assert
  // it's still present as the *checked* row (proving the menu stayed open)
  // rather than re-querying it as a plain menuitem.
  await page.getByRole('menuitem', { name: 'Dark' }).click();
  await expect
    .poll(() => page.evaluate(() => document.body.classList.contains('slds-color-scheme_dark')))
    .toBe(true);
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(page.getByRole('menuitemcheckbox', { name: 'Dark' })).toBeVisible();

  // A second selection in the still-open menu also applies.
  await page.getByRole('menuitem', { name: 'Enabled' }).click();
  await expect
    .poll(() => page.evaluate(() => localStorage.getItem('slds-ui-vertical-nav')))
    .toBe('true');
});

test('global-header buttons open, switch, and close their docked panels', async ({ page }) => {
  await page.goto('/app');
  await page.waitForLoadState('networkidle');

  const panel = page.getByRole('complementary', { name: 'Agentforce' });
  await expect(panel).toHaveCount(0);

  // Agentforce opens its docked panel with a heading + close control (A01).
  await page.getByRole('button', { name: 'Agentforce' }).click();
  await expect(page.getByRole('complementary', { name: 'Agentforce' })).toBeVisible();
  await expect(page.getByRole('button', { name: /collapse agentforce/i })).toBeVisible();

  // Clicking a different header button switches to that panel.
  await page.getByRole('button', { name: 'Notifications' }).click();
  await expect(page.getByRole('complementary', { name: 'Agentforce' })).toHaveCount(0);
  await expect(page.getByRole('complementary', { name: 'Notifications' })).toBeVisible();

  // The close control dismisses the panel.
  await page.getByRole('button', { name: /collapse notifications/i }).click();
  await expect(page.getByRole('complementary', { name: 'Notifications' })).toHaveCount(0);
});

test('header and navigation stay visible when the page body scrolls', async ({ page }) => {
  await page.goto('/app');
  await page.waitForLoadState('networkidle');

  const header = page.locator('.slds-global-header');
  const nav = page.locator('.slds-context-bar').first();
  const topBefore = await header.evaluate((el) => el.getBoundingClientRect().top);

  // The page body is the scroll container (parity A02), not the window.
  await page.locator('.app-body').evaluate((el) => {
    el.scrollTop = 600;
  });
  await expect.poll(() => page.locator('.app-body').evaluate((el) => el.scrollTop)).toBeGreaterThan(100);

  // Header + nav have not moved off the top after scrolling.
  expect(await header.evaluate((el) => el.getBoundingClientRect().top)).toBe(topBefore);
  await expect(nav).toBeInViewport();
});

test('waffle app launcher opens', async ({ page }) => {
  await page.goto('/app');
  await page.waitForLoadState('networkidle');

  await page.getByRole('button', { name: /app launcher/i }).click();
  // The launcher lists the configured apps as menu items.
  await expect(page.locator('[role^="menuitem"]').first()).toBeVisible();
});
