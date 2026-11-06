# CSIRT Tools - Quick Test Script
Write-Host "Testing CSIRT Tools..." -ForegroundColor Cyan
Write-Host ""

# Test Nmap
Write-Host "1. Testing Nmap..." -ForegroundColor Yellow
docker run --rm instrumentisto/nmap:latest --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: Nmap is working" -ForegroundColor Green
} else {
    Write-Host "   FAIL: Nmap failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "2. Testing Nuclei..." -ForegroundColor Yellow
docker run --rm projectdiscovery/nuclei:latest -version
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: Nuclei is working" -ForegroundColor Green
} else {
    Write-Host "   FAIL: Nuclei failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "3. Testing SQLMap..." -ForegroundColor Yellow
docker run --rm paoloo/sqlmap:latest --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: SQLMap is working" -ForegroundColor Green
} else {
    Write-Host "   FAIL: SQLMap failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "4. Testing theHarvester..." -ForegroundColor Yellow
docker run --rm theharvester/theharvester:latest -h | Select-Object -First 5
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: theHarvester is working" -ForegroundColor Green
} else {
    Write-Host "   FAIL: theHarvester failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "5. Testing YARA..." -ForegroundColor Yellow
docker run --rm blacktop/yara:latest --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: YARA is working" -ForegroundColor Green
} else {
    Write-Host "   FAIL: YARA failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "6. Testing tshark..." -ForegroundColor Yellow
docker run --rm nicolaka/netshoot:latest tshark --version | Select-Object -First 3
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: tshark is working" -ForegroundColor Green
} else {
    Write-Host "   FAIL: tshark failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "7. Testing Metasploit..." -ForegroundColor Yellow
docker run --rm metasploitframework/metasploit-framework:latest msfconsole --version
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: Metasploit is working" -ForegroundColor Green
} else {
    Write-Host "   FAIL: Metasploit failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "8. Testing ZAP..." -ForegroundColor Yellow
docker run --rm ghcr.io/zaproxy/zaproxy:stable zap.sh -version
if ($LASTEXITCODE -eq 0) {
    Write-Host "   OK: ZAP is working" -ForegroundColor Green
} else {
    Write-Host "   FAIL: ZAP failed" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
