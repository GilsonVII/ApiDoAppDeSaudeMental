import cron from 'node-cron';
import * as agendaRepository from '../database/repositories/agendaRepository';
import { sendPushNotification } from '../utils/notificationService';
import { Logger } from '../utils/logger';

const checkPendingOccurrences = async () => {
    Logger.info(`[Cron Job] Rodando verificação da rotina... (Hora: ${new Date().toLocaleTimeString()})`);
    
    const now = new Date();
    
    try {
        const pendingOccurrences = await agendaRepository.findPendingOccurrencesForCron(now);
        
        if (pendingOccurrences.length === 0) {
            return; 
        }

        Logger.info(`[Cron Job] ${pendingOccurrences.length} rotinas pendentes. Disparando popups...`);

        for (const occ of pendingOccurrences) {
            
            if (occ.fcm_token) {
                
                let prefixo = '🏠 SafeHome Lembrete:';
                
                switch (occ.tipo) {
                    case 'MEDICAMENTO':
                        prefixo = '💊 Hora do Remédio:';
                        break;
                    case 'HIDRATACAO':
                        prefixo = '💧 Beba Água:';
                        break;
                    case 'SONO':
                        prefixo = '🌙 Higiene do Sono:';
                        break;
                    case 'CONSULTA':
                        prefixo = '🩺 Consulta Médica:';
                        break;
                }

                await sendPushNotification(
                    occ.fcm_token,
                    `${prefixo} ${occ.titulo}`, 
                    occ.descricao || 'É hora de focar na sua rotina de autocuidado!' 
                );
                
            } else {
                Logger.warn(`[Cron Job] Usuário sem FCM Token. Impossível notificar sobre: ${occ.titulo}`);
            }
        }

    } catch (error) {
        Logger.error("[Cron Job] Erro ao processar ocorrências da agenda:", error);
    }
};

export const startScheduler = () => {
    cron.schedule('*/5 * * * *', checkPendingOccurrences);
    Logger.info("✅ Scheduler (Cron Job) SafeHome iniciado. Rodando a cada 5 minutos.");
};