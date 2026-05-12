import { Request, Response } from 'express';
import * as healthBusiness from '../business/healthBusiness';
import { healthTelemetrySchema } from '../validation/healthSchemas';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/errors'; 

export const handleHealthTelemetry = async (req: Request, res: Response) => {
    try {
        
        const validation = healthTelemetrySchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Formato de dados de saúde inválido', 
                details: validation.error.flatten().fieldErrors 
            });
        }

        const parsedData = validation.data;
        const userId = req.user?.id; 
        
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const result = await healthBusiness.processHealthData(userId, parsedData);
        return res.status(200).json(result);
        
    } catch (error: any) {
        Logger.error(`[healthController] Erro ao processar telemetria de saúde: ${error.message}`);
        
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        
        return res.status(500).json({ error: 'Erro interno no servidor ao processar dados de saúde.' });
    }
};

export const handleCancelAlert = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id; 
        
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const result = await healthBusiness.cancelPendingAlert(userId);
        
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json(result);
        }
        
    } catch (error: any) {
        Logger.error(`[healthController] Erro ao cancelar alerta: ${error.message}`);
        
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        
        return res.status(500).json({ error: 'Erro interno no servidor ao cancelar alerta.' });
    }
};
