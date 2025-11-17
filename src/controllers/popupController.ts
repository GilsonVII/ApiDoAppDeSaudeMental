import { Request, Response } from 'express';
import * as popupBusiness from '../business/popupBusiness';

export const handleGetGeneralPopup = async (req: Request, res: Response) => {
    try {
        const type = req.params.tipo;
        
        // Simulado: A lógica real buscaria dados com base no tipo
        const popupData = {
            tipo: type,
            titulo: `Este é um Pop-up ${type}`,
            mensagem: "Esta é a mensagem do pop-up geral."
        };

        return res.status(200).json(popupData);
    } catch (error: any) {
        return res.status(500).json({ error: 'Erro interno ao buscar pop-up.' });
    }
};
