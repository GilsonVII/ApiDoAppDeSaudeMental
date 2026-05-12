import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { Logger } from '../utils/logger';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        Logger.warn(`[authMiddleware] Tentativa de acesso sem token na rota: ${req.originalUrl}`);
        return res.status(401).json({ error: 'Acesso negado: Token não fornecido ou mal formatado.' });
    }

    const token = authHeader.split(' ')[1];
    
    const decoded = verifyToken(token);

    if (!decoded) {
        Logger.warn(`[authMiddleware] Token inválido ou expirado na rota: ${req.originalUrl}`);
        return res.status(401).json({ error: 'Acesso negado: Token inválido ou expirado.' });
    }

    req.user = decoded;

    next();
};
