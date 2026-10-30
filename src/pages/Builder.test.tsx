import { render, screen, fireEvent, within } from '@testing-library/react';
import { IconSettings } from '@salesforce/design-system-react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import Builder from './Builder';
import App from '../App';

function renderBuilder(onExit = vi.fn()) {
  render(
    <IconSettings iconPath="/assets/icons">
      <Builder onExit={onExit} />
    </IconSettings>
  );
  return onExit;
}

beforeEach(() => {
  localStorage.clear();
});
afterEach(() => {
  localStorage.clear();
  history.replaceState({}, '', '/app');
});

test('renders the builder header, toolbar, canvas, and both panels', () => {
  renderBuilder();
  // App name + default document title in the builder header.
  expect(screen.getByText('Builder')).toBeInTheDocument();
  expect(screen.getByText('Untitled Page')).toBeInTheDocument();
  // Docked panels + canvas empty state.
  expect(screen.getByText('Components')).toBeInTheDocument();
  expect(screen.getByText('Properties')).toBeInTheDocument();
  expect(screen.getByText('Builder Canvas')).toBeInTheDocument();
  // Toolbar document actions.
  expect(screen.getByRole('button', { name: /save as/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /^save$/i })).toBeInTheDocument();
});

test('seeds the document title from localStorage', () => {
  localStorage.setItem('builder-page-name', 'Landing Page');
  renderBuilder();
  expect(screen.getByText('Landing Page')).toBeInTheDocument();
});

test('the Back action fires the builder-exit callback', () => {
  const onExit = renderBuilder();
  fireEvent.click(screen.getByRole('link', { name: /back/i }));
  expect(onExit).toHaveBeenCalledTimes(1);
});

test('toggling the components panel hides it', () => {
  const { container } = render(
    <IconSettings iconPath="/assets/icons">
      <Builder />
    </IconSettings>
  );
  const leftRail = container.querySelector('.builder-rail_left')!;
  expect(leftRail.className).not.toContain('slds-hide');
  // The panel's own Close button hides it.
  fireEvent.click(screen.getByRole('button', { name: /close panel/i }));
  expect(leftRail.className).toContain('slds-hide');
});

test('the settings modal opens, saves, and persists the page name', () => {
  renderBuilder();
  fireEvent.click(screen.getByRole('link', { name: /settings/i }));
  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByText('Page Settings')).toBeInTheDocument();
  const input = within(dialog).getByLabelText('Page Name') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'Marketing Home' } });
  fireEvent.click(within(dialog).getByRole('button', { name: /^save$/i }));
  expect(localStorage.getItem('builder-page-name')).toBe('Marketing Home');
  // The builder header document title reflects the new name.
  expect(screen.getByText('Marketing Home')).toBeInTheDocument();
});

test('the builder app renders full-screen, bypassing the global shell', () => {
  history.replaceState({}, '', '/builder');
  render(
    <IconSettings iconPath="/assets/icons">
      <App />
    </IconSettings>
  );
  // Builder chrome present…
  expect(screen.getByText('Builder Canvas')).toBeInTheDocument();
  // …but the global header search box (rendered by GlobalShell) is not.
  expect(screen.queryByPlaceholderText(/search/i)).not.toBeInTheDocument();
});
