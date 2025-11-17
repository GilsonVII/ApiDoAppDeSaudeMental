import { Request, Response } from 'express';
import * as userBusiness from '../business/userBusiness';
import { AppError } from '../utils/errors';
import { 
    addContactSchema, 
    updateFcmTokenSchema, 
    updateProfileSchema, 
    searchUserSchema 
} from '../validation/userSchemas';

export const handleGetMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        
        const profile = await userBusiness.getProfile(userId);
        
        return res.status(200).json(profile); 
    } catch (error: any) {
        console.error('Erro no controller de perfil:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao buscar perfil.' });
    }
};

export const handleAddContact = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        if (!loggedInUserId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const validation = addContactSchema.safeParse({ body: req.body });
        if (!validation.success) {
            return res.status(400).json({ 
                error: "Dados de entrada inválidos.",
                details: validation.error.flatten().fieldErrors 
            });
        }
        
        const payload = validation.data.body;

        const relationId = await userBusiness.addContact(loggedInUserId, payload);
        return res.status(201).json({ message: 'Contato adicionado com sucesso.', relationId });
        
    } catch (error: any) {
        console.error('Erro ao adicionar contato:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao adicionar contato.' });
    }
};

export const handleListContacts = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        if (!loggedInUserId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const contacts = await userBusiness.listMyContacts(loggedInUserId);
        return res.status(200).json(contacts);
        
    } catch (error: any) {
        console.error('Erro ao listar contatos:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao listar contatos.' });
    }
};

export const handleUpdateFcmToken = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        
        const validation = updateFcmTokenSchema.safeParse({ body: req.body });
        if (!validation.success) {
            return res.status(400).json({ 
                error: "Dados de entrada inválidos.",
                details: validation.error.flatten().fieldErrors 
            });
        }
        
        const { fcm_token } = validation.data.body;

        await userBusiness.updateFcmToken(userId, fcm_token);
        return res.status(200).json({ message: 'Token de notificação salvo.' });

    } catch (error: any) {
        console.error('Erro ao salvar FcmToken:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao salvar token.' });
    }
};

export const handleUpdateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        
        const validation = updateProfileSchema.safeParse({ body: req.body });
        if (!validation.success) {
            return res.status(400).json({ 
                error: "Dados de entrada inválidos.",
                details: validation.error.flatten().fieldErrors 
            });
        }
        
        const { name, is_patient, is_emergency_contact } = validation.data.body;

        await userBusiness.updateProfile(userId, name, is_patient, is_emergency_contact);
        return res.status(200).json({ message: 'Perfil atualizado com sucesso.' });
        
    } catch (error: any) {
        console.error('Erro no controller de atualizar perfil:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao atualizar perfil.' });
    }
};

export const handleSearchUser = async (req: Request, res: Response) => {
    try {
        const validation = searchUserSchema.safeParse({ query: req.query });
        if (!validation.success) {
            return res.status(400).json({ 
                error: "Query param inválido.",
                details: validation.error.flatten().fieldErrors 
            });
        }
        
        const { email } = validation.data.query;
        
        const profile = await userBusiness.searchUserByEmail(email);
        if (!profile) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        return res.status(200).json(profile);
        
    } catch (error: any) {
        console.error('Erro no controller de busca de usuário:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao buscar usuário.' });
    }
};