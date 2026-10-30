# Development reference

Technical details for extending and publishing the starter kit. For getting started, see [README.md](../README.md).

## Project structure

| Path | Purpose |
|------|---------|
| `src/pages/` | Route views, registered by key in `src/pages/registry.tsx` |
| `src/ui/` | Reusable components and SLDS blueprints |
| `src/shell/` | App shell: global layout, header, panel, and profile menu |
| `src/theme/` | SLDS version, color mode, and vertical-nav hooks, plus the stylesheet loader |
| `src/data/` | Plain TypeScript helpers and fixtures |
| `src/styles/` | Component CSS |
| `src/routes.config.ts` | Route definitions and navigation metadata |
| `src/apps.config.ts` | Apps, page order, URL prefixes, and landing routes |
| `src/router/` | Route matching, path/hash URLs, and the `useRouter` hook |
| `src/main.tsx` | Theme initialization, icon settings, and app mounting |
| `tests/e2e/` | Playwright specs and screenshot baselines |
| `vite.config.ts` | Build, icon copying, dev server, and Vitest configuration |

Put feature pages in `pages/`, reusable components in `ui/`, and shell wiring in `shell/`.

## Add a page or component

1. Create `src/pages/<Name>.tsx`, such as `Dashboard.tsx`.
2. Register it in `src/pages/registry.tsx` under a key, such as `'page-dashboard': Dashboard`.
3. Add a route to `src/routes.config.ts`:

   ```ts
   { path: '/dashboard', component: 'page-dashboard', title: 'Dashboard', navPage: 'dashboard', navLabel: 'Dashboard' }
   ```

   No changes to `src/router/` are needed.
4. For a new feature or page, make its `navPage` first in each applicable app's `pages` array in `src/apps.config.ts`, and set that app's `defaultPath` to the app-prefixed route (for example, `/app/dashboard`). Keep existing pages as secondary tabs unless requested otherwise. Apps without primary navigation, such as Builder, are exempt.

For child routes, use `navHighlight: '<parentNavPage>'` instead of `navPage` to highlight the parent without adding a tab.

For reusable components, create `src/ui/<Name>.tsx` and import it where needed. Follow [AGENTS.md](../AGENTS.md) and any additional editor rules when present.

## Routing and apps

Routes use logical paths without app prefixes. Each entry has `path`, `component`, and `title`, plus optional `navPage`, `navLabel`, `navPath`, `navHighlight`, and `app` fields.

- `title` is a string or a function of route parameters.
- `:id` defines a path parameter; matched parameters are passed to the page component.
- `navPage` creates a navigation entry; `navLabel` supplies its label. `navPath` supplies a concrete navigation target for dynamic routes.
- `navHighlight` selects an existing parent entry, such as `contacts` for `/contacts/:id`.
- Call `navigate(path)` from `useRouter`. The shell renders the matching page without reloading. `navigate(path, { replace: true })` replaces the current history entry.
- Use `linkHref(path)` for anchors so links carry the app prefix and the right path or hash format, and keep modified clicks (such as open in new tab) working.

Each app in `src/apps.config.ts` declares its `pages` using route `navPage` ids:

| App | Navigation | URL prefix |
|-----|------------|------------|
| Standard | Tab bar | `/app` |
| Console | Object switcher | `/console` |
| Builder | Full-screen builder chrome | `/builder` |

The router strips and prepends the active app's prefix (`stripAppPrefix` / `withAppPrefix`). Pages can appear in multiple apps. Edit an app's `pages` array to change navigation; add an app with a unique `id`, `pathPrefix`, `variant`, and `defaultPath` to create another. The bare root redirects to the last-used app; unmatched routes show Page Not Found inside their app shell.

## Components and styles

Prefer `@salesforce/design-system-react` components, then SLDS utilities, then styling hooks. Import from the package root only. See [AGENTS.md](../AGENTS.md) for modal, form, and styling constraints.

For modals, use the DSR `Modal` with a controlled `isOpen` and a `footer` for actions. Follow `src/ui/BuilderSettingsModal.tsx` and the demo modal in `src/pages/Home.tsx`. Do not use raw SLDS modal markup.

DSR renders into the light DOM, so global SLDS styles apply directly. Put component-specific CSS in `src/styles/`.

### Themes

SLDS 2 (Cosmos) is the default. `src/main.tsx` calls `initSldsFromStorage()` from `src/theme/sldsLoader.ts` before mounting, restoring the saved theme.

The loader injects `<link rel="stylesheet" data-slds="...">` elements and switches sheets through `media="all"` or `media="not all"`. Stylesheet URLs come from Vite `?url` imports, so the CSS is emitted as hashed assets without being auto-injected:

- `@salesforce-ux/design-system-2`: SLDS 2/Cosmos, always loaded.
- `@salesforce-ux/design-system`: classic SLDS, loaded lazily when selected or restored from a saved preference.

Color mode (light, dark, or system) applies `.slds-color-scheme_dark` to `<body>` and is offered only under SLDS 2. Preferences persist in `localStorage` under `slds-ui-slds-version`, `slds-ui-color-mode`, `slds-ui-vertical-nav`, and `shell-current-app`.

### Icons

`vite-plugin-static-copy` copies the SLDS icon sprites into the build at `assets/node_modules/@salesforce-ux/design-system/assets/icons/`. `IconSettings.iconPath` in `src/main.tsx` points there, prefixed with the build base. If icons render blank, check that the two match.

## Testing

Run all three before considering a change done:

```bash
npm run build      # tsc -b + vite build; catches type errors the test runners miss
npm test           # Vitest unit/component tests, colocated as *.test.ts(x) in src/
npm run test:e2e   # Playwright visual-regression tests (starts the dev server)
```

Screenshot baselines live in `tests/e2e/__baselines__/`. If a visual change is intentional, re-capture them with `npm run test:e2e:update`. `npm run test:e2e:pages` checks navigation against the GitHub Pages build.

`tests/setup.ts` mocks `@floating-ui/dom`'s `autoUpdate`, and `vite.config.ts` raises the Vitest timeout, because DSR menu positioning is very slow under jsdom. Both are marked `TEMPORARY`; remove them once DSR fixes this upstream.

## GitHub Pages

Publish with `npm run deploy`. It runs `build:gh-pages` with hash routing, then pushes `dist/` to `gh-pages` on `origin` using [gh-pages](https://www.npmjs.com/package/gh-pages). This repository does not use GitHub Actions for Pages.

For first-time setup:

1. Configure Git push access to `origin`.
2. Run `npm run deploy` to create the remote `gh-pages` branch.
3. In GitHub **Settings → Pages → Build and deployment**, select **Deploy from a branch**, branch **gh-pages**, folder **/ (root)**, then save.

Find the published URL in **Settings → Pages** once publishing finishes. Run `npm run deploy` for subsequent updates. Project skills [repo-setup](../.agent/skills/repo-setup/SKILL.md) and [first-time-deploy](../.agent/skills/first-time-deploy/SKILL.md) guide repository creation and initial publishing.

`npm run dev` and `npm run build` use path URLs such as `/app/contacts`. Pages builds use hash URLs such as `…/your-repo/#/app/contacts` and relative asset paths, so one build works at a domain root or under a repository subpath, and refreshes and deep links work on static hosting. Path-only bookmarks such as `…/your-repo/app/contacts` still return 404 on Pages. To force an absolute asset base, set `DEPLOY_BASE`, for example `DEPLOY_BASE=/your-repo/ npm run build:gh-pages`.

To preview locally, run either `npm run build` for path routing or `npm run build:gh-pages` for Pages routing, then `npm run preview`. When hosting the path-routed build, configure the server to serve `index.html` for application routes.

For another target, publish a Pages build with `npx gh-pages -d dist -o <remote-name>` or `npx gh-pages -d dist -r https://github.com/org/repo.git`.

## Tooling and references

- `react` and `react-dom` (19), `typescript`, and `vite` provide the runtime, type checking, builds, and hot reload.
- `@salesforce/design-system-react` is pinned to an exact v11 alpha. Alphas can change APIs between releases (for example, alpha.5 renamed `DataTable` to `SimpleDataTable`). A `package.json` override aligns its SLDS dependency with the app's version.
- `@salesforce-ux/design-system` and `@salesforce-ux/design-system-2` supply SLDS 1 and SLDS 2 styles and icon sprites.
- [Vitest](https://vitest.dev) with Testing Library, and [Playwright](https://playwright.dev).
- Project skills live in `.agent/skills/<skill-id>/`.
- [Lightning Design System](https://lightningdesignsystem.com)
- [`design-system-react`](https://github.com/salesforce/design-system-react)
- [SLDS Starter Kit (LWC)](https://github.com/salesforce-ux/slds-starter-kit-lwc), the original this kit mirrors.
