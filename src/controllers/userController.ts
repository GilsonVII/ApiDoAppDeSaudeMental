import { Request, Response } from 'express';
import * as userBusiness from '../business/userBusiness';

<<<<<<< HEAD
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
=======
export async function getMyProfile(req: Request, res: Response) {
  try {
    const db = req.app.locals.db;
    const userId = (req as any).user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized: user missing in request' });

    const profile = await userBusiness.getProfile(db, userId);
    return res.status(200).json({ user: profile });
  } catch (err: any) {
    console.error('getMyProfile error', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
>>>>>>> d46311185f1e2c568922bcf8f6d646c9366a9123
