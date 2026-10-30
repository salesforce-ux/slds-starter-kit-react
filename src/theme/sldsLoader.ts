// Runtime SLDS 1 ↔ SLDS 2 stylesheet loader — the React port of the LWC app's
// `src/build/slds-loader.js`. SLDS global stylesheets are attached as
// `<link rel="stylesheet">` tags and the active one is toggled via the link's
// `media` attribute (`media="all"` → applied, `media="not all"` → present but
// inert). SLDS 2 (Cosmos) is always inserted at startup; SLDS 1 is inserted
// lazily the first time it's needed (mirrors the LWC loader's lazy chunk).
//
// The URLs come from Vite `?url` imports: this hands back the built asset URL
// (hashed in prod, served from node_modules in dev) WITHOUT injecting the CSS
// the way a bare `import '...css'` would — injection can't be toggled, which is
// the whole point of doing this at runtime.
import slds2Url from '@salesforce-ux/design-system-2/dist/css/bundled/slds2.cosmos.css?url';
import slds1Url from '@salesforce-ux/design-system/assets/styles/salesforce-lightning-design-system.min.css?url';

export const STORAGE_KEY_SLDS_VERSION = 'slds-ui-slds-version';

export type SldsVersion = 1 | 2;

// `data-slds` keys match the LWC loader so the two apps behave identically.
const SLDS2_KEY = 'slds-plus';
const SLDS1_KEY = 'salesforce-lightning-design-system';

function getLink(key: string): HTMLLinkElement | null {
  return document.querySelector(`link[data-slds="${key}"]`);
}

function ensureLink(key: string, href: string, media = 'not all'): HTMLLinkElement {
  let link = getLink(key);
  if (!link) {
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.media = media;
    link.setAttribute('data-slds', key);
    link.href = href;
    // Prepend so the SLDS global sheet sits *before* the app's bundled CSS
    // (global.css / shell.css / page styles) in the cascade — the same order
    // as when slds2.cosmos.css was the first bare `import` in main.tsx. A
    // trailing appendChild would flip specificity ties and shift layout.
    document.head.insertBefore(link, document.head.firstChild);
  } else if (href && link.getAttribute('href') !== href) {
    link.href = href;
  }
  return link;
}

function ensureSlds1(): HTMLLinkElement {
  return ensureLink(SLDS1_KEY, slds1Url);
}

/**
 * Bootstrap: insert the SLDS 2 link, and if storage says the last session used
 * SLDS 1, also insert SLDS 1 and swap the applied sheet. Call once before React
 * mounts (see main.tsx) so the correct stylesheet is live on first paint.
 */
export function initSldsFromStorage(): void {
  const saved = localStorage.getItem(STORAGE_KEY_SLDS_VERSION);
  if (saved === '1') {
    const slds2 = ensureLink(SLDS2_KEY, slds2Url);
    const slds1 = ensureSlds1();
    slds1.media = 'all';
    slds2.media = 'not all';
  } else {
    ensureLink(SLDS2_KEY, slds2Url, 'all');
  }
}

export function activateSLDS2(): void {
  const slds2 = getLink(SLDS2_KEY);
  const slds1 = getLink(SLDS1_KEY);
  if (slds2) slds2.media = 'all';
  if (slds1) slds1.media = 'not all';
}

export function activateSLDS1(): void {
  const slds1 = ensureSlds1();
  const slds2 = getLink(SLDS2_KEY);
  if (slds2) slds2.media = 'not all';
  slds1.media = 'all';
}

/**
 * Reflects which sheet is currently applied. Defaults to SLDS 2 (the app's
 * default design system) — SLDS 1 is reported only when its sheet is actually
 * applied AND SLDS 2's is not, so the absence of any inserted link (e.g. before
 * `initSldsFromStorage`, or under tests) still reads as SLDS 2 rather than
 * falling through to 1.
 */
export function activeSLDSVersion(): SldsVersion {
  const slds1 = getLink(SLDS1_KEY);
  const slds2 = getLink(SLDS2_KEY);
  const slds1Applied = !!slds1 && slds1.media !== 'not all';
  const slds2Applied = !slds2 || slds2.media !== 'not all';
  return slds1Applied && !slds2Applied ? 1 : 2;
}

/** Swap the applied sheet and persist the choice (LWC key/values). */
export function setSldsVersion(version: SldsVersion): void {
  if (version === 1) activateSLDS1();
  else activateSLDS2();
  localStorage.setItem(STORAGE_KEY_SLDS_VERSION, String(version));
}
