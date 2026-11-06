@echo off
echo ========================================
echo CSIRT Backend - Quick Start
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [1/4] Installing dependencies...
    node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
    echo Dependencies installed!
) else (
    echo [1/4] Dependencies already installed
)

echo.
echo [2/4] Running database migrations...
node node_modules\prisma\build\index.js migrate dev --name add_csirt_models

echo.
echo [3/4] Generating Prisma client...
node node_modules\prisma\build\index.js generate

echo.
echo [4/4] Setup complete!
echo.
echo ========================================
echo To start the backend:
echo   start-backend.bat
echo.
echo To start the scan worker:
echo   start-worker.bat
echo ========================================
pause
