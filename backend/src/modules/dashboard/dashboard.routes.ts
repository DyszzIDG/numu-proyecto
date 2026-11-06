import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import { DashboardController } from './dashboard.controller';

const router = Router();

// All dashboard routes require authentication
router.use(authMiddleware);

// GET /api/csirt/dashboard - Dashboard root (checks auth)
router.get('/', (req, res) => {
    res.json({ message: 'CSIRT Dashboard API is ready' });
});

// GET /api/csirt/dashboard/stats - Get dashboard statistics
router.get('/stats', asyncHandler(DashboardController.getStats));

// GET /api/csirt/dashboard/charts/vulnerabilities-timeline - Vulnerability timeline data
router.get('/charts/vulnerabilities-timeline', asyncHandler(DashboardController.getVulnerabilitiesTimeline));

// GET /api/csirt/dashboard/charts/vulnerability-types - Top vulnerability types
router.get('/charts/vulnerability-types', asyncHandler(DashboardController.getVulnerabilityTypes));

// GET /api/csirt/dashboard/charts/incidents-distribution - Incidents by type
router.get('/charts/incidents-distribution', asyncHandler(DashboardController.getIncidentsDistribution));

// GET /api/csirt/dashboard/charts/scan-activity - Scan activity heatmap
router.get('/charts/scan-activity', asyncHandler(DashboardController.getScanActivity));

// GET /api/csirt/dashboard/recent-activity - Recent activity feed
router.get('/recent-activity', asyncHandler(DashboardController.getRecentActivity));

// GET /api/csirt/dashboard/critical-alerts - Critical alerts
router.get('/critical-alerts', asyncHandler(DashboardController.getCriticalAlerts));

export default router;
