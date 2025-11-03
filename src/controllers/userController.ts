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