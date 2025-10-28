import { Request, Response } from 'express';
import * as userBusiness from '../business/userBusiness';

export async function getMyProfile(req: Request, res: Response) {
  try {
    const db = req.app.locals.db;
    const userId = (req as any).user?.id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized: user missing in request' });

    const profile = await userBusiness.getProfile(db, userId);
    return res.status(200).json({ user: profile });
  } catch (err: any) {
    console.error('getMyProfile error', err);
    return res.status(500).json({ error: err.message || 'Internal server error' });
  }
}