import { render, screen, within } from '@testing-library/react';
import { IconSettings } from '@salesforce/design-system-react';
import { expect, test } from 'vitest';
import Icons from './Icons';

function renderIcons() {
  render(<IconSettings iconPath="/assets/icons"><Icons /></IconSettings>);
}

test('renders the three icon category cards', () => {
  renderIcons();
  expect(screen.getByText('Standard')).toBeInTheDocument();
  expect(screen.getByText('Utility')).toBeInTheDocument();
  expect(screen.getByText('Doctype')).toBeInTheDocument();
});

test('renders a known icon label and the browse button', () => {
  renderIcons();
  expect(screen.getByText('account')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /browse full icon library/i })).toBeInTheDocument();
});

test('each category card shows a count badge matching its icon array length', () => {
  // Guards against the header's Badge content (String(ARR.length)) drifting
  // from the actual icon array — a future hardcoded count edit that doesn't
  // match the array length would fail this. Scoped to each Card's <article>
  // (Card renders `<article class="slds-card">`) since a bare getByText
  // number would be ambiguous outside its card.
  renderIcons();

  const standardCard = screen.getByText('Standard').closest('article') as HTMLElement;
  expect(standardCard).not.toBeNull();
  expect(within(standardCard).getByText('24')).toBeInTheDocument();

  const utilityCard = screen.getByText('Utility').closest('article') as HTMLElement;
  expect(utilityCard).not.toBeNull();
  expect(within(utilityCard).getByText('49')).toBeInTheDocument();

  const doctypeCard = screen.getByText('Doctype').closest('article') as HTMLElement;
  expect(doctypeCard).not.toBeNull();
  expect(within(doctypeCard).getByText('17')).toBeInTheDocument();
});
