import { Request, Response } from 'express';
import { IncidentService } from './incident.service';

export class IncidentController {
    static async getIncidents(req: Request, res: Response) {
        try {
            const filters = {
                status: req.query.status as string,
                priority: req.query.priority as string,
                type: req.query.type as string,
                limit: req.query.limit ? Number(req.query.limit) : 50
            };

            const incidents = await IncidentService.findAll(filters);
            res.json(incidents);
        } catch (error: any) {
            console.error('Error fetching incidents:', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getStats(req: Request, res: Response) {
        try {
            const stats = await IncidentService.getStats();
            res.json(stats);
        } catch (error: any) {
            console.error('Error fetching incident stats:', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async createIncident(req: Request, res: Response) {
        try {
            const incident = await IncidentService.create(req.body);
            res.status(201).json(incident);
        } catch (error: any) {
            console.error('Error creating incident:', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async updateIncident(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const incident = await IncidentService.update(id, req.body);
            res.json(incident);
        } catch (error: any) {
            console.error('Error updating incident:', error);
            res.status(500).json({ error: error.message });
        }
    }
}
