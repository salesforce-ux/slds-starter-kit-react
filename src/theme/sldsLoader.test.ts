import { beforeEach, expect, test } from 'vitest';
import {
  STORAGE_KEY_SLDS_VERSION,
  activateSLDS1,
  activateSLDS2,
  activeSLDSVersion,
  initSldsFromStorage,
  setSldsVersion,
} from './sldsLoader';

// The loader manages real <link data-slds> tags on document.head, so reset
// both storage and the head between tests to keep them independent.
beforeEach(() => {
  localStorage.clear();
  document.head.querySelectorAll('link[data-slds]').forEach((l) => l.remove());
});

const slds2 = () => document.querySelector('link[data-slds="slds-plus"]') as HTMLLinkElement | null;
const slds1 = () =>
  document.querySelector('link[data-slds="salesforce-lightning-design-system"]') as HTMLLinkElement | null;

test('initSldsFromStorage with no saved version inserts only SLDS 2, applied', () => {
  initSldsFromStorage();
  expect(slds2()).not.toBeNull();
  expect(slds2()!.media).toBe('all');
  // SLDS 1 is lazy — not inserted until needed.
  expect(slds1()).toBeNull();
  expect(activeSLDSVersion()).toBe(2);
});

test('initSldsFromStorage with saved "1" inserts both and applies SLDS 1', () => {
  localStorage.setItem(STORAGE_KEY_SLDS_VERSION, '1');
  initSldsFromStorage();
  expect(slds2()!.media).toBe('not all');
  expect(slds1()!.media).toBe('all');
  expect(activeSLDSVersion()).toBe(1);
});

test('setSldsVersion(1) swaps applied sheet and persists', () => {
  initSldsFromStorage();
  setSldsVersion(1);
  expect(slds2()!.media).toBe('not all');
  expect(slds1()!.media).toBe('all');
  expect(activeSLDSVersion()).toBe(1);
  expect(localStorage.getItem(STORAGE_KEY_SLDS_VERSION)).toBe('1');
});

test('setSldsVersion(2) swaps back and persists', () => {
  initSldsFromStorage();
  setSldsVersion(1);
  setSldsVersion(2);
  expect(slds2()!.media).toBe('all');
  expect(slds1()!.media).toBe('not all');
  expect(activeSLDSVersion()).toBe(2);
  expect(localStorage.getItem(STORAGE_KEY_SLDS_VERSION)).toBe('2');
});

test('activate helpers toggle media without touching storage', () => {
  initSldsFromStorage();
  activateSLDS1();
  expect(activeSLDSVersion()).toBe(1);
  expect(localStorage.getItem(STORAGE_KEY_SLDS_VERSION)).toBeNull();
  activateSLDS2();
  expect(activeSLDSVersion()).toBe(2);
  expect(localStorage.getItem(STORAGE_KEY_SLDS_VERSION)).toBeNull();
});
