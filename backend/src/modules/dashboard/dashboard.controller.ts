import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { DashboardService } from './dashboard.service';

export class DashboardController {
    static async getStats(req: AuthRequest, res: Response) {
        const userId = req.user!.id;
        const stats = await DashboardService.getStats(userId);
        res.json(stats);
    }

    static async getVulnerabilitiesTimeline(req: AuthRequest, res: Response) {
        const days = parseInt(req.query.days as string) || 30;
        const data = await DashboardService.getVulnerabilitiesTimeline(days);
        res.json(data);
    }

    static async getVulnerabilityTypes(req: AuthRequest, res: Response) {
        const limit = parseInt(req.query.limit as string) || 10;
        const data = await DashboardService.getVulnerabilityTypes(limit);
        res.json(data);
    }

    static async getIncidentsDistribution(req: AuthRequest, res: Response) {
        const data = await DashboardService.getIncidentsDistribution();
        res.json(data);
    }

    static async getScanActivity(req: AuthRequest, res: Response) {
        const days = parseInt(req.query.days as string) || 90;
        const data = await DashboardService.getScanActivity(days);
        res.json(data);
    }

    static async getRecentActivity(req: AuthRequest, res: Response) {
        const limit = parseInt(req.query.limit as string) || 20;
        const data = await DashboardService.getRecentActivity(limit);
        res.json(data);
    }

    static async getCriticalAlerts(req: AuthRequest, res: Response) {
        const limit = parseInt(req.query.limit as string) || 10;
        const data = await DashboardService.getCriticalAlerts(limit);
        res.json(data);
    }
}
