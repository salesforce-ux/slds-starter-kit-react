import { render, screen, fireEvent } from '@testing-library/react';
import { IconSettings } from '@salesforce/design-system-react';
import { expect, test, vi } from 'vitest';
import VerticalNav from './VerticalNav';

const apps = [
  { id: 'standard', label: 'Standard App', icon: 'utility:home', href: '/app', isCurrent: true },
  { id: 'console', label: 'Console App', icon: 'utility:layout', href: '/console', isCurrent: false },
];

function renderNav(onAppSwitch = vi.fn()) {
  render(
    <IconSettings iconPath="/assets/icons">
      <VerticalNav apps={apps} onAppSwitch={onAppSwitch} />
    </IconSettings>
  );
  return onAppSwitch;
}

test('renders a tile per app and marks the current one', () => {
  renderNav();
  expect(screen.getByRole('link', { name: /standard app/i })).toHaveAttribute('aria-current', 'true');
  expect(screen.getByRole('link', { name: /console app/i })).not.toHaveAttribute('aria-current', 'true');
});

test('clicking a tile fires onAppSwitch with the app id', () => {
  const onAppSwitch = renderNav();
  fireEvent.click(screen.getByRole('link', { name: /console app/i }));
  expect(onAppSwitch).toHaveBeenCalledWith('console');
});

test('each tile carries a real href to its app (parity A09)', () => {
  renderNav();
  expect(screen.getByRole('link', { name: /standard app/i })).toHaveAttribute('href', '/app');
  expect(screen.getByRole('link', { name: /console app/i })).toHaveAttribute('href', '/console');
});
