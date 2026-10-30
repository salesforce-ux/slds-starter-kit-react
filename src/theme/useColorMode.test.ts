import { renderHook } from '@testing-library/react';
import { beforeEach, expect, test } from 'vitest';
import { useColorMode } from './useColorMode';

beforeEach(() => { localStorage.clear(); document.body.className = ''; });

test('reads the canonical slds-ui-color-mode key', () => {
  localStorage.setItem('slds-ui-color-mode', 'dark');
  const { result } = renderHook(() => useColorMode());
  expect(result.current.colorMode).toBe('dark');
});

test('migrates a legacy mode-string under slds-ui-dark-mode', () => {
  localStorage.setItem('slds-ui-dark-mode', 'dark');
  const { result } = renderHook(() => useColorMode());
  expect(result.current.colorMode).toBe('dark');
  expect(localStorage.getItem('slds-ui-color-mode')).toBe('dark');
  expect(localStorage.getItem('slds-ui-dark-mode')).toBeNull();
});

test('migrates legacy boolean "true"/"false" from LWC format', () => {
  localStorage.setItem('slds-ui-dark-mode', 'true');
  const { result } = renderHook(() => useColorMode());
  expect(result.current.colorMode).toBe('dark');
  expect(localStorage.getItem('slds-ui-color-mode')).toBe('dark');
});

test('defaults to light when nothing stored', () => {
  const { result } = renderHook(() => useColorMode());
  expect(result.current.colorMode).toBe('light');
});
