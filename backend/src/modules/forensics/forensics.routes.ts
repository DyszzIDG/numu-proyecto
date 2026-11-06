import { Router } from 'express';
import { ForensicsController } from './forensics.controller';

const router = Router();

router.get('/', ForensicsController.listEvidence);
router.post('/', ForensicsController.createEvidence);

export default router;
