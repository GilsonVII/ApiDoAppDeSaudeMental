import { db } from '../connection';
import { Logger } from '../../utils/logger';
import { InternalServerError } from '../../utils/errors';

/**
 * Conta as ocorrencias da agenda de um paciente dentro de um intervalo de datas,
 * separando por status (concluidas x total). Usado para o calculo de
 * "Consistencia da rotina".
 */
export const getOccurrenceStatsInRange = async (
    patientId: number,
    startDate: string,
    endDate: string
): Promise<{ total: number; concluidas: number }> => {
    try {
        const rows = await db('OCORRENCIA_AGENDA')
            .where('usuario_id', patientId)
            .andWhere('data_ocorrencia', '>=', startDate)
            .andWhere('data_ocorrencia', '<=', endDate)
            .select(
                db.raw('COUNT(*) as total'),
                db.raw('SUM(CASE WHEN status_concluido = true THEN 1 ELSE 0 END) as concluidas')
            )
            .first();

        return {
            total: Number(rows?.total ?? 0),
            concluidas: Number(rows?.concluidas ?? 0),
        };
    } catch (error) {
        Logger.error('Erro ao calcular estatisticas de ocorrencias:', error);
        throw new InternalServerError('Erro ao calcular estatisticas da rotina.');
    }
};

/**
 * Retorna o timestamp do ultimo evento de panico de um paciente,
 * ou null se nunca houve. Usado para o calculo de "dias de estabilidade".
 */
export const getLastPanicTimestamp = async (patientId: number): Promise<Date | null> => {
    try {
        const row = await db('EVENTO_PANICO')
            .where('usuario_id', patientId)
            .orderBy('timestamp', 'desc')
            .select('timestamp')
            .first();

        return row?.timestamp ? new Date(row.timestamp) : null;
    } catch (error) {
        Logger.error('Erro ao buscar ultimo evento de panico:', error);
        throw new InternalServerError('Erro ao calcular dias de estabilidade.');
    }
};

/**
 * Retorna a data de criacao da conta do usuario. Usado como fallback
 * para "dias de estabilidade" quando o usuario nunca teve um alerta.
 */
export const getUserCreationDate = async (patientId: number): Promise<Date | null> => {
    try {
        const row = await db('USUARIO')
            .where('id_usuario', patientId)
            .select('data_criacao')
            .first();

        return row?.data_criacao ? new Date(row.data_criacao) : null;
    } catch (error) {
        Logger.error('Erro ao buscar data de criacao do usuario:', error);
        throw new InternalServerError('Erro ao calcular dias de estabilidade.');
    }
};
