import { z } from 'zod';

export const telemetrySchema = z.object({
    deviceId: z.string({ message: "ID do dispositivo é obrigatório." }),
    sensorType: z.enum(['GAS_LEVEL', 'LUMINOSITY', 'NOISE_DB', 'DOOR_STATUS', 'MOTION'], {
        message: "Tipo de sensor inválido."
    }),
    value: z.union([z.number(), z.string()]),
    unit: z.string().optional(),
});

export type TelemetryInput = z.infer<typeof telemetrySchema>;

export const createDeviceSchema = z.object({
    body: z.object({
        id_dispositivo: z.string().min(1, "ID do dispositivo é obrigatório."),
        nome: z.string().min(1, "Nome do dispositivo é obrigatório."),
        categoria: z.enum(['GAS', 'LUMINOSIDADE', 'RUIDO', 'PORTA', 'MOVIMENTO', 'LUZ_RGB'], {
            message: "Categoria de dispositivo inválida."
        }),
        status_ativo: z.boolean().optional(),
    })
});

export const updateDeviceSchema = z.object({
    body: z.object({
        nome: z.string().min(1, "O nome não pode ser vazio.").optional(),
        status_ativo: z.boolean().optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: "Pelo menos um campo (nome ou status_ativo) deve ser enviado."
    })
});

export type CreateDeviceInput = z.infer<typeof createDeviceSchema>['body'];
export type UpdateDeviceInput = z.infer<typeof updateDeviceSchema>['body'];
