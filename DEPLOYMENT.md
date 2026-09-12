# Deployment guide

This cleaned project does not include frontend dependencies, Python virtual
environments, build output, caches, local databases, or secrets. Deployment
services recreate dependencies from package-lock.json and requirements.txt.

## Run locally on Windows

From the project root, run:

    .\start-local.ps1

This creates local environments when needed and starts both FastAPI and React.
Keep its PowerShell window open while using the app.

## Option 1: Docker Compose

Install Docker, then run from the project root:

    docker compose up --build

Open http://localhost:8080. Nginx serves the React app, sends /api requests
to FastAPI, and falls back to index.html for React Router URLs. SQLite data is
stored in the named pramaanika_data volume.

## Option 2: deploy frontend and backend separately

Backend settings:

- Root directory: backend/backend
- Build command: pip install -r requirements.txt
- Start command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
- The default SQLite file is local to the service. For real data persistence,
  attach a persistent disk and set DATABASE_URL to an absolute SQLite URL such
  as sqlite:////data/pramaanika.db.
- To use PostgreSQL or another database, install its SQLAlchemy driver before
  changing DATABASE_URL.
- Set CORS_ORIGINS to the exact frontend origin. Separate multiple origins
  with commas.

Frontend settings:

- Root directory: frontend
- Build command: npm ci && npm run build:static
- Publish directory: dist
- Set VITE_API_URL to the public backend URL before building.
- Configure an SPA rewrite from /* to /index.html. Netlify can use the
  included public/_redirects file; other hosts need their equivalent rule.

Copy the .env.example files to local .env files only for development. Never
commit real secrets.

## Verification

Frontend:

    cd frontend
    npm ci
    npm run check

Backend:

    cd backend/backend
    python -m venv .venv
    # Windows: .venv\Scripts\activate
    # macOS/Linux: source .venv/bin/activate
    pip install -r requirements.txt
    uvicorn app.main:app --host 0.0.0.0 --port 8000
