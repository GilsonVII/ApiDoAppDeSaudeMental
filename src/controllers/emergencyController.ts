import { Request, Response } from 'express';
import * as panicBusiness from '../business/panicBusiness';

export async function triggerPanic(req: Request, res: Response) {
  try {
    const db = req.app.locals.db;
    const userId = (req as any).user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized: user missing in request' });

    const { latitude, longitude } = req.body;
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ error: 'Invalid or missing latitude/longitude' });
    }

    const result = await panicBusiness.triggerPanic(db, userId, { latitude, longitude });

    return res.status(201).json({ success: true, event: result.event, contacts: result.contacts });
  } catch (err: any) {
    console.error('triggerPanic error', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}