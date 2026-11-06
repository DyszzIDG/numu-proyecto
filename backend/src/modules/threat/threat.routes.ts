// Placeholder routes for threat intelligence module
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
router.use(authMiddleware);

// TODO: Implement threat intelligence routes
router.get('/', (req, res) => {
    res.json({ message: 'Threat intelligence routes coming soon' });
});

export default router;
