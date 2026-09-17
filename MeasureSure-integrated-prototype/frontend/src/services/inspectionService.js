import { apiRequest } from "./api.js";

const mapInspection = (x) => x && ({
  id: x.id ?? x.inspection_id,
  instrumentId: x.instrumentId ?? x.instrument_id,
  inspector: x.inspector ?? x.inspector_name,
  date: x.date ?? x.inspection_date,
  accuracy: x.accuracy ?? "",
  seal: x.seal ?? "",
  physical: x.physical ?? "",
  compliance: x.compliance ?? "",
  result: x.result,
  remarks: x.remarks || "",
  validityMonths: String(x.validityMonths ?? x.validity_months ?? "12"),
  validUntil: x.validUntil ?? x.valid_until,
});

export async function getInspections() { return (await apiRequest("/inspections")).map(mapInspection); }
export async function getInspectionById(id) { const x = await apiRequest(`/inspections/${encodeURIComponent(id)}`); return x ? mapInspection(x) : null; }
export async function createInspection(values) {
  const inspection = await apiRequest("/inspections", {
    method: "POST",
    body: JSON.stringify(values),
  });

  return mapInspection(inspection);
}