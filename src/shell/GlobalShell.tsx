import GlobalHeader from './GlobalHeader';
import GlobalNavigation from '../ui/GlobalNavigation';
import type { ColorMode } from '../theme/useColorMode';
import type { SldsVersion } from '../theme/useSldsVersion';

type NavPage = { navPage: string; navLabel: string; href: string };
type NavApp = { id: string; label: string; isCurrent: boolean; href: string };
type NavVariant = 'standard' | 'console' | 'builder';

export default function GlobalShell({
  pages, currentPage, appLabel, onNavigate, colorMode, onColorModeChange,
  verticalNav, onVerticalNavChange, sldsVersion, onSldsVersionChange,
  hideWaffle, apps, onAppSwitch, variant, selectedPanel, onPanelToggle,
}: {
  pages: NavPage[]; currentPage?: string; appLabel: string; onNavigate: (page: string) => void;
  colorMode: ColorMode; onColorModeChange: (m: ColorMode) => void;
  verticalNav: boolean; onVerticalNavChange: (next: boolean) => void;
  sldsVersion: SldsVersion; onSldsVersionChange: (next: SldsVersion) => void;
  hideWaffle?: boolean;
  apps: NavApp[];
  onAppSwitch: (id: string) => void;
  variant?: NavVariant;
  selectedPanel?: string | null;
  onPanelToggle: (name: string) => void;
}) {
  return (
    <div className="global-shell">
      <GlobalHeader
        colorMode={colorMode}
        onColorModeChange={onColorModeChange}
        verticalNav={verticalNav}
        onVerticalNavChange={onVerticalNavChange}
        sldsVersion={sldsVersion}
        onSldsVersionChange={onSldsVersionChange}
        selectedPanel={selectedPanel}
        onPanelToggle={onPanelToggle}
      />
      <GlobalNavigation
        pages={pages}
        currentPage={currentPage}
        appLabel={appLabel}
        onNavigate={onNavigate}
        hideWaffle={hideWaffle}
        apps={apps}
        onAppSwitch={onAppSwitch}
        variant={variant}
      />
    </div>
  );
}
