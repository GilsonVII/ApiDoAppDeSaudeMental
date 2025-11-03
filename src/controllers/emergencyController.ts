import { Request, Response } from 'express';
import * as panicBusiness from '../business/panicBusiness';


export const handleTriggerPanic = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        const { latitude, longitude } = req.body;
        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            return res.status(400).json({ error: 'Latitude e longitude são obrigatórias e devem ser números.' });
        }
        const result = await panicBusiness.triggerPanic(userId, { latitude, longitude });
        return res.status(201).json({
            message: "Evento de pânico registrado. Notificações (simuladas) enviadas.",
            eventId: result.eventId,
            notifiedContactsCount: result.contacts.length
        });
    } catch (error: any) {
        console.error('Erro no controller de pânico:', error);
        return res.status(500).json({ error: 'Erro interno ao processar acionamento de pânico.' });
    }
};