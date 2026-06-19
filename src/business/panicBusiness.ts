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

    // NOTA: a tabela USUARIO ainda nao tem coluna de telefone. O campo abaixo
    // fica vazio por enquanto (a PanicAlertScreen esconde o botao "Ligar" quando
    // nao ha telefone). Quando adicionarem telefone ao cadastro, basta popular aqui.
    const telefonePaciente = (patient as any).telefone ?? '';

    // data payload do FCM — TODO valor precisa ser string.
    // O app le isso no toque da notificacao e abre a PanicAlertScreen.
    const dataPayload: Record<string, string> = {
        tipo: 'PANIC',
        eventId: String(eventId ?? ''),
        usuarioId: String(userId),
        pacienteNome: patient.nome ?? '',
        origem: origem,
        latitude: String(coords.latitude ?? ''),
        longitude: String(coords.longitude ?? ''),
        telefone: telefonePaciente ? String(telefonePaciente) : '',
        timestamp: new Date().toISOString(),
    };

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

            await sendPushNotification(contact.fcm_token, titulo, corpo, dataPayload);

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

// ============================================================
// Caminho B - lado do CONTATO/cuidador
// ============================================================

export const getIncomingPanics = async (contactUserId: number, somenteAtivos = true) => {
    return panicRepository.getIncomingPanics(contactUserId, somenteAtivos);
};

export const resolvePanic = async (loggedInUserId: number, eventId: number) => {
    const ownerId = await panicRepository.getPanicOwner(eventId);

    if (ownerId === null) {
        throw new NotFoundError('Incidente de pânico não encontrado.');
    }

    const isOwner = ownerId === loggedInUserId;
    const isContact = isOwner
        ? true
        : await panicRepository.isContactOfPatient(loggedInUserId, ownerId);

    if (!isContact) {
        throw new ForbiddenError('Você não tem permissão para resolver este incidente.');
    }

    const updated = await panicRepository.resolvePanic(eventId, loggedInUserId);
    if (!updated) {
        throw new NotFoundError('Incidente de pânico não encontrado.');
    }

    Logger.info(`[panicBusiness] Incidente ${eventId} resolvido por usuário ${loggedInUserId}.`);
    return { resolved: true };
};
