import * as panicRepository from '../database/repositories/panicRepository';
import * as userRepository from '../database/repositories/userRepository'; 
import { sendPanicEmail } from '../utils/notificationService'; 
import * as contactRepository from '../database/repositories/contactRepository';
import { Logger } from '../utils/logger';
import { ForbiddenError, NotFoundError } from '../utils/errors';
 
export interface Coord {
    latitude: number;
    longitude: number;
}
 
export const triggerPanic = async (userId: number, coords: Coord) => {
    
    const patient = await userRepository.findUserById(userId);
    if (!patient) {
        throw new NotFoundError('Usuário (paciente) que acionou o pânico não foi encontrado.');
    }
 
    const contacts = await panicRepository.getEmergencyContactsData(userId);
 
    const eventPayload = {
        usuario_id: userId,
        latitude: coords.latitude,
        longitude: coords.longitude,
    };

    const eventId = await panicRepository.createPanicLog(eventPayload);
 
    Logger.info(`[panicBusiness] Pânico acionado por ${patient.name}. Notificando ${contacts.length} contatos...`);
 
    for (const contact of contacts) {
        await sendPanicEmail({
            contactEmail: contact.email,
            contactName: contact.nome || 'Contato', 
            patientName: patient.name,
            latitude: coords.latitude,
            longitude: coords.longitude
        });
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