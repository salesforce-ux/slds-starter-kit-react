import { Input, InputIcon, Icon, Button, ButtonGroup, Dropdown } from '@salesforce/design-system-react';

// Placeholder menu item for the demo button-menus (favorites / global actions /
// help). The LWC globalHeader gives each of these a single non-functional
// `lightning-menu-item label="Menu Item One"`, so mirror that verbatim.
const PLACEHOLDER_MENU = [{ label: 'Menu Item One', value: 'item1' }];
import ProfileMenu from './ProfileMenu';
import type { ColorMode } from '../theme/useColorMode';
import type { SldsVersion } from '../theme/useSldsVersion';

export default function GlobalHeader({
  colorMode, onColorModeChange, verticalNav, onVerticalNavChange,
  sldsVersion, onSldsVersionChange, selectedPanel, onPanelToggle,
}: {
  colorMode: ColorMode;
  onColorModeChange: (m: ColorMode) => void;
  verticalNav: boolean;
  onVerticalNavChange: (next: boolean) => void;
  sldsVersion: SldsVersion;
  onSldsVersionChange: (next: SldsVersion) => void;
  selectedPanel?: string | null;
  onPanelToggle: (name: string) => void;
}) {
  // No `slds-global-header_container` wrapper: that SLDS class is
  // `position: fixed`, which the LWC original does not use here (see
  // design-system-2-starter-kit's globalHeader.html — it's a plain
  // lightning-layout with no fixed container). Fixed positioning took the
  // header out of flow and let the nav underneath render at the same
  // position, hidden behind it and unclickable.
  //
  // The right-hand action cluster mirrors the LWC globalHeader: Agentforce,
  // favorites (star + menu), global actions, guidance, help, setup,
  // notifications, and the profile avatar. These are demo chrome — the icon
  // buttons carry titles/assistive text for a11y but no wired behavior, same
  // as the LWC handlers which are placeholders.
  return (
    <header>
      <div className="slds-global-header slds-grid slds-grid_align-spread slds-grid_vertical-align-center">
        <div className="slds-global-header__item">
          <Icon assistiveText={{ label: 'Salesforce' }} category="utility" name="salesforce1" size="large" />
        </div>
        <div className="slds-global-header__item slds-global-header__item_search">
          {/*
            slds-container_small + _center mirrors the LWC search input
            (max-width 30rem, centered) so the field width/position matches
            (parity A03). iconLeft adds the magnifying-glass affordance the LWC
            search variant renders (parity C07).
          */}
          <Input
            className="slds-container_small slds-container_center"
            assistiveText={{ label: 'Search' }}
            placeholder="Search..."
            aria-label="Search"
            iconLeft={<InputIcon name="search" category="utility" assistiveText={{ icon: 'Search' }} />}
          />
        </div>
        <div className="slds-global-header__item">
          <div className="slds-grid slds-grid_vertical-align-center global-header__actions">
            <Button
              className={`slds-m-right_small${selectedPanel === 'Agentforce' ? ' global-header__action_active' : ''}`}
              variant="icon"
              iconCategory="utility"
              iconName="agent_astro"
              iconSize="large"
              assistiveText={{ icon: 'Agentforce' }}
              title="Agentforce"
              aria-pressed={selectedPanel === 'Agentforce'}
              onClick={() => onPanelToggle('Agentforce')}
            />
            {/* Favorites: LWC wraps a button-icon-stateful (star, size="small")
                + a button-menu (chevron, icon-size="small") in a
                lightning-button-group, rendering an enclosed segmented pill.
                Those render as `slds-button_icon-border` + `slds-button_icon-
                small` (24×24, transparent fill) — NOT border-filled (white) or
                the default 32×32. Mirror that with iconVariant="border" +
                iconSize="small" on both; the Dropdown as the last child gets
                `slds-button_last`, joining star and chevron into one pill. */}
            <ButtonGroup className="slds-m-right_xx-small">
              <Button
                variant="icon"
                iconVariant="border"
                iconSize="small"
                iconCategory="utility"
                iconName="favorite"
                assistiveText={{ icon: 'Toggle Favorites' }}
                title="Toggle Favorites"
              />
              <Dropdown
                align="left"
                width="xx-small"
                iconCategory="utility"
                iconName="chevrondown"
                iconVariant="border"
                iconSize="small"
                assistiveText={{ icon: 'View Favorites' }}
                options={PLACEHOLDER_MENU}
              />
            </ButtonGroup>
            {/* Global Actions: LWC button-menu (variant=container, nubbin=true).
                A DSR Dropdown gives the same container icon trigger. LWC's menu
                is `slds-dropdown_left slds-nubbin_top-left`, min-width 96px — so
                width="xx-small" (6rem min) and nubbinPosition="top left" (which
                DSR maps to a left-aligned dialog with the top-left nubbin).
                Without these the DSR default was `slds-dropdown_medium` (320px)
                right-aligned — much wider and shifted left of the trigger. */}
            <div className="slds-m-right_xx-small">
              <Dropdown
                nubbinPosition="top left"
                width="xx-small"
                iconCategory="utility"
                iconName="new"
                iconVariant="container"
                iconSize="large"
                assistiveText={{ icon: 'Global Actions' }}
                options={PLACEHOLDER_MENU}
              />
            </div>
            <Button
              className={`slds-m-right_xx-small${selectedPanel === 'Guidance Center' ? ' global-header__action_active' : ''}`}
              variant="icon"
              iconCategory="utility"
              iconName="trailhead_alt"
              iconSize="large"
              assistiveText={{ icon: 'Guidance Center' }}
              title="Guidance Center"
              aria-pressed={selectedPanel === 'Guidance Center'}
              onClick={() => onPanelToggle('Guidance Center')}
            />
            {/* Help: LWC button-menu (variant=container, nubbin=true) → DSR
                Dropdown, same `slds-dropdown_left slds-nubbin_top-left` /
                min-width 96px treatment as Global Actions above. */}
            <div className="slds-m-right_xx-small">
              <Dropdown
                nubbinPosition="top left"
                width="xx-small"
                iconCategory="utility"
                iconName="help"
                iconVariant="container"
                iconSize="large"
                assistiveText={{ icon: 'Salesforce Help' }}
                options={PLACEHOLDER_MENU}
              />
            </div>
            <Button
              className={`slds-m-right_small${selectedPanel === 'Setup' ? ' global-header__action_active' : ''}`}
              variant="icon"
              iconCategory="utility"
              iconName="settings"
              iconSize="large"
              assistiveText={{ icon: 'Setup' }}
              title="Setup"
              aria-pressed={selectedPanel === 'Setup'}
              onClick={() => onPanelToggle('Setup')}
            />
            <Button
              className={`slds-m-right_xx-small${selectedPanel === 'Notifications' ? ' global-header__action_active' : ''}`}
              variant="icon"
              iconCategory="utility"
              iconName="notification"
              iconSize="large"
              assistiveText={{ icon: 'Notifications' }}
              title="Notifications"
              aria-pressed={selectedPanel === 'Notifications'}
              onClick={() => onPanelToggle('Notifications')}
            />
            <div className="slds-p-left_small">
              <ProfileMenu
                colorMode={colorMode}
                onColorModeChange={onColorModeChange}
                verticalNav={verticalNav}
                onVerticalNavChange={onVerticalNavChange}
                sldsVersion={sldsVersion}
                onSldsVersionChange={onSldsVersionChange}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
