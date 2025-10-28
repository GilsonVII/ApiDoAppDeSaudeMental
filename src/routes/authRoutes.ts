import { Router } from 'express';
import { handleRegister, handleLogin } from '../controllers/auth/authController';

const authRouter = Router();

authRouter.post('/register', handleRegister);
authRouter.post('/login', handleLogin);

export default authRouter;