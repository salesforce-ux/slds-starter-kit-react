# Agent guidelines: SLDS Starter Kit (React)

This repository is a **React recreation** of the [SLDS Starter Kit (LWC)](https://github.com/salesforce-ux/slds-starter-kit-lwc). It uses **React 19**, **TypeScript**, **Vite**, and **SLDS** via [`@salesforce/design-system-react`](https://github.com/salesforce/design-system-react) (DSR), with a small config-driven client-side router. The goal is semantic and visual parity with the LWC original. See [docs/development.md](docs/development.md) for the full development reference.

> This is a React app, not LWC. There are no `.html` templates, no synthetic shadow DOM, no `lightning-*` base components, and no `@salesforce/afv-skills` dependency. Do not apply LWC conventions here.

---

## Project-specific guidance

### Where to put code

- **Route-level views**: `src/pages/<Name>.tsx`. Register the component in `src/pages/registry.tsx` under the key used in the route's `component` field, then add the route to `src/routes.config.ts`. The router resolves the key to the component automatically; nothing in `src/router/` needs editing.
- **New features and pages are primary by default**: When the user requests a new feature or page, make it the primary navigation tab and initial landing page without asking for confirmation. Give it a `navPage`, place that id first in every applicable app's `pages` list in `src/apps.config.ts`, and set each applicable app's `defaultPath` to its app-prefixed route so it appears immediately on load. Keep existing pages as secondary tabs unless the user explicitly requests otherwise. Apps without primary navigation (e.g. the Builder app) are exempt.
- **Reusable UI / SLDS blueprints**: `src/ui/<Name>.tsx`. Use inside pages, the shell, or other components.
- **App shell**: `src/shell/<Name>.tsx` — root layout, header, nav, panel, profile menu. Not route views (those go in `pages/`) and not general reusable components (those go in `ui/`).
- **Theming state**: `src/theme/` — small hooks (`useColorMode`, `useSldsVersion`, `useVerticalNav`) plus the SLDS stylesheet loader (`sldsLoader.ts`).
- **Data / fixtures**: `src/data/`.

### Engineering habits

- **Prefer DSR components over hand-rolled SLDS markup.** When a `@salesforce/design-system-react` component exists for what you're building, use it (e.g. `Card`, `Button`, `Icon`, `Modal`, `SimpleDataTable`, `PageHeader`) instead of reconstructing the `slds-*` blueprint by hand. Only hand-roll a blueprint when no DSR component covers the case — and say so when you do.
- **Import DSR from its public root exports only** (`@salesforce/design-system-react`). Do not reach into internal/deep paths; the app is meant to swap to the official npm package with no source changes.
- Prefer small, single-responsibility components and readable structure.
- Do not use `!important`.
- Avoid inline `style` attributes; use a CSS file in `src/styles/` or SLDS utility classes. A few LWC visuals that relied on shadow encapsulation are reproduced with explicit CSS there — follow that pattern rather than inline styles.
- After changing presentation, verify against the LWC original where parity matters. Known, accepted DSR-vs-LWC cosmetic differences are documented inline in code; don't re-litigate those.

### Modals

Use the DSR `Modal` component. See `src/ui/BuilderSettingsModal.tsx` and the demo modal in `src/pages/Home.tsx` for the structure (controlled `isOpen`, `footer` prop for actions). Do not build modals from raw `slds-modal` markup.

### Forms

Use DSR form components (`Input`, `Combobox`, `Checkbox`, `Radio`, `Textarea`, `DatePicker`, etc.) rather than raw `<input>`/`<select>`/`<textarea>`. Use the correct input `type` and read-only rendering for data display. Note this DSR version's quirks documented in code (e.g. `Textarea` has no `readOnly` — use static fields for display).

### Routing

- Routes live in `src/routes.config.ts` as `{ path, component, title, navPage?, navLabel?, navPath?, navHighlight?, app? }`. `component` is a string key resolved in `src/pages/registry.tsx`.
- Path params use `:id` (e.g. `/contacts/:id`) and are passed to the page component.
- Only routes with `navPage` create a nav entry; child routes use `navHighlight` to light up a parent tab.
- Navigate with `navigate(path)` from `useRouter` (`src/router/`). Use `linkHref(path)` for anchors and preserve modified clicks. Pages builds use hash routing — never hard-code the base path in components.

### Apps

Three app modes in `src/apps.config.ts`: **Standard** (tabs, `/app`), **Console** (object switcher, `/console`), **Builder** (full-screen, `/builder`). Routes stay logical (un-prefixed); the router strips/prepends the active app's prefix (`stripAppPrefix`/`withAppPrefix`).

### Theming

SLDS 2 (Cosmos) is the default; SLDS 1 loads lazily on demand. Theme swap is handled by `src/theme/sldsLoader.ts` (toggles `<link data-slds>` sheets via the `media` attribute). Color mode adds `.slds-color-scheme_dark` on `<body>` and is only available under SLDS 2. Preferences persist under `slds-ui-slds-version`, `slds-ui-color-mode`, `slds-ui-vertical-nav`, and `shell-current-app`.

### Icons

SLDS sprites are copied by `vite-plugin-static-copy` and served at `/assets/node_modules/@salesforce-ux/design-system/assets/icons/**`. `IconSettings.iconPath` in `src/main.tsx` is set to match and is prefixed with the build base path. There is no icon codegen step. If icons render blank, check that `iconPath` matches the served sprite path.

### Testing — always run all three before considering work done

```bash
npm run build      # tsc -b + vite build — catches type errors the runners miss
npm test           # Vitest unit/component tests (colocated *.test.ts[x] in src/)
npm run test:e2e   # Playwright visual-regression (baselines in tests/e2e/__baselines__)
```

`npm test` and `npm run test:e2e` do **not** run `tsc`. Run `npm run build` too — a passing test run with a type error has shipped here before. If a visual change is intentional, re-baseline with `npm run test:e2e:update` and note why.

### Dependency note

`@salesforce/design-system-react` is pinned to an exact **v11 alpha** from npm (alphas can break between releases — e.g. alpha.5 renamed `DataTable` to `SimpleDataTable`). `npm install` may need `--legacy-peer-deps`. The package can't be patched from here — work around its quirks in app code (documented inline where they bite).

### Skills

| Skill path | Use |
|------------|-----|
| `.agent/skills/repo-setup/SKILL.md` | Saving or backing up work: host detection, prerequisites, repository creation, and initial push. |
| `.agent/skills/first-time-deploy/SKILL.md` | First GitHub Pages deployment or sharing a published link. For repeat deployments, run `npm run deploy`. |

### GitHub Pages

Publish only through `npm run deploy`: it runs `build:gh-pages` with hash routing and relative asset paths, and pushes `dist/` to `gh-pages` on `origin`. `npm run dev` and `npm run build` retain path routing. GitHub Pages must use **Deploy from a branch → gh-pages**; see [docs/development.md](docs/development.md#github-pages).

When asked about another push target, mention `gh-pages` options `-o <remote>` and `-r <url>`.
