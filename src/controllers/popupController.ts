import { Request, Response } from 'express';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/errors';

export const handleGetGeneralPopup = async (req: Request, res: Response) => {
    try {
        const type = req.params.tipo as string;
        const popupData = {
            tipo: type,
            titulo: `Pop-up de ${type.toUpperCase()}`,
            mensagem: "Esta é a mensagem padrão do sistema."
        };

        return res.status(200).json(popupData);
        
    } catch (error: any) {
        Logger.error(`[popupController] Erro ao buscar pop-up genérico: ${error.message}`);
        
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        
        return res.status(500).json({ error: 'Erro interno ao buscar pop-up.' });
    }
};
