import * as userRepository from '../database/repositories/userRepository';
import * as iotRepository from '../database/repositories/iotRepository';
import * as agendaRepository from '../database/repositories/agendaRepository';
import { sendPushNotification } from '../utils/notificationService';
import { Logger } from '../utils/logger';


export const checkSensoryOverload = async (userId: number, sensorType: string, value: number) => {
    
    if (sensorType !== 'NOISE_DB' && sensorType !== 'LUMINOSITY') return;

    const patient = await userRepository.findUserById(userId);
    if (!patient || !patient.fcm_token) return;

    if (sensorType === 'NOISE_DB' && value > 85) {
        Logger.info(`[automationBusiness] Pico de ruído detectado. Enviando alerta sensorial para ${patient.nome}.`);
        await sendPushNotification(
            patient.fcm_token,
            "Ambiente Barulhento 🎧",
            "Os níveis de ruído estão muito altos. Que tal ir para um lugar mais calmo ou usar seu abafador?"
        );
    }

    if (sensorType === 'LUMINOSITY' && value > 900) {
        
        await sendPushNotification(
            patient.fcm_token,
            "Luz muito forte 🕶️",
            "A luminosidade do ambiente está no máximo. Considere fechar um pouco as cortinas."
        );
    }
};

export const enforceSleepHygiene = async () => {
    Logger.info("[automationBusiness] Rodando automação de Higiene do Sono...");
    const now = new Date();
    const horaAtual = now.getHours();

    if (horaAtual < 22 && horaAtual > 4) return; 

    try {
        const sleepEvents = await agendaRepository.findPendingOccurrencesForCron(now);
        const pendingSleepEvents = sleepEvents.filter(e => e.tipo === 'SONO');

        for (const event of pendingSleepEvents) {

            const lastLuminosity = await iotRepository.getTelemetryLogsByUserId(event.usuario_id, 1);
            
            const luzDoQuarto = lastLuminosity.find(log => log.tipo_sensor === 'LUMINOSITY');

            if (luzDoQuarto && Number(luzDoQuarto.valor) > 300) {
                if (event.fcm_token) {
                    await sendPushNotification(
                        event.fcm_token,
                        "Hora de desacelerar 🌙",
                        "Notamos que a luz ainda está acesa. Que tal apagar e começar a se preparar para dormir?"
                    );
                    Logger.info(`[automationBusiness] Alerta de sono enviado para o usuário ID ${event.usuario_id}.`);
                }
            }
        }
    } catch (error) {
        Logger.error("[automationBusiness] Erro ao processar automação de sono:", error);
    }
};