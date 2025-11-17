import { Router } from 'express';
import { handleGetGeneralPopup } from '../controllers/popupController';
import { authMiddleware } from '../middlewares/authMiddleware';

const popupRouter = Router();

popupRouter.get('/:tipo', authMiddleware, handleGetGeneralPopup);

export default popupRouter;
