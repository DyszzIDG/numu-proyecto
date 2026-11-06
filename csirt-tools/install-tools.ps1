# CSIRT Tools Installation and Verification Script
# This script installs and verifies the MVP set of 10 essential security tools

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CSIRT Tools MVP Installation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command {
    param($Command)
    try {
        if (Get-Command $Command -ErrorAction Stop) {
            return $true
        }
    }
    catch {
        return $false
    }
}

# Function to test Docker container
function Test-DockerContainer {
    param($ContainerName, $Image)
    
    Write-Host "Testing $ContainerName..." -ForegroundColor Yellow
    
    try {
        $result = docker run --rm $Image 2>&1
        if ($LASTEXITCODE -eq 0 -or $result -match "version|help|usage") {
            Write-Host "✓ $ContainerName is working" -ForegroundColor Green
            return $true
        } else {
            Write-Host "✗ $ContainerName failed" -ForegroundColor Red
            return $false
        }
    }
    catch {
        Write-Host "✗ $ContainerName error: $_" -ForegroundColor Red
        return $false
    }
}

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Cyan
Write-Host ""

# Check Docker
if (Test-Command docker) {
    $dockerVersion = docker --version
    Write-Host "✓ Docker installed: $dockerVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Docker not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

# Check Python
if (Test-Command python) {
    $pythonVersion = python --version
    Write-Host "✓ Python installed: $pythonVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Python not found. Please install Python." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Pulling Docker Images..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to csirt-tools directory
Set-Location -Path "$PSScriptRoot"

# Pull all images
Write-Host "Pulling images (this may take several minutes)..." -ForegroundColor Yellow
docker-compose pull

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing Tools..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Test each tool
$tools = @(
    @{Name="Nmap"; Image="instrumentisto/nmap:latest"},
    @{Name="Nuclei"; Image="projectdiscovery/nuclei:latest"},
    @{Name="Nikto"; Image="sullo/nikto:latest"},
    @{Name="SQLMap"; Image="paoloo/sqlmap:latest"},
    @{Name="Gobuster"; Image="opsxcq/gobuster:latest"},
    @{Name="theHarvester"; Image="theharvester/theharvester:latest"},
    @{Name="YARA"; Image="blacktop/yara:latest"},
    @{Name="Lynis"; Image="cisofy/lynis:latest"},
    @{Name="tshark"; Image="nicolaka/netshoot:latest"}
)

$successCount = 0
$failCount = 0

foreach ($tool in $tools) {
    if (Test-DockerContainer -ContainerName $tool.Name -Image $tool.Image) {
        $successCount++
    } else {
        $failCount++
    }
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Installation Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✓ Successful: $successCount" -ForegroundColor Green
Write-Host "✗ Failed: $failCount" -ForegroundColor Red
Write-Host ""

if ($failCount -eq 0) {
    Write-Host "🎉 All tools installed successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Some tools failed to install. Check the output above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Review the docker-compose.yml file" -ForegroundColor White
Write-Host "2. Run tools using: docker-compose run <tool-name> <args>" -ForegroundColor White
Write-Host "3. Example: docker-compose run nmap -sV scanme.nmap.org" -ForegroundColor White
Write-Host ""
Write-Host "Documentation: See tools-documentation.md" -ForegroundColor White
Write-Host ""
