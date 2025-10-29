import { Router } from 'express';
import { handleGetMyProfile } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const userRouter = Router();

userRouter.get('/me', authMiddleware, handleGetMyProfile);

export default userRouter;