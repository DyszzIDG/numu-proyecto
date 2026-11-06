# 🚀 CSIRT System - Quick Start Guide

## ¿Qué es esto?

Sistema CSIRT (Computer Security Incident Response Team) completo con:
- ✅ Backend API (Express + TypeScript)
- ✅ Escaneo de seguridad con Nmap
- ✅ Dashboard en tiempo real
- ✅ Base de datos PostgreSQL
- ✅ WebSockets para actualizaciones en vivo

## 📋 Requisitos Previos

- ✅ Node.js 18+ (ya instalado)
- ✅ PostgreSQL (ya configurado)
- ⚠️ Redis (opcional, para colas de trabajo)
- ⚠️ Nmap (opcional, para escaneos reales)

## 🎯 Inicio Rápido

### 1. Backend (Primera vez)

```bash
cd backend
.\setup.bat
```

Esto instalará dependencias, ejecutará migraciones y configurará todo.

### 2. Iniciar Servicios

**Terminal 1 - Frontend (ya corriendo):**
```bash
npm run dev
```

**Terminal 2 - Backend API:**
```bash
cd backend
.\start-backend.bat
```

**Terminal 3 - Worker de Escaneo (opcional):**
```bash
cd backend
.\start-worker.bat
```

## 🌐 URLs

- **Frontend**: http://localhost:3100
- **Backend API**: http://localhost:4000
- **Dashboard CSIRT**: http://localhost:3100/csirt/dashboard
- **Escaneos**: http://localhost:3100/csirt/scans

## 🧪 Probar el Sistema

1. Ve a http://localhost:3100/csirt/scans/new
2. Crea un escaneo:
   - Nombre: "Test Scan"
   - Target: `scanme.nmap.org`
   - Tipo: Network Scan
3. Haz clic en "Create Scan"
4. Ve a la lista de escaneos para ver el progreso
5. Cuando complete, haz clic para ver vulnerabilidades

## 📊 Estructura del Proyecto

```
numu-desarrollo-main/
├── backend/              # API Backend
│   ├── src/
│   │   ├── config/      # Configuración
│   │   ├── middleware/  # Auth, errores, logs
│   │   ├── modules/     # Dashboard, Scans, etc.
│   │   └── services/    # Servicios compartidos
│   ├── setup.bat        # Script de instalación
│   ├── start-backend.bat # Iniciar servidor
│   └── start-worker.bat  # Iniciar worker
├── prisma/
│   └── schema.prisma    # Modelos de base de datos
└── src/
    └── app/
        └── csirt/       # Frontend CSIRT
            ├── dashboard/
            └── scans/
```

## 🔧 Comandos Útiles

### Backend
```bash
# Ver logs de base de datos
cd backend
node node_modules\prisma\build\index.js studio

# Regenerar cliente Prisma
node node_modules\prisma\build\index.js generate

# Nueva migración
node node_modules\prisma\build\index.js migrate dev
```

## ❓ Problemas Comunes

### "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo
- Revisa las credenciales en `.env`

### "Redis connection failed"
- El sistema funciona sin Redis (usa mock data)
- Para instalar Redis: https://redis.io/download

### "Nmap not found"
- El sistema usa datos de prueba si Nmap no está instalado
- Para instalar Nmap: https://nmap.org/download.html

## 📚 Próximos Pasos

1. ✅ **Fase 1 Completa**: Dashboard + Escaneos básicos
2. 🔜 **Fase 2**: Gestión de Incidentes
3. 🔜 **Fase 3**: Threat Intelligence
4. 🔜 **Fase 4**: Más herramientas de escaneo (Nuclei, ZAP)

## 🎓 Documentación

- [Walkthrough Completo](../../../.gemini/antigravity/brain/df39a68f-b9e4-4612-865a-03c3aa6865db/walkthrough.md)
- [Backend README](backend/README.md)
- [Plan de Implementación](../../../.gemini/antigravity/brain/df39a68f-b9e4-4612-865a-03c3aa6865db/implementation_plan.md)

---

**¿Necesitas ayuda?** Revisa el walkthrough.md para instrucciones detalladas.
