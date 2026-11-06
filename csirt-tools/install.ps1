# CSIRT Tools Installation Script
Write-Host "CSIRT Tools MVP Installation" -ForegroundColor Cyan
Write-Host ""

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Yellow
$dockerVersion = docker --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: $dockerVersion" -ForegroundColor Green
} else {
    Write-Host "ERROR: Docker not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Pulling Docker images..." -ForegroundColor Yellow
Write-Host "This may take 10-15 minutes depending on your internet connection" -ForegroundColor Gray
Write-Host ""

# Pull images
docker-compose pull

Write-Host ""
Write-Host "Installation complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To test a tool, run:" -ForegroundColor Cyan
Write-Host "  docker-compose run nmap --version" -ForegroundColor White
Write-Host ""
