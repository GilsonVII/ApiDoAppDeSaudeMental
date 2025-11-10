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
    try {
        const contacts = await contactRepository.findContactsByPatientId(patientId);
        return contacts.some(contact => contact.id_contato === loggedInUserId);
    } catch (e) {
        console.error("Erro ao checar permissão", e);
        return false;
    }
};

export const listTemplatesForPatient = async (loggedInUserId: number, patientId: number) => {
    const hasPermission = await checkPermission(loggedInUserId, patientId);
    if (!hasPermission) {
        throw new Error('Permissão negada para listar templates.');
    }
    return agendaRepository.findTemplatesByPatientId(patientId);
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

function generateOccurrences(templateId: number, patientId: number, startDateStr: string, endDateStr: string | null | undefined): Omit<IAgendaOccurrence, 'id_ocorrencia'>[] {
    const occurrences: Omit<IAgendaOccurrence, 'id_ocorrencia'>[] = [];
    
    const startDate = new Date(startDateStr + 'T00:00:00'); 
    
    const endDate = endDateStr ? new Date(endDateStr + 'T00:00:00') : new Date(startDate);
    if (!endDateStr) {
        endDate.setDate(startDate.getDate() + 90);
    }

    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
        occurrences.push({
            id_evento: templateId,
            usuario_id: patientId,
            data_ocorrencia: currentDate.toISOString().split('T')[0], 
            status_concluido: false
        });
        currentDate.setDate(currentDate.getDate() + 1);
    }

    return occurrences;
}

export const createAgendaTemplate = async (creatorId: number, payload: AgendaTemplatePayload): Promise<number | null> => {
    
    if (!payload || !payload.titulo || !payload.id_paciente || !payload.data_hora || !payload.data_inicio || !payload.tipo) {
        throw new Error('Dados inválidos: Faltam campos obrigatórios para criar o template.');
    }

    const hasPermission = await checkPermission(creatorId, payload.id_paciente);
    if (!hasPermission) {
        throw new Error('Permissão negada: Você não pode criar eventos para este paciente.');
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
    if (!templateId) {
        throw new Error('Falha ao criar o template.');
    }

    try {
        const occurrencesToCreate = generateOccurrences(
            templateId, 
            payload.id_paciente, 
            payload.data_inicio, 
            payload.data_fim
        );
        
        if (occurrencesToCreate.length > 0) {
            await agendaRepository.createOccurrencesBatch(occurrencesToCreate);
        }
    } catch (error) {
        console.error("Erro ao gerar ocorrências, mas template foi criado:", error);
    }

    return templateId;
};
