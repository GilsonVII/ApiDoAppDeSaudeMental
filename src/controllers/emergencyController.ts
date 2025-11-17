import { Request, Response } from 'express';
import * as panicBusiness from '../business/panicBusiness';
import { AppError } from '../utils/errors';
import { triggerPanicSchema } from '../validation/emergencySchemas';

export const handleTriggerPanic = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }
        
        const validation = triggerPanicSchema.safeParse({ body: req.body });
        if (!validation.success) {
            return res.status(400).json({ 
                error: "Dados de entrada inválidos.",
                details: validation.error.flatten().fieldErrors 
            });
        }
        
        const { latitude, longitude } = validation.data.body;
        
        const result = await panicBusiness.triggerPanic(userId, { latitude, longitude });
        
        return res.status(201).json({
            message: "Evento de pânico registrado. Notificações (simuladas) enviadas.",
            eventId: result.eventId,
            notifiedContactsCount: result.contacts.length
        });
    } catch (error: any) {
        console.error('Erro no controller de pânico:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao processar acionamento de pânico.' });
    }
};