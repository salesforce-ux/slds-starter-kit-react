import { act, renderHook } from '@testing-library/react';
import { beforeEach, expect, test } from 'vitest';
import { useSldsVersion } from './useSldsVersion';
import { STORAGE_KEY_SLDS_VERSION, initSldsFromStorage } from './sldsLoader';

beforeEach(() => {
  localStorage.clear();
  document.head.querySelectorAll('link[data-slds]').forEach((l) => l.remove());
});

test('defaults to SLDS 2 when only SLDS 2 is applied', () => {
  initSldsFromStorage();
  const { result } = renderHook(() => useSldsVersion());
  expect(result.current.sldsVersion).toBe(2);
});

test('reads persisted SLDS 1 on init', () => {
  localStorage.setItem(STORAGE_KEY_SLDS_VERSION, '1');
  initSldsFromStorage();
  const { result } = renderHook(() => useSldsVersion());
  expect(result.current.sldsVersion).toBe(1);
});

test('setSldsVersion swaps and persists', () => {
  initSldsFromStorage();
  const { result } = renderHook(() => useSldsVersion());
  act(() => result.current.setSldsVersion(1));
  expect(result.current.sldsVersion).toBe(1);
  expect(localStorage.getItem(STORAGE_KEY_SLDS_VERSION)).toBe('1');
  act(() => result.current.setSldsVersion(2));
  expect(result.current.sldsVersion).toBe(2);
  expect(localStorage.getItem(STORAGE_KEY_SLDS_VERSION)).toBe('2');
});
