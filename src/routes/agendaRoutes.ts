import { Router } from 'express';
import { 
    handleCreateAgendaTemplate, 
    handleDeleteTemplate, 
    handleGetOccurrenceById, 
    handleListOccurrences, 
    handleListOccurrencesByDate, 
    handleUpdateOccurrenceStatus,
    handleUpdateTemplate,
    handleAddMonthlyNote, 
} from '../controllers/agendaController';
import { authMiddleware } from '../middlewares/authMiddleware'; 

const agendaRouter = Router();

agendaRouter.post('/template', authMiddleware, handleCreateAgendaTemplate);



agendaRouter.patch('/template/:id_evento', authMiddleware, handleUpdateTemplate);

agendaRouter.delete('/template/:id_evento', authMiddleware, handleDeleteTemplate);

agendaRouter.get('/ocorrencias/:id_paciente', authMiddleware, handleListOccurrences);

agendaRouter.get('/ocorrencias/:id_paciente/data/:data', authMiddleware, handleListOccurrencesByDate);

agendaRouter.get('/ocorrencias/:id_ocorrencia', authMiddleware, handleGetOccurrenceById);

agendaRouter.patch('/ocorrencias/:id_ocorrencia/status', authMiddleware, handleUpdateOccurrenceStatus);

agendaRouter.post('/notes', authMiddleware, handleAddMonthlyNote);

export default agendaRouter;
