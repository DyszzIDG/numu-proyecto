# NUMU Platform - Quick Commands

## 🚀 Start Development Server
```bash
cd c:\Users\IVAN\Desktop\csirt-json\numu-v2-main
npm run dev
```

## 📊 Database Commands
```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# View database in browser
npx prisma studio

# Check migration status
npx prisma migrate status
```

## 🔍 Testing URLs
```bash
# Main Landing
http://localhost:3000/numu-inicio

# AI Scans (Main Feature)
http://localhost:3000/dashboard/ai-scans

# CTF Platform
http://localhost:3000/numu-ctf

# CSIRT Logs (Admin)
http://localhost:3000/csirt-logs

# Financial System (Admin)
http://localhost:3000/sistema-financiero

# Admin Panel (SuperAdmin)
http://localhost:3000/vista-administrador

# Company View
http://localhost:3000/vista-empresa

# Configuration Hub (Admin)
http://localhost:3000/numu-central
```

## 🐳 Docker Commands
```bash
# Check if csirt-ubuntu is running
docker ps | grep csirt-ubuntu

# Start container
docker start csirt-ubuntu

# Stop container
docker stop csirt-ubuntu

# View logs
docker logs csirt-ubuntu
```

## 🔑 Environment Variables Needed
```bash
# Add to .env file:
OPENAI_API_KEY=sk-your-key-here
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=your-secret
FOFA_API_KEY=optional
STRIPE_SECRET_KEY=pending
```

## 📝 Quick Test Flow
```bash
1. Open: http://localhost:3000/numu-inicio
2. Click: "AI Security Scans"
3. Select: Nmap tool
4. Type: "Scan numu.group for vulnerabilities"
5. Click: "Run AI-Powered Scan"
6. Verify: Command generated, executed, analyzed
```

## 🎯 Features Implemented
- ✅ AI-powered security scanning
- ✅ 7 specialized dashboards
- ✅ Subscription system (Free/Premium)
- ✅ Role-based access control
- ✅ Nmap & Nikto parsers
- ⏳ Stripe integration (pending)
- ⏳ FOFA API (pending)

## 📊 Progress: 85% Complete
