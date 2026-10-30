import ReactDOM from 'react-dom/client';
import { IconSettings, Settings } from '@salesforce/design-system-react';
// SLDS global CSS is now loaded at runtime as <link> tags so the profile
// menu's "Design System" group can swap SLDS 1 ↔ SLDS 2 (matches the LWC
// app's src/build/slds-loader.js). `initSldsFromStorage()` inserts the SLDS 2
// (Cosmos) sheet — or SLDS 1 if that was the last session's choice — before
// React mounts, so the right stylesheet is live on first paint. (SLDS 1's
// legacy CSS has no `.slds-color-scheme_dark` rules, which is why dark mode is
// gated to SLDS 2.)
import { initSldsFromStorage } from './theme/sldsLoader';
import './styles/global.css';
import App from './App';

initSldsFromStorage();

// Tells DSR's Modal which element is the app root, so it can apply
// aria-hidden to everything else while a modal is open (see the Home
// modal). Without this, react-modal warns and screen readers still see
// the underlying page content.
Settings.setAppElement('#root');

// NOTE: intentionally NOT wrapped in <React.StrictMode>. StrictMode's
// dev-only double-mount (mount → unmount → remount to surface impure
// effects) breaks the vendored DSR `MenuDropdown` (Dropdown): its trigger
// tracks readiness in a `triggerRendered` state set from a callback ref,
// and that state does not survive the StrictMode remount — so `isOpen`
// (computed as `getIsOpen() && triggerRendered`) stays false and EVERY
// dropdown (profile menu, waffle app launcher) silently refuses to open in
// `npm run dev`. This is a defect in the DSR fork, which we must keep as a
// clean drop-in for the eventual npm-package swap, so we cannot patch it.
// StrictMode has no effect on the production bundle, so dropping it only
// aligns dev with prod for this component. If StrictMode is ever restored,
// the "profile menu opens" e2e test (tests/e2e/shell.spec.ts) will fail.
ReactDOM.createRoot(document.getElementById('root')!).render(
  // iconPath: where vite.config.ts's vite-plugin-static-copy serves the SLDS
  // icon sprites. v4 of that plugin preserves the source's node_modules/...
  // path under the copy dest, so this is NOT /assets/icons — DSR builds each
  // sprite URL as `${iconPath}/<category>-sprite/svg/symbols.svg#<name>`.
  // BASE_URL ('/' in dev, './' in the Pages build) keeps the sprite path
  // correct wherever the site is served; Pages builds use hash routes, so the
  // document is always the site's index.html.
  <IconSettings iconPath={`${import.meta.env.BASE_URL}assets/node_modules/@salesforce-ux/design-system/assets/icons`}>
    <App />
  </IconSettings>
);
