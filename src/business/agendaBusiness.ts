import * as agendaRepository from '../database/repositories/agendaRepository';
import { IAgendaEvent, AgendaEventType } from '../models/AgendaEventModel';

export interface AgendaTemplatePayload {
    id_paciente: number;
    titulo: string;
    descricao?: string;
    data_hora: string;
    data_inicio: string; 
    data_fim?: string | null; 
    tipo: AgendaEventType;
}

export const createAgendaTemplate = async (creatorId: number, payload: AgendaTemplatePayload): Promise<number | null> => {

    if (!payload || !payload.titulo || !payload.id_paciente || !payload.data_hora || !payload.data_inicio || !payload.tipo) {
        throw new Error('Dados inválidos: Faltam campos obrigatórios para criar o template.');
    }

    const templateToSave: Omit<IAgendaEvent, 'id_evento'> = {
        titulo: payload.titulo,
        descricao: payload.descricao || null,
        data_hora: payload.data_hora,
        data_inicio: payload.data_inicio,
        data_fim: payload.data_fim || null,
        tipo: payload.tipo,
        id_paciente: payload.id_paciente,
        id_criador: creatorId,
    };

    return agendaRepository.createAgendaTemplate(templateToSave);
};