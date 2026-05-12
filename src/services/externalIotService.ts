import axios from 'axios';
import { Logger } from '../utils/logger';
import { AppError } from '../utils/errors';

const ESP32_BASE_URL = process.env.ESP32_URL || 'http://192.168.1.100';

export const sendCommandToDevice = async (deviceId: string, command: string, payload?: any) => {
    try {
        Logger.info(`[externalIotService] Enviando comando '${command}' para o dispositivo ${deviceId}...`);

        const response = await axios.post(`${ESP32_BASE_URL}/api/command`, {
            device_id: deviceId,
            action: command,
            data: payload
        }, {
            timeout: 5000
        });

        if (response.status === 200) {
            Logger.info(`[externalIotService] Comando '${command}' executado com sucesso no ESP32.`);
            return true;
        }

        return false;

    } catch (error: any) {
        Logger.error(`[externalIotService] Falha ao comunicar com o dispositivo IoT: ${error.message}`);
   
        return false;
    }
};

export const triggerCalmingLight = async (deviceId: string) => {
    
    return await sendCommandToDevice(deviceId, 'SET_COLOR', { hex: '#0000FF', brightness: 50 });
};