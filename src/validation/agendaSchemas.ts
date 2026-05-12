import { z } from 'zod';

const stringToNumber = z.string().transform((val: string, ctx: z.RefinementCtx) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "ID deve ser um número válido." });
        return z.NEVER;
    }
    return parsed;
});

export const createTemplateSchema = z.object({
    body: z.object({
       
        id_paciente: z.number({ message: "ID do paciente é obrigatório e deve ser um número." }), 
        titulo: z.string().min(1, "Título é obrigatório."),
        descricao: z.string().nullable().optional(),
        data_hora: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Formato de hora inválido. Use HH:MM ou HH:MM:SS"),
        data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido. Use YYYY-MM-DD"),
        data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido. Use YYYY-MM-DD").nullable().optional(),
        
        tipo: z.enum(['MEDICAMENTO', 'CONSULTA', 'SONO', 'HIDRATACAO', 'MEDITACAO', 'EVENTO', 'GERAL'], {
            message: "Tipo de evento inválido ou ausente."
        }),
    })
});

export const updateTemplateSchema = z.object({
    params: z.object({
        id_evento: stringToNumber,
    }),
    body: z.object({
        titulo: z.string().min(1, "O título não pode ser vazio.").optional(),
        descricao: z.string().nullable().optional(),
        data_hora: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, "Hora inválida.").optional(),
        data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida.").nullable().optional(),
    })
}).refine((data: any) => Object.keys(data.body || {}).length > 0, {
    message: "Pelo menos um campo deve ser enviado para atualização."
});

export const listOccurrencesSchema = z.object({
    params: z.object({
        id_paciente: stringToNumber,
    })
});

export const updateStatusSchema = z.object({
    params: z.object({
        id_ocorrencia: stringToNumber,
    }),
    body: z.object({
        status_concluido: z.boolean({ message: "status_concluido é obrigatório e deve ser um booleano." }),
    })
});

export const createMonthlyNoteSchema = z.object({
    body: z.object({
        id_paciente: z.number({ message: "ID do paciente é obrigatório e deve ser um número." }),
        mes_referencia: z.string().regex(/^\d{4}-\d{2}$/, "O mês deve estar no formato YYYY-MM (ex: 2026-05)."),
        texto: z.string().min(1, "O texto da nota não pode estar vazio."),
    })
});
