import { db } from '../connection';
import { IUser } from '../../models/UserModel';
import { AppError, ForbiddenError, NotFoundError, BadRequestError, InternalServerError } from '../../utils/errors';
import { Logger } from '../../utils/logger';

export const createUser = async (userData: Omit<IUser, 'id_usuario' | 'data_criacao'>): Promise<number | null> => {
    try {
        const [id] = await db('USUARIO').insert(userData);
        return id;
    } catch (error) {
        Logger.error("Erro ao criar usuário:", error);
        throw new InternalServerError('Erro ao criar usuário no banco de dados.');
    }
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    try {
        const user = await db('USUARIO').where({ email }).first();
        return user || null;
    } catch (error) {
        Logger.error("Erro ao buscar usuário por email:", error);
        throw new InternalServerError('Erro ao buscar usuário no banco de dados.');
    }
};

export const findUserById = async (userId: number): Promise<Omit<IUser, 'senha_hash'> | null> => {
    try {
        const user = await db('USUARIO')
            .select('id_usuario', 'email', 'nome', 'genero', 'is_paciente', 'is_contato_emergencia', 'fcm_token', 'settings_json')
            .where('id_usuario', userId)
            .first();
        return user || null;
    } catch (error) {
        Logger.error("Erro ao buscar usuário por ID:", error);
        throw new InternalServerError('Erro ao buscar usuário no banco de dados.');
    }
};

export const updateFcmToken = async (userId: number, fcmToken: string): Promise<boolean> => {
    try {
        const count = await db('USUARIO')
            .where('id_usuario', userId)
            .update({ fcm_token: fcmToken });
        return count > 0;
    } catch (error) {
        Logger.error("Erro ao salvar FcmToken:", error);
        throw new InternalServerError('Erro ao salvar token de notificação.');
    }
};

type UpdateProfileData = Partial<Omit<IUser, 'id_usuario' | 'senha_hash' | 'email' | 'data_criacao'>>;

export const updateUserProfile = async (userId: number, updateData: UpdateProfileData): Promise<boolean> => {
    try {
        const dataToUpdate: any = { ...updateData };

        if (dataToUpdate.settings_json && typeof dataToUpdate.settings_json === 'object') {
            dataToUpdate.settings_json = JSON.stringify(dataToUpdate.settings_json);
        }

        const count = await db('USUARIO')
            .where('id_usuario', userId)
            .update(dataToUpdate);

        return count > 0;
    } catch (error) {
        Logger.error("Erro ao atualizar perfil do usuário:", error);
        throw new InternalServerError('Erro ao atualizar perfil no banco de dados.');
    }
};

export const updateUserPassword = async (userId: number, newPasswordHash: string): Promise<boolean> => {
    try {
        const count = await db('USUARIO')
            .where('id_usuario', userId)
            .update({ senha_hash: newPasswordHash });
        return count > 0;
    } catch (error) {
        Logger.error("Erro ao atualizar senha do usuário:", error);
        throw new InternalServerError('Erro ao atualizar senha no banco de dados.');
    }
};
