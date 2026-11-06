import { Request, Response } from 'express';
import { ForensicsService } from './forensics.service';

export class ForensicsController {
    static async listEvidence(req: Request, res: Response) {
        try {
            const evidence = await ForensicsService.findAll();
            res.json(evidence);
        } catch (error: any) {
            console.error('Error fetching evidence:', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async createEvidence(req: Request, res: Response) {
        try {
            const evidence = await ForensicsService.createEvidence(req.body);
            res.status(201).json(evidence);
        } catch (error: any) {
            console.error('Error creating evidence:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
