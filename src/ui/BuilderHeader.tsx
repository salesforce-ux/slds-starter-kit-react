import type { MouseEvent, ReactNode } from 'react';
import { Icon } from '@salesforce/design-system-react';

// Ports the LWC `ui/builderHeader`: the `slds-builder-header` banner (back /
// app-name / doc-title / Settings+Help utilities) plus an optional
// `slds-builder-toolbar`. The LWC template exposes `toolbar-actions-left` and
// `toolbar-actions-right` named slots; here the Builder page passes those as
// the `toolbarLeft` / `toolbarRight` props. Inverse icons match the dark
// builder-header bar (DSR `Icon` supports the `inverse` boolean, same as the
// vertical-nav rail).
type BuilderHeaderProps = {
  appName?: string;
  documentTitle?: string;
  showToolbar?: boolean;
  onBack?: () => void;
  onSettings?: () => void;
  toolbarLeft?: ReactNode;
  toolbarRight?: ReactNode;
};

export default function BuilderHeader({
  appName = 'Builder',
  documentTitle = 'Untitled',
  showToolbar = false,
  onBack,
  onSettings,
  toolbarLeft,
  toolbarRight,
}: BuilderHeaderProps) {
  const handleBack = (event: MouseEvent) => {
    event.preventDefault();
    onBack?.();
  };
  const handleSettings = (event: MouseEvent) => {
    event.preventDefault();
    onSettings?.();
  };

  return (
    <div className="slds-shrink-none">
      <header className="slds-builder-header" role="banner">
        <div className="slds-builder-header__item">
          <a
            href="#"
            className="slds-builder-header__item-action"
            title="Back"
            onClick={handleBack}
          >
            <Icon
              category="utility"
              name="back"
              size="x-small"
              inverse
              assistiveText={{ label: 'Back' }}
            />
          </a>
        </div>

        <div className="slds-builder-header__item">
          <div className="slds-builder-header__item-label slds-media slds-media_center">
            <div className="slds-media__figure">
              <Icon category="utility" name="builder" size="x-small" inverse />
            </div>
            <div className="slds-media__body">{appName}</div>
          </div>
        </div>

        <div className="slds-builder-header__item slds-has-flexi-truncate">
          <h1 className="slds-builder-header__item-label">
            <span className="slds-truncate" title={documentTitle}>
              {documentTitle}
            </span>
          </h1>
        </div>

        <div className="slds-builder-header__item slds-builder-header__utilities">
          <div className="slds-builder-header__utilities-item">
            <a
              href="#"
              className="slds-builder-header__item-action slds-media slds-media_center"
              title="Settings"
              onClick={handleSettings}
            >
              <span className="slds-media__figure">
                <Icon category="utility" name="settings" size="x-small" inverse />
              </span>
              <span className="slds-media__body">
                <span className="slds-truncate" title="Settings">
                  Settings
                </span>
              </span>
            </a>
          </div>
          <div className="slds-builder-header__utilities-item">
            <a
              href="#"
              className="slds-builder-header__item-action slds-media slds-media_center"
              title="Help"
              onClick={(event) => event.preventDefault()}
            >
              <span className="slds-media__figure">
                <Icon category="utility" name="help" size="x-small" inverse />
              </span>
              <span className="slds-media__body">
                <span className="slds-truncate" title="Help">
                  Help
                </span>
              </span>
            </a>
          </div>
        </div>
      </header>

      {showToolbar && (
        <div className="slds-builder-toolbar" role="toolbar" aria-label="Builder actions">
          <div className="slds-builder-toolbar__item-group" aria-label="Canvas actions">
            {toolbarLeft}
          </div>
          <div className="slds-builder-toolbar__actions" aria-label="Document actions">
            {toolbarRight}
          </div>
        </div>
      )}
    </div>
  );
}
