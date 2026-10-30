import { act, renderHook } from '@testing-library/react';
import { useRouter } from './useRouter';

beforeEach(() => { localStorage.clear(); history.replaceState({}, '', '/app'); });

test('exposes the matched route for the current URL', () => {
  history.replaceState({}, '', '/app/contacts');
  const { result } = renderHook(() => useRouter());
  expect(result.current.route?.component).toBe('page-contacts');
});

test('navigate pushes a new URL and updates the route', () => {
  const { result } = renderHook(() => useRouter());
  act(() => result.current.navigate('/contacts'));
  expect(window.location.pathname).toBe('/app/contacts');
  expect(result.current.route?.component).toBe('page-contacts');
});

test('navigate sets document.title from the route title', () => {
  const { result } = renderHook(() => useRouter());
  act(() => result.current.navigate('/contacts'));
  expect(document.title).toBe('Contacts');
});

test('redirects a bare "/" into the active app default path', () => {
  history.replaceState({}, '', '/');
  const { result } = renderHook(() => useRouter());
  expect(window.location.pathname).toBe('/app');
  expect(result.current.route?.component).toBe('page-home');
});

test('unknown Console URLs keep the app and set a missing-page title', () => {
  history.replaceState({}, '', '/console/missing');
  const { result } = renderHook(() => useRouter());
  expect(result.current.app?.id).toBe('console');
  expect(result.current.route).toBeNull();
  expect(document.title).toBe('Page Not Found');
});

test('unknown unprefixed URLs do not redirect to saved preferences', () => {
  localStorage.setItem('shell-current-app', 'console');
  history.replaceState({}, '', '/typo');
  const { result } = renderHook(() => useRouter());
  expect(location.pathname).toBe('/typo');
  expect(result.current.notFound).toBe(true);
});

test('navigation follows the URL even when the saved preference changes', () => {
  history.replaceState({}, '', '/console');
  const { result } = renderHook(() => useRouter());
  localStorage.setItem('shell-current-app', 'standard');
  act(() => result.current.navigate('/contacts'));
  expect(location.pathname).toBe('/console/contacts');
});

test('repeated navigation adds no history entry and replace does not push', () => {
  const { result } = renderHook(() => useRouter());
  const originalLength = history.length;
  act(() => result.current.navigate('/contacts'));
  expect(history.length).toBe(originalLength + 1);
  act(() => result.current.navigate('/contacts'));
  expect(history.length).toBe(originalLength + 1);
  act(() => result.current.navigate('/icons', { replace: true }));
  expect(history.length).toBe(originalLength + 1);
  expect(result.current.route?.component).toBe('page-icon-test');
});

test('popstate updates the owning app and page', () => {
  const { result } = renderHook(() => useRouter());
  act(() => {
    history.replaceState({}, '', '/console/contacts/42');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  expect(result.current.app?.id).toBe('console');
  expect(result.current.params.id).toBe('42');
});

test('root query is preserved when choosing the saved app', () => {
  localStorage.setItem('shell-current-app', 'console');
  history.replaceState({}, '', '/?campaign=x');
  renderHook(() => useRouter());
  expect(location.pathname + location.search).toBe('/console?campaign=x');
});
