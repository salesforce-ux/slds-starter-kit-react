import { Button } from '@salesforce/design-system-react';

// Placeholder body copy for each header-launched panel, mirroring the LWC
// shell's docked utility panels (heading + placeholder content + close). The
// LWC panels are demo chrome with no real content, so a short descriptive line
// stands in for each.
const PANEL_BODY: Record<string, string> = {
  Agentforce: 'Agentforce assistant panel. Conversations and suggested actions appear here.',
  'Guidance Center': 'Guidance Center panel. Walkthroughs and learning resources appear here.',
  Setup: 'Setup panel. Quick administration shortcuts appear here.',
  Notifications: 'Notifications panel. Recent alerts and updates appear here.',
};

export default function Panel({
  selectedPanel,
  onClose,
}: {
  selectedPanel?: string | null;
  onClose: () => void;
}) {
  if (!selectedPanel) return null;
  return (
    <aside
      className="app-panel slds-panel slds-panel_docked slds-panel_docked-right slds-is-open"
      aria-label={selectedPanel}
    >
      <div className="slds-panel__header">
        <h2
          className="slds-panel__header-title slds-text-heading_small slds-truncate"
          title={selectedPanel}
        >
          {selectedPanel}
        </h2>
        <Button
          className="slds-panel__close"
          variant="icon"
          iconCategory="utility"
          iconName="close"
          iconSize="small"
          assistiveText={{ icon: `Collapse ${selectedPanel}` }}
          title={`Collapse ${selectedPanel}`}
          onClick={onClose}
        />
      </div>
      <div className="slds-panel__body slds-p-around_medium">
        {PANEL_BODY[selectedPanel] ?? ''}
      </div>
    </aside>
  );
}
