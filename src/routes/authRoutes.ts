import { Router } from 'express';
import { handleRegister, handleLogin, handlePasswordReset } from '../controllers/auth/authController';

const authRouter = Router();

authRouter.post('/register', handleRegister);
authRouter.post('/login', handleLogin);
authRouter.patch('/password/reset', handlePasswordReset);

export default authRouter;