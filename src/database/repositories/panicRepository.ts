import pool from '../connection'; 
import { IPanicEvent } from '../../models/PanicEventModel'; 


export const createPanicLog = async (panicData: Omit<IPanicEvent, 'id_panico' | 'timestamp'>): Promise<number | null> => {
    const { usuario_id, latitude, longitude } = panicData;

    const sql = 'INSERT INTO EVENTO_PANICO (usuario_id, latitude, longitude) VALUES (?, ?, ?)';

    try {
        const [result]: any = await pool.query(sql, [usuario_id, latitude, longitude]);
        return result.insertId;
    } catch (error) {
        console.error("Erro ao criar log de pânico:", error);
        throw new Error('Erro ao salvar evento de pânico.');
    }
};

export const getEmergencyContactsData = async (userId: number): Promise<{ email: string, nome: string }[]> => {
    const sql = `
        SELECT u.email, u.nome 
        FROM CONTATO_EMERGENCIA ce
        JOIN USUARIO u ON ce.id_contato = u.id_usuario
        WHERE ce.id_paciente = ?;
    `;
    try {
        const [rows]: any = await pool.query(sql, [userId]);
        
        return rows; 
    } catch (error) {
        console.error("Erro ao buscar dados dos contatos de emergência:", error);
        throw new Error('Erro ao buscar contatos de emergência.');
    }
};


export const getPanicLogsByUserId = async (userId: number): Promise<IPanicEvent[]> => {

    const sql = 'SELECT * FROM EVENTO_PANICO WHERE usuario_id = ? ORDER BY timestamp DESC';
    
    try {
        const [rows]: any = await pool.query(sql, [userId]);
        return rows;
    } catch (error) {
        console.error("Erro ao buscar logs de pânico:", error);
        throw new Error('Erro ao buscar histórico de pânico.');
    }
};