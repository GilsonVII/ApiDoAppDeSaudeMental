import { z } from 'zod';
import { AgendaEventType } from '../models/AgendaEventModel';

const validTypes: [AgendaEventType, ...AgendaEventType[]] = [
    'MEDICAMENTO', 'CONSULTA', 'SONO', 'HIDRATACAO', 'MEDITACAO', 'EVENTO', 'GERAL'
];

const stringToNumber = z.string().transform((val, ctx) => {
    const parsed = parseInt(val);
    if (isNaN(parsed)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "ID deve ser um número." });
        return z.NEVER;
    }
    return parsed;
});

export const createTemplateSchema = z.object({
    body: z.object({
        id_paciente: z.number(),
        titulo: z.string().min(1, "Título é obrigatório."),
        descricao: z.string().optional().nullable(),
        data_hora: z.string().regex(/^\d{2}:\d{2}:\d{2}$/, "Formato de data_hora deve ser HH:MM:SS"),
        data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data_inicio deve ser YYYY-MM-DD"),
        data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data_fim deve ser YYYY-MM-DD").optional().nullable(),
        tipo: z.enum(validTypes),
    })
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
        status_concluido: z.boolean(),
    })
});