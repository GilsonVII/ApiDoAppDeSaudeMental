import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error("ERRO FATAL: JWT_SECRET não definida no .env");
    process.exit(1);
}

export const generateToken = (userId: number): string => {

    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' }); 
};

export interface TokenPayload {
    id: number;
    iat: number;
    exp: number;
}

export const verifyToken = (token: string): TokenPayload | null => {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
        return decoded;
    } catch (error) {
        console.error("Erro ao verificar token:", error);
        return null; 
    }
};