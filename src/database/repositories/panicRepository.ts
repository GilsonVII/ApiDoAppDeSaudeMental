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

export const getEmergencyContacts = async (userId: number): Promise<any[]> => {

    console.warn(`[panicRepository] Função getEmergencyContacts para ID ${userId} não implementada.`);
    return [{ whatsapp_numero: 'NUMERO_FAKE_1' }, { whatsapp_numero: 'NUMERO_FAKE_2' }];
};