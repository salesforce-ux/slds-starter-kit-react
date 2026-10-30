import { getAppForPath, stripAppPrefix, withAppPrefix, getAppById, DEFAULT_APP_ID } from './apps.config';

test('getAppForPath matches by longest prefix', () => {
  expect(getAppForPath('/app/contacts')?.id).toBe('standard');
  expect(getAppForPath('/console/home')?.id).toBe('console');
  expect(getAppForPath('/')).toBeNull();
});

test('stripAppPrefix returns "/" for bare prefix and strips otherwise', () => {
  const app = getAppById('standard')!;
  expect(stripAppPrefix('/app', app)).toBe('/');
  expect(stripAppPrefix('/app/contacts', app)).toBe('/contacts');
});

test('withAppPrefix prepends prefix, "/" becomes bare prefix', () => {
  const app = getAppById('standard')!;
  expect(withAppPrefix('/', app)).toBe('/app');
  expect(withAppPrefix('/contacts', app)).toBe('/app/contacts');
});

test('DEFAULT_APP_ID is standard', () => {
  expect(DEFAULT_APP_ID).toBe('standard');
});
