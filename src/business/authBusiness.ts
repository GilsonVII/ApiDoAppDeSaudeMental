import * as userRepository from '../database/repositories/userRepository';
import { generateToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { IUser } from '../models/UserModel';
import { ConflictError, NotFoundError, UnauthorizedError } from '../utils/errors';


type RegisterInput = {
    email: string;
    password: string;
    name: string;
    is_patient?: boolean;
    is_emergency_contact?: boolean;
};

export const registerNewUser = async (userData: RegisterInput): Promise<number | null> => {

    
    const existingUser = await userRepository.findUserByEmail(userData.email);
    if (existingUser) {
        throw new ConflictError('E-mail já cadastrado.');
    }

    const hashedPassword = await hashPassword(userData.password);

    const userToSave = {
        email: userData.email,
        senha_hash: hashedPassword,
        nome: userData.name, 
        is_paciente: userData.is_patient ?? true, 
        is_contato_emergencia: userData.is_emergency_contact ?? false, 
    };

    return userRepository.createUser(userToSave);
};

export const authenticateUser = async (email: string, password: string): Promise<string | null> => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new UnauthorizedError('Credenciais inválidas.');
    }

    const isMatch = await comparePassword(password, user.senha_hash);
    if (!isMatch) {
        throw new UnauthorizedError('Credenciais inválidas.');
    }

    return generateToken(user.id_usuario);
};

export const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    const user = await userRepository.findUserByEmail(email);
    if (!user) {
        throw new NotFoundError('Usuário não encontrado.');
    }
    const hashedPassword = await hashPassword(newPassword);
    return userRepository.updateUserPassword(user.id_usuario, hashedPassword);
};