import { z } from 'zod';
import { AgendaEventType } from '../models/AgendaEventModel';

const validTypes: [AgendaEventType, ...AgendaEventType[]] = [
    'MEDICAMENTO', 'CONSULTA', 'SONO', 'HIDRATACAO', 'MEDITACAO', 'EVENTO', 'GERAL'
];

const stringToNumber = z.string().transform((val) => parseInt(val, 10));

export const createTemplateSchema = z.object({
    body: z.object({
        id_paciente: z.number(), 
        titulo: z.string().min(1),
        descricao: z.string().nullable().optional(),
        data_hora: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
        data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
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

export const createMonthlyNoteSchema = z.object({
    body: z.object({
        id_paciente: z.number(), 

        mes_referencia: z.string().regex(/^\d{4}-\d{2}$/, "O mês deve estar no formato YYYY-MM (ex: 2025-11)."),
        
        texto: z.string().min(1, "O texto da nota não pode estar vazio."),
    })
});