import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Acesso negado: Token não fornecido ou mal formatado.' });
    }

    const token = authHeader.split(' ')[1];

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Acesso negado: Token inválido ou expirado.' });
    }

    req.user = decoded;

    next();
};