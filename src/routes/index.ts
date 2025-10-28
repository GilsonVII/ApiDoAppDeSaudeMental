import { Router } from 'express';
import authRouter from './authRoutes';

const router = Router();

router.use('/v1', authRouter); 

export default router;