import { z } from 'zod';

export const triggerPanicSchema = z.object({
    body: z.object({
        latitude: z.number({ message: "Latitude é obrigatória." }),
        longitude: z.number({ message: "Longitude é obrigatória." }),
        origem: z.enum(['MANUAL', 'SENSOR_GAS', 'QUEDA_WATCH', 'BPM_ALTO'], {
            message: "Origem do alerta inválida."
        }).optional()
    })
});
