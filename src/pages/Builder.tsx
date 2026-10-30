import { useState } from 'react';
import { Button, ButtonGroup, ButtonStateful } from '@salesforce/design-system-react';
import BuilderHeader from '../ui/BuilderHeader';
import BuilderSettingsModal from '../ui/BuilderSettingsModal';
import '../styles/builder.css';

const STORAGE_KEY_PAGE_NAME = 'builder-page-name';
const DEFAULT_PAGE_NAME = 'Untitled Page';

function readStoredPageName(): string {
  try {
    return localStorage.getItem(STORAGE_KEY_PAGE_NAME) || DEFAULT_PAGE_NAME;
  } catch {
    return DEFAULT_PAGE_NAME;
  }
}

type BuilderProps = {
  // Fired when the builder-header Back action is clicked; App returns to the
  // default app (mirrors the LWC `builderexit` event → handleBuilderExit).
  onExit?: () => void;
};

// Ports the LWC `page/builder`: a full-screen builder chrome (rendered outside
// the global shell by App) with a builder header + toolbar, a docked
// "Components" left panel (toggleable/closeable), a canvas empty state, and a
// docked "Properties" right panel. The Settings action opens a modal that
// persists the page name to localStorage['builder-page-name'].
export default function Builder({ onExit }: BuilderProps) {
  const [pageName, setPageName] = useState<string>(readStoredPageName);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleSaveSettings = (name: string) => {
    const next = name || DEFAULT_PAGE_NAME;
    setPageName(next);
    try {
      localStorage.setItem(STORAGE_KEY_PAGE_NAME, next);
    } catch {
      /* storage unavailable; non-fatal */
    }
    setSettingsOpen(false);
  };

  const leftRailClass = `slds-panel slds-panel_docked slds-panel_docked-left slds-is-open builder-rail builder-rail_left slds-scrollable${
    showLeftPanel ? '' : ' slds-hide'
  }`;

  const toolbarLeft = (
    <div className="slds-grid slds-grid_vertical-align-center">
      <ButtonGroup>
        <Button
          variant="icon"
          iconCategory="utility"
          iconName="undo"
          iconVariant="border-filled"
          assistiveText={{ icon: 'Undo' }}
          title="Undo"
        />
        <Button
          variant="icon"
          iconCategory="utility"
          iconName="redo"
          iconVariant="border-filled"
          assistiveText={{ icon: 'Redo' }}
          title="Redo"
        />
      </ButtonGroup>
      <ButtonStateful
        className="slds-m-left_xx-small"
        variant="icon-filled"
        iconName="toggle_panel_left"
        active={showLeftPanel}
        assistiveText={{ icon: 'Toggle components panel' }}
        onClick={() => setShowLeftPanel((prev) => !prev)}
      />
    </div>
  );

  const toolbarRight = (
    <>
      <Button label="Save As" variant="neutral" title="Save As" />
      <Button className="slds-m-left_xx-small" label="Save" variant="brand" title="Save" />
    </>
  );

  return (
    <div className="builder-page">
      <BuilderHeader
        appName="Builder"
        documentTitle={pageName}
        showToolbar
        onBack={onExit}
        onSettings={() => setSettingsOpen(true)}
        toolbarLeft={toolbarLeft}
        toolbarRight={toolbarRight}
      />

      <div className="builder-body slds-grid slds-grid_vertical-stretch slds-is-relative">
        <div className={leftRailClass}>
          <div className="builder-panel">
            <div className="slds-panel__header">
              <h2 className="slds-panel__header-title slds-text-heading_small slds-truncate" title="Components">
                Components
              </h2>
              <div className="slds-panel__header-actions">
                <Button
                  variant="icon"
                  iconCategory="utility"
                  iconName="close"
                  iconSize="small"
                  assistiveText={{ icon: 'Close panel' }}
                  title="Close panel"
                  onClick={() => setShowLeftPanel(false)}
                />
              </div>
            </div>
            <div className="slds-panel__body">
              <div className="slds-text-color_weak slds-text-body_small">
                Components you can add to the canvas will appear here.
              </div>
            </div>
          </div>
        </div>

        <main className="builder-canvas slds-scrollable" aria-label="Builder canvas">
          <div className="slds-align_absolute-center builder-canvas__empty">
            <p className="slds-text-body_regular slds-text-color_weak">Builder Canvas</p>
          </div>
        </main>

        <div className="slds-panel slds-panel_docked slds-panel_docked-right slds-is-open builder-rail builder-rail_right slds-scrollable">
          <div className="builder-panel">
            <div className="slds-panel__header">
              <h2 className="slds-panel__header-title slds-text-heading_small slds-truncate" title="Properties">
                Properties
              </h2>
            </div>
            <div className="slds-panel__body">
              <div className="slds-text-color_weak slds-text-body_small">
                Select an element on the canvas to edit its properties.
              </div>
            </div>
          </div>
        </div>
      </div>

      <BuilderSettingsModal
        isOpen={settingsOpen}
        initialName={pageName}
        onCancel={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
