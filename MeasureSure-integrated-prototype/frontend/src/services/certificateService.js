import { apiRequest } from "./api.js";
import { mockCertificates } from "../data/mockCertificates.js";

const mapCertificate = (x) =>
  x && {
    id: x.id ?? x.certificate_number,
    instrumentId: x.instrumentId ?? x.instrument_id,
    issueDate: x.issueDate ?? x.issue_date,
    validUntil: x.validUntil ?? x.expiry_date,
    status: x.status,
    blockchainStatus: x.blockchainStatus ?? "PENDING",
    inspector: x.inspector ?? "—",
    hash: x.hash ?? "—",
    transactionId: x.transactionId ?? "—",
    inspectionId: x.inspectionId ?? x.inspection_id,
  };

export async function getCertificates() {
  try {
    const data = await apiRequest("/certificates");

    if (Array.isArray(data) && data.length > 0) {
      return data.map(mapCertificate);
    }
  } catch (error) {
    console.warn("Certificate API unavailable, using mock certificates.", error);
  }

  return mockCertificates.map(mapCertificate);
}

export async function getCertificateById(id) {
  try {
    const x = await apiRequest(
      `/certificates/${encodeURIComponent(id)}`
    );

    if (x) return mapCertificate(x);
  } catch (error) {
    console.warn("Certificate API unavailable, using mock certificate.", error);
  }

  const mock = mockCertificates.find(
    (certificate) => certificate.id === id
  );

  return mock ? mapCertificate(mock) : null;
}

export async function getPublicCertificateById(id) {
  try {
    const x = await apiRequest(
      `/public/certificates/${encodeURIComponent(id)}`
    );

    if (x) return mapCertificate(x);
  } catch {
    console.warn("Public certificate API unavailable.");
  }

  const mock = mockCertificates.find(
    (certificate) => certificate.id === id
  );

  return mock ? mapCertificate(mock) : null;
}

export async function getCertificateForInspection(inspectionId) {
  try {
    const x = await apiRequest(
      `/certificates/by-inspection/${encodeURIComponent(inspectionId)}`
    );

    if (x) return mapCertificate(x);
  } catch {
    console.warn(
      "Certificate lookup API unavailable, checking mock certificates."
    );
  }

  const mock = mockCertificates.find(
    (certificate) => certificate.inspectionId === inspectionId
  );

  return mock ? mapCertificate(mock) : null;
}

export async function createCertificateFromInspection(inspection) {
  if (inspection.result !== "PASSED") {
    throw new Error(
      "Only passed inspections can receive a certificate."
    );
  }

  let expiryDate = inspection.validUntil;

  if (!expiryDate) {
    const date = new Date(`${inspection.date}T00:00:00`);
    const months = Number(inspection.validityMonths || 12);

    date.setMonth(date.getMonth() + months);
    expiryDate = date.toISOString().slice(0, 10);
  }

  try {
    const existing = await getCertificateForInspection(inspection.id);

    if (existing) {
      return existing;
    }

    const certificate = await apiRequest("/certificates", {
      method: "POST",
      body: JSON.stringify({
        certificate_number: `CERT-${inspection.id.replace(/^INSP-/, "")}`,
        instrument_id: inspection.instrumentId,
        issue_date: inspection.date,
        expiry_date: expiryDate,
        status: "ACTIVE",
        inspector: inspection.inspector,
        inspection_id: inspection.id,
      }),
    });

    return mapCertificate(certificate);
  } catch {
    console.warn(
      "Certificate API unavailable. Creating prototype certificate locally."
    );

    const certificate = {
      id: `CERT-${inspection.id.replace(/^INSP-/, "")}`,
      instrumentId: inspection.instrumentId,
      issueDate: inspection.date,
      validUntil: expiryDate,
      status: "ACTIVE",
      blockchainStatus: "PENDING",
      inspector: inspection.inspector || "—",
      hash: "—",
      transactionId: "—",
      inspectionId: inspection.id,
    };

    mockCertificates.unshift(certificate);

    return mapCertificate(certificate);
  }
}

export async function updateCertificateBlockchain() {
  throw new Error(
    "Blockchain is disabled for the prototype merge."
  );
}
