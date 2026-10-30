import { useState } from 'react';
import { Dropdown, DropdownTrigger, Button, Avatar } from '@salesforce/design-system-react';
import type { ColorMode } from '../theme/useColorMode';
import type { SldsVersion } from '../theme/useSldsVersion';

type Props = {
  colorMode: ColorMode;
  onColorModeChange: (m: ColorMode) => void;
  verticalNav: boolean;
  onVerticalNavChange: (next: boolean) => void;
  sldsVersion: SldsVersion;
  onSldsVersionChange: (next: SldsVersion) => void;
};

export default function ProfileMenu({
  colorMode, onColorModeChange, verticalNav, onVerticalNavChange,
  sldsVersion, onSldsVersionChange,
}: Props) {
  // Grouped sections with subheaders + dividers, matching the LWC profileMenu:
  // Design System (SLDS 1/2) → Color Mode (only on SLDS 2) → Vertical Nav. DSR
  // MenuDropdownOption supports type 'header' | 'divider' | 'item'; header and
  // divider rows are non-selectable. The active row in each group is derived
  // below and marked via `value` matching + `checkmark`.
  //
  // DSR's MenuDropdown only turns an array `value` into per-row checkmarks
  // when `multiple` is also set (see menu-dropdown.tsx: the value-sync effect
  // only maps `value` to `selectedIndices` in the `multiple` branch; without
  // it, an array `value` is compared as a whole against each option's scalar
  // `value` and never matches, so no row gets checked at all). Verified
  // against
  // node_modules/@salesforce/design-system-react/components/menu-dropdown/menu-dropdown.tsx
  // (getIndexByValue / the value-sync useEffect) and
  // components/utilities/menu-list/index.tsx (isMultipleSelected).
  //
  // Side effect of `multiple`: DSR skips its own auto-close-on-select for
  // multi-select menus. That happens to match the LWC profileMenu, which stays
  // open after each selection so several settings can be changed in one visit
  // (parity A07) — so we deliberately do NOT close it on select; `isOpen` is
  // driven only by open/close (trigger, outside-click, Escape).
  //
  // Color Mode is shown only on SLDS 2 (mirrors LWC `showColorMode =
  // sldsVersion === 2`): SLDS 1's legacy CSS has no dark scheme, so the app is
  // forced light there and the group is hidden.
  const showColorMode = sldsVersion === 2;
  const options = [
    { type: 'header' as const, label: 'Design System' },
    { label: 'SLDS 1', value: 'sldsVersion:1' },
    { label: 'SLDS 2', value: 'sldsVersion:2' },
    ...(showColorMode
      ? [
          { type: 'divider' as const },
          { type: 'header' as const, label: 'Color Mode' },
          { label: 'Light', value: 'colorMode:light' },
          { label: 'Dark', value: 'colorMode:dark' },
          { label: 'System', value: 'colorMode:system' },
        ]
      : []),
    { type: 'divider' as const },
    { type: 'header' as const, label: 'Vertical Nav' },
    { label: 'Enabled', value: 'verticalNav:on' },
    { label: 'Disabled', value: 'verticalNav:off' },
  ];
  const value = [
    `sldsVersion:${sldsVersion}`,
    `colorMode:${colorMode}`,
    `verticalNav:${verticalNav ? 'on' : 'off'}`,
  ];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown
      align="right"
      checkmark
      multiple
      // Scoped class so the selection checks read neutral-gray (not accent
      // blue) with LWC-matched section/item spacing (parity C13). NOTE: the LWC
      // menu also has a top pointer/nubbin, but DSR's nubbinPosition reroutes
      // the menu through its Dialog/popover positioning path; rather than risk
      // that interacting with the controlled stay-open behavior (parity A07,
      // higher priority), the nubbin is left off. The gray checks + spacing
      // below cover the substance of C13.
      className="profile-menu__dropdown"
      // DSR MenuDropdown defaults `length` to '5', which adds
      // `slds-dropdown_length-5` (max-height: 200px + overflow: auto) and
      // clips this grouped menu after ~5 rows — hiding Dark/System and the
      // whole Vertical Nav group behind a scroll. The LWC profileMenu caps
      // nothing and shows every row, so disable the cap with length={null}
      // (menu-list only adds the length class when the prop is truthy).
      length={null}
      isOpen={isOpen}
      onOpen={() => setIsOpen(true)}
      onClose={() => setIsOpen(false)}
      options={options}
      value={value}
      onSelect={(option) => {
        const [group, raw] = String(option.value ?? '').split(':');
        if (group === 'sldsVersion') onSldsVersionChange(Number(raw) as SldsVersion);
        else if (group === 'colorMode') onColorModeChange(raw as ColorMode);
        else if (group === 'verticalNav') onVerticalNavChange(raw === 'on');
        // Intentionally leave the menu open (parity A07).
      }}
    >
      <DropdownTrigger>
        <Button variant="base" className="profile-menu__trigger">
          <Avatar variant="user" size="medium" initials="AG" label="Austin Guevara" />
          <span className="slds-assistive-text">Open profile menu</span>
        </Button>
      </DropdownTrigger>
    </Dropdown>
  );
}
