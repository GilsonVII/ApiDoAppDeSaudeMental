import { Router } from 'express';
import { 
    handleCreateAgendaTemplate, 
    handleListOccurrences, 
    handleUpdateOccurrenceStatus, 
} from '../controllers/agendaController';
import { authMiddleware } from '../middlewares/authMiddleware'; 

const agendaRouter = Router();

agendaRouter.post('/template', authMiddleware, handleCreateAgendaTemplate);

agendaRouter.get('/ocorrencias/:id_paciente', authMiddleware, handleListOccurrences);
agendaRouter.patch('/ocorrencias/:id_ocorrencia/status', authMiddleware, handleUpdateOccurrenceStatus);

export default agendaRouter;