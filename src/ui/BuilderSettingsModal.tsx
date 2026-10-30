import { useEffect, useState } from 'react';
import { Button, Input, Modal } from '@salesforce/design-system-react';

// Ports the LWC `ui/builderSettingsModal` (a lightning/modal): edits the page
// name and returns the trimmed value on Save. LWC opens it imperatively and
// awaits a result; the React port is a controlled dialog — `onSave` receives
// the trimmed name, `onCancel` dismisses. The draft value is seeded from
// `initialName` each time the modal opens.
type BuilderSettingsModalProps = {
  isOpen: boolean;
  initialName: string;
  onCancel: () => void;
  onSave: (name: string) => void;
};

export default function BuilderSettingsModal({
  isOpen,
  initialName,
  onCancel,
  onSave,
}: BuilderSettingsModalProps) {
  const [value, setValue] = useState(initialName);

  useEffect(() => {
    if (isOpen) setValue(initialName);
  }, [isOpen, initialName]);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen
      heading="Page Settings"
      onRequestClose={onCancel}
      footer={[
        <Button
          key="cancel"
          label="Cancel"
          variant="neutral"
          onClick={onCancel}
          title="Cancel"
        />,
        <Button
          key="save"
          className="slds-m-left_x-small"
          label="Save"
          variant="brand"
          onClick={() => onSave((value || '').trim())}
          title="Save"
        />,
      ]}
    >
      <div className="slds-p-around_medium">
        <Input
          label="Page Name"
          value={value}
          placeholder="Untitled Page"
          onChange={(_event, data) => setValue(data.value)}
        />
      </div>
    </Modal>
  );
}
