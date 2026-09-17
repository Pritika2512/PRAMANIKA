import { apiRequest } from "./api.js";
const map = (x) => ({
  id: x.id ?? `VER-${x.verification_id}`,
  certificateId: x.certificateId ?? x.certificate_number,
  instrumentId: x.instrumentId ?? x.instrument_id,
  inspector: x.inspector ?? x.verified_by,
  date: x.date ?? x.verification_date,
  result: x.result ?? "VERIFIED",
  blockchainStatus: x.blockchainStatus ?? "PENDING",
  transactionId: x.transactionId ?? "—",
});
export async function getVerificationHistory() { return (await apiRequest("/verifications")).map(map); }
export async function verifyCertificate(id) { return apiRequest(`/verify/${encodeURIComponent(id)}`); }
