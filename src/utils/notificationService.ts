import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from 'fs';
import { Logger } from './logger';

try {
    let serviceAccount: any;

    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
        const serviceAccountPath = path.resolve(__dirname, '..', '..', 'firebase-service-account.json');
        serviceAccount = require(serviceAccountPath);
    }

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
    Logger.info('[NotificationService] Firebase inicializado com sucesso.');
} catch (error) {
    Logger.warn('[NotificationService] Credenciais do Firebase não encontradas. Push notifications desativadas.');
}

// data é opcional. ATENÇÃO: o FCM exige que TODO valor em `data` seja string.
// Quem chama é responsável por converter números/booleanos para string.
export const sendPushNotification = async (
    token: string,
    title: string,
    body: string,
    data?: Record<string, string>
) => {
    if (!admin.apps.length) {
        Logger.warn('[NotificationService] Simulação de envio (Firebase desligado).');
        return;
    }

    try {
        await admin.messaging().send({
            token,
            notification: { title, body },
            ...(data ? { data } : {}),
        });
        Logger.info(`[NotificationService] Notificação enviada para ${token}`);
    } catch (error) {
        Logger.error('[NotificationService] Erro ao enviar notificação:', error);
    }
};
