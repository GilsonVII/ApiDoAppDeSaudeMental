import cron from 'node-cron';
import * as agendaRepository from './database/repositories/agendaRepository';
import { sendPushNotification } from './utils/notificationService';
import { Logger } from './utils/logger';
import { enforceSleepHygiene } from './business/automationBusiness';

const checkPendingOccurrences = async () => {
   
    const now = new Date();
    
    try {
        const pendingOccurrences = await agendaRepository.findPendingOccurrencesForCron(now);
        
        if (pendingOccurrences.length === 0) {
            
            return;
        }

        Logger.info(`[Cron Job] ${pendingOccurrences.length} ocorrências encontradas. Enviando notificações...`);

        for (const occ of pendingOccurrences) {
      
            try {
            
                if (!occ.fcm_token) continue; 

                await sendPushNotification(
                    occ.fcm_token,
                    `⏰ SafeHome: ${occ.titulo}`, 
                    occ.descricao || 'É hora de focar na sua rotina!' 
                );
                
            } catch (err: any) {
                Logger.error(`[Cron Job] Falha ao notificar token ${occ.fcm_token}: ${err.message}`);
            }
        }

    } catch (error: any) {
        Logger.error("[Cron Job] Erro crítico ao buscar ocorrências pendentes:", error);
    }
};

export const startScheduler = () => {
    
    cron.schedule('*/5 * * * *', checkPendingOccurrences);

    cron.schedule('*/30 22-23 * * *', async () => {
        Logger.info("[Cron Job] Iniciando varredura de Higiene do Sono...");
        await enforceSleepHygiene();
    });

    Logger.info("✅ Scheduler V2 iniciado! Cron Jobs rodando em segundo plano.");
};
