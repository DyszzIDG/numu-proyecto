import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import http from 'http';
import { initializeWebSocket } from './config/websocket';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/logger';

// Import routes
import dashboardRoutes from './modules/dashboard/dashboard.routes';
import scanRoutes from './modules/scan/scan.routes';
import incidentRoutes from './modules/incident/incident.routes';
import threatRoutes from './modules/threat/threat.routes';
import forensicsRoutes from './modules/forensics/forensics.routes';

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize WebSocket
initializeWebSocket(server);

// Security middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3100',
    credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// Logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/csirt/dashboard', dashboardRoutes);
app.use('/api/csirt/scans', scanRoutes);
app.use('/api/csirt/incidents', incidentRoutes);
app.use('/api/csirt/threats', threatRoutes);
app.use('/api/csirt/forensics', forensicsRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.BACKEND_PORT || 4000;

server.listen(PORT, () => {
    console.log(`🚀 CSIRT Backend server running on port ${PORT}`);
    console.log(`📊 Dashboard API: http://localhost:${PORT}/api/csirt/dashboard`);
    console.log(`🔍 Scans API: http://localhost:${PORT}/api/csirt/scans`);
    console.log(`🚨 Incidents API: http://localhost:${PORT}/api/csirt/incidents`);
    console.log(`⚠️  Threats API: http://localhost:${PORT}/api/csirt/threats`);
});

export default app;
