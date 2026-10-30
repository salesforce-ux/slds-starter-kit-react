import { render, screen, fireEvent } from '@testing-library/react';
import { IconSettings } from '@salesforce/design-system-react';
import { expect, test, vi } from 'vitest';
import NotFound from './NotFound';

function renderNotFound(navigate = vi.fn()) {
  render(
    <IconSettings iconPath="/assets/icons">
      <NotFound navigate={navigate} />
    </IconSettings>
  );
  return navigate;
}

test('renders the not-found illustration, heading, and body copy', () => {
  renderNotFound();
  expect(screen.getByRole('heading', { name: /page not found/i })).toBeInTheDocument();
  expect(screen.getByText(/doesn't exist or has been moved/i)).toBeInTheDocument();
});

test('the Go to Home button navigates to the home route', () => {
  const navigate = renderNotFound();
  fireEvent.click(screen.getByRole('button', { name: /go to home/i }));
  expect(navigate).toHaveBeenCalledWith('/');
});
