# 🎯 CSIRT System - Guía de Pruebas

## ✅ Estado del Sistema

**Backend**: ✅ Corriendo en http://localhost:4000  
**Frontend**: ✅ Corriendo en http://localhost:3100  
**Base de Datos**: ✅ PostgreSQL conectado  

---

## 🧪 Pruebas Paso a Paso

### 1. Verificar Backend (Health Check)

**En Git Bash o PowerShell:**
```bash
curl http://localhost:4000/health
```

**Resultado esperado:**
```json
{"status":"ok","timestamp":"2026-01-29T..."}
```

---

### 2. Probar Dashboard

1. Abre tu navegador en: **http://localhost:3100/csirt/dashboard**
2. Deberías ver:
   - ✅ Tarjetas de estadísticas (Active Scans, Critical Vulnerabilities, etc.)
   - ✅ Distribución de vulnerabilidades
   - ✅ Pestañas: Overview, Scans, Vulnerabilities, Incidents

---

### 3. Crear tu Primer Scan

1. Ve a: **http://localhost:3100/csirt/scans/new**

2. Completa el formulario:
   ```
   Scan Name: Test Scan 1
   Description: Mi primer scan de prueba
   Target: scanme.nmap.org
   Scan Type: Network Scan
   Priority: Medium
   Nmap Flags: -sV -sC
   Port Range: 1-1000
   ```

3. Click en **"Create Scan"**

4. Serás redirigido a la página de detalle del scan

---

### 4. Ver Lista de Scans

1. Ve a: **http://localhost:3100/csirt/scans**

2. Deberías ver tu scan con:
   - ✅ Estado: QUEUED → RUNNING → COMPLETED
   - ✅ Barra de progreso (si está corriendo)
   - ✅ Badges de estado y prioridad

---

### 5. Ver Resultados del Scan

1. Click en el scan completado

2. Explora las pestañas:

   **Vulnerabilities:**
   - Lista de vulnerabilidades encontradas
   - Severidad (Critical, High, Medium, Low)
   - CVE y CWE si aplica
   - Descripción y remediación

   **Ports:**
   - Tabla de puertos descubiertos
   - Estado (open/closed)
   - Servicio y versión

   **Services:**
   - Servicios detectados
   - Versiones de software

   **Raw Output:**
   - Salida completa de Nmap
   - Formato terminal

---

## 🔍 Pruebas Avanzadas

### Test API Directamente

**Obtener estadísticas del dashboard:**
```bash
curl http://localhost:4000/api/csirt/dashboard/stats
```

**Listar todos los scans:**
```bash
curl http://localhost:4000/api/csirt/scans
```

**Crear scan vía API:**
```bash
curl -X POST http://localhost:4000/api/csirt/scans \
  -H "Content-Type: application/json" \
  -d '{
    "name": "API Test Scan",
    "target": "scanme.nmap.org",
    "type": "NETWORK",
    "priority": "MEDIUM",
    "tools": ["nmap"]
  }'
```

---

## 🎨 Características a Probar

### Dashboard
- [ ] Estadísticas se actualizan en tiempo real
- [ ] Gráficos de distribución de vulnerabilidades
- [ ] Navegación entre pestañas

### Scans
- [ ] Crear scan con diferentes configuraciones
- [ ] Filtrar scans por estado (All, Running, Completed, Failed)
- [ ] Ver progreso en tiempo real
- [ ] Eliminar scans

### Vulnerabilities
- [ ] Ver detalles de vulnerabilidades
- [ ] Badges de severidad con colores
- [ ] CVE y CWE links
- [ ] Recomendaciones de remediación

---

## 🐛 Troubleshooting

### "Cannot connect to backend"
```bash
# Verifica que el backend esté corriendo
curl http://localhost:4000/health

# Si no responde, reinicia:
cd backend
npm run dev
```

### "No vulnerabilities found"
- Es normal si el target no tiene vulnerabilidades
- Prueba con: `scanme.nmap.org` (siempre tiene algunos hallazgos)
- O usa datos mock si Nmap no está instalado

### "Scan stuck in QUEUED"
- Verifica que el worker esté corriendo
- Si no tienes Nmap instalado, el sistema usa datos mock
- El scan debería completar en 10-30 segundos

---

## 📊 Datos de Prueba

### Targets Recomendados

1. **scanme.nmap.org** - Target oficial de Nmap para pruebas
2. **localhost** - Tu propia máquina
3. **192.168.1.1** - Tu router (si estás en red local)

### Configuraciones de Scan

**Scan Rápido:**
```
Flags: -sV
Ports: 80,443,22
```

**Scan Completo:**
```
Flags: -sV -sC -A
Ports: 1-1000
```

**Scan Agresivo:**
```
Flags: -sV -sC -A -T4
Ports: 1-65535
```

---

## ✅ Checklist de Funcionalidades

### Backend
- [x] Health check endpoint
- [x] Dashboard stats API
- [x] Scan CRUD operations
- [x] Vulnerability tracking
- [x] Real-time WebSocket updates
- [x] Audit logging
- [x] Error handling

### Frontend
- [x] Dashboard con estadísticas
- [x] Lista de scans con filtros
- [x] Formulario de creación de scans
- [x] Vista detallada de scans
- [x] Visualización de vulnerabilidades
- [x] Tablas de puertos y servicios
- [x] Raw output display

### Database
- [x] Prisma schema con 20+ modelos
- [x] Relaciones entre entidades
- [x] Índices optimizados
- [x] Migraciones aplicadas

---

## 🚀 Próximas Funcionalidades (Fase 2)

1. **Incident Management**
   - Kanban board
   - Evidence upload
   - Timeline tracking

2. **Threat Intelligence**
   - IOC management
   - MITRE ATT&CK mapping
   - Threat feeds

3. **Enhanced Scanning**
   - Nuclei integration
   - OWASP ZAP
   - Scheduled scans

---

## 📝 Notas

- **Nmap**: Si no está instalado, el sistema usa datos mock realistas
- **Redis**: Opcional, el sistema funciona sin él
- **WebSockets**: Actualizaciones en tiempo real automáticas
- **Audit Logs**: Todas las acciones se registran en la BD

---

**¿Todo funcionando?** ¡Felicitaciones! Tienes un sistema CSIRT profesional corriendo. 🎉

**¿Problemas?** Revisa el [STATUS.md](file:///C:/Users/Ivan/.gemini/antigravity/brain/df39a68f-b9e4-4612-865a-03c3aa6865db/STATUS.md) para soluciones.
