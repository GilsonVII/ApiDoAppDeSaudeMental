import { db } from '../connection'; 
import { Logger } from '../../utils/logger';
import { InternalServerError } from '../../utils/errors';
import { ITelemetry } from '../../models/TelemetryModel'; 

export const createTelemetryLog = async (data: Omit<ITelemetry, 'id_telemetria' | 'timestamp'>): Promise<number> => {
    try {
        const [id] = await db('TELEMETRIA_IOT').insert(data);
        return id;
    } catch (error) {
        Logger.error("Erro ao criar log de telemetria IoT:", error);
        throw new InternalServerError('Erro ao salvar telemetria IoT no banco.');
    }
};

export const getTelemetryLogsByUserId = async (userId: number, limit: number = 50): Promise<ITelemetry[]> => {
    try {
        return await db('TELEMETRIA_IOT')
            .where('id_usuario', userId)
            .orderBy('timestamp', 'desc')
            .limit(limit);
    } catch (error) {
        Logger.error("Erro ao buscar histórico de IoT:", error);
        throw new InternalServerError('Erro ao buscar dados dos sensores da casa.');
    }
};
