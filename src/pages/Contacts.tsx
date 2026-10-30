import { useMemo, useState } from 'react';
import {
  SimpleDataTable,
  SimpleDataTableColumn,
  SimpleDataTableCell,
  SimpleDataTableRowActions,
  PageHeader,
  PageHeaderControl,
  Button,
  ButtonGroup,
  Dropdown,
  Icon,
  Input,
  InputIcon,
} from '@salesforce/design-system-react';
import { getAllContacts, type Contact } from '../data/contacts';

// Fields the LWC `contacts.js` `filteredData` getter searches across
// (name, company, title, email — not phone/mobile). Mirrored verbatim.
const SEARCH_FIELDS: (keyof Contact)[] = ['name', 'company', 'title', 'email'];

const ROW_ACTIONS = [
  { id: 0, label: 'View', value: 'view' },
  { id: 1, label: 'Edit', value: 'edit' },
  { id: 2, label: 'Delete', value: 'delete' },
];

// The list-view toolbar icons the LWC page header renders in its row-2 controls
// slot (contacts.html: List View Controls / Change view / Edit List / Refresh,
// then a Charts+Filters button group). Non-functional demo chrome — the LWC
// button-icons carry no onclick either. Kept as data so the markup stays flat.
const TOOLBAR_ICONS: { name: string; label: string }[] = [
  { name: 'settings', label: 'List View Controls' },
  { name: 'table', label: 'Change view' },
  { name: 'edit', label: 'Edit List' },
  { name: 'refresh', label: 'Refresh List' },
];

type SortDirection = 'asc' | 'desc';

type ContactsProps = {
  navigate: (path: string) => void;
};

export default function Contacts({ navigate }: ContactsProps) {
  const [rows, setRows] = useState<Contact[]>(() => getAllContacts());
  const [sortColumn, setSortColumn] = useState<keyof Contact>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selection, setSelection] = useState<Contact[]>([]);

  // Search filters first (matches LWC's `filteredData` getter: case-insensitive
  // substring match across name/company/title/email), then sort applies to the
  // filtered set. Delete (see handleRowAction) always operates on `rows` — the
  // full underlying list — by contact id, so it's unaffected by search/sort.
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((contact) =>
      SEARCH_FIELDS.some((field) => String(contact[field] ?? '').toLowerCase().includes(term))
    );
  }, [rows, searchTerm]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => {
      const av = String(a[sortColumn] ?? '').toLowerCase();
      const bv = String(b[sortColumn] ?? '').toLowerCase();
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sortColumn, sortDirection]);

  // 1-based row position for the row-number column. DSR's SimpleDataTable exposes
  // rowIndex only via an internal CellContext (off-limits — app code uses root
  // exports only), so the number is derived from the row's position in the
  // currently rendered `sorted` list (ids are unique). O(n) per row is fine for
  // this demo-sized list.
  const RowNumberCell = ({ item, ...props }: { item?: Contact }) => {
    const contact = item as Contact;
    const index = sorted.findIndex((c) => c.id === contact.id);
    return (
      <SimpleDataTableCell {...props} className="contacts-list__row-number">
        {index + 1}
      </SimpleDataTableCell>
    );
  };
  RowNumberCell.displayName = SimpleDataTableCell.displayName;

  // Custom cell that renders the contact name as an interactive, link-styled
  // button that navigates to the detail route (matches the LWC 'button' column
  // type with variant="base", which renders as a bold brand-blue link).
  // `item` is typed optional here because SimpleDataTableColumn clones this element
  // at runtime and injects `item`.
  const NameCell = ({ item, ...props }: { item?: Contact }) => {
    const contact = item as Contact;
    return (
      <SimpleDataTableCell title={contact.name} {...props}>
        <button
          type="button"
          className="slds-button slds-button_reset contacts-list__name-link"
          onClick={() => navigate(`/contacts/${contact.id}`)}
        >
          {contact.name}
        </button>
      </SimpleDataTableCell>
    );
  };
  NameCell.displayName = SimpleDataTableCell.displayName;

  // Phone renders as a tel: link (LWC 'phone' column type — blue link).
  const PhoneCell = ({ item, ...props }: { item?: Contact }) => {
    const contact = item as Contact;
    return (
      <SimpleDataTableCell title={contact.phone} {...props}>
        <a href={`tel:${contact.phone}`}>{contact.phone}</a>
      </SimpleDataTableCell>
    );
  };
  PhoneCell.displayName = SimpleDataTableCell.displayName;

  // Email renders as a mailto: link with a leading envelope icon (LWC 'email'
  // column type — blue link prefixed by a utility:email glyph).
  const EmailCell = ({ item, ...props }: { item?: Contact }) => {
    const contact = item as Contact;
    return (
      <SimpleDataTableCell title={contact.email} {...props}>
        <a href={`mailto:${contact.email}`} className="contacts-list__email-link">
          <Icon
            category="utility"
            name="email"
            size="x-small"
            containerClassName="contacts-list__email-icon"
            assistiveText={{ label: 'Email' }}
          />
          {contact.email}
        </a>
      </SimpleDataTableCell>
    );
  };
  EmailCell.displayName = SimpleDataTableCell.displayName;

  const handleSort = (sort: { property: string; sortDirection: SortDirection }) => {
    setSortColumn(sort.property as keyof Contact);
    setSortDirection(sort.sortDirection);
  };

  // Controlled row selection (DSR selectRows="checkbox"). onRowChange hands back
  // the full new selection array; mirror it into state so the checkboxes stay
  // in sync. Non-functional beyond the visual — the LWC datatable's checkboxes
  // drive nothing either.
  const handleRowChange = (_event: unknown, data: { selection: Record<string, unknown>[] }) => {
    setSelection(data.selection as Contact[]);
  };

  // Signature matches SimpleDataTableRowActionsProps['onAction']: (item, selection).
  const handleRowAction = (item: Record<string, unknown>, selectionArg: unknown) => {
    const contact = item as Contact;
    const action = selectionArg as { value: string };
    if (action.value === 'view') {
      navigate(`/contacts/${contact.id}`);
    } else if (action.value === 'delete') {
      setRows((cur) => cur.filter((c) => c.id !== contact.id));
    }
  };

  const columnLabels: Record<keyof Contact, string> = {
    id: 'Id',
    name: 'Name',
    title: 'Title',
    company: 'Account Name',
    email: 'Email',
    phone: 'Phone',
    mobile: 'Mobile',
    department: 'Department',
    mailingStreet: 'Mailing Street',
    mailingCity: 'Mailing City',
    mailingState: 'Mailing State',
    mailingZip: 'Mailing Zip',
    description: 'Description',
  };

  const meta = `${sorted.length} item${sorted.length !== 1 ? 's' : ''} • Sorted by ${columnLabels[sortColumn]} • Updated a few seconds ago`;

  // Two header controls, mirroring the LWC contacts template: the primary
  // button group, then a separate "More Actions" button-menu (border-filled
  // down chevron, right-aligned) holding "Printable View". Non-functional
  // demo chrome — the LWC button-menu has no onselect handler either.
  const actions = () => (
    <>
      <PageHeaderControl>
        <ButtonGroup variant="list">
          <Button label="New" />
          <Button label="Import" />
          <Button label="Add to Campaign" />
          <Button label="Send Email" />
        </ButtonGroup>
      </PageHeaderControl>
      <PageHeaderControl>
        {/* LWC's lightning-button-menu sets no width, so its menu is content-fit
            (SLDS default min-width). DSR's Dropdown defaults to
            slds-dropdown_medium (320px). width="xx-small" restores the LWC model:
            a 96px floor that grows to fit the label ("Printable View"). */}
        <Dropdown
          align="right"
          width="xx-small"
          iconCategory="utility"
          iconName="down"
          iconVariant="border-filled"
          assistiveText={{ icon: 'More Actions' }}
          options={[{ label: 'Printable View', value: 'printable' }]}
        />
      </PageHeaderControl>
    </>
  );

  // Row-2 controls, mirroring the LWC object-home page header: the search box
  // (`lightning-input type="search"`, label-hidden, placeholder "Search this
  // list..."), then the list-view toolbar button-icons and a Charts+Filters
  // group. DSR's Controls collects each PageHeaderControl child into the
  // .slds-page-header__col-controls slot, matching the LWC layout.
  const controls = () => (
    <>
      <PageHeaderControl>
        <Input
          type="search"
          placeholder="Search this list..."
          assistiveText={{ label: 'Search Contacts' }}
          value={searchTerm}
          onChange={(_event, data) => setSearchTerm(data.value)}
          // Magnifying-glass affordance + a Clear button once populated, matching
          // the LWC search variant (parity C07).
          iconLeft={<InputIcon name="search" category="utility" assistiveText={{ icon: 'Search' }} />}
          iconRight={
            searchTerm ? (
              <InputIcon
                name="clear"
                category="utility"
                assistiveText={{ icon: 'Clear' }}
                onClick={() => setSearchTerm('')}
              />
            ) : undefined
          }
        />
      </PageHeaderControl>
      {TOOLBAR_ICONS.map((icon) => (
        <PageHeaderControl key={icon.name}>
          <Button
            variant="icon"
            iconCategory="utility"
            iconName={icon.name}
            iconVariant="border-filled"
            assistiveText={{ icon: icon.label }}
            title={icon.label}
          />
        </PageHeaderControl>
      ))}
      <PageHeaderControl>
        <ButtonGroup>
          <Button
            variant="icon"
            iconCategory="utility"
            iconName="chart"
            iconVariant="border-filled"
            assistiveText={{ icon: 'Charts' }}
            title="Charts"
          />
          <Button
            variant="icon"
            iconCategory="utility"
            iconName="filterList"
            iconVariant="border-filled"
            assistiveText={{ icon: 'Filters' }}
            title="Filters"
          />
        </ButtonGroup>
      </PageHeaderControl>
    </>
  );

  return (
    <div className="slds-p-horizontal_medium">
      {/* `truncate` from the DSR __examples__/object-home.jsx sample isn't in
          this version's PageHeaderProps type, so it's omitted here. The
          nameSwitcherDropdown renders the LWC "Switch list view" chevron next
          to the title (bare down icon; non-functional demo chrome). */}
      <PageHeader
        icon={<Icon category="standard" name="contact" />}
        label="Contacts"
        title="All Contacts"
        info={meta}
        nameSwitcherDropdown={
          <Button
            variant="icon"
            iconCategory="utility"
            iconName="down"
            iconVariant="bare"
            iconSize="small"
            assistiveText={{ icon: 'Switch list view' }}
            title="Switch list view"
          />
        }
        onRenderActions={actions}
        onRenderControls={controls}
        variant="object-home"
      />
      <SimpleDataTable
        items={sorted}
        id="contacts-table"
        fixedLayout
        selectRows="checkbox"
        selection={selection}
        onRowChange={handleRowChange}
        onSort={handleSort}
      >
        <SimpleDataTableColumn label="" property="rowNumber" width="3.25rem">
          <RowNumberCell />
        </SimpleDataTableColumn>
        <SimpleDataTableColumn
          label="Name"
          property="name"
          primaryColumn
          sortable
          isSorted={sortColumn === 'name'}
          sortDirection={sortDirection}
        >
          <NameCell />
        </SimpleDataTableColumn>
        <SimpleDataTableColumn
          label="Account Name"
          property="company"
          sortable
          isSorted={sortColumn === 'company'}
          sortDirection={sortDirection}
        />
        <SimpleDataTableColumn
          label="Title"
          property="title"
          sortable
          isSorted={sortColumn === 'title'}
          sortDirection={sortDirection}
        />
        <SimpleDataTableColumn label="Phone" property="phone">
          <PhoneCell />
        </SimpleDataTableColumn>
        <SimpleDataTableColumn label="Email" property="email">
          <EmailCell />
        </SimpleDataTableColumn>
        {/* SimpleDataTableRowActions builds its menu with no `width`, so DSR falls
            back to the default `slds-dropdown_medium` (320px) — ~3x wider than
            the LWC list row-action menu. Pass a width-constrained Dropdown;
            SimpleDataTableRowActions merges this element's props over its defaults,
            yielding `slds-dropdown_xx-small` (96px) to match LWC. */}
        <SimpleDataTableRowActions
          options={ROW_ACTIONS}
          onAction={handleRowAction}
          dropdown={<Dropdown width="xx-small" />}
        />
      </SimpleDataTable>
    </div>
  );
}
