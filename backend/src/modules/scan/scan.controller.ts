import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth';
import { ScanService } from './scan.service';
import { z } from 'zod';

const createScanSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    target: z.string().min(1),
    type: z.enum(['NETWORK', 'WEB_APPLICATION', 'API', 'CLOUD', 'MOBILE', 'INFRASTRUCTURE', 'FULL_STACK']),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).default('MEDIUM'),
    tools: z.array(z.string()).default(['nmap']),
    nmapOptions: z.object({
        flags: z.string().optional(),
        ports: z.string().optional(),
    }).optional(),
});

export class ScanController {
    static async createScan(req: AuthRequest, res: Response) {
        const userId = req.user!.id;
        const data = createScanSchema.parse(req.body);

        const scan = await ScanService.createScan(userId, data, req);
        res.status(201).json(scan);
    }

    static async listScans(req: AuthRequest, res: Response) {
        const userId = req.user!.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const status = req.query.status as string;
        const type = req.query.type as string;

        const scans = await ScanService.listScans(userId, { page, limit, status, type });
        res.json(scans);
    }

    static async getScan(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const scan = await ScanService.getScanById(id);
        res.json(scan);
    }

    static async deleteScan(req: AuthRequest, res: Response) {
        const { id } = req.params;
        await ScanService.deleteScan(id);
        res.json({ message: 'Scan deleted successfully' });
    }

    static async cancelScan(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const scan = await ScanService.cancelScan(id);
        res.json(scan);
    }

    static async getScanVulnerabilities(req: AuthRequest, res: Response) {
        const { id } = req.params;
        const vulnerabilities = await ScanService.getScanVulnerabilities(id);
        res.json(vulnerabilities);
    }
}
