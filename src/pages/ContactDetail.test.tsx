import { render, screen, fireEvent, within } from '@testing-library/react';
import { IconSettings } from '@salesforce/design-system-react';
import { expect, test, vi } from 'vitest';
import ContactDetail from './ContactDetail';

function renderDetail(id?: string) {
  return render(
    <IconSettings iconPath="/assets/icons">
      <ContactDetail params={{ id }} navigate={vi.fn()} />
    </IconSettings>
  );
}

test('renders the named contact and its fields', () => {
  renderDetail('1');
  // Name shows in both the PageHeader title and the "Full Name" card field;
  // company shows in both the header summary and the "Account Name" field.
  expect(screen.getAllByText('Lando Voss').length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText('Global Media').length).toBeGreaterThanOrEqual(1);
  expect(screen.getByText('Full Name')).toBeInTheDocument();
  expect(screen.getByText('Mailing Address')).toBeInTheDocument();
});

test('renders the activity timeline with all four entries', () => {
  const { container } = renderDetail('1');
  expect(container.querySelectorAll('.slds-timeline__item')).toHaveLength(4);
  expect(screen.getByText('Follow-up call')).toBeInTheDocument();
});

test('More Actions menu opens and lists the record actions', () => {
  renderDetail('1');
  fireEvent.click(screen.getByRole('button', { name: /more actions/i }));
  const menu = screen.getByRole('menu');
  expect(within(menu).getByText('Send Email')).toBeInTheDocument();
  expect(within(menu).getByText('Log a Call')).toBeInTheDocument();
  expect(within(menu).getByText('Create Task')).toBeInTheDocument();
});

test('shows a not-found state for an unknown id', () => {
  renderDetail('nope');
  expect(screen.getByText(/not found/i)).toBeInTheDocument();
});
