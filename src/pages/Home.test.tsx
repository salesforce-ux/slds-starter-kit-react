import { render, screen, fireEvent } from '@testing-library/react';
import { IconSettings } from '@salesforce/design-system-react';
import Home from './Home';

const renderHome = () =>
  render(<IconSettings iconPath="/assets/icons"><Home /></IconSettings>);

test('renders the demo section cards', () => {
  renderHome();
  expect(screen.getByText('Input Components')).toBeInTheDocument();
  expect(screen.getByText('Selection Components')).toBeInTheDocument();
  expect(screen.getByText('Button Variants')).toBeInTheDocument();
  expect(screen.getByText('Badges')).toBeInTheDocument();
});

test('renders the text input with its label', () => {
  renderHome();
  expect(screen.getByText('Text Input')).toBeInTheDocument();
});

test('renders the footer credit line', () => {
  renderHome();
  expect(screen.getByText(/Built with Vite \+ React/i)).toBeInTheDocument();
});

test('clicking a button fires a toast with a title and message', () => {
  renderHome();
  fireEvent.click(screen.getByRole('button', { name: 'Base Button' }));
  // Two-line toast: variant title heading + message details (parity C31).
  expect(screen.getByText('Base')).toBeInTheDocument();
  expect(screen.getByText('Base button was clicked.')).toBeInTheDocument();
});

test('the feature toggle is exposed as a switch and flips on click (parity C08)', () => {
  renderHome();
  const toggle = screen.getByRole('switch', { name: /toggle switch/i });
  expect(toggle).not.toBeChecked();
  fireEvent.click(toggle);
  expect(toggle).toBeChecked();
});

test('email input shows an inline error for an invalid address', () => {
  renderHome();
  const email = screen.getByPlaceholderText('user@example.com');
  fireEvent.change(email, { target: { value: 'invalid' } });
  expect(
    screen.getByText('Enter a valid email address, such as name@email.com.')
  ).toBeInTheDocument();
});

test('email input clears the error for a valid address', () => {
  renderHome();
  const email = screen.getByPlaceholderText('user@example.com');
  fireEvent.change(email, { target: { value: 'invalid' } });
  fireEvent.change(email, { target: { value: 'name@email.com' } });
  expect(
    screen.queryByText('Enter a valid email address, such as name@email.com.')
  ).not.toBeInTheDocument();
});

test('opening the modal renders its content', () => {
  renderHome();
  fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));
  expect(screen.getByText('Demo Modal')).toBeInTheDocument();
  // Body copy (split by <strong> tags, so match a substring in one text node),
  // tagline, and footer buttons — mirroring the LWC demoModal.
  expect(screen.getByText(/to close with a result, or/i)).toBeInTheDocument();
  expect(screen.getByText(/built with design-system-react/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
});

test('renders the DSR date picker', () => {
  renderHome();
  expect(screen.getByLabelText('Date Picker')).toBeInTheDocument();
});
