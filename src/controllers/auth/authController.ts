import { Request, Response } from 'express';
import * as authBusiness from '../../business/authBusiness';


export const handleRegister = async (req: Request, res: Response) => {
    try {
        const { email, password, name, is_patient, is_emergency_contact } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Campos obrigatórios: email, password, name.' });
        }
        const userId = await authBusiness.registerNewUser({ email, password, name, is_patient, is_emergency_contact });
        return res.status(201).json({ message: "Usuário registrado com sucesso.", userId });
    } catch (error: any) {
        console.error("Erro no controller de registro:", error);
        if (error.message.includes('E-mail já cadastrado')) {
            return res.status(409).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
    }
};

export const handleLogin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Campos obrigatórios: email, password.' });
        }
        const token = await authBusiness.authenticateUser(email, password);
        if (!token) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }
        return res.status(200).json({ token });
    } catch (error: any) {
        console.error("Erro no controller de login:", error);
        return res.status(500).json({ error: 'Erro interno ao tentar fazer login.' });
    }
};