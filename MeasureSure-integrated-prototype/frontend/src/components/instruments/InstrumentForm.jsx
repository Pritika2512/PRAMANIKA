import { ConfigForm } from "../common/Forms.jsx";
import { Modal } from "../common/Modal.jsx";
import { instrumentSections } from "../../config/instrumentConfig.js";
import { updateInstrument } from "../../services/instrumentService.js";
import { useToast } from "../../hooks/useToast.jsx";
export function InstrumentForm(props) {
  return <ConfigForm sections={instrumentSections} {...props} />;
}
export function EditInstrumentModal({ instrument, onClose, onSaved }) {
  const notify = useToast();
  return (
    <Modal open={!!instrument} onClose={onClose} title="Edit instrument">
      {instrument && (
        <InstrumentForm
          key={instrument.id}
          compact
          initialValues={instrument}
          onCancel={onClose}
          onSubmit={async (values) => {
            await updateInstrument(instrument.id, values);
            notify("Instrument updated successfully.");
            onClose();
            onSaved();
          }}
        />
      )}
    </Modal>
  );
}
