import { db } from '../connection';
import { IPanicEvent } from '../../models/PanicEventModel';
import { AppError, ForbiddenError, NotFoundError, BadRequestError, InternalServerError } from '../../utils/errors';

export const createPanicLog = async (panicData: Omit<IPanicEvent, 'id_panico' | 'timestamp'>): Promise<number | null> => {
    try {
        const [id] = await db('EVENTO_PANICO').insert(panicData);
        return id;
    } catch (error) {
        console.error("Erro ao criar log de pânico:", error);
        throw new InternalServerError('Erro ao salvar evento de pânico.');
    }
};

export const getEmergencyContactsData = async (userId: number): Promise<{ email: string, nome: string }[]> => {
    try {
        return await db('CONTATO_EMERGENCIA as ce')
            .join('USUARIO as u', 'ce.id_contato', 'u.id_usuario')
            .select('u.email', 'u.nome')
            .where('ce.id_paciente', userId);
    } catch (error) {
        console.error("Erro ao buscar dados dos contatos de emergência:", error);
        throw new InternalServerError('Erro ao buscar contatos de emergência.');
    }
};

export const getPanicLogsByUserId = async (userId: number): Promise<IPanicEvent[]> => {
    try {
        return await db('EVENTO_PANICO')
            .where('usuario_id', userId)
            .orderBy('timestamp', 'desc');
    } catch (error) {
        console.error("Erro ao buscar logs de pânico:", error);
        throw new InternalServerError('Erro ao buscar histórico de pânico.');
    }
};

// Função auxiliar que você pode precisar
export const getEmergencyContacts = async (userId: number): Promise<any[]> => {
    try {
        return await db('CONTATO_EMERGENCIA').where('id_paciente', userId);
    } catch (error) {
         console.error("Erro ao buscar contatos (simples):", error);
         throw new InternalServerError('Erro ao buscar contatos.');
    }
}