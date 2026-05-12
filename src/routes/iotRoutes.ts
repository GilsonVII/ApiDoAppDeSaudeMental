import { Router } from 'express';
import * as iotController from '../controllers/iotController';
import { authMiddleware } from '../middlewares/authMiddleware'; 

const router = Router();

router.post('/telemetry', authMiddleware, iotController.handleTelemetry);

export default router;
