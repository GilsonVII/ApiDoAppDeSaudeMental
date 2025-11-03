import * as agendaRepository from '../database/repositories/agendaRepository';
import * as contactRepository from '../database/repositories/contactRepository';
import { IAgendaEvent, AgendaEventType, IAgendaOccurrence } from '../models/AgendaEventModel'; 

export interface AgendaTemplatePayload {
    id_paciente: number;
    titulo: string;
    descricao?: string;
    data_hora: string; 
    data_inicio: string; 
    data_fim?: string | null; 
    tipo: AgendaEventType;
}

const checkPermission = async (loggedInUserId: number, patientId: number): Promise<boolean> => {
    if (loggedInUserId === patientId) {
        return true; 
    }
    const contacts: any[] = await contactRepository.findContactsByPatientId(patientId);
    return contacts.some(contact => contact.id_contato === loggedInUserId);
};

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

export const listOccurrences = async (loggedInUserId: number, patientId: number) => {
    const hasPermission = await checkPermission(loggedInUserId, patientId);
    if (!hasPermission) {
        throw new Error('Permissão negada para listar ocorrências.');
    }
    return agendaRepository.findOccurrencesByPatientId(patientId);
};

export const updateOccurrenceStatus = async (loggedInUserId: number, occurrenceId: number, status: boolean): Promise<IAgendaOccurrence> => {
    const occurrence = await agendaRepository.findOccurrenceById(occurrenceId);
    if (!occurrence) {
        throw new Error('Ocorrência não encontrada.');
    }
    
    const hasPermission = await checkPermission(loggedInUserId, occurrence.usuario_id);
    if (!hasPermission) {
        throw new Error('Permissão negada para atualizar esta ocorrência.');
    }
    
    return agendaRepository.updateOccurrenceStatus(occurrenceId, status);
};
