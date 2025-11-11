import * as userRepository from '../database/repositories/userRepository';
import * as contactRepository from '../database/repositories/contactRepository';
import { IUser } from '../models/UserModel'; 
import { IContactRelation } from '../models/ContactModel';

export const getProfile = async (userId: number): Promise<Omit<IUser, 'senha_hash'> | null> => {
    const user = await userRepository.findUserById(userId);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    return user; 
};

export const addContact = async (loggedInUserId: number, payload: Omit<IContactRelation, 'id_relacao'>): Promise<number | null> => {
    if (loggedInUserId !== payload.id_paciente) {
        throw new Error('Permissão negada: Você só pode adicionar contatos para si mesmo.');
    }
    
    const contactUser = await userRepository.findUserById(payload.id_contato);
    if (!contactUser) {
        throw new Error('Usuário de contato não encontrado.');
    }

    return contactRepository.createContactRelation(payload);
};

export const listMyContacts = async (loggedInUserId: number) => {
    return contactRepository.findContactsByPatientId(loggedInUserId);
};

export const updateFcmToken = async (userId: number, fcmToken: string) => {
    if (!fcmToken) {
        throw new Error('Token FCM não pode ser vazio.');
    }
    return userRepository.updateFcmToken(userId, fcmToken);
};