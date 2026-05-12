import { db } from '../connection';
import { IPanicEvent } from '../../models/PanicEventModel';
import { IContactRelation } from '../../models/ContactModel';
import { Logger } from '../../utils/logger';
import { InternalServerError } from '../../utils/errors';

export const createPanicLog = async (panicData: Omit<IPanicEvent, 'id_panico' | 'timestamp'>): Promise<number | null> => {
    try {
        const [id] = await db('EVENTO_PANICO').insert(panicData);
        return id;
    } catch (error) {
        Logger.error("Erro ao criar log de pânico:", error);
        throw new InternalServerError('Erro ao salvar evento de pânico.');
    }
};

export const getEmergencyContactsData = async (userId: number): Promise<{ email: string, nome: string, fcm_token: string | null }[]> => {
    try {
        return await db('CONTATO_EMERGENCIA as ce')
            .join('USUARIO as u', 'ce.id_contato', 'u.id_usuario')
            .select('u.email', 'u.nome', 'u.fcm_token') 
            .where('ce.id_paciente', userId);
    } catch (error) {
        Logger.error("Erro ao buscar dados dos contatos de emergência:", error);
        throw new InternalServerError('Erro ao buscar contatos de emergência.');
    }
};

export const getPanicLogsByUserId = async (userId: number): Promise<IPanicEvent[]> => {
    try {
        return await db('EVENTO_PANICO')
            .where('usuario_id', userId)
            .orderBy('timestamp', 'desc');
    } catch (error) {
        Logger.error("Erro ao buscar logs de pânico:", error);
        throw new InternalServerError('Erro ao buscar histórico de pânico.');
    }
};

export const getEmergencyContacts = async (userId: number): Promise<IContactRelation[]> => {
    try {
        return await db('CONTATO_EMERGENCIA').where('id_paciente', userId);
    } catch (error) {
         Logger.error("Erro ao buscar contatos (simples):", error);
         throw new InternalServerError('Erro ao buscar contatos.');
    }
};
