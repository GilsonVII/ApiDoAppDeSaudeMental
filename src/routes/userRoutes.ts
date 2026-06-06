import { Router } from 'express';
import {
    handleGetMyProfile,
    handleGetMyStatus,
    handleAddContact,
    handleListContacts,
    handleListMonitored,
    handleUpdateFcmToken,
    handleUpdateProfile,
    handleSearchUser,
    handleDeleteContact
} from '../controllers/userController';
import { authMiddleware } from '../middlewares/authMiddleware';

const userRouter = Router();

userRouter.get('/me', authMiddleware, handleGetMyProfile);
userRouter.patch('/me', authMiddleware, handleUpdateProfile);
userRouter.get('/me/status', authMiddleware, handleGetMyStatus);
userRouter.get('/search', authMiddleware, handleSearchUser);
userRouter.patch('/fcm-token', authMiddleware, handleUpdateFcmToken);
userRouter.post('/contact', authMiddleware, handleAddContact);
userRouter.get('/contacts', authMiddleware, handleListContacts);
userRouter.get('/monitored', authMiddleware, handleListMonitored);
userRouter.delete('/contact/:id_relacao', authMiddleware, handleDeleteContact);

export default userRouter;
