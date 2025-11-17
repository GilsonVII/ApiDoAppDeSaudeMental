import { Request, Response } from 'express';
import * as authBusiness from '../../business/authBusiness';
import { AppError } from '../../utils/errors';
import { registerSchema, loginSchema, resetPasswordSchema } from '../../validation/authSchemas';

export const handleRegister = async (req: Request, res: Response) => {
    try {
        const validation = registerSchema.safeParse({ body: req.body });
        if (!validation.success) {
            return res.status(400).json({ 
                error: "Dados de entrada inválidos.",
                details: validation.error.flatten().fieldErrors 
            });
        }
        
        const { email, password, name, is_patient, is_emergency_contact } = validation.data.body;
        
        const userId = await authBusiness.registerNewUser({ email, password, name, is_patient, is_emergency_contact });
        return res.status(201).json({ message: "Usuário registrado com sucesso.", userId });

    } catch (error: any) {
        console.error("Erro no controller de registro:", error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao registrar usuário.' });
    }
};

export const handleLogin = async (req: Request, res: Response) => {
    try {
        const validation = loginSchema.safeParse({ body: req.body });
        if (!validation.success) {
            return res.status(400).json({ 
                error: "Dados de entrada inválidos.",
                details: validation.error.flatten().fieldErrors 
            });
        }
        
        const { email, password } = validation.data.body;
        
        const token = await authBusiness.authenticateUser(email, password);
        return res.status(200).json({ token });

    } catch (error: any) {
        console.error("Erro no controller de login:", error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao tentar fazer login.' });
    }
};

export const handlePasswordReset = async (req: Request, res: Response) => {
    try {
        const validation = resetPasswordSchema.safeParse({ body: req.body });
        if (!validation.success) {
            return res.status(400).json({ 
                error: "Dados de entrada inválidos.",
                details: validation.error.flatten().fieldErrors 
            });
        }
        
        const { email, new_password } = validation.data.body;
        
        await authBusiness.resetPassword(email, new_password);
        return res.status(200).json({ message: 'Senha redefinida com sucesso.' });

    } catch (error: any) {
        console.error("Erro no controller de redefinir senha:", error);
        if (error instanceof AppError) {
            return res.status(error.statusCode).json({ error: error.message });
        }
        return res.status(500).json({ error: 'Erro interno ao redefinir senha.' });
    }
};