import { z } from 'zod';

export const addContactSchema = z.object({
    body: z.object({
        id_paciente: z.number(),
        id_contato: z.number(),
        whatsapp_numero: z.string().min(10, "Número de WhatsApp inválido."),
    })
});

export const updateFcmTokenSchema = z.object({
    body: z.object({
        fcm_token: z.string().min(10, "Token FCM parece inválido."),
    })
});

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
        is_patient: z.boolean(),
        is_emergency_contact: z.boolean(),
    })
});

export const searchUserSchema = z.object({
    query: z.object({
        email: z.string().email("Formato de e-mail inválido."),
    })
});