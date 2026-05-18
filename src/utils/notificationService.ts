import * as admin from 'firebase-admin';
import * as path from 'path';
import { Logger } from './logger';

try {
    
    const serviceAccountPath = path.resolve(__dirname, '..', '..', 'firebase-service-account.json');
    const serviceAccount = require(serviceAccountPath);

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
