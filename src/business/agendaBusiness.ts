import * as agendaRepository from '../database/repositories/agendaRepository';
import * as contactRepository from '../database/repositories/contactRepository';
import { IAgendaEvent, AgendaEventType, IAgendaOccurrence } from '../models/AgendaEventModel'; 
import { AppError, ForbiddenError, NotFoundError } from '../utils/errors';


export interface AgendaTemplatePayload {
    id_paciente: number;
    titulo: string;
    descricao?: string | null; 
    data_hora: string; 
    data_inicio: string; 
    data_fim?: string | null; 
    tipo: AgendaEventType;
}

const checkPermission = async (loggedInUserId: number, patientId: number): Promise<boolean> => {
    if (loggedInUserId === patientId) {
        return true; 
    }
    try {
        const contacts = await contactRepository.findContactsByPatientId(patientId);
        return contacts.some(contact => contact.id_contato === loggedInUserId);
    } catch (e) {
        console.error("Erro ao checar permissão", e);
        return false;
    }
};

export const createAgendaTemplate = async (creatorId: number, payload: AgendaTemplatePayload): Promise<number | null> => {
    
    const hasPermission = await checkPermission(creatorId, payload.id_paciente);
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada: Você não pode criar eventos para este paciente.');
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
    
    const templateId = await agendaRepository.createAgendaTemplate(templateToSave);
    
    return templateId;
};

export const updateTemplate = async (loggedInUserId: number, eventId: number, payload: Partial<AgendaTemplatePayload>) => {
    const template = await agendaRepository.findTemplateById(eventId);
    if (!template) {
        throw new Error('Template não encontrado.');
    }
    const hasPermission = await checkPermission(loggedInUserId, template.id_paciente);
    if (!hasPermission) {
        throw new Error('Permissão negada para editar este template.');
    }
    
    return agendaRepository.updateTemplate(eventId, payload);
};

export const deleteTemplate = async (loggedInUserId: number, eventId: number) => {
    const template = await agendaRepository.findTemplateById(eventId); 
    if (!template) {
        throw new Error('Template não encontrado.');
    }
    const hasPermission = await checkPermission(loggedInUserId, template.id_paciente);
    if (!hasPermission) {
        throw new Error('Permissão negada para deletar este template.');
    }

    return agendaRepository.deleteTemplate(eventId);
};

export const getOccurrenceById = async (loggedInUserId: number, occurrenceId: number) => {
    const occurrence = await agendaRepository.findOccurrenceById(occurrenceId);
    if (!occurrence) {
        throw new Error('Ocorrência não encontrada.');
    }
    const hasPermission = await checkPermission(loggedInUserId, occurrence.usuario_id);
    if (!hasPermission) {
        throw new Error('Permissão negada para ver esta ocorrência.');
    }
    return occurrence;
};

export const listOccurrencesByDate = async (loggedInUserId: number, patientId: number, date: string) => {
    const hasPermission = await checkPermission(loggedInUserId, patientId);
    if (!hasPermission) {
        throw new Error('Permissão negada para listar ocorrências.');
    }
    return agendaRepository.findOccurrencesByDate(patientId, date);
};


export const listTemplatesForPatient = async (loggedInUserId: number, patientId: number) => {
    const hasPermission = await checkPermission(loggedInUserId, patientId);
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para listar templates.');
    }
    return agendaRepository.findTemplatesByPatientId(patientId);
};

export const listOccurrences = async (loggedInUserId: number, patientId: number) => {
    const hasPermission = await checkPermission(loggedInUserId, patientId);
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para listar ocorrências.');
    }
    return agendaRepository.findOccurrencesByPatientId(patientId);
};

export const updateOccurrenceStatus = async (loggedInUserId: number, occurrenceId: number, status: boolean): Promise<IAgendaOccurrence> => {
    const occurrence = await agendaRepository.findOccurrenceById(occurrenceId);
    if (!occurrence) {
        throw new NotFoundError('Ocorrência não encontrada.');
    }
    
    const hasPermission = await checkPermission(loggedInUserId, occurrence.usuario_id);
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para atualizar esta ocorrência.');
    }
    
    return agendaRepository.updateOccurrenceStatus(occurrenceId, status);
};