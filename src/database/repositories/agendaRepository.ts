import { db } from '../connection';
import { IAgendaEvent, IAgendaOccurrence } from '../../models/AgendaEventModel';

type OccurrenceInput = Omit<IAgendaOccurrence, 'id_ocorrencia'>;

export const createAgendaTemplate = async (templateData: Omit<IAgendaEvent, 'id_evento'>): Promise<number | null> => {
    try {
        const [id] = await db('EVENTO_AGENDA').insert(templateData);
        return id;
    } catch (error) {
        console.error("Erro ao criar template de agenda:", error);
        throw new Error('Erro ao salvar template de agenda.');
    }
};

export const createOccurrencesBatch = async (occurrences: OccurrenceInput[]): Promise<boolean> => {
    if (occurrences.length === 0) return true;
    
    try {
        await db.batchInsert('OCORRENCIA_AGENDA', occurrences); 
        return true;
    } catch (error) {
        console.error("Erro no batch insert de ocorrências:", error);
        throw new Error('Erro ao salvar ocorrências da agenda.');
    }
};

export const findOccurrencesByPatientId = async (patientId: number): Promise<IAgendaOccurrence[]> => {
    try {
        return await db('OCORRENCIA_AGENDA')
            .where('usuario_id', patientId)
            .orderBy('data_ocorrencia', 'desc');
    } catch (error) {
        console.error("Erro ao buscar ocorrências por paciente:", error);
        throw new Error('Erro ao buscar ocorrências.');
    }
};

export const findTemplateById = async (eventId: number): Promise<IAgendaEvent | null> => {
    try {
        const template = await db('EVENTO_AGENDA').where('id_evento', eventId).first();
        return template || null;
    } catch (error) {
        console.error("Erro ao buscar template por ID:", error);
        throw new Error('Erro ao buscar template.');
    }
};

export const updateOccurrenceStatus = async (occurrenceId: number, status: boolean): Promise<IAgendaOccurrence> => {
    try {
        await db('OCORRENCIA_AGENDA')
            .where('id_ocorrencia', occurrenceId)
            .update({ status_concluido: status });
            
        const updated = await db('OCORRENCIA_AGENDA').where('id_ocorrencia', occurrenceId).first();
        if (!updated) throw new Error('Falha ao buscar ocorrência após atualização.');
        return updated;
    } catch (error) {
        console.error("Erro ao atualizar status da ocorrência:", error);
        throw new Error('Erro ao atualizar status da ocorrência.');
    }
};

export const findPendingOccurrencesForCron = async (now: Date): Promise<any[]> => {
    const currentDay = now.toISOString().split('T')[0];
    const currentHour = now.toTimeString().split(' ')[0].substring(0, 5);
    try {
        return await db('OCORRENCIA_AGENDA as o')
            .join('EVENTO_AGENDA as e', 'o.id_evento', 'e.id_evento')
            .join('USUARIO as u', 'o.usuario_id', 'u.id_usuario')
            .select('o.id_ocorrencia', 'e.titulo', 'e.descricao', 'u.fcm_token')
            .where('o.data_ocorrencia', currentDay)
            .andWhere('o.status_concluido', false)
            .whereRaw("TIME_FORMAT(e.data_hora, '%H:%i') = ?", [currentHour])
            .whereNotNull('u.fcm_token');
    } catch (error) {
        console.error("Erro ao buscar ocorrências para o cron:", error);
        return [];
    }
};
export const findTemplatesByPatientId = async (patientId: number): Promise<IAgendaEvent[]> => {
    try {
        return await db('EVENTO_AGENDA').where('id_paciente', patientId);
    } catch (error) {
        console.error("Erro ao buscar templates por paciente:", error);
        throw new Error('Erro ao buscar templates.');
    }
};

export const findOccurrenceById = async (occurrenceId: number): Promise<IAgendaOccurrence | null> => {
    try {
        const occurrence = await db('OCORRENCIA_AGENDA')
            .where('id_ocorrencia', occurrenceId)
            .first();
        return occurrence || null;
    } catch (error) {
        console.error("Erro ao buscar ocorrência por ID:", error);
        throw new Error('Erro ao buscar ocorrência.');
    }
};

export const updateTemplate = async (eventId: number, templateData: Partial<Omit<IAgendaEvent, 'id_evento' | 'id_paciente' | 'id_criador'>>): Promise<boolean> => {
    try {
        const count = await db('EVENTO_AGENDA').where('id_evento', eventId).update(templateData);
        return count > 0;
    } catch (error) {
        console.error("Erro ao atualizar template de agenda:", error);
        throw new Error('Erro ao atualizar template no banco de dados.');
    }
};

export const deleteTemplate = async (eventId: number): Promise<boolean> => {
    try {
        const count = await db('EVENTO_AGENDA').where('id_evento', eventId).delete();
        return count > 0;
    } catch (error) {
        console.error("Erro ao deletar template de agenda:", error);
        throw new Error('Erro ao deletar template no banco de dados.');
    }
};

export const findOccurrencesByDate = async (patientId: number, date: string): Promise<IAgendaOccurrence[]> => {
    try {
        return await db('OCORRENCIA_AGENDA')
            .where({ usuario_id: patientId, data_ocorrencia: date });
    } catch (error) {
        console.error("Erro ao buscar ocorrências por data:", error);
        throw new Error('Erro ao buscar ocorrências.');
    }
};