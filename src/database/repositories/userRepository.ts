import { db } from '../connection'; 
import { IUser } from '../../models/UserModel';

type CreateUserParams = {
    email: string;
    senha_hash: string;
    nome: string;
    is_patient: boolean;
    is_contato_emergencia: boolean;
};

export const createUser = async (userData: CreateUserParams): Promise<number | null> => {
    try {
        const [id] = await db('USUARIO').insert(userData);
        return id;
    } catch (error) {
        console.error("Erro ao criar usuário:", error);
        throw new Error('Erro ao criar usuário no banco de dados.');
    }
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    try {
        const user = await db('USUARIO').where({ email }).first();
        return user || null;
    } catch (error) {
        console.error("Erro ao buscar usuário por email:", error);
        throw new Error('Erro ao buscar usuário no banco de dados.');
    }
};

export const findUserById = async (userId: number): Promise<Omit<IUser, 'senha_hash'> | null> => {
    try {
        const user = await db('USUARIO')
            .select('id_usuario', 'email', 'nome', 'is_paciente', 'is_contato_emergencia', 'fcm_token')
            .where('id_usuario', userId)
            .first();
        return user || null;
    } catch (error) {
        console.error("Erro ao buscar usuário por ID:", error);
        throw new Error('Erro ao buscar usuário no banco de dados.');
    }
};

export const updateFcmToken = async (userId: number, fcmToken: string): Promise<boolean> => {
    try {
        const count = await db('USUARIO')
            .where('id_usuario', userId)
            .update({ fcm_token: fcmToken });
        return count > 0;
    } catch (error) {
        console.error("Erro ao salvar FcmToken:", error);
        throw new Error('Erro ao salvar token de notificação.');
    }
};

export const updateUserProfile = async (userId: number, name: string, isPatient: boolean, isEmergencyContact: boolean): Promise<boolean> => {
    try {
        const count = await db('USUARIO')
            .where('id_usuario', userId)
            .update({ 
                nome: name, 
                is_paciente: isPatient, 
                is_contato_emergencia: isEmergencyContact 
            });
        return count > 0;
    } catch (error) {
        console.error("Erro ao atualizar perfil do usuário:", error);
        throw new Error('Erro ao atualizar perfil no banco de dados.');
    }
};

export const updateUserPassword = async (userId: number, newPasswordHash: string): Promise<boolean> => {
    try {
        const count = await db('USUARIO')
            .where('id_usuario', userId)
            .update({ senha_hash: newPasswordHash });
        return count > 0;
    } catch (error) {
        console.error("Erro ao atualizar senha do usuário:", error);
        throw new Error('Erro ao atualizar senha no banco de dados.');
    }
};