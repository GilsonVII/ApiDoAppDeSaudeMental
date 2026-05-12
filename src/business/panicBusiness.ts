import * as panicRepository from '../database/repositories/panicRepository';
import * as userRepository from '../database/repositories/userRepository'; 
import { sendPushNotification } from '../utils/notificationService';
import * as contactRepository from '../database/repositories/contactRepository';
import { Logger } from '../utils/logger';
import { ForbiddenError, NotFoundError } from '../utils/errors';
import { OrigemPanico } from '../models/PanicEventModel';

export interface Coord {
    latitude: number;
    longitude: number;
}

export const triggerPanic = async (userId: number, coords: Coord, origem: OrigemPanico = 'MANUAL') => {
    
    const patient = await userRepository.findUserById(userId);
    if (!patient) {
        throw new NotFoundError('Usuário (paciente) que acionou o pânico não foi encontrado.');
    }

    const contacts = await panicRepository.getEmergencyContactsData(userId);

    const eventPayload = {
        usuario_id: userId,
        latitude: coords.latitude,
        longitude: coords.longitude,
        origem: origem 
    };

    const eventId = await panicRepository.createPanicLog(eventPayload);

    Logger.info(`[panicBusiness] Pânico (${origem}) acionado por ${patient.nome}. Notificando ${contacts.length} contatos...`);

    for (const contact of contacts) {
        if (contact.fcm_token) {
            
            let titulo = `🚨 ALERTA DE PÂNICO: ${patient.nome} 🚨`;
            let corpo = `Precisa de ajuda imediata! Acesse o app para ver a localização.`;

            if (origem === 'SENSOR_GAS') {
                titulo = `🔥 ALERTA CRÍTICO: GÁS/FUMAÇA 🔥`;
                corpo = `Possível vazamento na casa de ${patient.nome}. Verifique imediatamente!`;
            } else if (origem === 'QUEDA_WATCH') {
                titulo = `⚠️ ALERTA DE QUEDA ⚠️`;
                corpo = `O smartwatch de ${patient.nome} detectou uma queda. Acesse o app para detalhes.`;
            } else if (origem === 'BPM_ALTO') {
                titulo = `💓 ALERTA CARDÍACO 💓`;
                corpo = `Batimentos cardíacos críticos detectados para ${patient.nome}. Verifique agora.`;
            }

            await sendPushNotification(contact.fcm_token, titulo, corpo);
            
        } else {
            Logger.warn(`[panicBusiness] Contato ${contact.email} não possui fcm_token. Notificação ignorada.`);
        }
    }

    return { eventId, contacts };
};

export const getPanicLogs = async (loggedInUserId: number, patientId: number) => {
    const contacts = await contactRepository.findContactsByPatientId(patientId);
    const isAllowed = contacts.some(contact => contact.id_contato === loggedInUserId) || loggedInUserId === patientId;

    if (!isAllowed) {
        throw new ForbiddenError('Permissão negada para ver logs de pânico.');
    }
    
    return panicRepository.getPanicLogsByUserId(patientId);
};