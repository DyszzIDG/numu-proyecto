# Install Remaining CSIRT Tools
Write-Host "Installing Remaining CSIRT Tools..." -ForegroundColor Cyan
Write-Host ""

$tools = @(
    "sqlmap",
    "theharvester", 
    "nikto",
    "gobuster",
    "lynis",
    "subfinder",
    "httpx",
    "katana"
)

$successCount = 0
$failCount = 0

foreach ($tool in $tools) {
    Write-Host "Installing $tool..." -ForegroundColor Yellow
    
    # Run the container to install
    docker-compose run --rm $tool 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK: $tool installed successfully" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "  FAIL: $tool installation failed" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Successful: $successCount" -ForegroundColor Green
Write-Host "Failed: $failCount" -ForegroundColor Red
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "All tools installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Some tools failed. Check the output above." -ForegroundColor Yellow
}
