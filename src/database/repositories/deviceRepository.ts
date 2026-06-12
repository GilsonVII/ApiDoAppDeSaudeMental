import { db } from '../connection';
import { Logger } from '../../utils/logger';
import { InternalServerError } from '../../utils/errors';
import { IIotDevice } from '../../models/IotDeviceModel';

/**
 * Lista todos os dispositivos IoT cadastrados de um usuario.
 */
export const findDevicesByUserId = async (userId: number): Promise<IIotDevice[]> => {
    try {
        return await db('DISPOSITIVO_IOT')
            .where('id_usuario', userId)
            .orderBy('nome', 'asc');
    } catch (error) {
        Logger.error('Erro ao buscar dispositivos IoT:', error);
        throw new InternalServerError('Erro ao buscar dispositivos IoT.');
    }
};

/**
 * Busca um dispositivo especifico pelo seu id (string).
 */
export const findDeviceById = async (deviceId: string): Promise<IIotDevice | null> => {
    try {
        const device = await db('DISPOSITIVO_IOT')
            .where('id_dispositivo', deviceId)
            .first();
        return device || null;
    } catch (error) {
        Logger.error('Erro ao buscar dispositivo IoT por ID:', error);
        throw new InternalServerError('Erro ao buscar dispositivo IoT.');
    }
};

/**
 * Cadastra um novo dispositivo IoT.
 */
export const createDevice = async (deviceData: IIotDevice): Promise<string> => {
    try {
        await db('DISPOSITIVO_IOT').insert(deviceData);
        return deviceData.id_dispositivo;
    } catch (error) {
        Logger.error('Erro ao criar dispositivo IoT:', error);
        throw new InternalServerError('Erro ao cadastrar dispositivo IoT.');
    }
};

export const deleteDevice = async (deviceId: string): Promise<boolean> => {
    try {
        const count = await db('DISPOSITIVO_IOT')
            .where('id_dispositivo', deviceId)
            .delete();
        return count > 0;
    } catch (error) {
        Logger.error('Erro ao deletar dispositivo IoT:', error);
        throw new InternalServerError('Erro ao deletar dispositivo IoT.');
    }
};

/**
 * Atualiza um dispositivo (nome e/ou status ativo).
 */
export const updateDevice = async (
    deviceId: string,
    updateData: Partial<Pick<IIotDevice, 'nome' | 'status_ativo'>>
): Promise<boolean> => {
    try {
        const count = await db('DISPOSITIVO_IOT')
            .where('id_dispositivo', deviceId)
            .update(updateData);
        return count > 0;
    } catch (error) {
        Logger.error('Erro ao atualizar dispositivo IoT:', error);
        throw new InternalServerError('Erro ao atualizar dispositivo IoT.');
    }
};
