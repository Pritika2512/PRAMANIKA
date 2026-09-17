import { useCallback, useMemo, useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getVerificationHistory } from "../../services/verificationService.js";
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
  StatusBadge,
} from "../../components/common/ui.jsx";

import DataTable from "../../components/common/DataTable.jsx";
import { formatDate } from "../../utils/format.js";
import { paths, pageConfig } from "../../config/navigationConfig.js";

export default function VerificationHistory() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [result, setResult] = useState("");
  const [blockchainStatus, setBlockchainStatus] = useState("");

  const load = useCallback(
    () => getVerificationHistory(),
    [],
  );

  const {
    data,
    loading,
    error,
    reload,
  } = useResource(load);

  const rows = useMemo(() => {
    if (!data) return [];

    return data.filter((record) => {
      const searchText = `
        ${record.id}
        ${record.certificateId}
        ${record.instrumentId}
        ${record.inspector}
        ${record.result}
      `.toLowerCase();

      const matchesSearch =
        !search ||
        searchText.includes(search.toLowerCase());

      const matchesResult =
        !result ||
        record.result === result;

      const matchesBlockchain =
        !blockchainStatus ||
        record.blockchainStatus === blockchainStatus;

      return (
        matchesSearch &&
        matchesResult &&
        matchesBlockchain
      );
    });
  }, [data, search, result, blockchainStatus]);

  if (loading) {
    return <LoadingState label="Loading verification history…" />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        retry={reload}
      />
    );
  }

  const columns = [
    {
      key: "id",
      label: "Verification ID",
    },
    {
      key: "certificateId",
      label: "Certificate ID",
    },
    {
      key: "instrumentId",
      label: "Instrument ID",
    },
    {
      key: "inspector",
      label: "Inspector",
    },
    {
      key: "date",
      label: "Verification date",
      kind: "date",
    },
    {
      key: "result",
      label: "Result",
      kind: "status",
    },
    {
      key: "blockchainStatus",
      label: "Blockchain",
      sortable: false,
      render: (record) => (
        <StatusBadge
          status={record.blockchainStatus}
        />
      ),
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (record) => (
        <Button
          variant="ghost"
          onClick={() =>
            navigate(
              `/certificates/${record.certificateId}`,
            )
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
      <Breadcrumb
        items={[
          {
            label: pageConfig.verificationHistory.title,
          },
        ]}
      />

      <PageHeader
        title={pageConfig.verificationHistory.title}
        description={pageConfig.verificationHistory.subtitle}
      />

      <Card>
        <div className="record-toolbar">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search verification records…"
            label="Search verification records"
          />

          <FilterDropdown
            label="Result"
            value={result}
            onChange={setResult}
            options={[
              {
                value: "VERIFIED",
                label: "Verified",
              },
              {
                value: "PENDING",
                label: "Pending",
              },
              {
                value: "EXPIRED",
                label: "Expired",
              },
            ]}
          />

          <FilterDropdown
            label="Blockchain"
            value={blockchainStatus}
            onChange={setBlockchainStatus}
            options={[
              {
                value: "CONFIRMED",
                label: "Confirmed",
              },
              {
                value: "PENDING",
                label: "Pending",
              },
            ]}
          />
        </div>

        <DataTable
          columns={columns}
          rows={rows}
          label="Verification history records"
        />
      </Card>
    </>
  );
}