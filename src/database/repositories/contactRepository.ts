import { db } from '../connection';
import { IContactRelation } from '../../models/ContactModel';
import { Logger } from '../../utils/logger';
import { InternalServerError } from '../../utils/errors';

type ContactInput = Omit<IContactRelation, 'id_relacao'>;

type ContactSummary = {
    id_contato: number,
    whatsapp_numero: string,
    nome_contato: string,
    email_contato: string,
    nivel_permissao: string,       
    fcm_token: string | null       
};

type MonitoredPatientSummary = {
    id_relacao: number;
    id_paciente: number;
    nome_paciente: string;
    email_paciente: string;
    genero: string | null;
    nivel_permissao: string;
};

export const createContactRelation = async (data: ContactInput): Promise<number | null> => {
    try {
        const [id] = await db('CONTATO_EMERGENCIA').insert(data);
        return id;
    } catch (error) {
        Logger.error("Erro ao criar relação de contato:", error);
        throw new InternalServerError('Erro ao salvar relação de contato.');
    }
};

export const findContactsByPatientId = async (patientId: number): Promise<ContactSummary[]> => {
    try {
        const rows = await db('CONTATO_EMERGENCIA as ce')
            .join('USUARIO as u', 'ce.id_contato', 'u.id_usuario')
            .select(
                'ce.id_contato', 
                'ce.whatsapp_numero', 
                'ce.nivel_permissao', 
                'u.nome as nome_contato', 
                'u.email as email_contato',
                'u.fcm_token'
            )
            .where('ce.id_paciente', patientId);
            
        return rows as ContactSummary[];
    } catch (error) {
        Logger.error("Erro ao buscar contatos por ID do paciente:", error);
        throw new InternalServerError('Erro ao buscar contatos.');
    }
};

export const findPatientsByContactId = async (contactId: number): Promise<MonitoredPatientSummary[]> => {
    try {
        const rows = await db('CONTATO_EMERGENCIA as ce')
            .join('USUARIO as u', 'ce.id_paciente', 'u.id_usuario')
            .select(
                'ce.id_relacao',
                'ce.id_paciente',
                'ce.nivel_permissao',
                'u.nome as nome_paciente',
                'u.email as email_paciente',
                'u.genero'
            )
            .where('ce.id_contato', contactId);

        return rows as MonitoredPatientSummary[];
    } catch (error) {
        Logger.error("Erro ao buscar pacientes monitorados pelo contato:", error);
        throw new InternalServerError('Erro ao buscar pacientes monitorados.');
    }
};

export const deleteContactRelation = async (relationId: number, patientId: number): Promise<boolean> => {
    try {
        const count = await db('CONTATO_EMERGENCIA')
            .where({ id_relacao: relationId, id_paciente: patientId })
            .delete();
        return count > 0;
    } catch (error) {
        Logger.error("Erro ao deletar relação de contato:", error);
        throw new InternalServerError('Erro ao deletar relação de contato.');
    }
};
