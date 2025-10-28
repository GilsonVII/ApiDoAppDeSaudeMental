import { Request, Response } from 'express';
import * as agendaBusiness from '../business/agendaBusiness';

export async function createAgendaTemplate(req: Request, res: Response) {
  try {
    const db = req.app.locals.db;
    const userId = (req as any).user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized: user missing in request' });

    const payload = req.body;
    const template = await agendaBusiness.createAgendaTemplate(db, userId, payload);

    return res.status(201).json({ success: true, template });
  } catch (err: any) {
    console.error('createAgendaTemplate error', err);
    if (err.message && err.message.includes('Invalid')) {
      return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}