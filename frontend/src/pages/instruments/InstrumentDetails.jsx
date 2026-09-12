import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { getInstrumentById } from "../../services/instrumentService.js";
import {
  instrumentSections,
  instrumentTypes,
} from "../../config/instrumentConfig.js";
import { paths, pageConfig } from "../../config/navigationConfig.js";
import { formatDate, optionLabel } from "../../utils/format.js";
import { useResource } from "../../hooks/useResource.js";
import {
  Breadcrumb,
  PageHeader,
  Card,
  StatusBadge,
  Button,
  LoadingState,
  ErrorState,
  EmptyState,
} from "../../components/common/ui.jsx";
import { EditInstrumentModal } from "../../components/instruments/InstrumentForm.jsx";
import Icon from "../../components/common/Icon.jsx";
export default function InstrumentDetails() {
  const { id } = useParams();
  const loader = useCallback(() => getInstrumentById(id), [id]);
  const { data, loading, error, reload } = useResource(loader);
  const [edit, setEdit] = useState(false);
  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} retry={reload} />;
  if (!data)
    return (
      <EmptyState
        title="Instrument not found"
        description="This record may be unavailable or the demo has been reloaded."
        action={<Button to={paths.instruments}>Back to registry</Button>}
      />
    );
  return (
    <>
      <Breadcrumb
        items={[
          { label: pageConfig.instruments.title, to: paths.instruments },
          { label: data.id },
        ]}
      />
      <PageHeader
        page="instrumentDetail"
        title={data.id}
        description={
          optionLabel(instrumentTypes, data.type) + " · " + data.manufacturer
        }
        actions={
          <div className="page-actions">
          <Button to={`/inspections/new?instrumentId=${encodeURIComponent(data.id)}`}>
            <Icon name="ClipboardCheck" size={17} />
            Perform inspection
          </Button>
          <Button variant="secondary" onClick={() => setEdit(true)}>
            <Icon name="Pencil" size={17} />
            Edit instrument
          </Button>
          </div>
        }
      />
      <div className="details-layout">
        <div className="detail-sections">
          {instrumentSections.map((section) => (
            <Card key={section.title} title={section.title}>
              <dl className="details-grid">
                {section.fields.map((field) => (
                  <div
                    className={field.wide ? "field-wide" : ""}
                    key={field.name}
                  >
                    <dt>{field.label}</dt>
                    <dd>
                      {field.options
                        ? optionLabel(field.options, data[field.name])
                        : data[field.name]}
                    </dd>
                  </div>
                ))}
              </dl>
            </Card>
          ))}
        </div>
        <Card title="Registration record">
          <div className="record-summary">
            <span className="record-emblem">
              <Icon name="Scale" size={40} />
            </span>
            <StatusBadge status={data.status} />
            <dl>
              <dt>Instrument ID</dt>
              <dd>{data.id}</dd>
              <dt>Registered on</dt>
              <dd>{formatDate(data.createdAt)}</dd>
            </dl>
            <p>Status is shown from the instrument registry.</p>
          </div>
        </Card>
      </div>
      <EditInstrumentModal
        instrument={edit ? data : null}
        onClose={() => setEdit(false)}
        onSaved={reload}
      />
    </>
  );
}
