import pool from '../connection';
import { IAgendaEvent } from '../../models/AgendaEventModel';

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