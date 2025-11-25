import { z } from 'zod';

export const addContactSchema = z.object({
    body: z.object({
        id_paciente: z.number(),
        id_contato: z.number(),
        whatsapp_numero: z.string().min(10),
    })
});

export const updateFcmTokenSchema = z.object({
    body: z.object({
        fcm_token: z.string().min(10),
    })
});

export const updateProfileSchema = z.object({
    body: z.object({
        name: z.string().min(2),
        is_patient: z.boolean(),
        is_emergency_contact: z.boolean(),
    })
});

export const searchUserSchema = z.object({
    query: z.object({
        email: z.string().email(),
    })
});