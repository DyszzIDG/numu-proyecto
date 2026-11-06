#!/bin/bash
# Script para purgar el caché de Moodle
# Uso: ./purge-moodle-cache.sh

echo "🔄 Purgando caché de Moodle..."
docker exec numu_moodle_app php /var/www/html/admin/cli/purge_caches.php

if [ $? -eq 0 ]; then
    echo "✅ Caché purgado exitosamente"
    echo "📝 Recuerda refrescar tu navegador con Ctrl+Shift+R"
else
    echo "❌ Error al purgar caché"
    exit 1
fi
