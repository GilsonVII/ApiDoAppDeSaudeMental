import { Router } from 'express';
import { handleGetMyProfile, handleAddContact, handleListContacts, handleUpdateFcmToken } from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const userRouter = Router();
userRouter.patch('/me', authMiddleware, () => {});

userRouter.get('/me', authMiddleware, handleGetMyProfile);
userRouter.post('/contact', authMiddleware, handleAddContact);
userRouter.get('/contacts', authMiddleware, handleListContacts);
userRouter.patch('/fcm-token', authMiddleware, handleUpdateFcmToken);

export default userRouter;