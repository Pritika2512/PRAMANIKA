import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useNavigate } from "react-router-dom";
import { Button, Card, PageHeader } from "../../components/common/ui.jsx";
import CertificateIdForm from "../../components/verification/CertificateIdForm.jsx";
import { certificateIdFromValue } from "../../utils/publicVerification.js";
export default function UserScanner() {
  const ref = useRef(null);
  const lock = useRef(false);
  const disposed = useRef(false);
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    disposed.current = false;
    return () => {
      disposed.current = true;
      const scanner = ref.current;
      if (scanner?.isScanning) void scanner.stop().then(() => scanner.clear()).catch(() => {});
    };
  }, []);
  function instance() { return ref.current ||= new Html5Qrcode("user-qr-reader"); }
  async function stop() {
    if (ref.current?.isScanning) await ref.current.stop();
    ref.current?.clear();
    setRunning(false);
  }
  async function decoded(text) {
    if (lock.current) return;
    let id;
    try { id = certificateIdFromValue(text); }
    catch (err) { setError(err.message); return; }
    lock.current = true;
    try { await stop(); navigate("/verify/" + encodeURIComponent(id)); }
    finally { lock.current = false; }
  }
  async function start() {
    if (lock.current || running) return;
    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Camera access is unavailable. Use HTTPS or localhost, upload a QR image, or enter the Certificate ID.");
      return;
    }
    lock.current = true; setBusy(true); setError("");
    try {
      const scanner = instance();
      await scanner.start({ facingMode: "environment" }, { fps: 10,
        qrbox: (w, h) => ({ width: Math.min(250, w * .75, h * .75), height: Math.min(250, w * .75, h * .75) }),
      }, decoded, () => {});
      if (disposed.current) { await scanner.stop(); scanner.clear(); return; }
      setRunning(true);
    } catch {
      setError("Could not open the camera. Allow camera permission, check that a camera is connected and not in use, or upload a QR image.");
    } finally { lock.current = false; setBusy(false); }
  }
  async function upload(event) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file || busy) return;
    setBusy(true); setError("");
    try { await stop(); const text = await instance().scanFile(file, true); await decoded(text); }
    catch { setError("No readable certificate QR code was found. Choose a clear QR image or enter the Certificate ID."); }
    finally { setBusy(false); }
  }
  return <main className="page-shell public-scanner">
    <Button variant="secondary" to="/">Back to public verification</Button>
    <PageHeader title="Scan QR Code" description="Scan a certificate without logging in."/>
    <div className="scanner-layout"><Card className="scanner-card">
      <h2>Scan certificate</h2><p>Point your camera at the QR code printed on the certificate.</p>
      <div id="user-qr-reader" className="user-qr-reader"/>
      <div className="scanner-actions"><Button disabled={busy} onClick={running ? stop : start}>{running ? "Stop camera" : busy ? "Opening scanner…" : "Start camera"}</Button>
      <label>Upload QR image<input type="file" accept="image/*" disabled={busy} onChange={upload}/></label></div>
      {error && <p role="alert">{error}</p>}
      <p className="scanner-note">Camera frames and QR images are decoded on your device. No login or MetaMask required.</p>
    </Card><Card className="scanner-manual-card"><h2>Enter Certificate ID</h2><CertificateIdForm/></Card></div>
  </main>;
}
