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