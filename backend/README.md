# CSIRT Backend API

## Overview
Backend API for the CSIRT (Computer Security Incident Response Team) system. Built with Express.js, Prisma, Redis, and Socket.IO.

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Nmap (for security scanning)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration

# Run database migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Start development server
npm run dev
```

## Environment Variables

```env
NODE_ENV=development
BACKEND_PORT=4000
FRONTEND_URL=http://localhost:3100
DATABASE_URL="postgresql://user:password@localhost:5432/numu_dev?schema=public"
JWT_SECRET=your-super-secret-jwt-key
REDIS_HOST=localhost
REDIS_PORT=6379
LOG_LEVEL=info
```

## API Endpoints

### Dashboard
- `GET /api/csirt/dashboard/stats` - Get dashboard statistics
- `GET /api/csirt/dashboard/charts/vulnerabilities-timeline` - Vulnerability timeline
- `GET /api/csirt/dashboard/charts/vulnerability-types` - Top vulnerability types
- `GET /api/csirt/dashboard/recent-activity` - Recent activity feed
- `GET /api/csirt/dashboard/critical-alerts` - Critical alerts

### Scans
- `POST /api/csirt/scans` - Create new scan
- `GET /api/csirt/scans` - List all scans
- `GET /api/csirt/scans/:id` - Get scan details
- `DELETE /api/csirt/scans/:id` - Delete scan
- `POST /api/csirt/scans/:id/cancel` - Cancel running scan
- `GET /api/csirt/scans/:id/vulnerabilities` - Get scan vulnerabilities

## Architecture

```
backend/
├── src/
│   ├── config/          # Configuration (DB, Redis, WebSocket)
│   ├── middleware/      # Auth, error handling, logging
│   ├── modules/         # Feature modules
│   │   ├── dashboard/   # Dashboard API
│   │   ├── scan/        # Scan management + worker
│   │   ├── incident/    # Incident management (placeholder)
│   │   └── threat/      # Threat intelligence (placeholder)
│   ├── services/        # Shared services
│   └── server.ts        # Express app entry
└── package.json
```

## Running Workers

The scan worker processes background scan jobs:

```bash
npx ts-node src/modules/scan/scan.worker.ts
```

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run database migrations
npm run migrate

# Open Prisma Studio
npx prisma studio
```

## Testing

```bash
# Health check
curl http://localhost:4000/health

# Get dashboard stats (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:4000/api/csirt/dashboard/stats

# Create scan
curl -X POST http://localhost:4000/api/csirt/scans \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Scan",
    "target": "scanme.nmap.org",
    "type": "NETWORK",
    "priority": "MEDIUM",
    "tools": ["nmap"]
  }'
```

## Security

- JWT authentication on all routes
- Rate limiting (100 req/15min)
- Helmet security headers
- CORS configuration
- Input validation with Zod
- Audit logging

## Technologies

- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Cache**: Redis
- **Queue**: Bull
- **WebSocket**: Socket.IO
- **Validation**: Zod
- **Logging**: Winston
- **Security**: Helmet, JWT

## License

Proprietary
