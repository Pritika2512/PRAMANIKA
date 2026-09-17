import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryFilters } from "../../hooks/useQueryFilters.js";
import { getInstruments } from "../../services/instrumentService.js";
import {
  instrumentColumns,
  instrumentFilters,
} from "../../config/instrumentConfig.js";
import { paths, instrumentPath } from "../../config/navigationConfig.js";
import { useResource } from "../../hooks/useResource.js";
import {
  Button,
  Card,
  PageHeader,
  LoadingState,
  ErrorState,
} from "../../components/common/ui.jsx";
import RecordToolbar from "../../components/common/RecordToolbar.jsx";
import DataTable from "../../components/common/DataTable.jsx";
import Icon from "../../components/common/Icon.jsx";
import { EditInstrumentModal } from "../../components/instruments/InstrumentForm.jsx";
export default function InstrumentList() {
  const { data, loading, error, reload } = useResource(getInstruments);
  const { params, update, clear } = useQueryFilters();
  const [editing, setEditing] = useState(null);
  const nav = useNavigate();
  const search = params.get("q") || "";
  const filters = Object.fromEntries(
    instrumentFilters.map((f) => [f.key, params.get(f.key) || ""]),
  );
  const rows = (data || []).filter(
    (row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      Object.entries(filters).every(
        ([key, value]) => !value || row[key] === value,
      ) &&
      (!params.has("attention") || ["EXPIRED", "FAILED"].includes(row.status)),
  );
  const columns = instrumentColumns.map((c) =>
    c.key === "actions"
      ? {
          ...c,
          render: (row) => (
            <div className="row-actions">
              <Button
                variant="icon"
                to={instrumentPath(row.id)}
                aria-label={"View " + row.id}
              >
                <Icon name="Eye" size={17} />
              </Button>
              <Button
                variant="icon"
                aria-label={"Edit " + row.id}
                onClick={() => setEditing(row)}
              >
                <Icon name="Pencil" size={17} />
              </Button>
            </div>
          ),
        }
      : c,
  );
  return (
    <>
      <PageHeader
        page="instruments"
        actions={
          <Button to={paths.instrumentRegister}>
            <Icon name="PlusCircle" size={17} />
            Register instrument
          </Button>
        }
      />
      <Card>
        <RecordToolbar
          search={search}
          onSearch={(value) => update("q", value)}
          filters={instrumentFilters}
          values={filters}
          onFilter={update}
          placeholder="Search ID, owner, serial number…"
          extraActive={params.has("attention")}
          onClear={clear}
        />
        {params.has("attention") && (
          <p className="filter-note">Showing expired and failed instruments.</p>
        )}
        {error ? (
          <ErrorState message={error} retry={reload} />
        ) : loading ? (
          <LoadingState />
        ) : (
          <DataTable
            key={params.toString()}
            columns={columns}
            rows={rows}
            label="Instrument registry"
            onRowClick={(row) => nav(instrumentPath(row.id))}
          />
        )}
      </Card>
      <EditInstrumentModal
        instrument={editing}
        onClose={() => setEditing(null)}
        onSaved={reload}
      />
    </>
  );
}
