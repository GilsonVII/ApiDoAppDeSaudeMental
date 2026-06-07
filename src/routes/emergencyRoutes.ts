import { Router } from 'express';
import { handleTriggerPanic } from '../controllers/emergencyController';
import { authMiddleware } from '../middlewares/authMiddleware';
import { handleGetPanicLogs } from '../controllers/emergencyController';

const emergencyRouter = Router();

emergencyRouter.post('/panic/trigger', authMiddleware, handleTriggerPanic);
emergencyRouter.get('/panic/logs/:id_paciente', authMiddleware, handleGetPanicLogs);

export default emergencyRouter;
