<<<<<<< HEAD
import * as agendaRepository from '../database/repositories/agendaRepository';
import { IAgendaEvent, AgendaEventType } from '../models/AgendaEventModel';

export interface AgendaTemplatePayload {
    id_paciente: number;
    titulo: string;
    descricao?: string;
    data_hora: string;
    data_inicio: string; 
    data_fim?: string | null; 
    tipo: AgendaEventType;
}

export const createAgendaTemplate = async (creatorId: number, payload: AgendaTemplatePayload): Promise<number | null> => {

    if (!payload || !payload.titulo || !payload.id_paciente || !payload.data_hora || !payload.data_inicio || !payload.tipo) {
        throw new Error('Dados inválidos: Faltam campos obrigatórios para criar o template.');
    }

    const templateToSave: Omit<IAgendaEvent, 'id_evento'> = {
        titulo: payload.titulo,
        descricao: payload.descricao || null,
        data_hora: payload.data_hora,
        data_inicio: payload.data_inicio,
        data_fim: payload.data_fim || null,
        tipo: payload.tipo,
        id_paciente: payload.id_paciente,
        id_criador: creatorId,
    };

    return agendaRepository.createAgendaTemplate(templateToSave);
};
=======
import * as AgendaEventModel from '../models/AgendaEventModel';

export interface AgendaTemplatePayload {
  title: string;
  description?: string;
  startAt: string | Date;
  durationMinutes?: number;
  recurrence?: any;
  [key: string]: any;
}

export async function createAgendaTemplate(db: any, userId: string, payload: AgendaTemplatePayload) {
  if (!payload || !payload.title) throw new Error('Invalid: title is required');
  if (!payload.startAt) throw new Error('Invalid: startAt is required');

  const templateToSave = {
    userId,
    title: payload.title,
    description: payload.description || '',
    startAt: (typeof payload.startAt === 'string') ? new Date(payload.startAt) : payload.startAt,
    durationMinutes: payload.durationMinutes || null,
    recurrence: payload.recurrence || null,
    createdAt: new Date()
  };

  const template = await AgendaEventModel.createTemplate(db, templateToSave);
  return template;
}
>>>>>>> d46311185f1e2c568922bcf8f6d646c9366a9123
