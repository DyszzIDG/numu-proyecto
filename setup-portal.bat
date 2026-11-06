@echo off
echo ===================================
echo NUMU Employee Portal - Setup
echo ===================================
echo.
echo Step 1: Generating Prisma Client...
call npx prisma generate
echo.
echo Step 2: Running Migration...
call npx prisma migrate dev --name add_employee_portal
echo.
echo Step 3: Seeding Employees...
call npx ts-node prisma/seed-employees.ts
echo.
echo ===================================
echo Setup Complete!
echo ===================================
echo.
echo You can now login at:
echo http://localhost:3000/portal/login
echo.
echo Credentials:
echo - Admin: admin@numu.group / admin123
echo - HR: hr@numu.group / hr123
echo - Analyst: analyst1@numu.group / analyst123
echo.
pause
