import { useEffect, useState } from 'react';
import { useRouter } from './router/useRouter';
import { useColorMode } from './theme/useColorMode';
import { useVerticalNav } from './theme/useVerticalNav';
import { useSldsVersion, type SldsVersion } from './theme/useSldsVersion';
import { DEFAULT_APP_ID, apps as allApps, getAppById } from './apps.config';
import { routes } from './routes.config';
import { ROUTE_COMPONENTS } from './pages/registry';
import GlobalShell from './shell/GlobalShell';
import Panel from './shell/Panel';
import NotFound from './pages/NotFound';
import Builder from './pages/Builder';
import { linkHref } from './router/location';
import VerticalNav from './ui/VerticalNav';
import './styles/shell.css';

export default function App() {
  const { route, params, app, navigate } = useRouter();
  const { colorMode, setColorMode } = useColorMode();
  const { verticalNav, setVerticalNav } = useVerticalNav();
  const { sldsVersion, setSldsVersion } = useSldsVersion();
  // Which global-header docked panel is open (Agentforce / Guidance Center /
  // Setup / Notifications), or null when none. Clicking the active button
  // again closes it (parity A01).
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const togglePanel = (name: string) =>
    setSelectedPanel((cur) => (cur === name ? null : name));

  // SLDS 1 has no dark scheme, so force light whenever it's active — matches
  // LWC (`_setSldsVersion`/`_restorePreferences` both drop dark on SLDS 1).
  // Runs on switch AND on initial mount (handles a stored SLDS-1 + dark combo).
  useEffect(() => {
    if (sldsVersion !== 2 && colorMode !== 'light') setColorMode('light');
  }, [sldsVersion, colorMode, setColorMode]);

  const handleSldsVersionChange = (next: SldsVersion) => {
    setSldsVersion(next);
    if (next !== 2 && colorMode !== 'light') setColorMode('light');
  };

  const activeApp = app ?? getAppById(DEFAULT_APP_ID)!;
  const pages = activeApp.pages
    .map((id) => routes.find((r) => r.navPage === id))
    .filter(Boolean)
    .map((r) => ({ navPage: r!.navPage!, navLabel: r!.navLabel!, href: linkHref(r!.navPath ?? r!.path) }));

  const currentPage = route?.navPage ?? route?.navHighlight;
  const Outlet = route ? ROUTE_COMPONENTS[route.component] ?? NotFound : NotFound;

  const navApps = allApps.map((a) => ({
    id: a.id, label: a.label, icon: a.icon, isCurrent: a.id === activeApp.id, href: linkHref(a.defaultPath),
  }));
  const switchApp = (id: string) => {
    const target = getAppById(id);
    if (target) navigate(target.defaultPath);
  };

  // Mirror the LWC app shell: toggle `builder-active` on <html> whenever the
  // builder app is active, and clear it on unmount/app-change.
  const isBuilderApp = activeApp.variant === 'builder';
  useEffect(() => {
    document.documentElement.classList.toggle('builder-active', isBuilderApp);
    return () => document.documentElement.classList.remove('builder-active');
  }, [isBuilderApp]);

  // Builder renders full-screen, bypassing the global shell (LWC's
  // `isBuilderApp` branch). Back exits to the default app (`builderexit`).
  if (isBuilderApp) {
    return <Builder onExit={() => switchApp(DEFAULT_APP_ID)} />;
  }

  return (
    <div className={`app-root${verticalNav ? ' app-root_with-vertical-nav' : ''}`}>
      {verticalNav && <VerticalNav apps={navApps} onAppSwitch={switchApp} />}
      <div className="app-root__column">
        <GlobalShell
          pages={pages}
          currentPage={currentPage}
          appLabel={activeApp.label}
          onNavigate={(page) => {
            const target = routes.find((r) => r.navPage === page);
            if (target) navigate(target.navPath ?? target.path);
          }}
          colorMode={colorMode}
          onColorModeChange={setColorMode}
          verticalNav={verticalNav}
          onVerticalNavChange={setVerticalNav}
          sldsVersion={sldsVersion}
          onSldsVersionChange={handleSldsVersionChange}
          hideWaffle={verticalNav}
          apps={navApps}
          onAppSwitch={switchApp}
          variant={activeApp.variant}
          selectedPanel={selectedPanel}
          onPanelToggle={togglePanel}
        />
        {/* Content row: page body scrolls; the docked panel sits to its right
            and reduces the content width while open (parity A01). */}
        <div className="app-root__content">
          <main className="app-body slds-p-around_none">
            <div className="app-main__inner">
              <Outlet params={params} navigate={navigate} />
            </div>
          </main>
          <Panel selectedPanel={selectedPanel} onClose={() => setSelectedPanel(null)} />
        </div>
      </div>
    </div>
  );
}
