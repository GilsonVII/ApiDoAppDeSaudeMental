import { db } from '../connection'; 
import { Logger } from '../../utils/logger';
import { InternalServerError } from '../../utils/errors';
import { IHealthData } from '../../models/HealthDataModel';

export const createHealthLog = async (data: Omit<IHealthData, 'id_saude' | 'timestamp'>): Promise<number> => {
    try {
        const [id] = await db('TELEMETRIA_SAUDE').insert(data);
        return id;
    } catch (error) {
        Logger.error("Erro ao criar log de saúde do Smartwatch:", error);
        throw new InternalServerError('Erro ao salvar telemetria de saúde no banco.');
    }
};

export const getHealthLogsByUserId = async (userId: number, limit: number = 50): Promise<IHealthData[]> => {
    try {
        return await db('TELEMETRIA_SAUDE')
            .where('id_usuario', userId)
            .orderBy('timestamp', 'desc')
            .limit(limit);
    } catch (error) {
        Logger.error("Erro ao buscar histórico de saúde:", error);
        throw new InternalServerError('Erro ao buscar dados do Smartwatch.');
    }
};
