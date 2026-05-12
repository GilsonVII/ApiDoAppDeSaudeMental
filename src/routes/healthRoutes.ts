import { Router } from 'express';
import * as healthController from '../controllers/healthController';
import { authMiddleware } from '../middlewares/authMiddleware'; 

const router = Router();

router.post('/telemetry', authMiddleware, healthController.handleHealthTelemetry);
router.post('/cancel-alert', authMiddleware, healthController.handleCancelAlert);

export default router;
