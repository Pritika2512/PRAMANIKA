export function certificateIdFromValue(value) {
  let text = String(value || "").trim();
  if (!text) throw new Error("Enter a Certificate ID or scan a certificate QR code.");
  if (/^https?:\/\//i.test(text)) {
    try {
      const url = new URL(text);
      const match = url.pathname.match(/^\/verify\/([^/]+)\/?$/i);
      if (!match) throw new Error();
      text = decodeURIComponent(match[1]);
    } catch {
      throw new Error("This QR code does not contain a valid certificate verification link.");
    }
  }
  if (!/^CERT-\d{4}-\d{5,}$/i.test(text)) {
    throw new Error("Use a Certificate ID such as CERT-2026-00125 or its verification QR code.");
  }
  return text.toUpperCase();
}

export function publicCertificateState(data, now = Date.now()) {
  const certificate = data?.certificate || data;
  if (!(certificate?.id || certificate?.certificate_number)) return "INVALID";
  const status = String(certificate.status || data.status || "").toUpperCase();
  if (status === "REVOKED") return "REVOKED";
  const expiry = certificate.validUntil || certificate.expiry_date;
  const timestamp = Date.parse(expiry + "T23:59:59Z");
  if (status === "EXPIRED" || (Number.isFinite(timestamp) && now > timestamp)) return "EXPIRED";
  if (data.valid === true && Number.isFinite(timestamp)) return "VALID";
  return "INVALID";
}

