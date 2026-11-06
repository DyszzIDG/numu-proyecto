$ports = 5432, 5433, 5434, 5435
$passwords = "Ivan1234", "postgres", "admin", "1234", "root"
foreach ($p in $ports) {
    foreach ($pass in $passwords) {
        $env:DATABASE_URL = "postgresql://postgres:$($pass)@localhost:$p/postgres"
        $out = "SELECT 1;" | npx.cmd prisma db execute --stdin 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "FOUND: Port $p with password $pass"
        }
    }
}
