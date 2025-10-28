import { Router } from 'express';
import { handleTriggerPanic } from '../controllers/emergencyController';
import { authMiddleware } from '../middlewares/authMiddleware';

const emergencyRouter = Router();

emergencyRouter.post('/panic/trigger', authMiddleware, handleTriggerPanic);

export default emergencyRouter;