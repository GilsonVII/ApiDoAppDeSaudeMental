import { Request, Response } from 'express';
import * as statsBusiness from '../business/statsBusiness';
import { AppError } from '../utils/errors';
import { Logger } from '../utils/logger';

export const handleGetUserStats = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        if (!loggedInUserId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const patientId = parseInt(req.params.id_paciente as string, 10);
        if (isNaN(patientId)) {
            return res.status(400).json({ error: 'ID do paciente inválido.' });
        }

        const stats = await statsBusiness.getUserStats(loggedInUserId, patientId);
        return res.status(200).json(stats);

    } catch (error: any) {
        Logger.error('Erro no controller de estatísticas:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao calcular estatísticas.' });
    }
};
