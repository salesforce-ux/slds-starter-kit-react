import { test, expect } from '@playwright/test';

// Baselines are captured from THIS app's own corrected render (see
// __baselines__/home-*.png), making these a self-regression guard: they fail
// when the React output drifts from its known-good state. The prior LWC-captured
// baselines used a loose 0.08 tolerance to absorb the intentionally-descoped
// global-header chrome (app launcher, app name, action icons) — but that same
// slack silently masked a real regression where every SLDS icon rendered blank
// (a stale IconSettings.iconPath after the vite-plugin-static-copy v2->v4 bump).
// Cross-framework parity against the LWC app is verified manually during
// development, not by this gate. The tight ratio below catches large-area
// regressions (missing icons, wrong button shapes, badge colors) while the
// per-pixel threshold tolerates font/anti-aliasing jitter between runs.
// TODO: re-capture baselines from LWC and clip the header region if a
// cross-framework gate is wanted in addition to this self-regression one.
const DIFF = { maxDiffPixelRatio: 0.01, threshold: 0.2 };

test('Home matches known-good render — light', async ({ page }) => {
  await page.goto('/app');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('home-light.png', DIFF);
});

test('Home matches known-good render — dark', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('slds-ui-color-mode', 'dark'));
  await page.goto('/app');
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveScreenshot('home-dark.png', DIFF);
});
