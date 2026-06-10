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
    handleListTemplates,
    handleListMonthlyNotes,
    handleDeleteMonthlyNote
} from '../controllers/agendaController';
import { authMiddleware } from '../middlewares/authMiddleware';


const agendaRouter = Router();

// --- Templates (eventos base) ---
agendaRouter.post('/template', authMiddleware, handleCreateAgendaTemplate);
agendaRouter.get('/template/paciente/:id_paciente', authMiddleware, handleListTemplates);
agendaRouter.patch('/template/:id_evento', authMiddleware, handleUpdateTemplate);
agendaRouter.delete('/template/:id_evento', authMiddleware, handleDeleteTemplate);

// --- Ocorrencias ---
agendaRouter.get('/ocorrencias/paciente/:id_paciente', authMiddleware, handleListOccurrences);
agendaRouter.get('/ocorrencias/paciente/:id_paciente/data/:data', authMiddleware, handleListOccurrencesByDate);
agendaRouter.get('/ocorrencias/detalhe/:id_ocorrencia', authMiddleware, handleGetOccurrenceById);
agendaRouter.patch('/ocorrencias/:id_ocorrencia/status', authMiddleware, handleUpdateOccurrenceStatus);

// --- Notas mensais ---
agendaRouter.post('/notes', authMiddleware, handleAddMonthlyNote);
agendaRouter.get('/notes/:id_paciente/:mes_referencia', authMiddleware, handleListMonthlyNotes);
agendaRouter.delete('/notes/:id_nota', authMiddleware, handleDeleteMonthlyNote);

export default agendaRouter;
