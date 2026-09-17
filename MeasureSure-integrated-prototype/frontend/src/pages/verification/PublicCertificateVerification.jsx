import { useCallback } from "react";
import { CheckCircle2, ShieldCheck, XCircle, TriangleAlert } from "lucide-react";
import { useParams } from "react-router-dom";
import { verifyCertificate } from "../../services/verificationService.js";
import { useResource } from "../../hooks/useResource.js";
import { Button, Card, ErrorState, LoadingState, StatusBadge } from "../../components/common/ui.jsx";
import { formatDate, optionLabel } from "../../utils/format.js";
import { instrumentTypes } from "../../config/instrumentConfig.js";
import { certificateIdFromValue, publicCertificateState } from "../../utils/publicVerification.js";
export default function PublicCertificateVerification() {
  const { id } = useParams();
  const load = useCallback(async () => {
    let key;
    try { key = certificateIdFromValue(id); }
    catch { return { valid: false }; }
    try { return await verifyCertificate(key); }
    catch { throw new Error("We could not reach the verification service. Check your connection and try again shortly."); }
  }, [id]);
  const { data, loading, error, reload } = useResource(load);
  const state = publicCertificateState(data);
  const c = data?.certificate || data;
  const i = data?.instrument;
  const found = !!(c?.id || c?.certificate_number);
  const titles = { VALID: "Certificate Verified", EXPIRED: "Certificate Expired", REVOKED: "Certificate Revoked", INVALID: found ? "Invalid Certificate" : "Certificate Not Found / Invalid Certificate" };
  const Icon = state === "VALID" ? CheckCircle2 : state === "EXPIRED" ? TriangleAlert : XCircle;
  const fields = found ? [
    ["Instrument ID", c.instrumentId || c.instrument_id],
    ["Instrument details", optionLabel(instrumentTypes, i?.type || i?.instrument_type)],
    ["Manufacturer", i?.manufacturer], ["Model", i?.model],
    ["Serial Number", i?.serialNumber || i?.serial_number],
    ["Owner", i?.owner || "Not provided by the public API"], ["Location", i?.location],
    ["Inspection / verification date", formatDate(c.issueDate || c.issue_date)],
    ["Valid until", formatDate(c.validUntil || c.expiry_date)], ["Inspector", c.inspector],
    ["Certificate status", state],
    ["Reported blockchain status", c.blockchainStatus || c.blockchain_status || data.blockchain_status || "Not supplied"],
  ] : [];
  return <main className="standalone-state public-verify-page"><Card>
    <div className="public-verify-header"><ShieldCheck size={30}/><div><strong>Pramaanika</strong><p>Public Certificate Verification</p></div></div>
    {loading ? <LoadingState label="Verifying certificate…"/> : error ? <ErrorState message={error} retry={reload}/> : <>
      <div className="public-verify-summary" role="status"><Icon size={42}/><h1>{titles[state]}</h1><p>Certificate <strong>{c?.id || c?.certificate_number || id}</strong></p><StatusBadge status={state === "VALID" ? "VERIFIED" : state}/>
      <p>{state === "EXPIRED" ? "The certificate has passed its expiry date and is no longer valid." : state === "VALID" ? "The certificate is valid according to the certificate database and its expiry date." : "This certificate could not be verified as currently valid. Check the Certificate ID and contact the issuer if necessary."}</p></div>
      {found && <><dl className="details-grid">{fields.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value || "—"}</dd></div>)}</dl>
      <p className="scanner-note">The blockchain status above is supplied by the API. This database result is not proof of live blockchain verification.</p></>}
      <Button onClick={reload}>Verify again</Button>
    </>}
    <div className="public-verify-actions"><Button variant="secondary" to="/">Enter another Certificate ID</Button><Button variant="secondary" to="/scan">Scan QR Code</Button></div>
  </Card></main>;
}
