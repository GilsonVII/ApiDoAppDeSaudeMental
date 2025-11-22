import { db } from '../connection';
import { IContactRelation } from '../../models/ContactModel';

type ContactInput = Omit<IContactRelation, 'id_relacao'>;
type ContactSummary = {
    id_contato: number,
    whatsapp_numero: string,
    nome_contato: string,
    email_contato: string
};

export const createContactRelation = async (data: ContactInput): Promise<number | null> => {
    try {
        const [id] = await db('CONTATO_EMERGENCIA').insert(data);
        return id;
    } catch (error) {
        console.error("Erro ao criar relação de contato:", error);
        throw new Error('Erro ao salvar relação de contato.');
    }
};

export const findContactsByPatientId = async (patientId: number): Promise<ContactSummary[]> => {
    try {
        const rows = await db('CONTATO_EMERGENCIA as ce')
            .join('USUARIO as u', 'ce.id_contato', 'u.id_usuario')
            .select('ce.id_contato', 'ce.whatsapp_numero', 'u.nome as nome_contato', 'u.email as email_contato')
            .where('ce.id_paciente', patientId);
        return rows as ContactSummary[];
    } catch (error) {
        console.error("Erro ao buscar contatos por ID do paciente:", error);
        throw new Error('Erro ao buscar contatos.');
    }
};

export const deleteContactRelation = async (relationId: number, patientId: number): Promise<boolean> => {
    try {
        const count = await db('CONTATO_EMERGENCIA')
            .where({ id_relacao: relationId, id_paciente: patientId })
            .delete();
        return count > 0;
    } catch (error) {
        console.error("Erro ao deletar relação de contato:", error);
        throw new Error('Erro ao deletar relação de contato.');
    }
};