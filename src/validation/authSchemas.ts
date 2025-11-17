import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email("Formato de e-mail inválido."),
        
        password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres."),
        
        name: z.string().min(2, "Nome é obrigatório."),
        
        is_patient: z.boolean().optional(),
        is_emergency_contact: z.boolean().optional(),
    })
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email("E-mail inválido."),
        password: z.string().min(1, "Senha é obrigatória."),
    })
});

export const resetPasswordSchema = z.object({
    body: z.object({
        email: z.string().email("Formato de e-mail inválido."),
        new_password: z.string().min(6, "Nova senha deve ter no mínimo 6 caracteres."),
    })
});