import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../common/ui.jsx";
import { certificateIdFromValue } from "../../utils/publicVerification.js";
export default function CertificateIdForm() {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  function submit(event) {
    event.preventDefault();
    try { navigate("/verify/" + encodeURIComponent(certificateIdFromValue(value))); }
    catch (err) { setError(err.message); }
  }
  return <form onSubmit={submit} className="scanner-manual-form">
    <label htmlFor="public-certificate-id">Enter Certificate ID</label>
    <input id="public-certificate-id" value={value} onChange={e => { setValue(e.target.value); setError(""); }} placeholder="e.g. CERT-2026-00125" aria-describedby={error ? "certificate-input-error" : undefined} aria-invalid={!!error} />
    {error && <p id="certificate-input-error" role="alert">{error}</p>}
    <Button type="submit">Verify Certificate</Button>
  </form>;
}

