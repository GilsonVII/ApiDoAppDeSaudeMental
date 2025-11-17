import { Request, Response } from 'express';
import * as agendaBusiness from '../business/agendaBusiness';
import { AppError } from '../utils/errors';
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
        console.error('Erro no controller de criar template:', error);
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
        console.error('Erro ao listar ocorrências:', error);
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
        console.error('Erro ao atualizar status da ocorrência:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao atualizar status.' });
    }
};