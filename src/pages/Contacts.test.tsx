import { render, screen, fireEvent, within } from '@testing-library/react';
import { IconSettings } from '@salesforce/design-system-react';
import { expect, test, vi } from 'vitest';
import Contacts from './Contacts';

function renderContacts(navigate = vi.fn()) {
  render(<IconSettings iconPath="/assets/icons"><Contacts navigate={navigate} /></IconSettings>);
  return navigate;
}

function firstDataRowName() {
  const rows = screen.getAllByRole('row');
  // rows[0] is the header row; the row's first button is the name cell link
  // (the second is the row-actions dropdown trigger).
  return within(rows[1]).getAllByRole('button')[0].textContent;
}

test('renders contact rows from the fixture', () => {
  renderContacts();
  expect(screen.getByText('Lando Voss')).toBeInTheDocument();
  expect(screen.getByText('All Contacts')).toBeInTheDocument();
});

test('clicking a contact name navigates to its detail route', () => {
  const navigate = renderContacts();
  fireEvent.click(screen.getByRole('button', { name: 'Lando Voss' }));
  expect(navigate).toHaveBeenCalledWith('/contacts/1');
});

test('searching filters the visible rows by name', () => {
  renderContacts();
  const search = screen.getByRole('searchbox', { name: /search contacts/i });

  fireEvent.change(search, { target: { value: 'Lando' } });

  expect(screen.getByText('Lando Voss')).toBeInTheDocument();
  expect(screen.queryByText('Carlos Piquet')).not.toBeInTheDocument();
  // Header row + exactly one matching data row.
  expect(screen.getAllByRole('row').length).toBe(2);
});

test('a clear button appears once search has a value and empties it', () => {
  renderContacts();
  const search = screen.getByRole('searchbox', { name: /search contacts/i });

  // No clear affordance while the field is empty (parity C07).
  expect(screen.queryByRole('button', { name: /clear/i })).not.toBeInTheDocument();

  fireEvent.change(search, { target: { value: 'Lando' } });
  const clear = screen.getByRole('button', { name: /clear/i });
  expect(clear).toBeInTheDocument();

  fireEvent.click(clear);
  expect((search as HTMLInputElement).value).toBe('');
  // All rows return (header + 7 data rows).
  expect(screen.getAllByRole('row').length).toBe(8);
});

test('renders the row-number column with 1-based positions', () => {
  const { container } = render(
    <IconSettings iconPath="/assets/icons"><Contacts navigate={vi.fn()} /></IconSettings>
  );
  const numbers = Array.from(
    container.querySelectorAll('.contacts-list__row-number')
  ).map((el) => el.textContent);
  expect(numbers).toEqual(['1', '2', '3', '4', '5', '6', '7']);
});

test('renders selection checkboxes for each row plus select-all', () => {
  renderContacts();
  // One checkbox per data row (7) + the header select-all checkbox = 8.
  expect(screen.getAllByRole('checkbox').length).toBe(8);
});

test('phone and email render as links', () => {
  renderContacts();
  expect(screen.getByRole('link', { name: /\(415\) 555-7000/ })).toHaveAttribute(
    'href',
    'tel:(415) 555-7000'
  );
  expect(screen.getByRole('link', { name: /lvoss@globalmedia\.com/ })).toHaveAttribute(
    'href',
    'mailto:lvoss@globalmedia.com'
  );
});

test('renders the list-view toolbar icons and switcher', () => {
  renderContacts();
  for (const label of ['Switch list view', 'List View Controls', 'Change view', 'Edit List', 'Refresh List', 'Charts', 'Filters']) {
    expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
  }
});

test('sorting toggles row order', () => {
  renderContacts();
  // Default state sorts by Name ascending, so 'Ayrton Prost' (alphabetically
  // first) leads. Clicking the Name header toggles to descending, then back.
  expect(firstDataRowName()).toBe('Ayrton Prost');

  const nameHeader = screen.getByRole('button', { name: /^Sort by: Name /i });
  fireEvent.click(nameHeader);
  expect(firstDataRowName()).toBe('Oscar Lauda');

  fireEvent.click(nameHeader);
  expect(firstDataRowName()).toBe('Ayrton Prost');
});
