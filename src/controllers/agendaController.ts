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