import pool from '../connection';
import { IUser } from '../../models/UserModels'; 

export const createUser = async (userData: Omit<IUser, 'id_usuario'>): Promise<number | null> => {
    const { email, senha_hash, name, is_patient, is_emergency_contact } = userData;
    const sql = 'INSERT INTO USUARIO (email, senha_hash, nome, is_paciente, is_contato_emergencia) VALUES (?, ?, ?, ?, ?)';
    try {
        const [result]: any = await pool.query(sql, [email, senha_hash, name, is_patient, is_emergency_contact]);
        return result.insertId; 
    } catch (error) {
        console.error("Erro ao criar usuário:", error);

        throw new Error('Erro ao criar usuário no banco de dados.');
    }
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    const sql = 'SELECT * FROM USUARIO WHERE email = ? LIMIT 1';
    try {
        const [rows]: any = await pool.query(sql, [email]);
        if (rows.length > 0) {
        
            const user = rows[0];
            return {
                id_usuario: user.id_usuario,
                email: user.email,
                senha_hash: user.senha_hash,
                name: user.name,
                is_patient: user.is_patient,
                is_emergency_contact: user.is_emergency_contact
            } as IUser;
        }
        return null;
    } catch (error) {
        console.error("Erro ao buscar usuário por email:", error);
        throw new Error('Erro ao buscar usuário no banco de dados.');
    }
};

export const findUserById = async (userId: number): Promise<Omit<IUser, 'senha_hash'> | null> => {
    const sql = 'SELECT id_usuario, email, nome, is_paciente, is_contato_emergencia FROM USUARIO WHERE id_usuario = ? LIMIT 1';
    try {
        const [rows]: any = await pool.query(sql, [userId]);
        if (rows.length > 0) {
            return rows[0] as Omit<IUser, 'senha_hash'>;
        }
        return null;
    } catch (error) {
        console.error("Erro ao buscar usuário por ID:", error);
        throw new Error('Erro ao buscar usuário no banco de dados.');
    }
};