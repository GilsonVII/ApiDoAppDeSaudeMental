import * as userRepository from '../database/repositories/userRepository';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { IUser } from '../models/UserModel';

export const registerNewUser = async (userData: Omit<IUser, 'id_usuario' | 'senha_hash'> & { password: string }): Promise<number | null> => {

    const existingUser = await userRepository.findUserByEmail(userData.email);
    if (existingUser) {
        throw new Error('E-mail já cadastrado.');
    }

    const hashedPassword = await hashPassword(userData.password);

    const userToSave: Omit<IUser, 'id_usuario'> = {
        email: userData.email,
        senha_hash: hashedPassword,
        name: userData.name,
        is_patient: userData.is_patient ?? true,
        is_emergency_contact: userData.is_emergency_contact ?? false, 
    };

    return userRepository.createUser(userToSave);
};

export const authenticateUser = async (email: string, password: string): Promise<string | null> => {

    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        return null; 
    }

    const isMatch = await comparePassword(password, user.senha_hash);
    if (!isMatch) {
        return null; 
    }

    return generateToken(user.id_usuario);
};