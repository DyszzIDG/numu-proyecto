@echo off
REM Script para purgar el caché de Moodle en Windows
REM Uso: purge-moodle-cache.bat

echo Purgando cache de Moodle...
docker exec numu_moodle_app php /var/www/html/admin/cli/purge_caches.php

if %errorlevel% equ 0 (
    echo Cache purgado exitosamente
    echo Recuerda refrescar tu navegador con Ctrl+Shift+R
) else (
    echo Error al purgar cache
    exit /b 1
)
