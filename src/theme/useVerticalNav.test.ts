import { act, renderHook } from '@testing-library/react';
import { beforeEach, expect, test } from 'vitest';
import { useVerticalNav } from './useVerticalNav';

beforeEach(() => localStorage.clear());

test('defaults to false', () => {
  const { result } = renderHook(() => useVerticalNav());
  expect(result.current.verticalNav).toBe(false);
});

test('reads persisted true', () => {
  localStorage.setItem('slds-ui-vertical-nav', 'true');
  const { result } = renderHook(() => useVerticalNav());
  expect(result.current.verticalNav).toBe(true);
});

test('setVerticalNav persists', () => {
  const { result } = renderHook(() => useVerticalNav());
  act(() => result.current.setVerticalNav(true));
  expect(result.current.verticalNav).toBe(true);
  expect(localStorage.getItem('slds-ui-vertical-nav')).toBe('true');
});
