import { mockCertificates } from "../data/mockCertificates.js";
import { copy, nextId, recordActivity, store, wait } from "./mockStore.js";
import { requireUser } from "./authService.js";

store.certificates = structuredClone(mockCertificates);

export async function getCertificates() { await wait(); requireUser(); return copy(store.certificates); }
export async function getCertificateById(id) { await wait(); requireUser(); return copy(store.certificates.find((x) => x.id === id) || null); }
export async function getCertificateForInspection(inspectionId) {
  await wait(); requireUser();
  const inspection = store.inspections.find((x) => x.id === inspectionId);
  return copy(store.certificates.find((x) => x.instrumentId === inspection?.instrumentId && x.status === "ACTIVE") || null);
}
export async function createCertificateFromInspection(inspection) {
  await wait();
  const actor = requireUser();
  if (inspection.result !== "PASSED") throw new Error("Only passed inspections can receive a certificate.");
  const existing = store.certificates.find((x) => x.instrumentId === inspection.instrumentId && x.status === "ACTIVE");
  if (existing) return copy(existing);
  const certificate = { id: nextId(store.certificates, "CERT-2026-", 5), instrumentId: inspection.instrumentId, issueDate: inspection.date, validUntil: inspection.validUntil, status: "ACTIVE", blockchainStatus: "PENDING", inspector: actor.name, hash: "demo-hash…", transactionId: "Pending" };
  store.certificates.unshift(certificate);
  recordActivity("Certificate issued", certificate.id, actor.name);
  return copy(certificate);
}
