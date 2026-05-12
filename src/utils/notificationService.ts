import * as admin from 'firebase-admin';
import { Logger } from './logger';

try {
    
    const serviceAccount = require('../config/firebase-service-account.json');
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    Logger.info('[NotificationService] Firebase inicializado com sucesso.');
} catch (error) {
   
    Logger.warn('[NotificationService] Arquivo firebase-service-account.json não encontrado. Push notifications desativadas.');
}

export const sendPushNotification = async (token: string, title: string, body: string) => {
  
    if (!admin.apps.length) {
        Logger.warn('[NotificationService] Simulação de envio (Firebase desligado).');
        return;
    }

    try {
        await admin.messaging().send({
            token,
            notification: { title, body }
        });
        Logger.info(`[NotificationService] Notificação enviada para ${token}`);
    } catch (error) {
        Logger.error('[NotificationService] Erro ao enviar notificação:', error);
    }
};
