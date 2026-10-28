@echo off
echo Starting CUDA+MPI Virus Detection System...
echo.

:: Create necessary directories
mkdir uploads 2>nul
mkdir quarantine 2>nul
mkdir data\results 2>nul

echo [1/3] Installing dependencies...
call npm install

echo [2/3] Starting backend server...
start cmd /k "node server.js"

echo [3/3] Backend running on http://localhost:5000
echo.
echo API Endpoints:
echo   - http://localhost:5000/api/upload
echo   - http://localhost:5000/api/scan
echo   - http://localhost:5000/api/system-info
echo.
echo Open frontend in browser to use the system!
pause