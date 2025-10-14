import { Router } from 'express';
import authRouter from './auth.routes';

const router = Router();

router.use('/v1', authRouter); 

export default router;