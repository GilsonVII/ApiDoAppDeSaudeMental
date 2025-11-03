import { Router } from 'express';
import { handleGetMyProfile, handleAddContact, handleListContacts } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const userRouter = Router();

userRouter.get('/me', authMiddleware, handleGetMyProfile);
userRouter.post('/contact', authMiddleware, handleAddContact);
userRouter.get('/contacts', authMiddleware, handleListContacts);

export default userRouter;