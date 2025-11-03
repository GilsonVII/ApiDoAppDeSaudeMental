import { Request, Response } from 'express';
import * as userBusiness from '../business/userBusiness';


export const handleGetMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        const profile = await userBusiness.getProfile(userId);
        if (!profile) {
            return res.status(404).json({ error: 'Perfil não encontrado.' });
        }
        return res.status(200).json(profile); 
    } catch (error: any) {
        console.error('Erro no controller de perfil:', error);
        return res.status(500).json({ error: 'Erro interno ao buscar perfil.' });
    }
};

export const handleAddContact = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        const payload = req.body;

        if (!loggedInUserId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        if (!payload.id_paciente || !payload.id_contato || !payload.whatsapp_numero) {
            return res.status(400).json({ error: 'Campos obrigatórios: id_paciente, id_contato, whatsapp_numero.' });
        }

        const relationId = await userBusiness.addContact(loggedInUserId, payload);
        return res.status(201).json({ message: 'Contato adicionado com sucesso.', relationId });
    } catch (error: any) {
        console.error('Erro ao adicionar contato:', error);
        if (error.message.includes('Permissão negada') || error.message.includes('Usuário de contato não encontrado')) {
            return res.status(400).json({ error: error.message });
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
        return res.status(500).json({ error: 'Erro interno ao listar contatos.' });
    }
};