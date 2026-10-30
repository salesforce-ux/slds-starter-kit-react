import { shouldHandleLink } from '../router/location';
import { useEffect, useRef, useState } from 'react';
import { Dropdown } from '@salesforce/design-system-react';

type NavPage = { navPage: string; navLabel: string; href: string };
type NavApp = { id: string; label: string; isCurrent: boolean; href: string };
type NavVariant = 'standard' | 'console' | 'builder';

export default function GlobalNavigation({
  pages, currentPage, appLabel, onNavigate, hideWaffle, apps, onAppSwitch, variant = 'standard',
}: {
  pages: NavPage[];
  currentPage?: string;
  appLabel: string;
  onNavigate: (page: string) => void;
  hideWaffle?: boolean;
  apps: NavApp[];
  onAppSwitch: (id: string) => void;
  variant?: NavVariant;
}) {
  const [launcherOpen, setLauncherOpen] = useState(false);
  const launcherRef = useRef<HTMLDivElement>(null);

  // Console app swaps the standard tab strip for an object switcher (matches
  // the LWC globalNavigation `isConsole` branch): the primary bar shows the
  // current page as a tab plus a chevron dropdown listing the app's pages,
  // and the secondary bar is a divider placeholder (LWC leaves the workspace
  // tab strip for a follow-up, so we mirror the empty divider here).
  const isConsole = variant === 'console';
  const currentPageLabel = pages.find((p) => p.navPage === currentPage)?.navLabel ?? 'Page Not Found';
  const switcherOptions = pages.map((p) => ({ label: p.navLabel, value: p.navPage }));

  useEffect(() => {
    if (!launcherOpen) return undefined;
    const onDocClick = (e: MouseEvent) => {
      if (launcherRef.current && !launcherRef.current.contains(e.target as Node)) {
        setLauncherOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLauncherOpen(false); };
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [launcherOpen]);

  return (
    // Outer element is a <div> (not <nav>) so the secondary <nav> below isn't
    // nested inside another nav — matches the LWC globalNavigation structure
    // (slds-context-bar > __primary + <nav class="__secondary">). Console adds
    // the SLDS `_tabs` modifier, same as the LWC contextBarClass getter.
    <div className={`slds-context-bar${isConsole ? ' slds-context-bar_tabs' : ''}`}>
      <div className="slds-context-bar__primary">
        {/* App launcher (waffle). SLDS draws the 3x3 grid purely with CSS via
            .slds-icon-waffle (no sprite icon needed). Clicking it toggles an
            SLDS dropdown menu (one menuitem per app); picking an app calls
            onAppSwitch and closes the menu, matching the LWC context bar's
            app launcher. Hidden when Vertical Nav is enabled: the rail
            already provides app switching, so the waffle would be redundant
            (matches the LWC shell's hideWaffle behavior). */}
        {!hideWaffle && (
          <div className="slds-context-bar__icon-action app-launcher-trigger" ref={launcherRef}>
            <button
              type="button"
              className="slds-button slds-icon-waffle_container"
              title="App Launcher"
              aria-haspopup="true"
              aria-expanded={launcherOpen}
              aria-label="App Launcher"
              onClick={() => setLauncherOpen((open) => !open)}
            >
              <span className="slds-icon-waffle">
                <span className="slds-r1" />
                <span className="slds-r2" />
                <span className="slds-r3" />
                <span className="slds-r4" />
                <span className="slds-r5" />
                <span className="slds-r6" />
                <span className="slds-r7" />
                <span className="slds-r8" />
                <span className="slds-r9" />
              </span>
            </button>
            {launcherOpen && (
              <div className="slds-dropdown slds-dropdown_left" role="menu" aria-label="App Launcher">
                <ul className="slds-dropdown__list" role="group">
                  {apps.map((app) => (
                    <li key={app.id} className="slds-dropdown__item" role="presentation">
                      <a
                        href={app.href}
                        role="menuitem"
                        aria-current={app.isCurrent ? 'true' : undefined}
                        onClick={(e) => { if (!shouldHandleLink(e)) return; e.preventDefault(); onAppSwitch(app.id); setLauncherOpen(false); }}
                      >
                        <span className="slds-truncate" title={app.label}>{app.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        <span className="slds-context-bar__label-action slds-context-bar__app-name">
          <span className="slds-truncate" title={appLabel}>
            {appLabel}
          </span>
        </span>

        {isConsole && (
          <>
            <div className="slds-context-bar__item slds-context-bar__object-switcher slds-is-active">
              {/* The current-page "main" tab. Non-interactive like the LWC
                  version — the chevron dropdown does the page switching. */}
              <button
                type="button"
                className="slds-context-bar__label-action"
                role="tab"
                aria-selected="true"
                title={currentPageLabel}
              >
                <span className="slds-truncate" title={currentPageLabel}>{currentPageLabel}</span>
              </button>
            </div>
            {/* Object switcher menu: a borderless (container) chevron button
                that opens the app's page list; selecting a page navigates.
                DSR Dropdown renders its own slds-dropdown-trigger + button +
                slds-dropdown, standing in for the LWC lightning-button-icon +
                slds-dropdown pair. Public-root export only. */}
            <Dropdown
              align="left"
              iconCategory="utility"
              iconName="chevrondown"
              iconVariant="container"
              assistiveText={{ icon: 'Open object switcher menu' }}
              options={switcherOptions}
              onSelect={(option: { value?: string | number }) => {
                if (option.value != null) onNavigate(String(option.value));
              }}
            />
          </>
        )}
      </div>

      {isConsole ? (
        <div className="slds-context-bar__secondary" role="presentation">
          <div className="slds-context-bar__vertical-divider" />
          {/* Workspace tab strip lives here in a follow-up pass (LWC stubs it too). */}
        </div>
      ) : (
        <nav className="slds-context-bar__secondary" role="navigation" aria-label="App navigation">
          <ul className="slds-grid">
            {pages.map((p) => (
              <li
                key={p.navPage}
                className={`slds-context-bar__item${p.navPage === currentPage ? ' slds-is-active' : ''}`}
              >
                <a
                  href={p.href}
                  className="slds-context-bar__label-action"
                  aria-current={p.navPage === currentPage ? 'page' : undefined}
                  onClick={(e) => { if (!shouldHandleLink(e)) return; e.preventDefault(); onNavigate(p.navPage); }}
                >
                  <span className="slds-truncate">{p.navLabel}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
