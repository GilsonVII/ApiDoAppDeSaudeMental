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
