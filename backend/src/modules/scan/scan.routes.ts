import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';
import { ScanController } from './scan.controller';

const router = Router();

// All scan routes require authentication
router.use(authMiddleware);

// POST /api/csirt/scans - Create a new scan
router.post('/', asyncHandler(ScanController.createScan));

// GET /api/csirt/scans - List all scans
router.get('/', asyncHandler(ScanController.listScans));

// GET /api/csirt/scans/:id - Get scan details
router.get('/:id', asyncHandler(ScanController.getScan));

// DELETE /api/csirt/scans/:id - Delete a scan
router.delete('/:id', asyncHandler(ScanController.deleteScan));

// POST /api/csirt/scans/:id/cancel - Cancel a running scan
router.post('/:id/cancel', asyncHandler(ScanController.cancelScan));

// GET /api/csirt/scans/:id/vulnerabilities - Get scan vulnerabilities
router.get('/:id/vulnerabilities', asyncHandler(ScanController.getScanVulnerabilities));

export default router;
