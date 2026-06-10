import * as agendaRepository from '../database/repositories/agendaRepository';
import * as contactRepository from '../database/repositories/contactRepository';
import { Logger } from '../utils/logger';
import { IAgendaEvent, AgendaEventType, IAgendaOccurrence } from '../models/AgendaEventModel';
import { AppError, ForbiddenError, NotFoundError, BadRequestError } from '../utils/errors';

export interface AgendaTemplatePayload {
    id_paciente: number;
    titulo: string;
    descricao?: string | null;
    data_hora: string;
    data_inicio: string;
    data_fim?: string | null;
    tipo: AgendaEventType;
}

const checkPermission = async (loggedInUserId: number, patientId: number, accessLevel: 'READ' | 'WRITE' = 'READ'): Promise<boolean> => {

    if (loggedInUserId === patientId) {
        return true;
    }
    
    try {
        const contacts = await contactRepository.findContactsByPatientId(patientId);
        const contact = contacts.find(c => c.id_contato === loggedInUserId);
        
        if (!contact) return false;

        if (accessLevel === 'WRITE' && contact.nivel_permissao === 'SOMENTE_EMERGENCIA') {
            Logger.warn(`[Acesso Negado] Contato ${loggedInUserId} tentou alterar a agenda do paciente ${patientId}, mas é SOMENTE_EMERGENCIA.`);
            return false;
        }

        return true;
    } catch (e) {
        Logger.error("Erro ao checar permissão na Rede de Cuidado:", e);
        return false;
    }
};

function generateOccurrences(templateId: number, patientId: number, startDateStr: string, endDateStr: string | null | undefined): Omit<IAgendaOccurrence, 'id_ocorrencia'>[] {
    const occurrences: Omit<IAgendaOccurrence, 'id_ocorrencia'>[] = [];
    const startParts = startDateStr.split('-').map(Number);
    const startDate = new Date(startParts[0], startParts[1] - 1, startParts[2], 12, 0, 0);

    let endDate: Date;
    if (endDateStr) {
        const endParts = endDateStr.split('-').map(Number);
        endDate = new Date(endParts[0], endParts[1] - 1, endParts[2], 12, 0, 0);
    } else {
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 90); 
    }

    Logger.info(`[agendaBusiness] Gerando ocorrências de ${startDate.toISOString()} até ${endDate.toISOString()}`);

    let currentDate = new Date(startDate);
    let safetyCount = 0;

    while (currentDate <= endDate && safetyCount < 365) {
        occurrences.push({
            id_evento: templateId,
            usuario_id: patientId,
            data_ocorrencia: currentDate.toISOString().split('T')[0],
            status_concluido: false
        });
        currentDate.setDate(currentDate.getDate() + 1);
        safetyCount++;
    }

    Logger.info(`[agendaBusiness] ${occurrences.length} ocorrências geradas.`);
    return occurrences;
}

export const createAgendaTemplate = async (creatorId: number, payload: AgendaTemplatePayload): Promise<number | null> => {

    if (!payload || !payload.titulo || !payload.id_paciente || !payload.data_hora || !payload.data_inicio || !payload.tipo) {
        throw new BadRequestError('Dados inválidos: Faltam campos obrigatórios para criar a rotina.');
    }

    const hasPermission = await checkPermission(creatorId, payload.id_paciente, 'WRITE');
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada: Você não tem nível de acesso para criar eventos para este usuário.');
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
        throw new Error('Falha ao criar o evento base no banco.');
    }

    try {
        const occurrences = generateOccurrences(templateId, payload.id_paciente, payload.data_inicio, payload.data_fim);
        if (occurrences.length > 0) {
            await agendaRepository.createOccurrencesBatch(occurrences);
        }
    } catch (error) {
        Logger.error("Erro ao gerar ocorrências diárias (mas evento base foi criado):", error);
    }

    return templateId;
};

export const updateTemplate = async (loggedInUserId: number, eventId: number, payload: Partial<AgendaTemplatePayload>) => {
    const template = await agendaRepository.findTemplateById(eventId);
    if (!template) {
        throw new NotFoundError('Evento base não encontrado.');
    }
    
    const hasPermission = await checkPermission(loggedInUserId, template.id_paciente, 'WRITE');
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para editar a rotina deste usuário.');
    }

    return agendaRepository.updateTemplate(eventId, payload);
};

export const deleteTemplate = async (loggedInUserId: number, eventId: number) => {
    const template = await agendaRepository.findTemplateById(eventId);
    if (!template) {
        throw new NotFoundError('Evento base não encontrado.');
    }
    
    const hasPermission = await checkPermission(loggedInUserId, template.id_paciente, 'WRITE');
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para deletar esta rotina.');
    }

    return agendaRepository.deleteTemplate(eventId);
};

export const getOccurrenceById = async (loggedInUserId: number, occurrenceId: number) => {
    const occurrence = await agendaRepository.findOccurrenceById(occurrenceId);
    if (!occurrence) {
        throw new NotFoundError('Ocorrência não encontrada.');
    }
    
    const hasPermission = await checkPermission(loggedInUserId, occurrence.usuario_id, 'READ');
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para visualizar esta rotina.');
    }
    return occurrence;
};

export const listOccurrencesByDate = async (loggedInUserId: number, patientId: number, date: string) => {
    const hasPermission = await checkPermission(loggedInUserId, patientId, 'READ');
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para listar a agenda.');
    }
    return agendaRepository.findOccurrencesByDate(patientId, date);
};

export const listTemplatesForPatient = async (loggedInUserId: number, patientId: number) => {
    const hasPermission = await checkPermission(loggedInUserId, patientId, 'READ');
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para listar os eventos base.');
    }
    return agendaRepository.findTemplatesByPatientId(patientId);
};

export const listOccurrences = async (loggedInUserId: number, patientId: number) => {
    const hasPermission = await checkPermission(loggedInUserId, patientId, 'READ');
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para listar as ocorrências.');
    }
    return agendaRepository.findOccurrencesByPatientId(patientId);
};

export const updateOccurrenceStatus = async (loggedInUserId: number, occurrenceId: number, status: boolean): Promise<IAgendaOccurrence> => {
    const occurrence = await agendaRepository.findOccurrenceById(occurrenceId);
    if (!occurrence) {
        throw new NotFoundError('Ocorrência não encontrada.');
    }

    const hasPermission = await checkPermission(loggedInUserId, occurrence.usuario_id, 'WRITE');
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para marcar rotinas como concluídas.');
    }

    return agendaRepository.updateOccurrenceStatus(occurrenceId, status);
};

export const addMonthlyNote = async (authorId: number, patientId: number, month: string, text: string) => {

    const hasPermission = await checkPermission(authorId, patientId, 'WRITE');
    
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada: Você não tem permissão para adicionar notas para este usuário.');
    }

    const referenceDate = `${month}-01`;

    return agendaRepository.createMonthlyNote({
        id_paciente: patientId,
        id_autor: authorId,
        mes_referencia: referenceDate,
        texto: text
    });
};

export const listMonthlyNotes = async (loggedInUserId: number, patientId: number, monthReference: string) => {
    const hasPermission = await checkPermission(loggedInUserId, patientId, 'READ');
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para visualizar as notas deste usuário.');
    }
    return agendaRepository.findMonthlyNotes(patientId, monthReference);
};

export const deleteMonthlyNote = async (loggedInUserId: number, noteId: number) => {
    const note = await agendaRepository.findMonthlyNoteById(noteId);
    if (!note) {
        throw new NotFoundError('Nota não encontrada.');
    }

    if (note.id_autor === loggedInUserId) {
        return agendaRepository.deleteMonthlyNote(noteId);
    }

    const hasPermission = await checkPermission(loggedInUserId, note.id_paciente, 'WRITE');
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para excluir esta nota.');
    }

    return agendaRepository.deleteMonthlyNote(noteId);
};
