import { useCallback, useEffect, useState } from 'react';
import { matchRoute } from './matchRoute';
import { DEFAULT_APP_ID, getAppById, getAppForPath, getPersistedAppId, persistAppId } from '../apps.config';
import { browserHref, currentPath, destination } from './location';
export { linkHref } from './location';

type NavigationOptions = { replace?: boolean; appId?: string };

export function useRouter() {
  const [logicalPath, setLogicalPath] = useState(currentPath);

  useEffect(() => {
    const sync = () => {
      let path = currentPath();
      // Only a bare root uses the saved app. Keep unknown addresses intact.
      if (path.split('?')[0] === '/') {
        const app = getAppById(getPersistedAppId()) || getAppById(DEFAULT_APP_ID)!;
        path = app.defaultPath + path.slice(1);
        history.replaceState({}, '', browserHref(path));
      }
      setLogicalPath(path);
    };
    sync();
    window.addEventListener('popstate', sync);
    window.addEventListener('hashchange', sync);
    return () => {
      window.removeEventListener('popstate', sync);
      window.removeEventListener('hashchange', sync);
    };
  }, []);

  const pathname = logicalPath.split('?')[0];
  const app = getAppForPath(pathname);
  const matched = matchRoute(pathname);
  const title = matched
    ? typeof matched.route.title === 'function' ? matched.route.title(matched.params) : matched.route.title
    : 'Page Not Found';

  useEffect(() => {
    if (app) persistAppId(app.id);
    document.title = title;
  }, [app, title]);

  const navigate = useCallback((path: string, options: NavigationOptions = {}) => {
    const next = destination(path, options.appId);
    if (next === currentPath()) return;
    if (options.replace) history.replaceState({}, '', browserHref(next));
    else history.pushState({}, '', browserHref(next));
    setLogicalPath(currentPath());
  }, []);

  return {
    logicalPath,
    route: matched?.route ?? null,
    params: matched?.params ?? {},
    app,
    notFound: !matched,
    navigate,
  };
}
