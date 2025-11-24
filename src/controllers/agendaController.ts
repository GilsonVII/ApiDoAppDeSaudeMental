import { Request, Response } from 'express';
import * as agendaBusiness from '../business/agendaBusiness';
import { AppError } from '../utils/errors';
import { Logger } from '../utils/logger';
import { 
    createTemplateSchema, 
    listOccurrencesSchema, 
    updateStatusSchema 
} from '../validation/agendaSchemas';

export const handleCreateAgendaTemplate = async (req: Request, res: Response) => {
    try {
        const creatorId = req.user?.id; 
        if (!creatorId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        
        const validation = createTemplateSchema.safeParse({ body: req.body });
        if (!validation.success) {
            return res.status(400).json({ 
                error: "Dados de entrada inválidos.",
                details: validation.error.flatten().fieldErrors 
            });
        }
        
        const payload = validation.data.body;
        
        const templateId = await agendaBusiness.createAgendaTemplate(creatorId, payload);
        
        return res.status(201).json({
            message: "Template de evento de agenda criado com sucesso.",
            templateId
        });
    } catch (error: any) {
        Logger.error('Erro no controller de criar template:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao criar template de agenda.' });
    }
};

export const handleListOccurrences = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        if (!loggedInUserId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        
        const validation = listOccurrencesSchema.safeParse({ params: req.params });
        if (!validation.success) {
            return res.status(400).json({ 
                error: "Parâmetro de URL inválido.",
                details: validation.error.flatten().fieldErrors 
            });
        }
        
        const { id_paciente: patientId } = validation.data.params;

        const occurrences = await agendaBusiness.listOccurrences(loggedInUserId, patientId);
        return res.status(200).json(occurrences);
        
    } catch (error: any) {
        Logger.error('Erro ao listar ocorrências:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao listar ocorrências.' });
    }
};

export const handleUpdateOccurrenceStatus = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        if (!loggedInUserId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        
        const validation = updateStatusSchema.safeParse({ 
            params: req.params, 
            body: req.body 
        });
        if (!validation.success) {
            return res.status(400).json({ 
                error: "Dados de entrada inválidos.",
                details: validation.error.flatten() 
            });
        }
        
        const { id_ocorrencia: occurrenceId } = validation.data.params;
        const { status_concluido } = validation.data.body;

        const updatedOccurrence = await agendaBusiness.updateOccurrenceStatus(loggedInUserId, occurrenceId, status_concluido);
        return res.status(200).json(updatedOccurrence);
        
    } catch (error: any) {
        Logger.error('Erro ao atualizar status da ocorrência:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao atualizar status.' });
    }
};

export const handleUpdateTemplate = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        const eventId = parseInt(req.params.id_evento, 10);
        const payload = req.body;

        if (!loggedInUserId) return res.status(401).json({ error: 'Usuário não autenticado.' });
        if (isNaN(eventId)) return res.status(400).json({ error: 'ID do evento inválido.' });

        await agendaBusiness.updateTemplate(loggedInUserId, eventId, payload);
        return res.status(200).json({ message: 'Template atualizado com sucesso.' });
    } catch (error: any) {
        Logger.error('Erro ao atualizar template:', error);
        if (error.message.includes('Permissão negada') || error.message.includes('Template não encontrado')) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao atualizar template.' });
    }
};

export const handleDeleteTemplate = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        const eventId = parseInt(req.params.id_evento, 10);

        if (!loggedInUserId) return res.status(401).json({ error: 'Usuário não autenticado.' });
        if (isNaN(eventId)) return res.status(400).json({ error: 'ID do evento inválido.' });

        await agendaBusiness.deleteTemplate(loggedInUserId, eventId);
        return res.status(200).json({ message: 'Template deletado com sucesso.' });
    } catch (error: any) {
        Logger.error('Erro ao deletar template:', error);
        if (error.message.includes('Permissão negada') || error.message.includes('Template não encontrado')) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao deletar template.' });
    }
};

export const handleGetOccurrenceById = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        const occurrenceId = parseInt(req.params.id_ocorrencia, 10);

        if (!loggedInUserId) return res.status(401).json({ error: 'Usuário não autenticado.' });
        if (isNaN(occurrenceId)) return res.status(400).json({ error: 'ID da ocorrência inválido.' });

        const occurrence = await agendaBusiness.getOccurrenceById(loggedInUserId, occurrenceId);
        return res.status(200).json(occurrence);
    } catch (error: any) {
        Logger.error('Erro ao buscar ocorrência:', error);
        if (error.message.includes('Permissão negada') || error.message.includes('Ocorrência não encontrada')) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao buscar ocorrência.' });
    }
};

export const handleListOccurrencesByDate = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        const patientId = parseInt(req.params.id_paciente, 10);
        const date = req.params.data; // Assumindo formato YYYY-MM-DD

        if (!loggedInUserId) return res.status(401).json({ error: 'Usuário não autenticado.' });
        if (isNaN(patientId)) return res.status(400).json({ error: 'ID do paciente inválido.' });
        if (!date) return res.status(400).json({ error: 'Data é obrigatória.' });

        const occurrences = await agendaBusiness.listOccurrencesByDate(loggedInUserId, patientId, date);
        return res.status(200).json(occurrences);
    } catch (error: any) {
        Logger.error('Erro ao listar ocorrências por data:', error);
        if (error.message.includes('Permissão negada')) {
            return res.status(403).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao listar ocorrências.' });
    }
};
