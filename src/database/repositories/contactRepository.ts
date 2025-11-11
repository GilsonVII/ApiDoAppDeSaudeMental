import pool from '../connection';
import { IContactRelation } from '../../models/ContactModel';

type ContactInput = Omit<IContactRelation, 'id_relacao'>;
type ContactSummary = {
    id_contato: number,
    whatsapp_numero: string,
    nome_contato: string,
    email_contato: string
};

export const createContactRelation = async (data: ContactInput): Promise<number | null> => {
    const { id_paciente, id_contato, whatsapp_numero } = data;
    const sql = 'INSERT INTO CONTATO_EMERGENCIA (id_paciente, id_contato, whatsapp_numero) VALUES (?, ?, ?)';
    try {
        const [result]: any = await pool.query(sql, [id_paciente, id_contato, whatsapp_numero]);
        return result.insertId;
    } catch (error) {
        console.error("Erro ao criar relação de contato:", error);
        throw new Error('Erro ao salvar relação de contato.');
    }
};

export const findContactsByPatientId = async (patientId: number): Promise<ContactSummary[]> => {
    const sql = `
        SELECT 
            ce.id_contato, 
            ce.whatsapp_numero, 
            u.nome as nome_contato, 
            u.email as email_contato
        FROM CONTATO_EMERGENCIA ce
        JOIN USUARIO u ON ce.id_contato = u.id_usuario
        WHERE ce.id_paciente = ?;
    `;
    try {
        const [rows]: any = await pool.query(sql, [patientId]);
        return rows;
    } catch (error) {
        console.error("Erro ao buscar contatos por ID do paciente:", error);
        throw new Error('Erro ao buscar contatos.');
    }
};