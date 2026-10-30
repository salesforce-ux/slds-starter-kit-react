import { shouldHandleLink } from '../router/location';
import { Icon } from '@salesforce/design-system-react';

type NavApp = { id: string; label: string; icon: string; isCurrent: boolean; href: string };

export default function VerticalNav({
  apps, onAppSwitch,
}: { apps: NavApp[]; onAppSwitch: (id: string) => void }) {
  return (
    // Wrapper forces the light color scheme so the rail stays light in dark
    // mode, matching the LWC ui-vertical-nav (class="... slds-color-scheme_light").
    <div className="app-root__vertical-nav slds-color-scheme_light">
      <nav className="vertical-nav" role="navigation" aria-label="App navigation">
        <ul className="vertical-nav__list">
          {apps.map((app) => {
            // icon is a "category:name" string; the category maps to DSR's
            // sprite categories. Narrow the split result to that union instead
            // of casting to `any`.
            const [category, name] = (app.icon || 'utility:apps').split(':') as [
              'standard' | 'utility' | 'doctype' | 'custom' | 'action',
              string,
            ];
            return (
              <li key={app.id} className="vertical-nav__item">
                <a
                  href={app.href}
                  className={`vertical-nav__link${app.isCurrent ? ' vertical-nav__link_selected' : ''}`}
                  aria-current={app.isCurrent ? 'true' : undefined}
                  aria-label={app.label}
                  onClick={(e) => { if (!shouldHandleLink(e)) return; e.preventDefault(); onAppSwitch(app.id); }}
                >
                  <span className="vertical-nav__tile">
                    <Icon category={category} name={name} size="small" inverse />
                  </span>
                  <span className="vertical-nav__label">{app.label}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
