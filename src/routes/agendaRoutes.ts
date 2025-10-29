import { Router } from 'express';
import { handleCreateAgendaTemplate } from '../controllers/agendaController';
import { authMiddleware } from '../middlewares/authMiddleware'; 

const agendaRouter = Router();

agendaRouter.post('/template', authMiddleware, handleCreateAgendaTemplate);

export default agendaRouter;