import sgMail from '@sendgrid/mail';
import * as admin from 'firebase-admin';

const serviceAccount = require('../config/firebase-service-account.json'); 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const API_KEY = process.env.SENDGRID_API_KEY;
const SENDER_EMAIL = process.env.VERIFIED_SENDER_EMAIL;

if (API_KEY && SENDER_EMAIL) {
    sgMail.setApiKey(API_KEY);
} else {
    console.warn("Aviso: Chaves do SendGrid não definidas. E-mails de pânico serão simulados.");
}

interface PanicEmailPayload {
    contactEmail: string;
    patientName: string;
    latitude: number;
    longitude: number;
}

export const sendPanicEmail = async (payload: PanicEmailPayload) => {
    if (!API_KEY || !SENDER_EMAIL) {
        console.error(`[Email Simulado] PÂNICO! Paciente: ${payload.patientName}. Local: ${payload.latitude}, ${payload.longitude}. Notificar: ${payload.contactEmail}`);
        return;
    }
    const mapsLink = `https://www.google.com/maps?q=...{payload.latitude},${payload.longitude}`;
    const msg = {
        to: payload.contactEmail,
        from: SENDER_EMAIL,
        subject: `🚨 ALERTA DE PÂNICO: Ajuda necessária para ${payload.patientName} 🚨`,
        html: `<h1>ALERTA DE PÂNICO</h1><p>O paciente <strong>${payload.patientName}</strong> acionou o botão de pânico.</p><p>Localização: <a href="${mapsLink}">${mapsLink}</a></p>`,
    };
    try {
        await sgMail.send(msg);
        console.log(`[Email Service] E-mail de pânico enviado para ${payload.contactEmail}`);
    } catch (error) {
        console.error("Erro ao enviar e-mail pelo SendGrid:", error);
    }
};

export const sendPushNotification = async (fcmToken: string, title: string, body: string) => {
    const message = {
        notification: {
            title: title,
            body: body,  
        },
        token: fcmToken 
    };

    try {
        const response = await admin.messaging().send(message);
        console.log(`[FCM Service] Notificação Push enviada com sucesso para ${fcmToken}:`, response);
    } catch (error) {
        console.error(`Erro ao enviar FCM para ${fcmToken}:`, error);
        
    }
};