# 🚀 NUMU Platform - Testing Guide

## Quick Start Testing

### 1. Verificar que el servidor esté corriendo
```bash
# Ya está corriendo en: http://localhost:3000
# Status: ✅ Running (20+ minutos)
```

### 2. Dashboards para Probar

#### A. Landing Principal
```
URL: http://localhost:3000/numu-inicio
Qué probar:
- ✅ Navegación a todos los dashboards
- ✅ Estadísticas de usuario
- ✅ Quick actions funcionando
```

#### B. AI Scans (Funcionalidad Principal)
```
URL: http://localhost:3000/dashboard/ai-scans
Qué probar:
1. Seleccionar herramienta (Nmap, Nikto, etc.)
2. Escribir en lenguaje natural: "Scan numu.group for vulnerabilities"
3. Click en "Run AI-Powered Scan"
4. Verificar que:
   - ✅ Se genera el comando
   - ✅ Se ejecuta en Docker
   - ✅ Se muestra el análisis de IA
   - ✅ Se actualiza la cuota

⚠️ IMPORTANTE: Necesitas OPENAI_API_KEY en .env
```

#### C. CTF Platform
```
URL: http://localhost:3000/numu-ctf
Qué probar:
- ✅ Categorías de challenges
- ✅ Learning paths
- ✅ Leaderboard preview
```

#### D. CSIRT Logs (Admin)
```
URL: http://localhost:3000/csirt-logs
Requiere: Admin o SuperAdmin
Qué probar:
- ✅ Audit logs
- ✅ System events
- ✅ Severity filtering
```

#### E. Financial System (Admin)
```
URL: http://localhost:3000/sistema-financiero
Requiere: Admin o SuperAdmin
Qué probar:
- ✅ Revenue metrics
- ✅ Transaction history
- ✅ MRR calculation
```

#### F. Admin Panel (SuperAdmin)
```
URL: http://localhost:3000/vista-administrador
Requiere: SuperAdmin
Qué probar:
- ✅ User management
- ✅ Platform statistics
- ✅ System info
```

#### G. Company View
```
URL: http://localhost:3000/vista-empresa
Qué probar:
1. Seleccionar una empresa
2. Ver security score
3. Assessment history
```

#### H. NUMU Central (Admin)
```
URL: http://localhost:3000/numu-central
Requiere: Admin o SuperAdmin
Qué probar:
- ✅ API configuration status
- ✅ System status
- ✅ Integration settings
```

---

## 3. Testing de API Endpoints

### Check Quota
```bash
# GET /api/subscription/check-quota
curl http://localhost:3000/api/subscription/check-quota \
  -H "Cookie: your-session-cookie"
```

### AI Execute
```bash
# POST /api/ai/execute
curl -X POST http://localhost:3000/api/ai/execute \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "userPrompt": "Scan numu.group for open ports",
    "tool": "nmap"
  }'
```

### AI Analyze
```bash
# POST /api/ai/analyze
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "executionId": "your-execution-id"
  }'
```

---

## 4. Verificar Base de Datos

```bash
# Ver migraciones aplicadas
npx prisma migrate status

# Ver datos en Prisma Studio
npx prisma studio
```

---

## 5. Checklist de Funcionalidades

### AI Agent ✅
- [x] Generación de comandos desde lenguaje natural
- [x] Análisis de resultados con IA
- [x] Clasificación de severidad
- [x] Recomendaciones automáticas
- [x] Sistema de fallback

### Subscription System ✅
- [x] Free tier (4 scans/mes)
- [x] Premium tier ($9.90/mes)
- [x] Tracking de cuota
- [x] Reset mensual
- [ ] Stripe integration (pending)

### Dashboards ✅
- [x] numu-inicio
- [x] ai-scans
- [x] numu-ctf
- [x] csirt-logs
- [x] sistema-financiero
- [x] vista-administrador
- [x] vista-empresa
- [x] numu-central

### Security ✅
- [x] Command sanitization
- [x] Role-based access
- [x] Audit logging
- [x] Session management

---

## 6. Problemas Comunes y Soluciones

### "OpenAI API error"
```bash
# Solución: Agregar API key en .env
OPENAI_API_KEY=sk-your-key-here
```

### "Quota exceeded"
```bash
# Solución: Upgrade a premium o esperar reset mensual
# O en desarrollo, resetear manualmente en DB
```

### "Docker exec failed"
```bash
# Solución: Verificar que csirt-ubuntu esté corriendo
docker ps | grep csirt-ubuntu

# Si no está corriendo, iniciarlo
docker start csirt-ubuntu
```

### "Unauthorized" en dashboards admin
```bash
# Solución: Verificar rol de usuario en DB
# Cambiar isAdmin o isSuperAdmin a true
```

---

## 7. Testing Rápido (5 minutos)

```bash
# 1. Abrir navegador
http://localhost:3000/numu-inicio

# 2. Navegar a AI Scans
Click en "AI Security Scans"

# 3. Seleccionar Nmap
Click en la tarjeta de Nmap

# 4. Escribir prompt
"Scan numu.group for open ports"

# 5. Ejecutar
Click en "Run AI-Powered Scan"

# 6. Verificar resultados
- Comando generado ✅
- Ejecución completada ✅
- Análisis de IA mostrado ✅
- Cuota actualizada ✅
```

---

## 8. Próximos Pasos

### Para Producción
1. Agregar OPENAI_API_KEY real
2. Integrar Stripe para pagos
3. Configurar FOFA_API_KEY (opcional)
4. Configurar dominio y SSL
5. Configurar backups de DB

### Para Desarrollo
1. Agregar tests unitarios
2. Agregar tests de integración
3. Configurar CI/CD
4. Agregar monitoring (Sentry)
5. Agregar analytics

---

## 9. URLs de Acceso Rápido

```
Landing:     http://localhost:3000/numu-inicio
AI Scans:    http://localhost:3000/dashboard/ai-scans
CTF:         http://localhost:3000/numu-ctf
Logs:        http://localhost:3000/csirt-logs
Financial:   http://localhost:3000/sistema-financiero
Admin:       http://localhost:3000/vista-administrador
Companies:   http://localhost:3000/vista-empresa
Central:     http://localhost:3000/numu-central
```

---

## 10. Comandos Útiles

```bash
# Ver logs del servidor
# (ya está corriendo en tu terminal)

# Regenerar Prisma Client
npx prisma generate

# Ver base de datos
npx prisma studio

# Crear nueva migración
npx prisma migrate dev --name nombre_migracion

# Reset base de datos (CUIDADO!)
npx prisma migrate reset
```

---

## ✅ Todo Listo!

La plataforma está **85% completa** y lista para testing. 

**Siguiente paso recomendado**: Probar el flujo completo de AI Scans con una API key de OpenAI real.
