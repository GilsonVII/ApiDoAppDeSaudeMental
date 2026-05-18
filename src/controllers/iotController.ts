import { Request, Response } from 'express';
import * as iotBusiness from '../business/iotBusiness';
import { telemetrySchema, createDeviceSchema, updateDeviceSchema } from '../validation/iotSchemas';
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

export const handleListDevices = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const devices = await iotBusiness.listDevices(userId);
        return res.status(200).json(devices);

    } catch (error: any) {
        Logger.error(`[iotController] Erro ao listar dispositivos: ${error.message}`);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao listar dispositivos IoT.' });
    }
};

export const handleRegisterDevice = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const validation = createDeviceSchema.safeParse({ body: req.body });
        if (!validation.success) {
            return res.status(400).json({
                error: 'Dados de entrada inválidos.',
                details: validation.error.flatten().fieldErrors
            });
        }

        const result = await iotBusiness.registerDevice(userId, validation.data.body);
        return res.status(201).json(result);

    } catch (error: any) {
        Logger.error(`[iotController] Erro ao cadastrar dispositivo: ${error.message}`);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao cadastrar dispositivo IoT.' });
    }
};

export const handleUpdateDevice = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        const deviceId = req.params.id_dispositivo as string;
        if (!deviceId) {
            return res.status(400).json({ error: 'ID do dispositivo é obrigatório.' });
        }

        const validation = updateDeviceSchema.safeParse({ body: req.body });
        if (!validation.success) {
            return res.status(400).json({
                error: 'Dados de entrada inválidos.',
                details: validation.error.flatten().fieldErrors
            });
        }

        const result = await iotBusiness.updateDevice(userId, deviceId, validation.data.body);
        return res.status(200).json(result);

    } catch (error: any) {
        Logger.error(`[iotController] Erro ao atualizar dispositivo: ${error.message}`);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao atualizar dispositivo IoT.' });
    }
};
