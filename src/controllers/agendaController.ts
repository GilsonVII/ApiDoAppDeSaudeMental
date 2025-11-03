import { Request, Response } from 'express';
import * as agendaBusiness from '../business/agendaBusiness';
import { AgendaEventType } from '../models/AgendaEventModel'; 


export const handleCreateAgendaTemplate = async (req: Request, res: Response) => {
    try {
        const creatorId = req.user?.id; 
        if (!creatorId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        const payload = req.body as agendaBusiness.AgendaTemplatePayload;

        if (!payload.id_paciente || !payload.titulo || !payload.data_hora || !payload.data_inicio || !payload.tipo) {
            return res.status(400).json({ error: 'Campos obrigatórios: id_paciente, titulo, data_hora, data_inicio, tipo.' });
        }
        const validTypes: AgendaEventType[] = ['MEDICAMENTO', 'CONSULTA', 'SONO', 'HIDRATACAO', 'MEDITACAO', 'EVENTO', 'GERAL'];
        if (!validTypes.includes(payload.tipo)) {
            return res.status(400).json({ error: `Tipo inválido. Tipos permitidos: ${validTypes.join(', ')}` });
        }
        const templateId = await agendaBusiness.createAgendaTemplate(creatorId, payload);
        return res.status(201).json({
            message: "Template de evento de agenda criado com sucesso.",
            templateId
        });
    } catch (error: any) {
        console.error('Erro no controller de criar template:', error);
        if (error.message.includes('Dados inválidos')) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao criar template de agenda.' });
    }
};
export const handleListOccurrences = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        const patientId = parseInt(req.params.id_paciente, 10);

        if (!loggedInUserId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        if (isNaN(patientId)) {
            return res.status(400).json({ error: 'ID do paciente inválido.' });
        }

        const occurrences = await agendaBusiness.listOccurrences(loggedInUserId, patientId);
        return res.status(200).json(occurrences);
    } catch (error: any) {
        console.error('Erro ao listar ocorrências:', error);
        if (error.message.includes('Permissão negada')) {
            return res.status(403).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao listar ocorrências.' });
    }
};

export const handleUpdateOccurrenceStatus = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        const occurrenceId = parseInt(req.params.id_ocorrencia, 10);
        const { status_concluido } = req.body;

        if (!loggedInUserId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        if (isNaN(occurrenceId)) {
            return res.status(400).json({ error: 'ID da ocorrência inválido.' });
        }
        if (typeof status_concluido !== 'boolean') {
            return res.status(400).json({ error: 'Campo status_concluido (boolean) é obrigatório.' });
        }

        const updatedOccurrence = await agendaBusiness.updateOccurrenceStatus(loggedInUserId, occurrenceId, status_concluido);
        return res.status(200).json(updatedOccurrence);
    } catch (error: any) {
        console.error('Erro ao atualizar status da ocorrência:', error);
        if (error.message.includes('Permissão negada') || error.message.includes('Ocorrência não encontrada')) {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao atualizar status.' });
    }
};

