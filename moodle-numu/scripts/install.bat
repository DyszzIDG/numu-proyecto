@echo off
REM NUMU Moodle - Installation Script (Windows)
REM Automated setup for development environment

echo ================================================
echo NUMU Moodle - Instalacion Automatizada
echo ================================================
echo.

REM Check Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta instalado. Por favor instala Docker Desktop.
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose no esta instalado.
    pause
    exit /b 1
)

echo OK: Docker detectado
echo.

REM Clone Moodle if not exists
if not exist "moodle" (
    echo Descargando Moodle 4.4 LTS...
    git clone -b MOODLE_404_STABLE https://github.com/moodle/moodle.git moodle
    echo OK: Moodle descargado
) else (
    echo OK: Moodle ya existe
)

REM Copy environment file
if not exist ".env" (
    echo Creando archivo .env...
    copy .env.example .env
    echo OK: Archivo .env creado
) else (
    echo OK: Archivo .env ya existe
)

REM Create directories
echo Creando directorios...
if not exist "moodledata" mkdir moodledata
if not exist "moodledata\backups" mkdir moodledata\backups
echo OK: Directorios creados

REM Start Docker containers
echo.
echo Iniciando servicios Docker...
docker-compose up -d

echo.
echo Esperando a que los servicios esten listos (30 segundos)...
timeout /t 30 /nobreak >nul

echo.
echo ================================================
echo OK: Instalacion completada!
echo ================================================
echo.
echo Accede a Moodle en: http://localhost:8080
echo Adminer (DB): http://localhost:8081
echo.
echo Credenciales por defecto:
echo    Usuario: admin
echo    Password: Admin@NUMU2026!
echo.
echo Proximos pasos:
echo    1. Accede a http://localhost:8080
echo    2. Completa la instalacion web
echo    3. Activa el tema 'NUMU Cyber'
echo    4. Instala plugins recomendados
echo.
echo Ver README.md para mas informacion
echo ================================================
pause
