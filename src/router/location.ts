import { DEFAULT_APP_ID, getAppById, getAppForPath, withAppPrefix } from '../apps.config';

const HASH_MODE = import.meta.env.VITE_ROUTER_MODE === 'hash';
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function normalizePath(path: string): string {
  const [pathname, ...query] = path.split('?');
  const prefixed = pathname.startsWith('/') ? pathname : '/' + pathname;
  const normalized = prefixed.length > 1 ? prefixed.replace(/\/$/, '') : prefixed;
  return normalized + (query.length ? '?' + query.join('?') : '');
}

export function currentPath(): string {
  if (HASH_MODE) return normalizePath(window.location.hash.slice(1) || '/');
  let pathname = window.location.pathname;
  if (BASE && (pathname === BASE || pathname.startsWith(BASE + '/'))) {
    pathname = pathname.slice(BASE.length) || '/';
  }
  return normalizePath(pathname) + window.location.search;
}

export function browserHref(path: string): string {
  return HASH_MODE ? `#${path}` : BASE + path;
}

export function destination(path: string, appId?: string): string {
  if (path.startsWith('//') || /^[a-z][a-z\d+.-]*:/i.test(path) || path.includes('\\')) {
    throw new Error('Expected an internal route path');
  }
  const normalized = normalizePath(path);
  if (getAppForPath(normalized.split('?')[0])) return normalized;
  const app = (appId && getAppById(appId)) ||
    getAppForPath(currentPath().split('?')[0]) || getAppById(DEFAULT_APP_ID)!;
  return withAppPrefix(normalized, app);
}

export function linkHref(path: string, appId?: string): string {
  return browserHref(destination(path, appId));
}

/** Intercept only ordinary same-tab navigation. */
export function shouldHandleLink(event: {
  defaultPrevented: boolean; button: number;
  metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean;
  currentTarget: HTMLAnchorElement;
}): boolean {
  const anchor = event.currentTarget;
  return !event.defaultPrevented && event.button === 0 &&
    !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey &&
    (!anchor.target || anchor.target === '_self') && !anchor.hasAttribute('download');
}
