#!/bin/bash
# NUMU Moodle - Installation Script
# Automated setup for development environment

set -e

echo "================================================"
echo "NUMU Moodle - Instalación Automatizada"
echo "================================================"
echo ""

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker no está instalado. Por favor instala Docker Desktop."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose no está instalado."
    exit 1
fi

echo "✅ Docker detectado"
echo ""

# Clone Moodle if not exists
if [ ! -d "moodle" ]; then
    echo "📥 Descargando Moodle 4.4 LTS..."
    git clone -b MOODLE_404_STABLE https://github.com/moodle/moodle.git moodle
    echo "✅ Moodle descargado"
else
    echo "✅ Moodle ya existe"
fi

# Copy environment file
if [ ! -f ".env" ]; then
    echo "📝 Creando archivo .env..."
    cp .env.example .env
    echo "✅ Archivo .env creado"
else
    echo "✅ Archivo .env ya existe"
fi

# Create necessary directories
echo "📁 Creando directorios..."
mkdir -p moodledata
mkdir -p moodledata/backups
chmod -R 777 moodledata
echo "✅ Directorios creados"

# Start Docker containers
echo ""
echo "🚀 Iniciando servicios Docker..."
docker-compose up -d

echo ""
echo "⏳ Esperando a que los servicios estén listos..."
sleep 10

# Wait for PostgreSQL
echo "⏳ Esperando PostgreSQL..."
until docker exec numu_moodle_db pg_isready -U moodle_user -d moodle_numu > /dev/null 2>&1; do
    sleep 2
done
echo "✅ PostgreSQL listo"

# Wait for Redis
echo "⏳ Esperando Redis..."
until docker exec numu_moodle_redis redis-cli ping > /dev/null 2>&1; do
    sleep 2
done
echo "✅ Redis listo"

echo ""
echo "================================================"
echo "✅ Instalación completada!"
echo "================================================"
echo ""
echo "📍 Accede a Moodle en: http://localhost:8080"
echo "📍 Adminer (DB): http://localhost:8081"
echo ""
echo "🔐 Credenciales por defecto:"
echo "   Usuario: admin"
echo "   Password: Admin@NUMU2026!"
echo ""
echo "📚 Próximos pasos:"
echo "   1. Accede a http://localhost:8080"
echo "   2. Completa la instalación web"
echo "   3. Activa el tema 'NUMU Cyber'"
echo "   4. Instala plugins recomendados"
echo ""
echo "📖 Ver README.md para más información"
echo "================================================"
