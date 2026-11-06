import { Router } from 'express';
// import { authMiddleware } from '../../middleware/auth'; // Auth disabled for testing MVP
import { IncidentController } from './incident.controller';

const router = Router();
// router.use(authMiddleware);

router.get('/', IncidentController.getIncidents);
router.get('/stats', IncidentController.getStats);
router.post('/', IncidentController.createIncident);
router.patch('/:id', IncidentController.updateIncident);

export default router;
