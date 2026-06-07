import { Request, Response } from 'express';
import * as panicBusiness from '../business/panicBusiness';
import { AppError } from '../utils/errors';
import { triggerPanicSchema } from '../validation/emergencySchemas';
import { Logger } from '../utils/logger';
import { OrigemPanico } from '../models/PanicEventModel'; 

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
        
        const { latitude, longitude, origem } = validation.data.body;
        
        const origemPanico: OrigemPanico = origem || 'MANUAL';
        
        const result = await panicBusiness.triggerPanic(userId, { latitude, longitude }, origemPanico);
        
        return res.status(201).json({
            message: "Evento de emergência registrado. Notificações enviadas para a Rede de Apoio.",
            eventId: result.eventId,
            notifiedContactsCount: result.contacts.length
        });
    } catch (error: any) {
        Logger.error('Erro no controller de pânico:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao processar acionamento de pânico.' });
    }
};

export const handleGetPanicLogs = async (req: Request, res: Response) => {
    try {
        const loggedInUserId = req.user?.id;
        if (!loggedInUserId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const patientId = parseInt(req.params.id_paciente as string, 10);
        if (isNaN(patientId)) {
            return res.status(400).json({ error: 'ID do paciente inválido.' });
        }

        const logs = await panicBusiness.getPanicLogs(loggedInUserId, patientId);
        return res.status(200).json(logs);

    } catch (error: any) {
        Logger.error('Erro ao buscar logs de pânico:', error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao buscar logs de pânico.' });
    }
};
