import { Router } from 'express';
import { handleGetUserStats } from '../controllers/statsController';
import { authMiddleware } from '../middlewares/authMiddleware';

const statsRouter = Router();

statsRouter.get('/:id_paciente', authMiddleware, handleGetUserStats);

export default statsRouter;
