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