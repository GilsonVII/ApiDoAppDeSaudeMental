import * as panicRepository from '../database/repositories/panicRepository';

export interface Coord {
    latitude: number;
    longitude: number;
}


export const triggerPanic = async (userId: number, coords: Coord) => {

    const contacts = await panicRepository.getEmergencyContacts(userId);

    const eventPayload = {
        usuario_id: userId,
        latitude: coords.latitude,
        longitude: coords.longitude,
    };

    const eventId = await panicRepository.createPanicLog(eventPayload);

    console.log(`[panicBusiness] Pânico acionado por ${userId}. Notificar contatos:`, contacts);

    return { eventId, contacts };
};