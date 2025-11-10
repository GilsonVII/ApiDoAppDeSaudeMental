import pool from '../connection';
import { IAgendaEvent, IAgendaOccurrence } from '../../models/AgendaEventModel';

export const createAgendaTemplate = async (templateData: Omit<IAgendaEvent, 'id_evento'>): Promise<number | null> => {
    const { titulo, descricao, data_hora, data_inicio, data_fim, tipo, id_paciente, id_criador } = templateData;
    const sql = 'INSERT INTO EVENTO_AGENDA (titulo, descricao, data_hora, data_inicio, data_fim, tipo, id_paciente, id_criador) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    try {
        const [result]: any = await pool.query(sql, [titulo, descricao, data_hora, data_inicio, data_fim, tipo, id_paciente, id_criador]);
        return result.insertId;
    } catch (error) {
        console.error("Erro ao criar template de agenda:", error);
        throw new Error('Erro ao salvar template de agenda.');
    }
};

export const findOccurrencesByPatientId = async (patientId: number): Promise<IAgendaOccurrence[]> => {
    const sql = 'SELECT * FROM OCORRENCIA_AGENDA WHERE usuario_id = ? ORDER BY data_ocorrencia DESC';
    try {
        const [rows]: any = await pool.query(sql, [patientId]);
        return rows;
    } catch (error) {
        console.error("Erro ao buscar ocorrências por paciente:", error);
        throw new Error('Erro ao buscar ocorrências.');
    }
};

export const findOccurrenceById = async (occurrenceId: number): Promise<IAgendaOccurrence | null> => {
    const sql = 'SELECT * FROM OCORRENCIA_AGENDA WHERE id_ocorrencia = ? LIMIT 1';
    try {
        const [rows]: any = await pool.query(sql, [occurrenceId]);
        return rows[0] || null;
    } catch (error) {
        console.error("Erro ao buscar ocorrência por ID:", error);
        throw new Error('Erro ao buscar ocorrência.');
    }
};

export const updateOccurrenceStatus = async (occurrenceId: number, status: boolean): Promise<IAgendaOccurrence> => {
    const sql = 'UPDATE OCORRENCIA_AGENDA SET status_concluido = ? WHERE id_ocorrencia = ?';
    try {
        await pool.query(sql, [status, occurrenceId]);
        const updatedOccurrence = await findOccurrenceById(occurrenceId);
        if (!updatedOccurrence) throw new Error('Falha ao buscar ocorrência após atualização.');
        return updatedOccurrence;
    } catch (error) {
        console.error("Erro ao atualizar status da ocorrência:", error);
        throw new Error('Erro ao atualizar status da ocorrência.');
    }
};

export const findPendingOccurrencesForCron = async (now: Date): Promise<any[]> => {
    const currentDay = now.toISOString().split('T')[0];
    const currentHour = now.toTimeString().split(' ')[0].substring(0, 5);
    const sql = `
        SELECT 
            o.id_ocorrencia, 
            e.titulo, 
            e.descricao, 
            u.fcm_token
        FROM OCORRENCIA_AGENDA o
        JOIN EVENTO_AGENDA e ON o.id_evento = e.id_evento
        JOIN USUARIO u ON o.usuario_id = u.id_usuario
        WHERE 
            o.data_ocorrencia = ? 
            AND o.status_concluido = FALSE
            AND TIME_FORMAT(e.data_hora, '%H:%i') = ?
            AND u.fcm_token IS NOT NULL;
    `;
    
    try {
        const [rows]: any = await pool.query(sql, [currentDay, currentHour]);
        return rows;
    } catch (error) {
        console.error("Erro ao buscar ocorrências para o cron:", error);
        return [];
    }
};

type OccurrenceInput = Omit<IAgendaOccurrence, 'id_ocorrencia'>;

export const createOccurrencesBatch = async (occurrences: OccurrenceInput[]): Promise<boolean> => {
    if (occurrences.length === 0) {
        return true;
    }

    const sql = 'INSERT INTO OCORRENCIA_AGENDA (id_evento, usuario_id, data_ocorrencia, status_concluido) VALUES ?';
    
    const values = occurrences.map(occ => [
        occ.id_evento,
        occ.usuario_id,
        occ.data_ocorrencia,
        occ.status_concluido
    ]);

    try {
        await pool.query(sql, [values]); 
        return true;
    } catch (error) {
        console.error("Erro no batch insert de ocorrências:", error);
        throw new Error('Erro ao salvar ocorrências da agenda.');
    }
};