<<<<<<< HEAD
export type AgendaEventType = 'MEDICAMENTO' | 'CONSULTA' | 'SONO' | 'HIDRATACAO' | 'MEDITACAO' | 'EVENTO' | 'GERAL';

export interface IAgendaEvent {
    id_evento: number;
    titulo: string;
    descricao?: string | null;
    data_hora: string; 
    data_inicio: string; 
    data_fim?: string | null; 
    tipo: AgendaEventType;
    id_paciente: number;
    id_criador: number;
}

export interface IAgendaOccurrence {
    id_ocorrencia: number;
    id_evento: number;
    usuario_id: number;
    data_ocorrencia: string; 
    status_concluido: boolean;
=======
export interface AgendaTemplateRecord {
  id: number;
  userId: string;
  title: string;
  description?: string;
  startAt: Date;
  durationMinutes?: number | null;
  recurrence?: any | null;
  createdAt: Date;
}

export async function createTemplate(db: any, data: AgendaTemplateRecord) {
  if (db && typeof db.collection === 'function') {
    const res = await db.collection('agenda_templates').insertOne({
      userId: data.userId,
      title: data.title,
      description: data.description || '',
      startAt: data.startAt,
      durationMinutes: data.durationMinutes,
      recurrence: data.recurrence || null,
      createdAt: data.createdAt || new Date()
    });
    const inserted = await db.collection('agenda_templates').findOne({ _id: res.insertedId });
    return { ...inserted, id: res.insertedId };
  }

  if (typeof db === 'function') {
    try {
      const insertData = {
        user_id: data.userId,
        title: data.title,
        description: data.description || '',
        start_at: (data.startAt instanceof Date) ? data.startAt.toISOString() : new Date(data.startAt).toISOString(),
        duration_minutes: data.durationMinutes,
        recurrence: data.recurrence ? JSON.stringify(data.recurrence) : null,
        created_at: data.createdAt ? data.createdAt.toISOString() : new Date().toISOString()
      };
      const returning = await db('agenda_templates').insert(insertData).returning('*');
      if (Array.isArray(returning) && returning.length > 0) return returning[0];
      const rows = await db('agenda_templates').where({ user_id: data.userId, title: data.title }).orderBy('created_at', 'desc').limit(1);
      return rows[0];
    } catch (err) {
      await db('agenda_templates').insert({
        user_id: data.userId,
        title: data.title,
        description: data.description || '',
        start_at: (data.startAt instanceof Date) ? data.startAt.toISOString() : new Date(data.startAt).toISOString(),
        duration_minutes: data.durationMinutes,
        recurrence: data.recurrence ? JSON.stringify(data.recurrence) : null,
        created_at: data.createdAt ? data.createdAt.toISOString() : new Date().toISOString()
      });
      const rows = await db('agenda_templates').where({ user_id: data.userId, title: data.title }).orderBy('created_at', 'desc').limit(1);
      return rows[0];
    }
  }

  return { ...data, id: null };
>>>>>>> d46311185f1e2c568922bcf8f6d646c9366a9123
}