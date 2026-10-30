import { routes, type RouteConfig } from '../routes.config';
import { getAppForPath, stripAppPrefix, type AppConfig } from '../apps.config';

export function matchRoute(
  logicalPath: string
): { route: RouteConfig; params: Record<string, string>; app: AppConfig } | null {
  const app = getAppForPath(logicalPath);
  if (!app) return null;
  // Builder owns its entire prefix as one focused experience.
  const subPath = app.variant === 'builder' ? '/' : stripAppPrefix(logicalPath, app);
  const candidates = [
    ...routes.filter((r) => r.app === app.id),
    ...routes.filter((r) => !r.app),
  ];
  for (const route of candidates) {
    const keys: string[] = [];
    const pattern = route.path.replace(/:([^/]+)/g, (_m, name: string) => {
      keys.push(name);
      return '([^/]+)';
    });
    const re = new RegExp(`^${pattern}$`);
    const match = subPath.match(re);
    if (match) {
      const params: Record<string, string> = {};
      keys.forEach((k, i) => (params[k] = match[i + 1]));
      return { route, params, app };
    }
  }
  return null;
}
