<<<<<<< HEAD
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
=======
import * as PanicEventModel from '../models/PanicEventModel';

export interface Coord {
  latitude: number;
  longitude: number;
}

export async function triggerPanic(db: any, userId: string, coords: Coord) {
  // Busca contatos de emergência associados ao usuário
  const contacts = await PanicEventModel.getEmergencyContactsForUser(db, userId);

  // Monta payload do evento
  const eventPayload = {
    userId,
    latitude: coords.latitude,
    longitude: coords.longitude,
    contacts,
    createdAt: new Date()
  };

  // Cria o registro do evento de pânico
  const event = await PanicEventModel.createPanicEvent(db, eventPayload);

  // Retorna o evento criado e os contatos para o controller usar na resposta
  return { event, contacts };
}
>>>>>>> d46311185f1e2c568922bcf8f6d646c9366a9123
