import { db } from '../connection';
import { IPanicEvent, IIncomingPanic } from '../../models/PanicEventModel';
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

// ============================================================
//  Incidentes recebidos pelo CONTATO/cuidador
// ============================================================

// Lista os pânicos dos pacientes que `contactUserId` monitora.
export const getIncomingPanics = async (
    contactUserId: number,
    somenteAtivos: boolean
): Promise<IIncomingPanic[]> => {
    try {
        const query = db('EVENTO_PANICO as ep')
            .join('CONTATO_EMERGENCIA as ce', 'ep.usuario_id', 'ce.id_paciente')
            .join('USUARIO as u', 'ep.usuario_id', 'u.id_usuario')
            .where('ce.id_contato', contactUserId)
            .select(
                'ep.id_panico',
                'ep.usuario_id',
                'u.nome as paciente_nome',
                'ep.latitude',
                'ep.longitude',
                'ep.origem',
                'ep.timestamp',
                'ep.status_resolvido',
                'ep.resolvido_em',
                'ep.resolvido_por'
            )
            .orderBy('ep.timestamp', 'desc');

        if (somenteAtivos) {
            query.where('ep.status_resolvido', false);
        }

        const rows = await query;

        return rows.map((r: any) => ({
            ...r,
            status_resolvido: Boolean(r.status_resolvido),
        })) as IIncomingPanic[];
    } catch (error) {
        Logger.error("Erro ao buscar incidentes recebidos pelo contato:", error);
        throw new InternalServerError('Erro ao buscar incidentes de emergência.');
    }
};

// Verifica se `contactUserId` é contato de emergência do paciente dono do evento.
export const getPanicOwner = async (eventId: number): Promise<number | null> => {
    try {
        const row = await db('EVENTO_PANICO')
            .where('id_panico', eventId)
            .select('usuario_id')
            .first();
        return row ? row.usuario_id : null;
    } catch (error) {
        Logger.error("Erro ao buscar dono do evento de pânico:", error);
        throw new InternalServerError('Erro ao verificar evento de pânico.');
    }
};

export const isContactOfPatient = async (contactUserId: number, patientId: number): Promise<boolean> => {
    try {
        const row = await db('CONTATO_EMERGENCIA')
            .where({ id_contato: contactUserId, id_paciente: patientId })
            .first();
        return !!row;
    } catch (error) {
        Logger.error("Erro ao verificar vínculo de contato:", error);
        throw new InternalServerError('Erro ao verificar permissão.');
    }
};

// Marca um incidente como resolvido. Retorna true se atualizou alguma linha.
export const resolvePanic = async (eventId: number, resolvedByUserId: number): Promise<boolean> => {
    try {
        const count = await db('EVENTO_PANICO')
            .where('id_panico', eventId)
            .update({
                status_resolvido: true,
                resolvido_em: db.fn.now(),
                resolvido_por: resolvedByUserId,
            });
        return count > 0;
    } catch (error) {
        Logger.error("Erro ao resolver incidente de pânico:", error);
        throw new InternalServerError('Erro ao resolver incidente.');
    }
};
