import { Router, Request, Response } from 'express';
import authRouter from './authRoutes';
import userRouter from './userRoutes';
import emergencyRouter from './emergencyRoutes';
import agendaRouter from './agendaRoutes';
import popupRouter from './popupRoutes';
import iotRoutes from './iotRoutes';
import healthRoutes from './healthRoutes';
import statsRouter from './statsRoutes';

const router = Router();

router.use('/v1/auth', authRouter);
router.use('/v1/users', userRouter);
router.use('/v1', emergencyRouter);
router.use('/v1/agenda', agendaRouter);
router.use('/v1/pop-up', popupRouter);
router.use('/v1/iot', iotRoutes);
router.use('/v1/health', healthRoutes);
router.use('/v1/stats', statsRouter);

router.get('/', (req: Request, res: Response) => {
    res.status(200).json({ status: 'API SafeHome Online', version: '2.0' });
});

export default router;
