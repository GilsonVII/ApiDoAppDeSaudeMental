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
    console.warn("Aviso: Chaves do SendGrid (API ou Email) não definidas no .env. E-mails de pânico serão simulados.");
}

interface PanicEmailPayload {
    contactEmail: string;
    contactName: string;
    patientName: string;
    latitude: number;
    longitude: number;
}

export const sendPanicEmail = async (payload: PanicEmailPayload) => {
    
    
    if (!API_KEY || !SENDER_EMAIL) {
        console.error(`[Email Simulado] PÂNICO! Paciente: ${payload.patientName}. Local: ${payload.latitude}, ${payload.longitude}. Notificar: ${payload.contactEmail}`);
        return;
    }
    
    const mapsLink = `https://www.google.com/maps?q=${payload.latitude},${payload.longitude}`;

    const msg = {
        to: payload.contactEmail,
        from: {
            name: 'AlertaMente App', 
            
            email: SENDER_EMAIL,    
        },
        subject: `🚨 ALERTA DE PÂNICO: Ajuda necessária para ${payload.patientName} 🚨`,
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>ALERTA DE PÂNICO</h2>
                <p>Olá, ${payload.contactName},</p>
                <p>O paciente <strong>${payload.patientName}</strong> acionou o botão de pânico pelo App AlertaMente.</p>
                <p>A localização registrada é:</p>
                <ul>
                    <li><strong>Latitude:</strong> ${payload.latitude}</li>
                    <li><strong>Longitude:</strong> ${payload.longitude}</li>
                </ul>
                <p style="background-color: #f4f4f4; padding: 10px;">
                    <strong><a href="${mapsLink}">Clique aqui para ver a localização no Google Maps</a></strong>
                </p>
                <br>
                <p>Por favor, entre em contato com o paciente ou serviços de emergência imediatamente.</p>
                <small>AlertaMente App</small>
            </div>
        `,
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