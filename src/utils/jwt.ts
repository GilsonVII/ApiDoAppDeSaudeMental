import * as jwt from 'jsonwebtoken';
import { Logger } from './logger';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
    Logger.error("ERRO FATAL: JWT_SECRET não definida no .env");
    process.exit(1);
}

export interface TokenPayload {
    id: number;
}

export const generateToken = (userId: number): string => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        Logger.error("Erro ao verificar token:", error);
        return null;
    }
};
