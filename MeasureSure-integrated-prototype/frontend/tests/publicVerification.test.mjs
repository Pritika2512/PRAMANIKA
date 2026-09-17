import assert from "node:assert/strict";
import test from "node:test";
import { certificateIdFromValue, publicCertificateState } from "../src/utils/publicVerification.js";
test("IDs and local/production QR links resolve to the same certificate", () => {
 for (const value of ["CERT-2026-00125", "http://localhost:5178/verify/CERT-2026-00125", "https://yourdomain.com/verify/CERT-2026-00125"]) assert.equal(certificateIdFromValue(value), "CERT-2026-00125");
 for (const value of ["", "arbitrary text", "https://example.com/login", "https://example.com/verify/CERT-2026-00125/extra"]) assert.throws(() => certificateIdFromValue(value));
});
test("expiry and revocation take priority over a backend valid flag", () => {
 const c = {certificate_number:"CERT-2026-00125", valid:true, expiry_date:"2027-08-31"};
 assert.equal(publicCertificateState(c, Date.parse("2027-08-31T23:59:59Z")), "VALID");
 assert.equal(publicCertificateState(c, Date.parse("2027-09-01T00:00:00Z")), "EXPIRED");
 assert.equal(publicCertificateState({...c,status:"REVOKED"}, 0), "REVOKED");
 assert.equal(publicCertificateState({valid:false}), "INVALID");
 assert.equal(publicCertificateState({...c,expiry_date:null}), "INVALID");
});

