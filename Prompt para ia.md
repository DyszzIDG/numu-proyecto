# 🤖 PROMPT PARA IA - Implementación Dashboard CSIRT con Datos Reales

Hola, necesito tu ayuda para implementar la conexión del dashboard CSIRT a la base de datos real en mi proyecto NUMU.

## 📋 CONTEXTO DEL PROYECTO

Tengo un proyecto Next.js 14 con:
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
- **Backend**: Prisma ORM con PostgreSQL
- **Autenticación**: NextAuth.js
- **Base de Datos**: PostgreSQL con schema completo en Prisma

El dashboard CSIRT actual (`src/app/dashboard/csirt-overview/page.tsx`) usa datos mock hardcodeados. Necesito conectarlo a datos reales de la base de datos.

## 🎯 LO QUE NECESITO QUE HAGAS

Por favor, ayúdame a:

1. **Crear los archivos necesarios** para conectar el dashboard CSIRT a Prisma
2. **Generar los tipos TypeScript** apropiados
3. **Implementar Server Actions** para obtener datos reales
4. **Actualizar el componente del dashboard** para usar los datos reales
5. **Crear un script de seed** para poblar la BD con datos de ejemplo

## 📁 ARCHIVOS QUE NECESITO

### 1. Tipos TypeScript
**Ubicación**: `src/app/dashboard/csirt-overview/types.ts`

Debe incluir interfaces para:
- `CSIRTKPIs` (incidentes activos, nivel de riesgo, MTTD, MTTR)
- `IncidentBreakdown` (críticos, altos, medios, bajos, resueltos, pendientes)
- `ThreatTypeData` (para el gráfico de pastel)
- `OriginData` (para el gráfico de países)
- `RecentIncident` (tabla de incidentes)
- `ToolStatus` (estado de herramientas)
- `TeamStatus` (estado del equipo)
- `CSIRTDashboardData` (tipo principal que agrupa todo)

### 2. Server Actions
**Ubicación**: `src/app/dashboard/csirt-overview/actions.ts`

Debe incluir:
- Función `getCSIRTDashboardData()` que retorne `Promise<CSIRTDashboardData>`
- Usar `'use server'` directive
- Importar Prisma desde `@/lib/prisma`
- Queries para:
  - Incidentes activos agrupados por severidad
  - Incidentes de ayer (para comparación de cambios)
  - Incidentes resueltos hoy
  - Cálculo de MTTD y MTTR (últimos 30 días)
  - Distribución de tipos de amenaza (top 5, últimos 30 días)
  - Distribución de países de origen (top 5, últimos 30 días)
  - Últimos 10 incidentes con información del analista
  - Conteo de analistas activos y totales
  - Cálculo de riesgo basado en severidades
  - Cálculo de SLA remaining para cada incidente

**Lógica de Negocio**:
- **Risk Score**: `(críticos × 25) + (altos × 15) + (medios × 8) + (bajos × 2)`, máximo 100
- **Risk Level**: Alto (≥80), Medio (≥50), Bajo (<50)
- **MTTD**: Promedio de `(detectedAt - createdAt)` en minutos
- **MTTR**: Promedio de `(resolvedAt - detectedAt)` en minutos
- **SLA Hours**: Crítico=4h, Alto=8h, Medio=24h, Bajo=48h
- **SLA Remaining**: Calcular tiempo restante desde detección hasta deadline

### 3. Componente Actualizado
**Ubicación**: `src/app/dashboard/csirt-overview/page.tsx`

Debe:
- Ser un **async Server Component** (no 'use client')
- Importar y ejecutar `getCSIRTDashboardData()` al inicio
- Usar los datos reales en lugar de los mock
- Mantener exactamente el mismo diseño visual y estructura del componente actual
- Formatear fechas de manera relativa ("Hace 2h", "Ayer", "Hace 3 días")
- Calcular el porcentaje de resolución para la barra de progreso
- Mantener todos los gráficos de Recharts (PieChart, BarChart)
- Manejar casos donde no hay datos (mostrar mensajes apropiados)

### 4. Script de Seed
**Ubicación**: `prisma/seeds/seed-csirt.ts`

Debe crear:
- **4 analistas** (empleados con role='analyst', isActive=true)
  - John Doe, Maria Smith, Alex Garcia, Sarah Johnson
  - Email: `nombre.apellido@numu.com`
  - Password: hash bcrypt de "password"
- **50 incidentes** distribuidos en los últimos 30 días con:
  - Tipos variados: Ransomware, Phishing, Brute Force, Malware, DDoS, etc.
  - Severidades: Crítico, Alto, Medio, Bajo (distribución realista)
  - Estados: En Análisis, Contenido, Erradicado, Cerrado, Nuevo
  - Orígenes: CN, RU, US, BR, IR, KP, VN, IN, DE, FR
  - Analistas asignados aleatoriamente (70% asignados, 30% sin asignar)
  - Fechas de resolución para incidentes cerrados/erradicados
  - Cálculo de SLA deadline basado en severidad
- **2 incidentes críticos** recientes (últimos 30 minutos) para pruebas inmediatas

### 5. README de Implementación
**Ubicación**: `README-CSIRT-IMPLEMENTATION.md`

Debe incluir:
- Pasos detallados de instalación
- Comandos para ejecutar migraciones y seeds
- Instrucciones de troubleshooting
- Ejemplos de personalización
- Próximos pasos sugeridos

## 🔧 MODELO DE BASE DE DATOS

El schema de Prisma ya incluye:

```prisma
model Incident {
  id          String   @id @default(cuid())
  type        String   // "Ransomware Detected", "Phishing Campaign", etc.
  severity    String   // "Crítico", "Alto", "Medio", "Bajo"
  status      String   // "En Análisis", "Contenido", "Erradicado", "Cerrado", "Nuevo"
  detectedAt  DateTime
  resolvedAt  DateTime?
  analyst     Employee? @relation(fields: [analystId], references: [id])
  analystId   String?
  origin      String?  // Country code: CN, RU, US, etc.
  slaDeadline DateTime?
  description String?  @db.Text
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Employee {
  id         String  @id @default(cuid())
  email      String  @unique
  password   String
  firstName  String
  lastName   String
  role       String  // "admin", "analyst", "hr", "viewer"
  isActive   Boolean @default(true)
  // ... otros campos
  assignedIncidents Incident[]
}
```

## 📊 COMPONENTE ACTUAL (PARA REFERENCIA)

El componente actual tiene estas secciones:
1. **Header** con título y estado de sistemas
2. **4 KPI Cards**: Incidentes Activos, Nivel de Riesgo, MTTD, MTTR
3. **Grid de 3 columnas**:
   - Distribución de severidad (card con lista)
   - 2 gráficos (PieChart de amenazas + BarChart de orígenes)
4. **Tabla de incidentes** con 8 columnas
5. **Grid de 3 cards**: Estado de herramientas, Team Status, Reportes

**IMPORTANTE**: Mantén exactamente la misma estructura visual y clases de Tailwind.

## ✅ REQUISITOS TÉCNICOS

- Usa **TypeScript strict mode**
- Todos los archivos deben tener tipos completos
- Las Server Actions deben usar `'use server'`
- El componente debe ser **async** (Server Component)
- Manejo de errores con try-catch
- Usar `prisma` importado desde `@/lib/prisma`
- Queries optimizadas (usa `groupBy`, `count`, `findMany` con `include`)
- Formateo de fechas relativas
- Validación de datos nulos/undefined

## 🎨 ESTILO Y CONVENCIONES

- **Tailwind CSS**: bg-slate-950, text-slate-200, border-slate-800
- **Colores de severidad**:
  - Crítico: red-600/red-500
  - Alto: orange-500
  - Medio: yellow-500
  - Bajo: blue-400
- **Iconos**: Lucide React
- **Componentes UI**: Shadcn/ui (Card, CardContent, CardHeader, CardTitle)
- **Gráficos**: Recharts (PieChart, BarChart)

## 📝 NOTAS IMPORTANTES

1. El cliente Prisma ya está configurado en `src/lib/prisma.ts`
2. Next.js 14 usa App Router (no Pages Router)
3. Server Components no pueden usar hooks de React (useState, useEffect)
4. Para interactividad, crea Client Components separados si es necesario
5. El seed debe usar `upsert` para evitar duplicados en re-ejecuciones

## 🚀 ENTREGABLES

Por favor, genera:
1. ✅ `types.ts` - Definiciones de TypeScript
2. ✅ `actions.ts` - Server Actions con lógica de negocio
3. ✅ `page.tsx` - Componente actualizado del dashboard
4. ✅ `seed-csirt.ts` - Script de población de datos
5. ✅ `README-CSIRT-IMPLEMENTATION.md` - Guía de implementación

Cada archivo debe:
- Tener comentarios explicativos
- Incluir manejo de errores
- Ser production-ready
- Estar completo y funcional

---

## 🔍 PREGUNTAS GUÍA

Para asegurarte de hacer todo correctamente:

1. ¿Los tipos TypeScript cubren todos los datos necesarios?
2. ¿Las queries de Prisma están optimizadas?
3. ¿El componente maneja casos donde no hay datos?
4. ¿El seed crea datos realistas y variados?
5. ¿El README tiene instrucciones claras de implementación?
6. ¿El código sigue las convenciones de Next.js 14?
7. ¿Los cálculos de KPIs son correctos?

---

**¡Gracias! Espero archivos completos, funcionales y listos para producción.** 🚀