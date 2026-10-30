import { afterEach, expect, test, vi } from 'vitest';
import { shouldHandleLink } from './location';

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

for (const mode of ['hash', '']) {
  test(`${mode || 'path'} links preserve app, query and deployment base`, async () => {
    vi.stubEnv('VITE_ROUTER_MODE', mode);
    vi.stubEnv('BASE_URL', '/kit/');
    vi.resetModules();
    const { linkHref, currentPath } = await import('./location');
    history.replaceState({}, '', mode ? '/kit/#/console/contacts?x=1' : '/kit/console/contacts?x=1');
    expect(currentPath()).toBe('/console/contacts?x=1');
    expect(linkHref('/icons')).toBe(mode ? '#/console/icons' : '/kit/console/icons');
    expect(linkHref('/builder')).toBe(mode ? '#/builder' : '/kit/builder');
    for (const path of ['https://example.test', '//example.test', '/\\example.test']) {
      expect(() => linkHref(path)).toThrow();
    }
  });
}

test('only ordinary links are intercepted', () => {
  const anchor = document.createElement('a');
  const event = { defaultPrevented: false, button: 0, metaKey: false, ctrlKey: false,
    shiftKey: false, altKey: false, currentTarget: anchor };
  expect(shouldHandleLink(event)).toBe(true);
  for (const key of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey', 'defaultPrevented']) {
    expect(shouldHandleLink({ ...event, [key]: true })).toBe(false);
  }
  expect(shouldHandleLink({ ...event, button: 1 })).toBe(false);
  anchor.target = '_blank';
  expect(shouldHandleLink(event)).toBe(false);
  anchor.target = '';
  anchor.setAttribute('download', '');
  expect(shouldHandleLink(event)).toBe(false);
});

test('malformed incoming hashes are readable and never treated as Console', async () => {
  vi.stubEnv('VITE_ROUTER_MODE', 'hash');
  vi.resetModules();
  const { currentPath } = await import('./location');
  const { matchRoute } = await import('./matchRoute');
  for (const address of ['//console/contacts', 'https://example.test', '/\\example.test']) {
    history.replaceState({}, '', '/#' + address);
    expect(matchRoute(currentPath())).toBeNull();
  }
});
