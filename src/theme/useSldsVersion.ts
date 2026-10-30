import { useCallback, useState } from 'react';
import {
  activeSLDSVersion,
  setSldsVersion as applySldsVersion,
  type SldsVersion,
} from './sldsLoader';

// Mirrors useColorMode/useVerticalNav. The initial value comes from the loader
// (which `initSldsFromStorage()` in main.tsx already reconciled with storage
// before mount), so `activeSLDSVersion()` reflects the live stylesheet.
export function useSldsVersion() {
  const [sldsVersion, setState] = useState<SldsVersion>(() => activeSLDSVersion());

  const setSldsVersion = useCallback((next: SldsVersion) => {
    applySldsVersion(next);
    setState(next);
  }, []);

  return { sldsVersion, setSldsVersion };
}

export type { SldsVersion };
