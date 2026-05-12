import { z } from 'zod';

export const addContactSchema = z.object({
    body: z.object({
        id_contato: z.number({ message: "ID do contato é obrigatório." }),
        whatsapp_numero: z.string().min(10, "Número de WhatsApp inválido."),
        nivel_permissao: z.enum(['TOTAL', 'MODERADO', 'SOMENTE_EMERGENCIA'], {
            message: "Nível de permissão inválido."
        }).default('SOMENTE_EMERGENCIA')
    })
});

export const updateFcmTokenSchema = z.object({
    body: z.object({
        fcm_token: z.string().min(10, "Token FCM inválido.")
    })
});

export const updateProfileSchema = z.object({
    body: z.object({
        nome: z.string().min(2, "Nome deve ter no mínimo 2 caracteres.").optional(),
        is_paciente: z.boolean().optional(),
        is_contato_emergencia: z.boolean().optional(),
        genero: z.enum(['MASCULINO', 'FEMININO', 'OUTRO', 'NAO_INFORMADO'], {
            message: "Gênero inválido."
        }).optional(),
       
        settings_json: z.record(z.string(), z.any()).optional()
    })
}).refine((data: any) => Object.keys(data.body || {}).length > 0, {
    message: "Nenhum dado enviado para atualização."
});

export const searchUserSchema = z.object({
    query: z.object({
        email: z.string().email("Formato de e-mail inválido.")
    })
});
