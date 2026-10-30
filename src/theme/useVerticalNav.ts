import { useCallback, useState } from 'react';

const STORAGE_KEY = 'slds-ui-vertical-nav';

function readStored(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function useVerticalNav() {
  const [verticalNav, setState] = useState<boolean>(readStored);

  const setVerticalNav = useCallback((next: boolean) => {
    try {
      localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      /* storage unavailable; non-fatal */
    }
    setState(next);
  }, []);

  return { verticalNav, setVerticalNav };
}
