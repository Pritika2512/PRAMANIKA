import { useCallback, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getCertificates } from "../../services/certificateService.js";
import { getInstruments } from "../../services/instrumentService.js";
import { useResource } from "../../hooks/useResource.js";

import {
  Breadcrumb,
  Button,
  Card,
  ErrorState,
  FilterDropdown,
  LoadingState,
  PageHeader,
  SearchBar,
} from "../../components/common/ui.jsx";

import DataTable from "../../components/common/DataTable.jsx";
import { optionLabel } from "../../utils/format.js";
import { instrumentTypes } from "../../config/instrumentConfig.js";

export default function CertificateList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    const [certificates, instruments] = await Promise.all([
      getCertificates(),
      getInstruments(),
    ]);

    return {
      certificates,
      instruments,
    };
  }, []);

  const {
    data,
    loading,
    error,
    reload,
  } = useResource(load);

  const rows = useMemo(() => {
    if (!data) return [];

    const { certificates, instruments } = data;

    const instrumentMap = new Map(
      instruments.map((instrument) => [
        instrument.id,
        instrument,
      ])
    );

    return certificates
      .map((certificate) => ({
        ...certificate,
        instrument: instrumentMap.get(certificate.instrumentId),
      }))
      .filter((certificate) => {
        const searchText = `
          ${certificate.id}
          ${certificate.instrumentId}
          ${certificate.inspector}
          ${certificate.instrument?.owner || ""}
        `.toLowerCase();

        const matchesSearch =
          !search ||
          searchText.includes(search.toLowerCase());

        const matchesStatus =
          !status ||
          certificate.status === status;

        return matchesSearch && matchesStatus;
      });
  }, [data, search, status]);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} retry={reload} />;
  }

  const columns = [
    {
      key: "id",
      label: "Certificate ID",
    },

    {
      key: "instrumentId",
      label: "Instrument ID",
    },

    {
      key: "instrument",
      label: "Instrument",
      sortable: false,
      render: (row) => (
        <div className="cell-stack">
          <strong>
            {optionLabel(
              instrumentTypes,
              row.instrument?.type
            )}
          </strong>

          <small>
            {row.instrument?.owner || "—"}
          </small>
        </div>
      ),
    },

    {
      key: "issueDate",
      label: "Issue date",
      kind: "date",
    },

    {
      key: "validUntil",
      label: "Valid until",
      kind: "date",
    },

    {
      key: "status",
      label: "Status",
      kind: "status",
    },

    {
      key: "blockchainStatus",
      label: "Blockchain",
      sortable: false,
      render: (row) => (
        <span
          className={`blockchain-pill ${
            row.blockchainStatus === "CONFIRMED"
              ? "confirmed"
              : "pending"
          }`}
        >
          <i />
          {row.blockchainStatus}
        </span>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (row) => (
        <Button
          variant="ghost"
          onClick={() =>
            navigate(`/certificates/${row.id}`)
          }
        >
          <Eye size={16} />
          View
        </Button>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb items={[{ label: "Certificates" }]} />

      <PageHeader
        title="Certificates"
        description="Review digital verification certificates issued for compliant instruments."
      />

      <Card>
        <div className="record-toolbar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search certificates…"
            label="Search certificates"
          />

          <FilterDropdown
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              {
                value: "ACTIVE",
                label: "Active",
              },
              {
                value: "EXPIRED",
                label: "Expired",
              },
              {
                value: "REVOKED",
                label: "Revoked",
              },
            ]}
          />
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          label="Certificate records"
        />
      </Card>
    </>
  );
}
