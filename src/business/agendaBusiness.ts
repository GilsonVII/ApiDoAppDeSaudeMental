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