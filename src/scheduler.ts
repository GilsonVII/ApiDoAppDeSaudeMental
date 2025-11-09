import cron from 'node-cron';
import * as agendaRepository from './database/repositories/agendaRepository';
import { sendPushNotification } from './utils/notificationService';

const checkPendingOccurrences = async () => {
    console.log(`[Cron Job] Rodando verificação de ocorrências pendentes... (Hora: ${new Date().toLocaleTimeString()})`);
    
    const now = new Date();
    
    try {
        const pendingOccurrences = await agendaRepository.findPendingOccurrencesForCron(now);
        
        if (pendingOccurrences.length === 0) {
            console.log("[Cron Job] Nenhuma ocorrência pendente encontrada.");
            return;
        }

        console.log(`[Cron Job] ${pendingOccurrences.length} ocorrências encontradas. Enviando notificações...`);

        for (const occ of pendingOccurrences) {
            await sendPushNotification(
                occ.fcm_token,
                `AlertaMente Lembrete: ${occ.titulo}`,
                occ.descricao || 'É hora de focar na sua rotina!' 
            );
            
            
        }

    } catch (error) {
        console.error("[Cron Job] Erro ao processar ocorrências:", error);
    }
};

export const startScheduler = () => {
  
    cron.schedule('*/5 * * * *', checkPendingOccurrences);

    console.log("✅ Scheduler (Cron Job) iniciado. Verificando a cada 5 minutos.");
};