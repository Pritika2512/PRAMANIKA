# Run Pramaanika locally

## Option 1: One-command PowerShell launcher

Open PowerShell in this folder and run:

```powershell
Set-ExecutionPolicy -Scope Process Bypass
.\start-local.ps1
```

The script creates/uses the backend virtual environment, installs backend packages if needed, starts FastAPI on `http://127.0.0.1:8000`, installs frontend packages if needed, and starts Vite.

## Option 2: Run separately

### Backend terminal

```powershell
cd .\backend\backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend terminal

```powershell
cd .\frontend
npm install
npm run dev
```

Open the frontend URL shown by Vite, normally `http://localhost:5173`.

The frontend `.env` is configured to use `http://127.0.0.1:8000`.
