import { ScanLine, ShieldCheck, Keyboard } from "lucide-react";
import { Button, Card } from "../../components/common/ui.jsx";
import CertificateIdForm from "../../components/verification/CertificateIdForm.jsx";
import { paths } from "../../config/navigationConfig.js";
export default function PublicLanding() {
  return <main className="public-landing">
    <header className="public-landing-header"><strong><ShieldCheck aria-hidden="true" /> PRAMAANIKA</strong><nav aria-label="Account"><Button variant="secondary" to={paths.login}>Login</Button><Button variant="secondary" to={paths.register}>Register</Button></nav></header>
    <Card className="public-entry-card">
      <span className="certificate-mark"><ShieldCheck size={32} /></span>
      <p className="eyebrow">PUBLIC CERTIFICATE VERIFICATION</p>
      <h1>Verify a Certificate</h1>
      <p>Scan the QR code on your certificate or enter the Certificate ID to verify its authenticity.</p>
      <p>No account or login required.</p>
      <div className="public-entry-options">
        <section><ScanLine size={28} /><h2>Scan QR Code</h2><p>Use your camera or upload a QR image.</p><Button to={paths.scanner}>Scan QR Code</Button></section>
        <section><Keyboard size={28} /><h2>Enter Certificate ID</h2><CertificateIdForm /></section>
      </div>
    </Card>
  </main>;
}

