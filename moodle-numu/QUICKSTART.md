# NUMU Moodle - Quick Start Guide

## Instalación Rápida (Windows)

### Opción 1: Script Automatizado

```cmd
cd C:\Users\Ivan\Desktop\numu-desarrollo-main\moodle-numu
scripts\install.bat
```

### Opción 2: Manual

```cmd
# 1. Copiar variables de entorno
copy .env.example .env

# 2. Descargar Moodle
git clone -b MOODLE_404_STABLE https://github.com/moodle/moodle.git moodle

# 3. Iniciar servicios
docker-compose up -d

# 4. Esperar 2-3 minutos y acceder a:
# http://localhost:8080
```

## Configuración Inicial

### 1. Completar Instalación Web

1. Acceder a http://localhost:8080
2. Seleccionar idioma: **Español**
3. Confirmar paths (ya configurados)
4. Seleccionar driver: **PostgreSQL (native/pgsql)**
5. Configuración DB (ya configurada automáticamente)
6. Aceptar términos de licencia
7. Esperar verificación de requisitos (todos OK)
8. Continuar instalación de base de datos

### 2. Crear Usuario Administrador

- **Usuario:** admin
- **Password:** Admin@NUMU2026!
- **Email:** admin@numu.com
- **Nombre:** NUMU
- **Apellido:** Administrator

### 3. Configurar Sitio

- **Nombre completo:** NUMU Cybersecurity Academy
- **Nombre corto:** NUMU Academy
- **Descripción:** Plataforma de capacitación en ciberseguridad para profesionales SOC/CSIRT/GRC

### 4. Activar Tema NUMU Cyber

```
Site administration > Appearance > Themes > Theme selector
Seleccionar: NUMU Cyber
```

### 5. Configurar Idioma

```
Site administration > Language > Language settings
Default language: Español - Internacional (es)
```

## Estructura de Cursos Recomendada

### Crear Categorías

```
Site administration > Courses > Manage courses and categories
```

Crear las siguientes categorías:

1. **SOC & Blue Team**
2. **Cybersecurity Awareness**
3. **GRC & Compliance**
4. **Technical Labs**

### Curso Demo: SOC Analyst Level 1

1. Ir a `Site administration > Courses > Add a new course`
2. Configuración:
   - **Categoría:** SOC & Blue Team
   - **Nombre completo:** SOC Analyst Level 1
   - **Nombre corto:** SOC-L1
   - **Formato:** Topics
   - **Número de secciones:** 5
   - **Habilitar completion tracking:** Sí

3. Agregar secciones:
   - Módulo 1: Fundamentos de SOC
   - Módulo 2: Herramientas SIEM
   - Módulo 3: Análisis de Logs
   - Módulo 4: Incident Response
   - Evaluación Final

## Plugins Esenciales

### Instalar desde Site Administration

```
Site administration > Plugins > Install plugins
```

**Recomendados:**

1. **Certificate** - `mod_certificate`
2. **H5P** - `mod_hvp`
3. **Quiz Analytics** - `quiz_analytics`
4. **Completion Progress** - `block_completion_progress`
5. **Level Up!** - `block_xp`

## Roles Personalizados

### Crear Rol: SOC Analyst

```
Site administration > Users > Permissions > Define roles > Add a new role
```

- **Nombre corto:** soc_analyst
- **Nombre personalizado:** SOC Analyst
- **Descripción:** Analista SOC con acceso a labs avanzados
- **Archetype:** Student
- **Capabilities adicionales:**
  - `moodle/course:viewhiddenactivities`
  - `moodle/grade:viewall`

## Integración con NUMU Dashboard

### Configurar API

Editar `config/config.php`:

```php
$CFG->numu_api_endpoint = 'http://localhost:3000/api/moodle';
$CFG->numu_api_key = 'numu_integration_key_2026';
$CFG->numu_webhook_secret = 'numu_webhook_secret_2026';
```

### Endpoints Disponibles

```
POST /local/numu_integration/api.php?action=sync_user
GET  /local/numu_integration/api.php?action=get_user_progress&email=user@example.com
GET  /local/numu_integration/api.php?action=get_team_analytics
POST /local/numu_integration/api.php?action=enroll_user
```

**Headers requeridos:**
```
X-API-Key: numu_integration_key_2026
Content-Type: application/json
```

## Comandos Útiles

### Docker

```bash
# Ver logs
docker-compose logs -f moodle

# Reiniciar
docker-compose restart

# Detener
docker-compose down

# Backup DB
docker exec numu_moodle_db pg_dump -U moodle_user moodle_numu > backup.sql
```

### Moodle CLI

```bash
# Entrar al contenedor
docker exec -it numu_moodle_app bash

# Ejecutar cron
php admin/cli/cron.php

# Limpiar caché
php admin/cli/purge_caches.php

# Actualizar base de datos
php admin/cli/upgrade.php
```

## Troubleshooting

### Error: "Cannot connect to database"

```bash
# Verificar PostgreSQL
docker exec numu_moodle_db pg_isready -U moodle_user

# Reiniciar servicios
docker-compose restart postgres moodle
```

### Error: "Redis connection failed"

```bash
# Verificar Redis
docker exec numu_moodle_redis redis-cli ping

# Reiniciar Redis
docker-compose restart redis
```

### Tema no se aplica

```bash
# Limpiar caché
docker exec numu_moodle_app php admin/cli/purge_caches.php

# Verificar permisos
docker exec numu_moodle_app chmod -R 755 /var/www/html/theme/numu_cyber
```

## Próximos Pasos

1. ✅ Instalación completada
2. ⏳ Crear cursos de capacitación
3. ⏳ Configurar certificados
4. ⏳ Integrar con NUMU Dashboard
5. ⏳ Migrar a AWS (producción)

## Soporte

- 📧 Email: soporte@numu.com
- 📚 Docs: Ver `README.md` completo
- 🔧 Issues: Reportar en repositorio
