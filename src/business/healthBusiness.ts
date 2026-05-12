import * as healthRepository from '../database/repositories/healthRepository';
import * as userRepository from '../database/repositories/userRepository'; 
import * as panicBusiness from './panicBusiness'; 
import { sendPushNotification } from '../utils/notificationService';
import { Logger } from '../utils/logger';
import { HealthTelemetryInput } from '../validation/healthSchemas';

const pendingAlerts = new Map<number, NodeJS.Timeout>();

export const processHealthData = async (userId: number, data: HealthTelemetryInput) => {
    
    const tradutorDeTipos: Record<string, string> = {
        'BPM': 'BPM',
        'FALL_DETECTION': 'QUEDA',
        'OXYGEN': 'OXIGENIO',
        'SLEEP_STATUS': 'SONO',
        'STEP_COUNT': 'PASSOS' 
    };

    const healthPayload = {
        id_usuario: userId,
        tipo_dado: tradutorDeTipos[data.type] as "SONO" | "BPM" | "QUEDA" | "OXIGENIO",
        valor: String(data.value),
        is_emergencia: data.isEmergency
    };
    
    const healthId = await healthRepository.createHealthLog(healthPayload);

    if (data.type === 'BPM' && Number(data.value) > 130 && data.isEmergency) {
        Logger.info(`[healthBusiness] BPM Crítico (${data.value}) para usuário ${userId}.`);

        const patient = await userRepository.findUserById(userId);

        if (patient && patient.fcm_token) {
            await sendPushNotification(
                patient.fcm_token,
                "Alerta Cardíaco 🚨",
                "Detectamos batimentos altos. Você está bem? Toque aqui para confirmar."
            );

            Logger.info(`[healthBusiness] Push enviado. Iniciando contagem de 2 minutos para usuário ${userId}.`);

            const timeoutId = setTimeout(async () => {
                Logger.warn(`[healthBusiness] Tempo esgotado! Usuário ${userId} não respondeu. Acionando Pânico.`);
                pendingAlerts.delete(userId);
                
                const watchCoords: panicBusiness.Coord = { latitude: 0, longitude: 0 }; 
                
                await panicBusiness.triggerPanic(userId, watchCoords, 'BPM_ALTO');
                
            }, 120000);
          
            pendingAlerts.set(userId, timeoutId);

        } else {
            Logger.warn(`[healthBusiness] Usuário ${userId} sem token FCM. Acionando Pânico direto!`);
            
            const watchCoords: panicBusiness.Coord = { latitude: 0, longitude: 0 }; 

            await panicBusiness.triggerPanic(userId, watchCoords, 'BPM_ALTO');
        }
    }

    if (data.type === 'FALL_DETECTION' && data.isEmergency) {
        Logger.warn(`[healthBusiness] ALERTA CRÍTICO: Queda detectada (User ${userId}). Acionando Pânico!`);
        
        const watchCoords: panicBusiness.Coord = { latitude: 0, longitude: 0 }; 
        
        await panicBusiness.triggerPanic(userId, watchCoords, 'QUEDA_WATCH');
    }

    return { healthId, status: 'processed' };
};

export const cancelPendingAlert = async (userId: number) => {
    if (pendingAlerts.has(userId)) {
       
        clearTimeout(pendingAlerts.get(userId));
        pendingAlerts.delete(userId);
        
        Logger.info(`[healthBusiness] Pânico CANCELADO pelo usuário ${userId}. Tá tudo bem.`);
        return { success: true, message: 'Alerta cancelado com sucesso.' };
    }
    
    return { success: false, message: 'Nenhum alerta pendente encontrado.' };
};
