import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  createInspection,
} from "../../services/inspectionService.js";

import {
  getInstruments,
} from "../../services/instrumentService.js";

import {
  createCertificateFromInspection,
} from "../../services/certificateService.js";

import {
  Button,
  Breadcrumb,
  Card,
  InlineError,
  LoadingState,
  PageHeader,
  StatusBadge,
} from "../../components/common/ui.jsx";

import {
  FormInput,
  FormSelect,
  FormActions,
} from "../../components/common/Forms.jsx";

import { instrumentTypes } from "../../config/instrumentConfig.js";
import { optionLabel, today } from "../../utils/format.js";
import { useToast } from "../../hooks/useToast.jsx";

const checks = [
  "accuracy",
  "seal",
  "physical",
  "compliance",
];

const labels = {
  accuracy: "Accuracy check",
  seal: "Seal check",
  physical: "Physical condition",
  compliance: "Standard compliance",
};

export default function InspectionForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  const instrumentIdFromUrl = new URLSearchParams(
    location.search,
  ).get("instrumentId");

  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const [values, setValues] = useState({
    instrumentId: instrumentIdFromUrl || "",
    date: today(),
    accuracy: "",
    seal: "",
    physical: "",
    compliance: "",
    remarks: "",
    validityMonths: "12",
  });

  useEffect(() => {
    let mounted = true;

    getInstruments()
      .then((data) => {
        if (mounted) {
          setInstruments(data);
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err.message || "Unable to load instruments.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const selectedInstrument = instruments.find(
    (instrument) => instrument.id === values.instrumentId,
  );

  function updateValue(name, value) {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  async function submit(event) {
    event.preventDefault();

    setError("");

    if (!values.instrumentId) {
      setError("Please select an instrument.");
      return;
    }

    if (!values.date) {
      setError("Please select an inspection date.");
      return;
    }

    const missingCheck = checks.find(
      (check) => !values[check],
    );

    if (missingCheck) {
      setError(
        `Please record a result for ${labels[missingCheck].toLowerCase()}.`,
      );
      return;
    }

    setSaving(true);

    try {
      const inspection = await createInspection(values);

      if (inspection.result === "PASSED") {
        await createCertificateFromInspection(inspection);

        toast?.(
          "Inspection passed and certificate issued.",
          "success",
        );
      } else {
        toast?.(
          "Inspection completed. Re-inspection is required.",
          "error",
        );
      }

      setResult(inspection);
    } catch (err) {
      setError(
        err.message ||
          "Unable to complete the inspection. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <LoadingState label="Loading instruments…" />;
  }

  if (result) {
    const passed = result.result === "PASSED";

    return (
      <>
        <Breadcrumb
          items={[
            {
              label: "Inspections",
              to: "/inspections",
            },
            {
              label: "Completed",
            },
          ]}
        />

        <div className="completion-panel">
          <span
            className={
              passed
                ? "completion-icon success"
                : "completion-icon danger"
            }
          >
            <CheckCircle2 size={42} />
          </span>

          <h1>
            {passed
              ? "Inspection completed successfully"
              : "Inspection completed"}
          </h1>

          <p>
            {passed
              ? "The instrument passed all prescribed checks and a digital certificate is ready."
              : "The instrument did not pass all checks. A re-inspection is required."}
          </p>

          <div className="completion-meta">
            <span>
              Inspection ID
              <strong>{result.id}</strong>
            </span>

            <span>
              Instrument
              <strong>{result.instrumentId}</strong>
            </span>

            <span>
              Result
              <strong>{result.result}</strong>
            </span>
          </div>

          <div className="page-actions">
            {passed && (
              <Button
                to={`/certificates/by-inspection/${result.id}`}
              >
                View Certificate
              </Button>
            )}

            <Button
              variant="secondary"
              to="/inspections"
            >
              Back to inspections
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Breadcrumb
        items={[
          {
            label: "Inspections",
            to: "/inspections",
          },
          {
            label: "New inspection",
          },
        ]}
      />

      <PageHeader
        title="Perform inspection"
        description="Record the prescribed checks for a registered instrument."
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

      <form onSubmit={submit} noValidate>
        {error && <InlineError message={error} />}

        <div className="form-layout">
          <div className="detail-sections">

            <Card
              title="Instrument selection"
              description="Select the registered instrument being inspected."
            >
              <div className="form-grid">
                <FormSelect
                  label="Instrument"
                  required
                  value={values.instrumentId}
                  onChange={(event) =>
                    updateValue(
                      "instrumentId",
                      event.target.value,
                    )
                  }
                  options={instruments.map((instrument) => ({
                    value: instrument.id,
                    label: `${instrument.id} · ${optionLabel(
                      instrumentTypes,
                      instrument.type,
                    )} · ${instrument.owner}`,
                  }))}
                />

                <FormInput
                  label="Inspection date"
                  type="date"
                  required
                  value={values.date}
                  onChange={(event) =>
                    updateValue(
                      "date",
                      event.target.value,
                    )
                  }
                />
              </div>

              {selectedInstrument && (
                <div className="selected-instrument">
                  <div>
                    <small>Selected instrument</small>

                    <strong>
                      {selectedInstrument.id}
                    </strong>

                    <span>
                      {optionLabel(
                        instrumentTypes,
                        selectedInstrument.type,
                      )}{" "}
                      · {selectedInstrument.manufacturer}{" "}
                      {selectedInstrument.model}
                    </span>
                  </div>

                  <StatusBadge
                    status={selectedInstrument.status}
                  />
                </div>
              )}
            </Card>

            <Card
              title="Inspection checks"
              description="Mark each prescribed check as pass or fail."
            >
              <div className="inspection-checks">
                {checks.map((key) => (
                  <div
                    className="inspection-check"
                    key={key}
                  >
                    <div>
                      <strong>{labels[key]}</strong>
                      <small>
                        Record the observed condition.
                      </small>
                    </div>

                    <div className="choice-group">
                      {["PASS", "FAIL"].map((value) => (
                        <button
                          type="button"
                          key={value}
                          className={`choice-button ${
                            values[key] === value
                              ? `choice-${value.toLowerCase()}`
                              : ""
                          }`}
                          onClick={() =>
                            updateValue(key, value)
                          }
                          aria-pressed={
                            values[key] === value
                          }
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card
              title="Remarks"
              description="Add any relevant observations or corrective notes."
            >
              <label className="form-field">
                <span>Inspection remarks</span>

                <textarea
                  rows="4"
                  value={values.remarks}
                  onChange={(event) =>
                    updateValue(
                      "remarks",
                      event.target.value,
                    )
                  }
                  placeholder="Record observations, deviations or notes…"
                />
              </label>
            </Card>

            <Card
              title="Certificate validity"
              description="Used when all inspection checks pass."
            >
              <div className="form-grid">
                <FormSelect
                  label="Validity period"
                  value={values.validityMonths}
                  onChange={(event) =>
                    updateValue(
                      "validityMonths",
                      event.target.value,
                    )
                  }
                  options={[
                    {
                      value: "6",
                      label: "6 months",
                    },
                    {
                      value: "12",
                      label: "12 months",
                    },
                    {
                      value: "24",
                      label: "24 months",
                    },
                  ]}
                />
              </div>
            </Card>

          </div>

          <div>
            <Card title="Inspection summary">
              <div className="summary-list">
                {checks.map((key) => (
                  <div key={key}>
                    <span>{labels[key]}</span>

                    <strong>
                      {values[key] || "Not recorded"}
                    </strong>
                  </div>
                ))}
              </div>

              <FormActions
                onCancel={() => navigate("/inspections")}
                loading={saving}
                submitLabel="Complete inspection"
              />
            </Card>
          </div>
        </div>
      </form>
    </>
  );
}