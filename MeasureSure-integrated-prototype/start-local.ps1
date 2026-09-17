$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendRoot = Join-Path $projectRoot "backend\backend"
$frontendRoot = Join-Path $projectRoot "frontend"
$pythonPath = Join-Path $backendRoot ".venv\Scripts\python.exe"
$backendProcess = $null

if (-not (Test-Path -LiteralPath $pythonPath)) {
  Write-Host "Creating the backend environment..."
  python -m venv (Join-Path $backendRoot ".venv")
}

& $pythonPath -c "import fastapi, sqlalchemy" 2>$null
if ($LASTEXITCODE -ne 0) {
  Write-Host "Installing backend packages..."
  & $pythonPath -m pip install -r (Join-Path $backendRoot "requirements.txt")
}

$backendListener = Get-NetTCPConnection -LocalPort 8000 -State Listen -ErrorAction SilentlyContinue
if (-not $backendListener) {
  Write-Host "Starting the API..."
  $backendProcess = Start-Process -FilePath $pythonPath `
    -ArgumentList @("-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", "8000") `
    -WorkingDirectory $backendRoot -WindowStyle Hidden -PassThru
}

$apiReady = $false
for ($attempt = 0; $attempt -lt 30; $attempt++) {
  try {
    $health = Invoke-RestMethod "http://127.0.0.1:8000/health"
    if ($health.status -eq "ok") {
      $apiReady = $true
      break
    }
  } catch {
    Start-Sleep -Seconds 1
  }
}

if (-not $apiReady) {
  if ($backendProcess) {
    Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
  }
  throw "The backend did not become ready on http://127.0.0.1:8000."
}

if (-not (Test-Path -LiteralPath (Join-Path $frontendRoot "node_modules"))) {
  Write-Host "Installing frontend packages..."
  Push-Location $frontendRoot
  try {
    npm ci
  } finally {
    Pop-Location
  }
}

Write-Host "Pramaanika is ready. Open http://localhost:5176"
Write-Host "Press Ctrl+C to stop the local app."

Push-Location $frontendRoot
try {
  npm run dev
} finally {
  Pop-Location
  if ($backendProcess) {
    Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
  }
}
