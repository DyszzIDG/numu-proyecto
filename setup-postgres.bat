@echo off
echo ========================================
echo Configurando Base de Datos PostgreSQL
echo ========================================
echo.

REM Backup del .env actual
if exist .env (
    echo Creando backup de .env...
    copy .env .env.backup
)

echo Actualizando DATABASE_URL en .env...
powershell -Command "(Get-Content .env) -replace 'DATABASE_URL=\"sqlserver:.*\"', 'DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/numu_csirt?schema=public\"' | Set-Content .env"

echo.
echo Regenerando Prisma Client...
call npx prisma generate

echo.
echo Creando base de datos y tablas...
call npx prisma db push

echo.
echo ========================================
echo Configuracion completada!
echo ========================================
echo.
echo Ahora puedes iniciar el servidor con: npm run dev
pause
