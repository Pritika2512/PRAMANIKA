import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createInstrument } from "../../services/instrumentService.js";
import {
  instrumentPath,
  paths,
  pageConfig,
} from "../../config/navigationConfig.js";
import { InstrumentForm } from "../../components/instruments/InstrumentForm.jsx";
import { PageHeader, Breadcrumb, Button } from "../../components/common/ui.jsx";
import { Modal } from "../../components/common/Modal.jsx";
import Icon from "../../components/common/Icon.jsx";
import { useToast } from "../../hooks/useToast.jsx";
export default function InstrumentRegistration() {
  const [created, setCreated] = useState(null);
  const nav = useNavigate();
  const notify = useToast();
  const finish = () => nav(instrumentPath(created.id));
  return (
    <>
      <Breadcrumb
        items={[
          { label: pageConfig.instruments.title, to: paths.instruments },
          { label: "New registration" },
        ]}
      />
      <PageHeader page="instrumentRegister" />
      <div className="registration-layout">
        <InstrumentForm
          submitLabel="Register instrument"
          onCancel={() => nav(paths.instruments)}
          onSubmit={async (values) => {
            const record = await createInstrument(values);
            setCreated(record);
            notify("Instrument registered successfully.");
          }}
        />
        <aside className="registration-guide">
          <span className="section-icon">
            <Icon name="Scale" size={25} />
          </span>
          <h3>A complete record starts here</h3>
          <p>
            Keep the manufacturer nameplate and owner contact details ready.
          </p>
          <ol>
            <li>Enter the instrument specifications</li>
            <li>Confirm the registered owner</li>
            <li>Save and receive an instrument ID</li>
          </ol>
          <small>New instruments are added with a pending status.</small>
        </aside>
      </div>
      <Modal
        open={!!created}
        onClose={finish}
        title="Instrument registered"
        footer={
          <Button onClick={finish}>
            View instrument details
            <Icon name="ArrowRight" size={16} />
          </Button>
        }
      >
        <div className="success-content">
          <Icon name="CheckCircle2" size={42} />
          <h3>{created?.id}</h3>
          <p>The record for {created?.owner} has been added to the registry.</p>
        </div>
      </Modal>
    </>
  );
}
