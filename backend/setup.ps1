# CSIRT Backend - Setup Script
# Run this script to set up and start the backend

Write-Host "🚀 CSIRT Backend Setup" -ForegroundColor Cyan
Write-Host ""

# Check if node_modules exists
if (-Not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    node "C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js" install
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🗄️  Running database migrations..." -ForegroundColor Yellow
node node_modules\prisma\build\index.js migrate dev --name add_csirt_models

Write-Host ""
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
node node_modules\prisma\build\index.js generate

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the backend server:" -ForegroundColor Cyan
Write-Host "  node node_modules\ts-node-dev\lib\bin.js --respawn --transpile-only src\server.ts" -ForegroundColor White
Write-Host ""
Write-Host "To start the scan worker:" -ForegroundColor Cyan
Write-Host "  node node_modules\ts-node\dist\bin.js src\modules\scan\scan.worker.ts" -ForegroundColor White
