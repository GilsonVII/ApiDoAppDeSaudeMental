import { Request, Response } from 'express';
import * as iotBusiness from '../business/iotBusiness';
import { telemetrySchema } from '../validation/iotSchemas';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/errors';

export const handleTelemetry = async (req: Request, res: Response) => {
    try {
      
        const validation = telemetrySchema.safeParse(req.body);
        
        if (!validation.success) {
            return res.status(400).json({ 
                error: 'Formato de telemetria inválido', 
                details: validation.error.flatten().fieldErrors 
            });
        }

        const parsedData = validation.data;
        
        const userId = req.user?.id; 
        
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const result = await iotBusiness.processTelemetry(userId, parsedData);
        return res.status(200).json(result);
        
    } catch (error: any) {
        Logger.error(`[iotController] Erro ao processar telemetria: ${error.message}`);
        
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        
        return res.status(500).json({ error: 'Erro interno no servidor ao processar dados de IoT.' });
    }
};
