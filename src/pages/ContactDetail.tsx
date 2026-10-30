import { useState } from 'react';
import {
  PageHeader,
  PageHeaderControl,
  Card,
  Button,
  ButtonGroup,
  Dropdown,
  Icon,
} from '@salesforce/design-system-react';
import { getContactById } from '../data/contacts';
import '../styles/contacts.css';

// Fixed activity feed ported verbatim from LWC `contactDetail.js`
// (ACTIVITY_ITEMS) — this app has no real activity data source yet, so the
// same 4 canned entries render for every contact. `type` drives the icon's
// assistive text (matches the LWC `alternative-text`). Icon names
// (log_a_call, email, event) all exist in the standard-sprite symbol set.
const ACTIVITY_ITEMS = [
  { id: 'a1', type: 'call', iconName: 'log_a_call', subject: 'Follow-up call', date: '3 days ago', description: 'Discussed renewal timeline and next steps.' },
  { id: 'a2', type: 'email', iconName: 'email', subject: 'Proposal sent', date: '1 week ago', description: 'Sent updated pricing proposal via email.' },
  { id: 'a3', type: 'event', iconName: 'event', subject: 'Quarterly review meeting', date: '2 weeks ago', description: 'Reviewed Q4 results and Q1 goals.' },
  { id: 'a4', type: 'call', iconName: 'log_a_call', subject: 'Introductory call', date: '1 month ago', description: 'Initial discovery call to understand requirements.' },
];

type ContactDetailProps = {
  params: { id?: string };
  navigate: (path: string) => void;
};

export default function ContactDetail({ params }: ContactDetailProps) {
  const contact = params.id ? getContactById(params.id) : undefined;
  const [following, setFollowing] = useState(false);

  if (!contact) {
    return (
      <div className="slds-illustration slds-illustration_small slds-p-around_large slds-text-align_center">
        <p className="slds-text-heading_medium">Contact not found</p>
      </div>
    );
  }

  const mailingAddress = `${contact.mailingStreet}, ${contact.mailingCity}, ${contact.mailingState} ${contact.mailingZip}`;

  // Contact Details card body — the LWC `cardFields` (read-only
  // lightning-input/textarea), rendered as static SLDS form elements
  // (bold label + value). Description spans the full grid width.
  const cardFields = [
    { key: 'name', label: 'Full Name', value: contact.name },
    { key: 'company', label: 'Account Name', value: contact.company },
    { key: 'title', label: 'Title', value: contact.title },
    { key: 'department', label: 'Department', value: contact.department },
    { key: 'email', label: 'Email', value: contact.email },
    { key: 'phone', label: 'Phone', value: contact.phone },
    { key: 'mobile', label: 'Mobile', value: contact.mobile },
    { key: 'mailingAddress', label: 'Mailing Address', value: mailingAddress },
    { key: 'description', label: 'Description', value: contact.description, fullWidth: true },
  ];

  // PageHeader summary row — the LWC `detailFields` (Company, Title, Email,
  // Phone). DSR PageHeader renders `details` as {label, content} pairs.
  const details = [
    { label: 'Company', content: contact.company },
    { label: 'Title', content: contact.title },
    { label: 'Email', content: contact.email },
    { label: 'Phone', content: contact.phone },
  ];

  const actions = () => (
    <PageHeaderControl>
      <Button
        label={following ? 'Following' : 'Follow'}
        variant={following ? 'brand' : 'neutral'}
        iconCategory="utility"
        iconName={following ? 'check' : 'add'}
        iconPosition="left"
        onClick={() => setFollowing((f) => !f)}
      />
      <ButtonGroup variant="list">
        <Button label="Edit" />
        <Button label="Delete" />
        <Button label="Clone" />
        {/* Content-fit width to match LWC's lightning-button-menu (no width set).
            DSR defaults to slds-dropdown_medium (320px); width="xx-small" floors
            at 96px and grows to fit the labels. See Contacts.tsx for rationale. */}
        <Dropdown
          align="right"
          width="xx-small"
          iconCategory="utility"
          iconName="down"
          iconVariant="border-filled"
          assistiveText={{ icon: 'More Actions' }}
          options={[
            { label: 'Send Email', value: 'send_email' },
            { label: 'Log a Call', value: 'log_call' },
            { label: 'Create Task', value: 'create_task' },
          ]}
        />
      </ButtonGroup>
    </PageHeaderControl>
  );

  const activityActions = (
    <ButtonGroup variant="list">
      <Button label="Log a Call" />
      <Button label="New Task" />
    </ButtonGroup>
  );

  return (
    <div className="slds-p-horizontal_medium">
      <PageHeader
        variant="record-home"
        icon={<Icon category="standard" name="contact" />}
        label="Contact"
        title={contact.name}
        details={details}
        onRenderActions={actions}
      />
      <div className="slds-grid slds-gutters slds-m-top_medium">
        <div className="slds-col slds-size_1-of-1 slds-medium-size_8-of-12">
          <Card heading="Contact Details">
            {/* slds-p-horizontal_small (0.5rem) not _medium: the DSR Card body
                already insets its content, so _medium double-padded the fields
                ~36px in from the card edge; the LWC record-home starts ~16px in
                (parity A13). */}
            <div className="c-contact-details-grid slds-p-horizontal_small slds-p-vertical_medium">
              {cardFields.map((f) => (
                <div
                  key={f.key}
                  className={`slds-form-element slds-form-element_stacked slds-form-element_readonly${
                    f.fullWidth ? ' c-contact-details-grid__full' : ''
                  }`}
                >
                  <span className="slds-form-element__label" id={`field-${f.key}-label`}>
                    {f.label}
                  </span>
                  <div className="slds-form-element__control">
                    {/* Expose each value as a read-only textbox so it carries
                        the same read-only form-control semantics as the LWC
                        lightning-input read-only field (parity C20), not just
                        anonymous static text. */}
                    <div
                      className="slds-form-element__static"
                      role="textbox"
                      aria-readonly="true"
                      aria-labelledby={`field-${f.key}-label`}
                    >
                      {f.value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
        <div className="slds-col slds-size_1-of-1 slds-medium-size_4-of-12">
          <Card heading="Activity" headerActions={activityActions}>
            {/* _small (not _medium): the Card body already insets its content,
                so activity rows started ~16px farther in than the LWC card;
                pull them toward the left edge (parity A14). */}
            <div className="slds-p-horizontal_small slds-p-bottom_small">
              <ul className="slds-timeline">
                {ACTIVITY_ITEMS.map((a) => (
                  <li key={a.id} className="slds-timeline__item">
                    <div className="slds-media slds-m-bottom_small">
                      <div className="slds-media__figure">
                        <Icon
                          category="standard"
                          name={a.iconName}
                          size="small"
                          assistiveText={{ label: a.type }}
                        />
                      </div>
                      <div className="slds-media__body">
                        <div className="slds-grid slds-grid_align-spread">
                          <p className="slds-truncate">
                            <strong>{a.subject}</strong>
                          </p>
                          <p className="slds-text-body_small slds-text-color_weak slds-no-flex">
                            {a.date}
                          </p>
                        </div>
                        <p className="slds-text-body_small slds-m-top_xx-small">{a.description}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
