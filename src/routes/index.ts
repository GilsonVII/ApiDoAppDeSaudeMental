import { Router } from 'express';
import authRouter from './authRoutes';
import userRouter from './userRoutes';       
import emergencyRouter from './emergencyRoutes'; 
import agendaRouter from './agendaRoutes';    

const router = Router();

router.use('/v1/auth', authRouter);
router.use('/v1/users', userRouter);      
router.use('/v1', emergencyRouter);    
router.use('/v1/agenda', agendaRouter);        

router.get('/', (req, res) => {
    res.status(200).json({ status: 'API AlertaMente Online', version: '1.0' });
});

export default router;