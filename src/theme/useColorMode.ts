import { useCallback, useEffect, useState } from 'react';

export type ColorMode = 'light' | 'dark' | 'system';
const STORAGE_KEY = 'slds-ui-color-mode';
const LEGACY_KEY = 'slds-ui-dark-mode';
const SYSTEM_DARK_QUERY = '(prefers-color-scheme: dark)';

function coerce(v: string | null): ColorMode | null {
  if (v === 'dark' || v === 'light' || v === 'system') return v;
  if (v === 'true') return 'dark';
  if (v === 'false') return 'light';
  return null;
}

function readStored(): ColorMode {
  const current = coerce(localStorage.getItem(STORAGE_KEY));
  if (current) return current;
  // One-time migration off the legacy key (React app stored a mode string
  // there; the LWC app stored 'true'/'false' — coerce() handles both).
  const legacy = coerce(localStorage.getItem(LEGACY_KEY));
  if (legacy) {
    localStorage.setItem(STORAGE_KEY, legacy);
    localStorage.removeItem(LEGACY_KEY);
    return legacy;
  }
  return 'light';
}

function applyDark(isDark: boolean) {
  document.body.classList.toggle('slds-color-scheme_dark', isDark);
}

export function useColorMode() {
  const [colorMode, setMode] = useState<ColorMode>(readStored);

  useEffect(() => {
    if (colorMode === 'system') {
      const mq = window.matchMedia(SYSTEM_DARK_QUERY);
      const sync = () => applyDark(mq.matches);
      sync();
      mq.addEventListener('change', sync);
      return () => mq.removeEventListener('change', sync);
    }
    applyDark(colorMode === 'dark');
    return undefined;
  }, [colorMode]);

  const setColorMode = useCallback((m: ColorMode) => {
    localStorage.setItem(STORAGE_KEY, m);
    setMode(m);
  }, []);

  return { colorMode, setColorMode };
}
