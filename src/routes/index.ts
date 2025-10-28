import { Router } from 'express';
import authRouter from './authRoutes';
<<<<<<< HEAD
import userRouter from './userRoutes';       
import emergencyRouter from './emergencyRoutes'; 
import agendaRouter from './agendaRoutes';    
=======
>>>>>>> d46311185f1e2c568922bcf8f6d646c9366a9123

const router = Router();

router.use('/v1/auth', authRouter);
router.use('/v1/users', userRouter);      
router.use('/v1', emergencyRouter);    
router.use('/v1/agenda', agendaRouter);        

router.get('/', (req, res) => {
    res.status(200).json({ status: 'API AlertaMente Online', version: '1.0' });
});

export default router;