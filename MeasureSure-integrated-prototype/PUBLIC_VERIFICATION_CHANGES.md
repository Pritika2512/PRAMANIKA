# Public verification update

Based on PRAMAANIKA-blockchain-local-fixed-scanner.zip. Updated project: this directory.
Original ZIP and previous project copies were preserved. Nothing deployed.

## Files added
- frontend/src/pages/verification/PublicLanding.jsx — new public home page, exact requested heading/description, Scan QR Code link, manual form, Login/Register links.
- frontend/src/components/verification/CertificateIdForm.jsx — shared labeled input, empty/invalid validation, encoded /verify/:id navigation.
- frontend/src/utils/publicVerification.js — parses certificate IDs or HTTP(S) /verify/:id URLs, validates format, classifies validity with end-of-day UTC expiry and revocation priority.
- frontend/tests/publicVerification.test.mjs — QR/ID parsing, invalid input, expiry boundary, revoked and missing certificate tests.
- PUBLIC_VERIFICATION_CHANGES.md — this handoff.

## Files modified
- frontend/src/routes/routes.jsx — imports PublicLanding; changes / from dashboard redirect to public landing; adds /verify landing alias; uses configured public paths. Protected workspace and role checks retained.
- frontend/src/config/navigationConfig.js — adds home, verify and verificationDetail paths; retains scanner and workspace navigation.
- frontend/src/pages/verification/UserScanner.jsx — extends the existing scanner, reuses shared parsing/manual form, responsive camera scan box, stop/unmount camera cleanup, start lock, friendly camera errors, real image QR decoding via existing html5-qrcode, public back link.
- frontend/src/pages/verification/PublicCertificateVerification.jsx — retains existing verificationService/API client; re-check refreshes displayed data; handles malformed/missing IDs, expired/revoked/invalid/valid states; shows serial number, owner, location, date/status and API-reported blockchain status; handles network/API failures. Supports flat ZIP API and nested certificate responses.
- frontend/src/index.css — scoped landing/scanner responsive styles consistent with existing cards/buttons.
- frontend/package.json — test script now includes all tests/*.test.mjs.
- frontend/package-lock.json — synchronizes packages already declared in supplied package.json (html5-qrcode, qrcode and transitive dependencies). npm ci initially failed because the supplied lockfile omitted them.

## Backend, API and blockchain
No backend source/schema/API/contract changes.
Reuses GET /verify/{certificate_number} via verificationService and api.js / VITE_API_URL.
The supplied endpoint returns owner; UI does not display phone or street address.
The supplied endpoint only checks status ACTIVE, not expiry; UI additionally checks expiry using UTC. Backend enforcement remains an existing limitation because backend changes were prohibited.
The supplied endpoint hardcodes blockchain_status=PENDING. The UI labels this as API-reported status, not live blockchain proof. Existing wallet/contract services and authenticated certificate operations were not changed.
No live blockchain verification has been added to this landing feature.
The ZIP's existing hashing differs from the previously investigated project; this update does not rewrite or migrate that implementation.

## Local data
The ZIP contains no SQLite database. Starting its unchanged backend initialized a new pramaanika.db using its existing seed routine. No prior project database was opened or modified.
Use your existing database by setting DATABASE_URL when running against real local data.

## Run (PowerShell)
Backend, from backend/backend:
    python -m venv .venv
    .\.venv\Scripts\python.exe -m pip install -r requirements.txt
    $env:CORS_ORIGINS='http://127.0.0.1:5178,http://localhost:5178'
    .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8002

Frontend, from frontend:
    npm ci
    $env:VITE_API_URL='http://127.0.0.1:8002'
    npm run dev -- --host 127.0.0.1 --port 5178 --strictPort

The shell VITE_API_URL override intentionally selects the supplied ZIP backend; its unchanged .env.local points to the earlier project on port 8001.
Frontend: http://127.0.0.1:5178/
Backend: http://127.0.0.1:8002/
Public example: http://127.0.0.1:5178/verify/CERT-2026-00125

Local services were started successfully. The existing prior-project Python environment was reused for this session; the commands above create a self-contained environment on another machine.

## Tests performed
- ESLint: passed.
- Existing service tests plus new public utility tests: 6 passed, 0 failed.
- Production build: passed; existing large-bundle warning remains.
- npm install audit: 0 vulnerabilities.
- Real local browser/backend: root accessible without login; empty input error; manual CERT-2026-00125 displays Certificate Verified and owner.
- Missing CERT-2026-99999 and malformed ID: invalid/not-found UI.
- Dashboard, instruments, inspections, certificates, verification-history and admin: redirect to /login in anonymous browser.
- Real html5-qrcode uploaded-image decoding: raw ID, localhost URL, production URL all navigate and verify.
- Invalid QR payload stays on scanner with error.
- Camera unavailable/permission failure: friendly message.
- Network failure: friendly retry message (request intentionally aborted in browser test, no backend data modified).
- Mobile 390px landing: no horizontal overflow.
- UTC expiry and revocation precedence: unit tested, without changing SQLite records.
- Physical camera capture has not been tested with a real camera. For mobile camera use HTTPS (plain LAN HTTP is usually not a secure camera context); localhost works for desktop testing.

## Manual test
1. Open http://127.0.0.1:5178/ in a private browser window.
2. Enter CERT-2026-00125, click Verify Certificate.
3. Confirm instrument/manufacturer/model/serial/owner/location/date and status.
4. Return home, choose Scan QR Code, press Start camera and allow access; scan a printed certificate QR. Alternatively upload a clear QR image. Try all three supported QR formats.
5. Enter CERT-2026-99999 and verify; test empty input and non-certificate QR text.
6. Open /dashboard in the private window; confirm /login redirect.
7. Run npm run check from frontend for lint/tests/build.

