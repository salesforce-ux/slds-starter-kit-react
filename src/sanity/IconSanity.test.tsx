import { render } from '@testing-library/react';
import { Icon, IconSettings } from '@salesforce/design-system-react';

test('Icon resolves a sprite href from IconSettings iconPath', () => {
  const { container } = render(
    <IconSettings iconPath="/assets/icons">
      <Icon assistiveText={{ label: 'Account' }} category="standard" name="account" size="small" />
    </IconSettings>
  );
  const use = container.querySelector('use');
  expect(use).toBeTruthy();
  const href = use?.getAttribute('xlink:href') ?? use?.getAttribute('href') ?? '';
  expect(href).toContain('/assets/icons/standard-sprite/svg/symbols.svg#account');
});
