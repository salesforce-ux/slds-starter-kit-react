import { act, renderHook } from '@testing-library/react';
import { useColorMode } from './useColorMode';

beforeEach(() => {
  localStorage.clear();
  document.body.className = '';
});

test('defaults to light with no dark class', () => {
  const { result } = renderHook(() => useColorMode());
  expect(result.current.colorMode).toBe('light');
  expect(document.body.classList.contains('slds-color-scheme_dark')).toBe(false);
});

test('setting dark adds the body class and persists', () => {
  const { result } = renderHook(() => useColorMode());
  act(() => result.current.setColorMode('dark'));
  expect(document.body.classList.contains('slds-color-scheme_dark')).toBe(true);
  expect(localStorage.getItem('slds-ui-color-mode')).toBe('dark');
});

test('restores persisted mode on mount', () => {
  localStorage.setItem('slds-ui-color-mode', 'dark');
  const { result } = renderHook(() => useColorMode());
  expect(result.current.colorMode).toBe('dark');
  expect(document.body.classList.contains('slds-color-scheme_dark')).toBe(true);
});

function stubMatchMedia(initialMatches: boolean) {
  let matches = initialMatches;
  const listeners = new Set<() => void>();
  const mql = {
    get matches() {
      return matches;
    },
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_type: string, cb: () => void) => {
      listeners.add(cb);
    },
    removeEventListener: (_type: string, cb: () => void) => {
      listeners.delete(cb);
    },
  };
  window.matchMedia = ((_query: string) => mql) as unknown as typeof window.matchMedia;
  return {
    set(next: boolean) {
      matches = next;
      listeners.forEach((cb) => cb());
    },
    listenerCount: () => listeners.size,
  };
}

test('system mode follows the OS preference and syncs on change', () => {
  const mm = stubMatchMedia(true);
  const { result, unmount } = renderHook(() => useColorMode());
  act(() => result.current.setColorMode('system'));
  expect(document.body.classList.contains('slds-color-scheme_dark')).toBe(true);

  // OS switches to light -> the subscribed listener updates the body class
  act(() => mm.set(false));
  expect(document.body.classList.contains('slds-color-scheme_dark')).toBe(false);

  // unmount removes the media-query listener (no leak)
  unmount();
  expect(mm.listenerCount()).toBe(0);
});

test('falls back to light for an invalid persisted value', () => {
  localStorage.setItem('slds-ui-color-mode', 'bogus');
  const { result } = renderHook(() => useColorMode());
  expect(result.current.colorMode).toBe('light');
});
