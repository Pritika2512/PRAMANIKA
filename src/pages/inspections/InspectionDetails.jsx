import { useCallback } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useParams } from "react-router-dom";

import {
  getInspectionById,
} from "../../services/inspectionService.js";

import {
  Breadcrumb,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  StatusBadge,
} from "../../components/common/ui.jsx";

import {
  formatDate,
} from "../../utils/format.js";

import {
  useResource,
} from "../../hooks/useResource.js";

const checks = [
  {
    key: "accuracy",
    label: "Accuracy check",
  },
  {
    key: "seal",
    label: "Seal check",
  },
  {
    key: "physical",
    label: "Physical condition",
  },
  {
    key: "compliance",
    label: "Standard compliance",
  },
];

function CheckResult({ value }) {
  const passed = value === "PASS";

  return (
    <span
      className={
        passed
          ? "check-result check-result-pass"
          : "check-result check-result-fail"
      }
    >
      {passed ? (
        <CheckCircle2 size={17} />
      ) : (
        <XCircle size={17} />
      )}

      {value}
    </span>
  );
}

export default function InspectionDetails() {
  const { id } = useParams();

  const loader = useCallback(
    () => getInspectionById(id),
    [id]
  );

  const {
    data,
    loading,
    error,
    reload,
  } = useResource(loader);

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        retry={reload}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Inspection not found"
        description="This inspection record may no longer be available."
        action={
          <Button to="/inspections">
            Back to inspections
          </Button>
        }
      />
    );
  }

  const passed = data.result === "PASSED";

  return (
    <>
      <Breadcrumb
        items={[
          {
            label: "Inspections",
            to: "/inspections",
          },
          {
            label: data.id,
          },
        ]}
      />

      <PageHeader
        title={data.id}
        description={`Inspection of ${data.instrumentId}`}
        actions={
          <Button
            variant="secondary"
            to="/inspections"
          >
            <ArrowLeft size={17} />
            Back
          </Button>
        }
      />

      <div className="details-layout">

        <div className="detail-sections">

          <Card title="Inspection information">
            <dl className="details-grid">
              <div>
                <dt>Inspection ID</dt>
                <dd>{data.id}</dd>
              </div>

              <div>
                <dt>Instrument ID</dt>
                <dd>{data.instrumentId}</dd>
              </div>

              <div>
                <dt>Inspector</dt>
                <dd>{data.inspector}</dd>
              </div>

              <div>
                <dt>Inspection date</dt>
                <dd>{formatDate(data.date)}</dd>
              </div>
            </dl>
          </Card>

          <Card
            title="Inspection checks"
            description="Results recorded during the verification."
          >
            <div className="inspection-detail-checks">
              {checks.map((check) => (
                <div
                  className="inspection-detail-check"
                  key={check.key}
                >
                  <span>{check.label}</span>

                  <CheckResult
                    value={data[check.key]}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card title="Inspector remarks">
            <p className="detail-description">
              {data.remarks || "No remarks recorded."}
            </p>
          </Card>

        </div>

        <div>

          <Card title="Inspection result">
            <div className="record-summary">

              <span className="record-emblem">
                {passed ? (
                  <CheckCircle2 size={40} />
                ) : (
                  <XCircle size={40} />
                )}
              </span>

              <StatusBadge
                status={
                  passed
                    ? "VERIFIED"
                    : "FAILED"
                }
              />

              <dl>
                <dt>Result</dt>
                <dd>{data.result}</dd>

                <dt>Certificate validity</dt>
                <dd>
                  {passed
                    ? `${data.validityMonths} months`
                    : "Not issued"}
                </dd>
              </dl>

              {passed && (
                <Button
                  to={`/certificates/by-inspection/${data.id}`}
                >
                  View certificate
                </Button>
              )}

            </div>
          </Card>

        </div>

      </div>
    </>
  );
}