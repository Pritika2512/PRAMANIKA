import { copy, nextId, recordActivity, store, wait } from "./mockStore.js";
import { requireUser } from "./authService.js";

export async function getInspections() {
  await wait();
  requireUser();

  return copy(store.inspections || []);
}

export async function getInspectionById(id) {
  await wait();
  requireUser();

  return copy(
    (store.inspections || []).find(
      (inspection) => inspection.id === id
    ) || null
  );
}

export async function createInspection(values) {
  await wait();

  const actor = requireUser();

  const checks = [
    values.accuracy,
    values.seal,
    values.physical,
    values.compliance,
  ];

  const result = checks.every((value) => value === "PASS")
    ? "PASSED"
    : "FAILED";

  const inspection = {
    id: nextId(
      store.inspections || [],
      "INSP-2026-",
      3
    ),
    instrumentId: values.instrumentId,
    inspector: actor.name,
    date: values.date,
    accuracy: values.accuracy,
    seal: values.seal,
    physical: values.physical,
    compliance: values.compliance,
    result,
    remarks: values.remarks || "",
    validityMonths: values.validityMonths || "12",
  };

  if (!store.inspections) {
    store.inspections = [];
  }

  store.inspections.unshift(inspection);

  recordActivity(
    "Inspection completed",
    inspection.id,
    actor.name
  );

  return copy(inspection);
}