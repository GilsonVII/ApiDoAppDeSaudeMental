import * as userRepository from '../database/repositories/userRepository';
import { IUser } from '../models/UserModel';

export const getProfile = async (userId: number): Promise<Omit<IUser, 'senha_hash'> | null> => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    return user; 
};