import { matchRoute } from './matchRoute';

test('matches a static route within the standard app', () => {
  const m = matchRoute('/app/contacts');
  expect(m?.route.component).toBe('page-contacts');
  expect(m?.app.id).toBe('standard');
});

test('extracts :id param', () => {
  const m = matchRoute('/app/contacts/42');
  expect(m?.route.component).toBe('page-contact-detail');
  expect(m?.params.id).toBe('42');
});

test('returns null when no app prefix matches', () => {
  expect(matchRoute('/')).toBeNull();
});

test.each(['/builder', '/builder/missing', '/builder/contacts'])('Builder resolves to its focused experience: %s', (path) => {
  const matched = matchRoute(path);
  expect(matched?.route.component).toBe('page-builder');
  expect(matched?.route.title).toBe('Builder');
  expect(matched?.app.id).toBe('builder');
});
