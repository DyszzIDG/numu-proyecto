# NUMU Moodle - Enterprise Education Module

Plataforma de capacitación en ciberseguridad basada en Moodle 4.4 LTS, optimizada para formación técnica SOC/CSIRT/GRC.

## 🚀 Quick Start

### Requisitos Previos

- Docker Desktop instalado
- Git
- 8GB RAM mínimo
- 20GB espacio en disco

### Instalación

```bash
# 1. Clonar repositorio (si no está clonado)
cd C:\Users\Ivan\Desktop\numu-desarrollo-main\moodle-numu

# 2. Copiar variables de entorno
copy .env.example .env

# 3. Descargar Moodle 4.4 LTS
git clone -b MOODLE_404_STABLE https://github.com/moodle/moodle.git moodle

# 4. Iniciar servicios
docker-compose up -d

# 5. Esperar a que los servicios estén listos (2-3 minutos)
docker-compose logs -f moodle

# 6. Acceder a Moodle
# http://localhost:8080
```

### Credenciales por Defecto

**Moodle Admin:**
- URL: http://localhost:8080
- Usuario: `admin`
- Password: `Admin@NUMU2026!`

**Base de Datos (Adminer):**
- URL: http://localhost:8081
- Sistema: PostgreSQL
- Servidor: postgres
- Usuario: `moodle_user`
- Password: `numu_secure_2026`
- Base de datos: `moodle_numu`

## 📁 Estructura del Proyecto

```
moodle-numu/
├── config/
│   ├── config.php          # Configuración principal Moodle
│   ├── php.ini             # Optimizaciones PHP
│   └── postgresql.conf     # Tuning PostgreSQL
├── theme/
│   └── numu_cyber/         # Tema personalizado NUMU
├── local/
│   └── numu_integration/   # Plugin integración con Dashboard
├── scripts/
│   ├── install.sh          # Script instalación automatizada
│   ├── backup.sh           # Backups automáticos
│   └── deploy-aws.sh       # Migración a AWS
├── docker-compose.yml      # Orquestación de servicios
└── README.md
```

## 🎨 Personalización

### Tema NUMU Cyber

El tema personalizado incluye:
- Paleta de colores corporativa (#00D9FF, #7B2CBF)
- Tipografía Inter + JetBrains Mono
- Dark mode nativo
- Iconografía cybersecurity
- Responsive design premium

### Plugins Esenciales

Instalar desde `Site administration > Plugins > Install plugins`:

1. **Certificate** - Certificados personalizados
2. **H5P** - Contenido interactivo
3. **SCORM Cloud** - Laboratorios técnicos
4. **Quiz Analytics** - Métricas avanzadas
5. **Custom Reports** - Dashboards ejecutivos

## 🔒 Seguridad

### Configuración Aplicada

- ✅ Política de contraseñas robusta (12+ caracteres)
- ✅ Lockout tras 5 intentos fallidos
- ✅ Sesiones en Redis (performance + seguridad)
- ✅ File upload limitado a 100MB
- ✅ Backups automáticos diarios
- ✅ Logs de auditoría habilitados

### Hardening Adicional (Producción)

```bash
# Habilitar HTTPS
# Editar config.php:
$CFG->sslproxy = true;
$CFG->reverseproxy = true;

# Deshabilitar debugging
$CFG->debug = 0;
$CFG->debugdisplay = 0;
```

## 📊 Roles Personalizados

| Rol | Descripción | Permisos Clave |
|-----|-------------|----------------|
| **CISO/Manager** | Gestión ejecutiva | Ver reportes, exportar datos, gestionar usuarios |
| **Instructor** | Creador de cursos | Crear/editar cursos, calificar, reportes de grupo |
| **SOC Analyst** | Líder técnico | Acceso labs avanzados, ver progreso del equipo |
| **Student** | Usuario final | Completar cursos, obtener certificados |

Configurar en: `Site administration > Users > Permissions > Define roles`

## 🎓 Estructura de Cursos

### Categorías Principales

```
📁 SOC & Blue Team
  ├── SOC Analyst Level 1
  ├── Incident Response Fundamentals
  └── Threat Hunting Basics

📁 Cybersecurity Awareness
  ├── Phishing Awareness
  ├── Password Security
  └── Social Engineering Defense

📁 GRC & Compliance
  ├── ISO 27001 Foundations
  ├── NIST Cybersecurity Framework
  └── Risk Management

📁 Technical Labs
  ├── Malware Analysis Sandbox
  ├── Network Forensics
  └── SIEM Operations
```

## 🔌 Integración con NUMU Dashboard

### API Endpoints

El plugin `local_numu_integration` expone:

```
POST /local/numu_integration/api/users/sync
GET  /local/numu_integration/api/users/{id}/progress
GET  /local/numu_integration/api/analytics/team
POST /local/numu_integration/webhook/course_completed
```

### Configuración

Editar `config.php`:

```php
$CFG->numu_api_endpoint = 'https://numu.com/api/moodle';
$CFG->numu_api_key = 'your-api-key';
$CFG->numu_webhook_secret = 'your-webhook-secret';
```

## 🛠️ Comandos Útiles

### Docker

```bash
# Ver logs
docker-compose logs -f moodle

# Reiniciar servicios
docker-compose restart

# Detener todo
docker-compose down

# Backup de base de datos
docker exec numu_moodle_db pg_dump -U moodle_user moodle_numu > backup.sql

# Restaurar backup
docker exec -i numu_moodle_db psql -U moodle_user moodle_numu < backup.sql
```

### Moodle CLI

```bash
# Entrar al contenedor
docker exec -it numu_moodle_app bash

# Ejecutar cron manualmente
php admin/cli/cron.php

# Limpiar caché
php admin/cli/purge_caches.php

# Crear usuario admin
php admin/cli/install.php
```

## 📈 Performance

### Métricas Esperadas

- **Tiempo de carga:** < 2s (primera visita)
- **Usuarios concurrentes:** 500+
- **Uptime:** 99.9%
- **Database queries:** < 100 por página

### Monitoreo

Acceder a:
- Moodle Reports: `Site administration > Reports > Performance overview`
- PostgreSQL Stats: Adminer (http://localhost:8081)
- Redis Monitor: `docker exec -it numu_moodle_redis redis-cli monitor`

## ☁️ Migración a AWS

Ver documentación completa en: `docs/aws-migration.md`

### Arquitectura Cloud

- **EC2:** t3.large x2 (Auto Scaling)
- **RDS:** PostgreSQL Multi-AZ
- **ElastiCache:** Redis cluster
- **S3:** File storage + CDN
- **CloudFront:** CDN global
- **Route 53:** DNS management

**Costo estimado:** ~$486/mes

## 📚 Documentación Adicional

- [Moodle Official Docs](https://docs.moodle.org)
- [PostgreSQL Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Redis Best Practices](https://redis.io/docs/management/optimization/)
- [AWS Well-Architected](https://aws.amazon.com/architecture/well-architected/)

## 🆘 Soporte

Para problemas o consultas:
- Email: soporte@numu.com
- Slack: #moodle-numu
- Docs: https://docs.numu.com/moodle

## 📝 Licencia

Este proyecto utiliza Moodle bajo licencia GPL v3.
Customizaciones NUMU: Propiedad de NUMU Group.
