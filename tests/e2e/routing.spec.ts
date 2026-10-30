import { test, expect } from '@playwright/test';

const path = (value: string) => test.info().project.name === 'pages' ? `./#${value}` : value;

test('direct links, refresh, and missing pages preserve their app', async ({ page }) => {
  await page.goto(path('/console/contacts/1'));
  await expect(page.getByText('Console App', { exact: true })).toBeVisible();
  await expect(page).toHaveTitle('Contact 1');
  await page.reload();
  await expect(page).toHaveTitle('Contact 1');
  await page.goto(path('/console/missing'));
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
  await expect(page.getByRole('tab', { name: 'Page Not Found' })).toBeVisible();
  await page.getByRole('button', { name: 'Go to Home' }).click();
  await expect(page).toHaveURL(/(?:#|:\d+)\/console$/);
  for (const address of ['/builder', '/builder/missing', '/builder/contacts']) {
    await page.goto(path(address));
    await expect(page.getByLabel('Builder canvas')).toBeVisible();
    await expect(page).toHaveTitle('Builder');
    await page.reload();
    await expect(page.getByLabel('Builder canvas')).toBeVisible();
  }
});

test('real tab links support new tabs and avoid duplicate Back steps', async ({ page, context }) => {
  await page.goto(path('/app'));
  const contacts = page.getByRole('link', { name: 'Contacts', exact: true });
  await expect(contacts).toHaveAttribute('href', /(?:#)?\/app\/contacts$/);
  const popupPromise = context.waitForEvent('page');
  await contacts.click({ modifiers: ['ControlOrMeta'] });
  const popup = await popupPromise;
  await expect(popup).toHaveTitle('Contacts');
  await expect(page).toHaveTitle('Home');
  await popup.close();
  await contacts.click();
  await expect(page).toHaveTitle('Contacts');
  await contacts.click();
  await page.goBack();
  await expect(page).toHaveTitle('Home');
  await page.goForward();
  await expect(page).toHaveTitle('Contacts');
});

test('root query uses saved app and unknown URLs remain visible', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('shell-current-app', 'console'));
  await page.goto(path('/?campaign=x'));
  await expect(page).toHaveURL(/\/console\?campaign=x$/);
  await expect(page.getByText('Console App', { exact: true })).toBeVisible();
  await page.goto(path('/typo'));
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
  await expect(page).toHaveURL(/\/typo$/);
});

test('malformed hashes show the fallback instead of crashing', async ({ page }) => {
  test.skip(test.info().project.name !== 'pages', 'Hash deployment only');
  await page.goto('./#//console/contacts');
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
  await page.goto('./#https://example.test');
  await expect(page.getByRole('heading', { name: 'Page Not Found' })).toBeVisible();
});
