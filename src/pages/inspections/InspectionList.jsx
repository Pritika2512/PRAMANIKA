import { useCallback, useMemo, useState } from "react";
import { ClipboardCheck, Eye, Plus } from "lucide-react";
import { Link } from "react-router-dom";

import {
  getInspections,
} from "../../services/inspectionService.js";

import {
  Breadcrumb,
  Button,
  Card,
  EmptyState,
  ErrorState,
  FilterDropdown,
  LoadingState,
  PageHeader,
  SearchBar,
  StatusBadge,
} from "../../components/common/ui.jsx";

import {
  formatDate,
} from "../../utils/format.js";

import {
  useResource,
} from "../../hooks/useResource.js";

export default function InspectionList() {
  const loader = useCallback(
    () => getInspections(),
    []
  );

  const {
    data,
    loading,
    error,
    reload,
  } = useResource(loader);

  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("");

  const inspections = data || [];

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return inspections.filter((item) => {
      const matchesSearch =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.instrumentId.toLowerCase().includes(query) ||
        item.inspector.toLowerCase().includes(query);

      const matchesResult =
        !resultFilter ||
        item.result === resultFilter;

      return matchesSearch && matchesResult;
    });
  }, [inspections, search, resultFilter]);

  if (loading) {
    return <LoadingState label="Loading inspections…" />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        retry={reload}
      />
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          {
            label: "Inspections",
          },
        ]}
      />

      <PageHeader
        title="Inspections"
        description="Review completed and recorded instrument inspections."
        actions={
          <Button to="/inspections/new">
            <Plus size={17} />
            New inspection
          </Button>
        }
      />

      <Card>
        <div className="record-toolbar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search inspection, instrument or inspector…"
          />

          <FilterDropdown
            label="Result"
            value={resultFilter}
            onChange={setResultFilter}
            options={[
              {
                value: "PASSED",
                label: "Passed",
              },
              {
                value: "FAILED",
                label: "Failed",
              },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            title="No inspections found"
            description="Try changing your search or filters."
          />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Inspection ID</th>
                  <th>Instrument</th>
                  <th>Inspector</th>
                  <th>Date</th>
                  <th>Result</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((inspection) => (
                  <tr key={inspection.id}>
                    <td>
                      <strong>{inspection.id}</strong>
                    </td>

                    <td>
                      {inspection.instrumentId}
                    </td>

                    <td>
                      {inspection.inspector}
                    </td>

                    <td>
                      {formatDate(inspection.date)}
                    </td>

                    <td>
                      <StatusBadge
                        status={
                          inspection.result === "PASSED"
                            ? "VERIFIED"
                            : "FAILED"
                        }
                      />
                    </td>

                    <td>
                      <Link
                        className="table-action"
                        to={`/inspections/${inspection.id}`}
                      >
                        <Eye size={16} />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}