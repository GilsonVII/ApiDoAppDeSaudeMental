import * as iotRepository from '../database/repositories/iotRepository';
import * as userRepository from '../database/repositories/userRepository'; 
import * as panicBusiness from './panicBusiness'; 
import { sendPushNotification } from '../utils/notificationService'; 
import { Logger } from '../utils/logger';
import { TelemetryInput } from '../validation/iotSchemas';
import { checkSensoryOverload } from './automationBusiness';

export const processTelemetry = async (userId: number, data: TelemetryInput) => {
    
    const telemetryPayload = {
        id_usuario: userId,
        id_dispositivo: data.deviceId,
        tipo_sensor: data.sensorType,
        valor: String(data.value)
    };

    const telemetryId = await iotRepository.createTelemetryLog(telemetryPayload);
    Logger.info(`[iotBusiness] Telemetria registrada: ${data.sensorType} = ${data.value} (Usuário: ${userId})`);

    const patient = await userRepository.findUserById(userId);
    const fcmToken = patient?.fcm_token;

    await checkSensoryOverload(userId, data.sensorType, Number(data.value));

    switch (data.sensorType) {
        
        case 'GAS_LEVEL':
            if (Number(data.value) > 300) {
                Logger.warn(`[iotBusiness] ALERTA CRÍTICO: Gás detectado (User ${userId}). Acionando Pânico!`);

                const homeCoords: panicBusiness.Coord = { latitude: 0, longitude: 0 }; 
               
                await panicBusiness.triggerPanic(userId, homeCoords, 'SENSOR_GAS');
            }
            break;

        case 'DOOR_STATUS':
            if (data.value === 'OPEN') {
                Logger.info(`[iotBusiness] Porta/Janela aberta (User ${userId}).`); 
                
                if (fcmToken) {
                    await sendPushNotification(fcmToken, "Aviso de Segurança 🚪", "A porta/janela foi aberta.");
                }
            }
            break;

        case 'NOISE_DB':
            if (Number(data.value) > 85) {
                Logger.info(`[iotBusiness] Ruído alto detectado para o usuário ${userId}.`);
            
                if (fcmToken) {
                    await sendPushNotification(fcmToken, "Ambiente Barulhento 🎧", "Níveis de ruído altos. Que tal ir para um lugar calmo?");
                }
            }
            break;
    }

    return { telemetryId, status: 'processed' };
};
