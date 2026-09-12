# MeasureSure / Pramaanika - Prototype Integration

This bundle connects the existing React frontend to the FastAPI backend for the prototype. Blockchain is intentionally left out of the runtime flow for now.

## Run backend

```bash
cd backend/backend
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend: http://localhost:8000
Health: http://localhost:8000/health
Docs: http://localhost:8000/docs

The backend seeds demo instruments, inspections, certificates and verification records into SQLite on first run.

## Run frontend

```bash
cd frontend
npm install
```

Create `.env` from `.env.example`:

```env
VITE_API_URL=http://localhost:8000
```

Then:

```bash
npm run dev
```

## Integrated flows

- Instruments list/details/register -> FastAPI
- Inspection list/details/create -> FastAPI
- Passed inspection -> certificate creation through FastAPI
- Certificate list/details -> FastAPI
- Public `/verify/:id` -> FastAPI verification endpoint
- Verification history -> FastAPI
- Dashboard counts/recent activity -> FastAPI

## Prototype notes

- Blockchain runtime calls are intentionally disabled for this submission.
- The existing frontend login/registration remains mock/local because the supplied backend does not expose authentication endpoints.
- Backend uses the SQLite database configuration already present in the supplied backend. PostgreSQL can be introduced later without changing the frontend API contract.
