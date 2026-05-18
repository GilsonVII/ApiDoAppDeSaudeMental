import * as statsRepository from '../database/repositories/statsRepository';
import * as contactRepository from '../database/repositories/contactRepository';
import * as userRepository from '../database/repositories/userRepository';
import { Logger } from '../utils/logger';
import { ForbiddenError, NotFoundError } from '../utils/errors';

export interface UserStats {
    consistencia_rotina: number;        // 0-100 (% de metas concluidas na semana)
    metas_concluidas_semana: number;
    metas_totais_semana: number;
    dias_estabilidade: number;          // dias desde o ultimo alerta critico
    ultimo_alerta_critico: string | null;
    mensagem_motivacional: string;
}

/**
 * Verifica se o usuario logado pode ver as estatisticas do paciente:
 * ou e o proprio paciente, ou e um contato de emergencia dele.
 * (mesma logica de permissao usada no agendaBusiness / panicBusiness)
 */
const checkPermission = async (loggedInUserId: number, patientId: number): Promise<boolean> => {
    if (loggedInUserId === patientId) return true;

    try {
        const contacts = await contactRepository.findContactsByPatientId(patientId);
        return contacts.some(c => c.id_contato === loggedInUserId);
    } catch (e) {
        Logger.error('Erro ao checar permissao de estatisticas:', e);
        return false;
    }
};

/** Retorna a data de N dias atras a partir de hoje, no formato YYYY-MM-DD. */
const getDateNDaysAgo = (days: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return d.toISOString().split('T')[0];
};

/** Gera a mensagem motivacional com base na faixa de consistencia. */
export const buildMotivationalMessage = (consistencia: number): string => {
    if (consistencia >= 80) {
        return 'Excelente trabalho! Sua consistencia esta otima, continue assim.';
    }
    if (consistencia >= 50) {
        return 'Muito bem, mas ha muito trabalho pela frente.';
    }
    if (consistencia > 0) {
        return 'Cada pequeno passo conta. Vamos retomar a rotina juntos.';
    }
    return 'Que tal comecar hoje? Sua jornada de autocuidado espera por voce.';
};

export type UserStatusLabel = 'Estável' | 'Atenção' | 'Crítico';

/**
 * Deriva um "status" textual do usuario a partir da consistencia da rotina
 * e da existencia de alertas recentes. Usado na Home.
 */
export const deriveStatusLabel = (consistencia: number, diasEstabilidade: number): UserStatusLabel => {
    // Alerta de panico nos ultimos 2 dias => Critico
    if (diasEstabilidade <= 2) return 'Crítico';
    // Rotina muito baixa => Atencao
    if (consistencia < 40) return 'Atenção';
    return 'Estável';
};

export const getUserStatus = async (
    loggedInUserId: number,
    patientId: number
): Promise<{ status: UserStatusLabel; consistencia_rotina: number; dias_estabilidade: number }> => {
    const stats = await getUserStats(loggedInUserId, patientId);
    const status = deriveStatusLabel(stats.consistencia_rotina, stats.dias_estabilidade);
    return {
        status,
        consistencia_rotina: stats.consistencia_rotina,
        dias_estabilidade: stats.dias_estabilidade,
    };
};

export const getUserStats = async (loggedInUserId: number, patientId: number): Promise<UserStats> => {
    // 1. Confirma que o paciente existe
    const patient = await userRepository.findUserById(patientId);
    if (!patient) {
        throw new NotFoundError('Paciente nao encontrado.');
    }

    // 2. Confirma permissao
    const hasPermission = await checkPermission(loggedInUserId, patientId);
    if (!hasPermission) {
        throw new ForbiddenError('Permissao negada para ver as estatisticas deste usuario.');
    }

    // 3. Indicador 1: consistencia da rotina (ultimos 7 dias)
    const startDate = getDateNDaysAgo(7);
    const endDate = getDateNDaysAgo(0);
    const { total, concluidas } = await statsRepository.getOccurrenceStatsInRange(
        patientId,
        startDate,
        endDate
    );
    const consistencia = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    // 4. Indicador 2: dias de estabilidade (desde o ultimo panico, ou desde a criacao da conta)
    const lastPanic = await statsRepository.getLastPanicTimestamp(patientId);
    let diasEstabilidade = 0;
    let ultimoAlerta: string | null = null;

    const referenceDate = lastPanic ?? (await statsRepository.getUserCreationDate(patientId));
    if (referenceDate) {
        const diffMs = Date.now() - referenceDate.getTime();
        diasEstabilidade = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
    }
    if (lastPanic) {
        ultimoAlerta = lastPanic.toISOString();
    }

    // 5. Indicador 3: mensagem motivacional
    const mensagem = buildMotivationalMessage(consistencia);

    return {
        consistencia_rotina: consistencia,
        metas_concluidas_semana: concluidas,
        metas_totais_semana: total,
        dias_estabilidade: diasEstabilidade,
        ultimo_alerta_critico: ultimoAlerta,
        mensagem_motivacional: mensagem,
    };
};
