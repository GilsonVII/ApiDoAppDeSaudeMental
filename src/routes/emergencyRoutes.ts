import { Router } from 'express';
import {
    handleTriggerPanic,
    handleGetIncomingPanics,
    handleResolvePanic,
} from '../controllers/emergencyController';
import { authMiddleware } from '../middlewares/authMiddleware';

const emergencyRouter = Router();

emergencyRouter.post('/panic/trigger', authMiddleware, handleTriggerPanic);

emergencyRouter.get('/panic/incoming', authMiddleware, handleGetIncomingPanics);
emergencyRouter.patch('/panic/:id/resolve', authMiddleware, handleResolvePanic);

export default emergencyRouter;
