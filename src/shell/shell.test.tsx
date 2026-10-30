import { render, screen, fireEvent, within } from '@testing-library/react';
import { IconSettings } from '@salesforce/design-system-react';
import App from '../App';

function renderApp(path = '/app') {
  history.replaceState({}, '', path);
  return render(
    <IconSettings iconPath="/assets/icons">
      <App />
    </IconSettings>
  );
}

test('renders the global header search box', () => {
  renderApp();
  expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
});

test('renders navigation tabs for the standard app pages', () => {
  renderApp();
  expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /contacts/i })).toBeInTheDocument();
});

test('clicking a nav tab navigates and renders that page placeholder', () => {
  renderApp();
  fireEvent.click(screen.getByRole('link', { name: /contacts/i }));
  expect(window.location.pathname).toBe('/app/contacts');
  // Scoped to <main>: the nav tab label and the Contacts page (PageHeader
  // label/title, table id, column header, etc.) all render text matching
  // /contacts/i, so an unscoped/untyped getByText is ambiguous. The page
  // heading is the single unambiguous anchor for "the Contacts page loaded".
  // See task-6-report.md and task-8-report.md.
  expect(
    within(screen.getByRole('main')).getByRole('heading', { name: /all contacts/i })
  ).toBeInTheDocument();
});

test('standard app renders the plain tab bar, not the console object switcher', () => {
  renderApp('/app');
  // Standard variant: secondary nav renders page tabs as links; there is no
  // object-switcher "tab" role element.
  expect(screen.getByRole('link', { name: /icons/i })).toBeInTheDocument();
  expect(screen.queryByRole('tab')).not.toBeInTheDocument();
});

test('console app renders the object switcher instead of the standard tabs', () => {
  renderApp('/console');
  // Console variant: the current page shows as a role="tab" in the primary
  // bar, and the standard secondary-bar page links are replaced by a divider
  // placeholder (so no per-page nav links are rendered when closed).
  expect(screen.getByRole('tab', { name: /home/i })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /icons/i })).not.toBeInTheDocument();
});

test('console object switcher lists the app pages and navigates on select', () => {
  renderApp('/console');
  fireEvent.click(screen.getByRole('button', { name: /open object switcher menu/i }));
  const menu = screen.getByRole('menu');
  expect(within(menu).getByText('Home')).toBeInTheDocument();
  expect(within(menu).getByText('Icons')).toBeInTheDocument();
  expect(within(menu).getByText('Contacts')).toBeInTheDocument();

  fireEvent.click(within(menu).getByText('Icons'));
  expect(window.location.pathname).toBe('/console/icons');
});

test('favorites renders as a grouped pill: a star button + a chevron menu', () => {
  renderApp();
  const star = screen.getByRole('button', { name: /toggle favorites/i });
  // The star and the chevron menu share one .slds-button-group (the segmented
  // pill), matching the LWC lightning-button-group.
  expect(star.closest('.slds-button-group')).not.toBeNull();

  fireEvent.click(screen.getByRole('button', { name: /view favorites/i }));
  expect(within(screen.getByRole('menu')).getByText('Menu Item One')).toBeInTheDocument();
});

test('the Global Actions button-menu opens', () => {
  renderApp();
  fireEvent.click(screen.getByRole('button', { name: /global actions/i }));
  expect(within(screen.getByRole('menu')).getByText('Menu Item One')).toBeInTheDocument();
});

test('the Help button-menu opens', () => {
  renderApp();
  fireEvent.click(screen.getByRole('button', { name: /salesforce help/i }));
  expect(within(screen.getByRole('menu')).getByText('Menu Item One')).toBeInTheDocument();
});

test('selecting Dark in the profile menu switches the theme and persists it', () => {
  // Exercises the real useColorMode <-> ProfileMenu wiring: opening the
  // dropdown and choosing "Dark" should flip the body class and write
  // through to localStorage, exactly like a user toggling the theme.
  localStorage.clear();
  document.body.className = '';
  renderApp();

  fireEvent.click(screen.getByRole('button', { name: /open profile menu/i }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Dark' }));

  expect(document.body.classList.contains('slds-color-scheme_dark')).toBe(true);
  expect(localStorage.getItem('slds-ui-color-mode')).toBe('dark');
});

test('enabling Vertical Nav shows the rail and hides the waffle', () => {
  localStorage.clear();
  renderApp();
  // waffle present initially
  expect(screen.getByRole('button', { name: /app launcher/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /open profile menu/i }));
  fireEvent.click(screen.getByRole('menuitem', { name: 'Enabled' }));

  // rail appears (app-switch links labelled by app name) and waffle is gone.
  // There are two elements named "App navigation" once the rail is up (the
  // rail <nav> and the secondary nav), so assert the count rather than using
  // the ambiguous singular getByRole.
  expect(screen.getAllByRole('navigation', { name: /app navigation/i })).toHaveLength(2);
  expect(screen.queryByRole('button', { name: /app launcher/i })).not.toBeInTheDocument();
  expect(localStorage.getItem('slds-ui-vertical-nav')).toBe('true');
});

test('profile menu shows the Design System group with both SLDS versions', () => {
  localStorage.clear();
  document.head.querySelectorAll('link[data-slds]').forEach((l) => l.remove());
  renderApp();

  fireEvent.click(screen.getByRole('button', { name: /open profile menu/i }));
  const menu = screen.getByRole('menu');
  // Query by text: DSR marks the *selected* row as role="menuitemcheckbox"
  // and unselected rows as role="menuitem", so a role query would be brittle.
  expect(within(menu).getByText('Design System')).toBeInTheDocument();
  expect(within(menu).getByText('SLDS 1')).toBeInTheDocument();
  expect(within(menu).getByText('SLDS 2')).toBeInTheDocument();
  // On SLDS 2 the Color Mode group is present.
  expect(within(menu).getByText('Color Mode')).toBeInTheDocument();
});

test('selecting SLDS 1 persists the version and hides the Color Mode group', () => {
  localStorage.clear();
  document.head.querySelectorAll('link[data-slds]').forEach((l) => l.remove());
  renderApp();

  fireEvent.click(screen.getByRole('button', { name: /open profile menu/i }));
  fireEvent.click(within(screen.getByRole('menu')).getByText('SLDS 1'));
  expect(localStorage.getItem('slds-ui-slds-version')).toBe('1');

  // The menu stays open after a selection (parity A07) and re-renders in place:
  // SLDS 1 has no dark scheme, so the Color Mode group is now gone, while the
  // Design System group (to switch back) remains. No reopen needed — clicking
  // the trigger again would toggle the still-open menu closed.
  const menu = screen.getByRole('menu');
  expect(within(menu).getByText('Design System')).toBeInTheDocument();
  expect(within(menu).queryByText('Color Mode')).not.toBeInTheDocument();
  expect(within(menu).queryByText('Dark')).not.toBeInTheDocument();
});

test('the waffle opens the app launcher and switching apps changes the path', () => {
  localStorage.clear();
  renderApp('/app');
  fireEvent.click(screen.getByRole('button', { name: /app launcher/i }));
  const consoleItem = screen.getByRole('menuitem', { name: /console app/i });
  expect(consoleItem).toBeInTheDocument();
  fireEvent.click(consoleItem);
  expect(window.location.pathname).toBe('/console');
});

test('pressing Escape closes the open app launcher', () => {
  // GlobalNavigation's useEffect listens for a document 'keydown' and closes
  // the menu on Escape.
  localStorage.clear();
  renderApp('/app');
  fireEvent.click(screen.getByRole('button', { name: /app launcher/i }));
  expect(screen.getByRole('menu', { name: /app launcher/i })).toBeInTheDocument();

  fireEvent.keyDown(document, { key: 'Escape' });

  expect(screen.queryByRole('menu', { name: /app launcher/i })).not.toBeInTheDocument();
});

test('clicking outside the app launcher closes it', () => {
  // GlobalNavigation's useEffect listens for a document 'click' (not
  // 'mousedown') outside the launcher ref and closes the menu.
  localStorage.clear();
  renderApp('/app');
  fireEvent.click(screen.getByRole('button', { name: /app launcher/i }));
  expect(screen.getByRole('menu', { name: /app launcher/i })).toBeInTheDocument();

  fireEvent.click(document.body);

  expect(screen.queryByRole('menu', { name: /app launcher/i })).not.toBeInTheDocument();
});

test('missing Console pages retain Console chrome and offer recovery', () => {
  renderApp('/console/missing');
  expect(screen.getByRole('heading', { name: 'Page Not Found' })).toBeInTheDocument();
  expect(screen.getByText('Console App')).toBeInTheDocument();
  expect(screen.getByRole('tab', { name: 'Page Not Found' })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Go to Home' }));
  expect(location.pathname).toBe('/console');
});

test.each(['/builder', '/builder/missing', '/builder/contacts'])('Builder owns its full prefix: %s', (path) => {
  renderApp(path);
  expect(screen.getByLabelText('Builder canvas')).toBeInTheDocument();
  expect(screen.queryByRole('heading', { name: 'Page Not Found' })).toBeNull();
  expect(document.title).toBe('Builder');
});

test('navigation has real URLs and modified clicks keep the current page', () => {
  renderApp('/app');
  const link = screen.getByRole('link', { name: 'Contacts' });
  expect(link).toHaveAttribute('href', '/app/contacts');
  fireEvent.click(link, { ctrlKey: true });
  expect(location.pathname).toBe('/app');
});
