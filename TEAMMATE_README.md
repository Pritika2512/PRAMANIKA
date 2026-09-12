# PRAMAANIKA — teammate handoff
Read this first. This source is based on PRAMAANIKA-blockchain-local-fixed-scanner.zip plus the public landing/scanner changes. It is the frontend used for the current temporary demo.

## What is included
- React + Vite frontend, FastAPI backend, SQLAlchemy models, requirements and npm lockfile.
- Public home page, manual Certificate ID form, camera scanner, uploaded-image QR scanning and public /verify/:id.
- Existing Admin/Inspector demo login and instrument, inspection, certificate and dashboard screens.
- Existing blockchain contract source and services, unchanged by the public landing work.
- Existing Docker/Compose files. Their inclusion does not mean production deployment was validated.
- PUBLIC_VERIFICATION_CHANGES.md with the implementation/test record.

The transfer ZIP excludes node_modules, build output, Python environments/caches, SQLite databases, local environment files, and the original Codex hosting identity. It excludes the temporary Cloudflare tunnel executable and gateway. No real database or wallet private keys are included.

## Run locally (PowerShell)
From backend/backend:
    python -m venv .venv
    .\.venv\Scripts\python.exe -m pip install -r requirements.txt
    $env:DATABASE_URL='sqlite:///./pramaanika.db'
    $env:CORS_ORIGINS='http://127.0.0.1:5178,http://localhost:5178'
    .\.venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8002

From frontend:
    npm ci
    $env:VITE_API_URL='http://127.0.0.1:8002'
    npm run dev -- --host 127.0.0.1 --port 5178 --strictPort

Node requirement: >=22.12.0. The backend was tested with the installed Python environment; requirements.txt pins its dependencies.
Open http://127.0.0.1:5178/
Public result: http://127.0.0.1:5178/verify/CERT-2026-00125

Backend environment variables are read from the process. Its current source does not automatically load a .env file. Export them or configure them in the process/container.
Vite reads VITE_* from shell variables or frontend/.env.local at startup/build time; changes require restart/rebuild.

## Backend/data work required before production
1. Keep SQLite unless the project owner explicitly approves otherwise. Configure DATABASE_URL to the existing database, retain field/table mappings, and back it up before schema changes.
2. app/main.py currently calls seed_demo_data on startup and creates demo data for empty tables. Review this before connecting an empty production database; do not treat the seeded records as real certificates.
3. Replace client-side mock authentication with backend authentication and enforce Admin/Inspector authorization on all protected APIs, including blockchain persistence. React Protected routes are navigation guards, not backend access control.
4. GET /verify/{certificate_number} exists. It currently checks status ACTIVE but does not enforce expiry and returns blockchain_status=PENDING literally. Return authoritative VALID/EXPIRED/REVOKED/INVALID states, UTC date semantics and genuine persisted blockchain metadata. The frontend adds a UTC expiry check, but this does not fix the backend contract.
5. This public endpoint currently includes owner phone/street address through instrument_dict. The frontend does not render those fields, but the direct API exposes them. Return an explicit public-safe response; agree which owner/location fields may be public.
6. Preserve the existing certificate number, instrument references, dates, hash, blockchain_status and transaction_id fields. Avoid duplicating tables/fields.
7. Remove or explicitly isolate mock-data fallbacks in production. Some existing services may fall back to browser demo data on API failure.

Useful source:
- backend/backend/app/main.py: API routes, public verification, response mapping and seeding
- backend/backend/app/database.py: SQLite URL/session setup
- backend/backend/app/models/: SQLAlchemy models
- frontend/src/services/api.js: central API configuration
- frontend/src/services/verificationService.js: existing public API call
- frontend/src/pages/verification/PublicCertificateVerification.jsx: public result UI
- frontend/src/services/authService.js: mock authentication
- frontend/src/routes/routes.jsx: public/protected route structure
- frontend/src/services/blockchainService.js: existing issuance/read-only chain service

## Blockchain handoff
Existing Sepolia registry address:
    0x16b16a74b0de283b134d437a26118a98389111de
Chain ID:
    11155111
Optional frontend blockchain configuration:
    VITE_BLOCKCHAIN_CHAIN_ID=11155111
    VITE_BLOCKCHAIN_CHAIN_NAME=Sepolia
    VITE_BLOCKCHAIN_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
    VITE_BLOCKCHAIN_CONTRACT_ADDRESS=0x16b16a74b0de283b134d437a26118a98389111de
    VITE_BLOCKCHAIN_EXPLORER_URL=https://sepolia.etherscan.io

VITE_* values are public build configuration: NEVER put private keys or secret RPC credentials in them.
This ZIP's blockchain hashing/service differs from the earlier locally investigated project. Reconcile canonical serialization against actual registered records before claiming blockchain verification. Do not redeploy or change the fingerprint algorithm blindly.
The public result currently reports the API's blockchain status and explicitly does not claim live blockchain verification. Existing authenticated blockchain features were retained, not re-audited for production in this update.

## Deployment notes
The current shared URL is a temporary tunnel to a local static build and a read-only gateway, not a hosted deployment.
The gateway restricts writes, strips contact fields from public verification, and injects a demo banner. These are tunnel-only behaviors and are NOT safeguards in this source backend. Deploying the source directly does not preserve these protections.

For the existing Docker layout:
    docker compose up --build
Frontend: http://localhost:8080
Compose uses /api through nginx and a SQLite named volume. Review frontend/nginx.conf and docker-compose.yml.
Docker image build/runtime was not tested in this public-landing update.
Current frontend Dockerfile accepts VITE_API_URL but does not define blockchain build arguments. Add the blockchain variables as build ARG/ENV and Compose build args if blockchain functionality is needed.
Use HTTPS for camera access on remote/mobile browsers. Configure SPA fallback for /verify/:id and all frontend routes.
Configure production API routing, exact CORS origins, persistent SQLite volume and tested backups. Avoid exposing the backend's write endpoints until server authorization is implemented.
Do not use frontend/.env.local localhost settings in production.
No deployment is performed by this handoff.

## Validation already performed
- npm run check: ESLint, 6 tests, production build passed.
- Anonymous browser: landing/manual real API verification, owner/details, invalid/missing input.
- Actual uploaded QR decoding: raw ID, localhost verification URL, production-style URL.
- Camera unavailable/permission failure and network error messages.
- Anonymous dashboard/instruments/inspections/certificates/history/admin redirect to login.
- Mobile 390px layout fits.
Physical camera capture and production Docker deployment still need device/environment testing.

