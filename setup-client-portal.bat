@echo off
echo ================================================
echo CLIENT PORTAL - Database Setup
echo ================================================
echo.

echo [1/3] Generating Prisma Client...
call npx prisma generate
if %errorlevel% neq 0 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)
echo.

echo [2/3] Running database migration...
call npx prisma migrate dev --name add_client_portal
if %errorlevel% neq 0 (
    echo ERROR: Failed to run migration
    pause
    exit /b 1
)
echo.

echo [3/3] Seeding demo client data...
call npx ts-node prisma/seed-clients.ts
if %errorlevel% neq 0 (
    echo ERROR: Failed to seed client data
    pause
    exit /b 1
)
echo.

echo ================================================
echo ✅ CLIENT PORTAL SETUP COMPLETE!
echo ================================================
echo.
echo Demo credentials:
echo   Email: demo@empresa.com
echo   Password: demo123
echo.
echo You can now access the client portal at:
echo   http://localhost:3000/client/login
echo.
pause
