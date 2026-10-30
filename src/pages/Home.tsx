import { useRef, useState } from 'react';
import {
  Card,
  Input,
  Combobox,
  Checkbox,
  RadioGroup,
  Radio,
  Slider,
  Textarea,
  Button,
  Badge,
  Spinner,
  Modal,
  Toast,
  ToastContainer,
  DatePicker,
} from '@salesforce/design-system-react';
import HomeIntro from '../ui/HomeIntro';
import '../styles/home.css';

const comboboxOptions = [
  { id: 'option1', label: 'Option 1' },
  { id: 'option2', label: 'Option 2' },
  { id: 'option3', label: 'Option 3' },
];

const checkboxOptions = [
  { id: 'checkbox1', label: 'Checkbox Option 1' },
  { id: 'checkbox2', label: 'Checkbox Option 2' },
  { id: 'checkbox3', label: 'Checkbox Option 3' },
];

const radioOptions = [
  { id: 'option1', label: 'Radio Option 1' },
  { id: 'option2', label: 'Radio Option 2' },
  { id: 'option3', label: 'Radio Option 3' },
];

type ToastEntry = {
  id: number;
  title: string;
  message: string;
  variant: 'info' | 'success' | 'warning' | 'error';
};

// Simple email shape check for the inline-validation demo (parity C06).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Render dates as "Sep 17, 2026" to match the LWC date field (parity C03);
// DSR's default formatter emits "9/17/2026".
const formatDatePickerValue = (date?: Date | null): string =>
  date instanceof Date && !Number.isNaN(date.getTime())
    ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

// Custom parser (round-trips the formatted string and avoids DSR's default-parser
// deprecation warning).
const parseDatePickerValue = (str: string): Date => new Date(str);

export default function Home() {
  const toastId = useRef(0);
  const [inputValue, setInputValue] = useState('');
  const [emailValue, setEmailValue] = useState('');
  const [dateValue, setDateValue] = useState<Date | undefined>(undefined);
  const [checkboxGroupValues, setCheckboxGroupValues] = useState<string[]>([]);
  const [selectedRadioValue, setSelectedRadioValue] = useState('option1');
  const [comboboxSelection, setComboboxSelection] = useState([comboboxOptions[0]]);
  const [toggleValue, setToggleValue] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);
  const [textAreaValue, setTextAreaValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastEntry[]>([]);

  const showToast = (title: string, message: string, variant: ToastEntry['variant'] = 'info') => {
    toastId.current += 1;
    setToasts((current) => [...current, { id: toastId.current, title, message, variant }]);
  };

  // Inline email validation: only flag a non-empty value that fails the shape
  // check, matching the LWC "Enter a valid email address..." error.
  const emailError =
    emailValue.trim() !== '' && !EMAIL_PATTERN.test(emailValue.trim())
      ? 'Enter a valid email address, such as name@email.com.'
      : undefined;

  const toggleCheckboxValue = (id: string, checked: boolean) => {
    setCheckboxGroupValues((current) =>
      checked ? [...current, id] : current.filter((value) => value !== id)
    );
  };

  return (
    <div className="slds-container_x-large slds-container_center slds-m-top_large slds-p-horizontal_large">
      <div className="slds-m-bottom_large">
        <HomeIntro />
      </div>

      <Card heading="Input Components" className="slds-m-bottom_large">
        <div className="slds-grid slds-wrap slds-gutters">
          <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-2">
            <Input
              label="Text Input"
              placeholder="Enter some text..."
              value={inputValue}
              onChange={(_event, data) => setInputValue(data.value)}
            />
          </div>
          <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-2 slds-m-top_small home-input-item-second">
            <Input
              type="email"
              label="Email Input"
              placeholder="user@example.com"
              value={emailValue}
              errorText={emailError}
              onChange={(_event, data) => setEmailValue(data.value)}
            />
          </div>
          <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-2 slds-m-top_small">
            <Input type="tel" label="Phone Number" placeholder="(555) 555-5555" />
          </div>
          <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-2 slds-m-top_small">
            <DatePicker
              // Empty placeholder (LWC shows none) + full-column width via the
              // block trigger class (parity C02/C03).
              labels={{ label: 'Date Picker', placeholder: '' }}
              triggerClassName="home-datepicker"
              formatter={formatDatePickerValue}
              parser={parseDatePickerValue}
              value={dateValue}
              onChange={(_event, data) => setDateValue(data.date)}
            />
          </div>
        </div>
      </Card>

      <Card heading="Selection Components" className="slds-m-bottom_large">
        <div className="slds-grid slds-wrap slds-gutters">
          <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-2">
            <fieldset>
              <legend className="slds-form-element__label slds-m-bottom_x-small">
                Checkbox Group
              </legend>
              {checkboxOptions.map((option) => (
                <Checkbox
                  key={option.id}
                  id={option.id}
                  labels={{ label: option.label }}
                  checked={checkboxGroupValues.includes(option.id)}
                  onChange={(_event, data) => toggleCheckboxValue(option.id, data.checked)}
                />
              ))}
            </fieldset>
          </div>
          <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-2 slds-m-top_small home-input-item-second">
            <RadioGroup labels={{ label: 'Radio Group' }}>
              {radioOptions.map((option) => (
                <Radio
                  key={option.id}
                  id={option.id}
                  labels={{ label: option.label }}
                  value={option.id}
                  checked={selectedRadioValue === option.id}
                  onChange={() => setSelectedRadioValue(option.id)}
                />
              ))}
            </RadioGroup>
          </div>
          <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-2 slds-m-top_small">
            <Combobox
              id="home-combobox"
              labels={{ label: 'Combobox', placeholder: 'Select an option' }}
              options={comboboxOptions}
              selection={comboboxSelection}
              value=""
              variant="readonly"
              events={{
                onSelect: (_event, data) =>
                  setComboboxSelection(
                    data.selection.map((option) => ({
                      id: String(option.id ?? ''),
                      label: String(option.label ?? ''),
                    }))
                  ),
              }}
            />
          </div>
          <div className="slds-col slds-size_1-of-1 slds-medium-size_1-of-2 slds-m-top_small">
            <Checkbox
              variant="toggle"
              // Match the LWC toggle (parity C08): a "Toggle Switch" field
              // label, Active/Inactive state text, and role="switch" so the
              // control is announced as a switch (not a plain checkbox) — the
              // standard ARIA switch pattern layered on the native checkbox.
              role="switch"
              labels={{
                label: 'Toggle Switch',
                toggleEnabled: 'Active',
                toggleDisabled: 'Inactive',
              }}
              checked={toggleValue}
              onChange={(_event, data) => setToggleValue(data.checked)}
            />
          </div>
        </div>
      </Card>

      <Card heading="Other Input Types" className="slds-m-bottom_large">
        <div className="slds-m-bottom_medium">
          <Slider
            label="Slider Control"
            value={sliderValue}
            min={0}
            max={100}
            step={5}
            onChange={(_event, data) => setSliderValue(data.value)}
          />
          <div className="slds-text-body_small slds-m-top_x-small">
            Current Value: {sliderValue}
          </div>
        </div>
        <Textarea
          label="Text Area"
          placeholder="Enter multiple lines of text..."
          value={textAreaValue}
          onChange={(event) => setTextAreaValue(event.target.value)}
        />
      </Card>

      <Card heading="Button Variants" className="slds-m-bottom_large">
        {/*
          No slds-button-group wrapper: the LWC original wraps these in one, but
          each <lightning-button> renders its .slds-button inside a shadow root,
          so the group's `:first-child`/`:last-child` border-radius rules never
          match and the buttons stay fully-rounded pills. DSR renders .slds-button
          directly in the light DOM, so a group here would flatten the inner edges
          into a segmented control. A plain row + per-button margins matches the
          LWC visual (separate pills).
        */}
        <div>
          <Button
            className="slds-m-right_x-small"
            label="Base Button"
            onClick={() => showToast('Base', 'Base button was clicked.', 'info')}
          />
          <Button
            className="slds-m-right_x-small"
            variant="brand"
            label="Brand Button"
            onClick={() => showToast('Brand', 'Brand button was clicked.', 'info')}
          />
          <Button
            className="slds-m-right_x-small"
            variant="success"
            label="Success Button"
            onClick={() => showToast('Success', 'Success button was clicked.', 'success')}
          />
          <Button
            className="slds-m-right_x-small"
            variant="neutral"
            label="Neutral Button"
            onClick={() => showToast('Neutral', 'Neutral button was clicked.', 'info')}
          />
          <Button
            variant="destructive"
            label="Destructive Button"
            onClick={() => showToast('Destructive', 'Destructive button was clicked.', 'error')}
          />
        </div>
      </Card>

      <Card heading="Icon Buttons" className="slds-m-bottom_large">
        {/*
          iconVariant="border" gives the bordered circular icon button that the
          LWC <lightning-button-icon> renders by default. Plain row (no
          slds-button-group) for the same shadow-DOM reason as Button Variants
          above — separate bordered circles, matching the LWC visual.
        */}
        <div>
          <Button
            className="slds-m-right_x-small"
            variant="icon"
            iconVariant="border"
            iconCategory="utility"
            iconName="download"
            assistiveText={{ icon: 'Download' }}
            title="Download"
          />
          <Button
            className="slds-m-right_x-small"
            variant="icon"
            iconVariant="border"
            iconCategory="utility"
            iconName="edit"
            assistiveText={{ icon: 'Edit' }}
            title="Edit"
          />
          <Button
            className="slds-m-right_x-small"
            variant="icon"
            iconVariant="border"
            iconCategory="utility"
            iconName="delete"
            assistiveText={{ icon: 'Delete' }}
            title="Delete"
          />
          <Button
            variant="icon"
            iconVariant="border"
            iconCategory="utility"
            iconName="refresh"
            assistiveText={{ icon: 'Refresh' }}
            title="Refresh"
          />
        </div>
      </Card>

      <Card heading="Badges" className="slds-m-bottom_large">
        {/*
          Match the LWC originals, which are neutral badges (no theme color):
          only the Success badge carries slds-badge_lightest; the rest are
          default. DSR's color="success|warning|error" would tint them
          green/yellow/red, diverging from the LWC visual.
        */}
        <Badge content="Default Badge" />
        <Badge className="slds-m-left_small slds-badge_lightest" content="Success Badge" />
        <Badge className="slds-m-left_small" content="Warning Badge" />
        <Badge className="slds-m-left_small" content="Error Badge" />
      </Card>

      <Card heading="Modal Demo" className="slds-m-bottom_large">
        <p className="slds-m-bottom_small slds-text-body_regular">
          Click the button below to open a modal built with <code>design-system-react</code>.
        </p>
        <Button
          label="Open modal"
          variant="brand"
          onClick={() => setModalOpen(true)}
          title="Open demo modal"
        />
      </Card>

      <Card heading="Popover" className="slds-m-bottom_large">
        {/*
          The LWC original renders its ui-popover component as always-visible static
          markup (no click-to-open trigger) — see
          design-system-2-starter-kit/src/modules/ui/popover/popover.html. Match that
          here with plain slds-popover markup instead of DSR's Popover, which is a
          trigger/overlay component.
        */}
        <div className="slds-p-around_medium popover-demo">
          <section className="slds-popover slds-nubbin_left" role="dialog" aria-label="Base popover">
            <Button
              className="slds-button_icon-small slds-float_right slds-popover__close"
              variant="icon"
              iconCategory="utility"
              iconName="close"
              assistiveText={{ icon: 'Close dialog' }}
              title="Close dialog"
            />
            <header className="slds-popover__header">
              <h2 className="slds-text-heading_small">Base popover</h2>
            </header>
            <div className="slds-popover__body">
              Base popover with a header, close button, and a left nubbin.
            </div>
          </section>
          <section
            className="slds-popover slds-popover_warning slds-nubbin_left"
            role="dialog"
            aria-label="Warning"
          >
            <Button
              className="slds-button_icon-small slds-float_right slds-popover__close"
              variant="icon"
              iconCategory="utility"
              iconName="close"
              inverse
              assistiveText={{ icon: 'Close dialog' }}
              title="Close dialog"
            />
            <header className="slds-popover__header">
              <h2 className="slds-text-heading_small">Warning</h2>
            </header>
            <div className="slds-popover__body">
              Something looks off. Use the warning variant for cautionary messages.
            </div>
          </section>
          <section
            className="slds-popover slds-popover_error slds-nubbin_left"
            role="dialog"
            aria-label="Error"
          >
            <Button
              className="slds-button_icon-small slds-float_right slds-popover__close"
              variant="icon"
              iconCategory="utility"
              iconName="close"
              inverse
              assistiveText={{ icon: 'Close dialog' }}
              title="Close dialog"
            />
            <header className="slds-popover__header">
              <h2 className="slds-text-heading_small">Error</h2>
            </header>
            <div className="slds-popover__body">
              Something went wrong. Use the error variant for destructive or blocking messages.
            </div>
          </section>
        </div>
      </Card>

      <Card heading="Loading Spinner" className="slds-m-bottom_large">
        <div className="slds-align_absolute-center slds-is-relative spinner-demo">
          <Spinner assistiveText={{ label: 'Loading' }} size="medium" variant="base" />
        </div>
      </Card>

      <div className="slds-text-align_center slds-m-top_large slds-m-bottom_large slds-text-color_weak">
        Built with Vite + React + design-system-react + SLDS
      </div>

      {modalOpen && (
        // Mirrors the LWC demoModal (modal-header + body + footer): a tagline
        // under the heading, the same body copy, and a Cancel/Confirm footer.
        // Both footer buttons just close the modal — the LWC handleConfirm
        // returns 'confirmed' but home.js never consumes the result.
        <Modal
          isOpen
          // medium = width:70% (~896px at desktop), matching the LWC dialog
          // width; DSR's default is a narrower 640px (parity C15).
          size="medium"
          heading="Demo Modal"
          tagline="This is a demo modal built with design-system-react."
          onRequestClose={() => setModalOpen(false)}
          footer={[
            <Button
              key="cancel"
              label="Cancel"
              variant="neutral"
              onClick={() => setModalOpen(false)}
              title="Cancel"
            />,
            <Button
              key="confirm"
              className="slds-m-left_x-small"
              label="Confirm"
              variant="brand"
              onClick={() => setModalOpen(false)}
              title="Confirm"
            />,
          ]}
        >
          <p className="slds-p-around_small">
            Click <strong>Confirm</strong> to close with a result, or <strong>Cancel</strong> to
            dismiss.
          </p>
        </Modal>
      )}

      <ToastContainer>
        {toasts.map((t) => (
          // duration auto-dismisses so toasts don't accumulate (parity C30);
          // heading = variant title + details = message reproduces the LWC
          // two-line toast (parity C31).
          <Toast
            key={t.id}
            variant={t.variant}
            duration={3000}
            labels={{ heading: t.title, details: t.message }}
            onRequestClose={() => setToasts((cur) => cur.filter((x) => x.id !== t.id))}
          />
        ))}
      </ToastContainer>
    </div>
  );
}
