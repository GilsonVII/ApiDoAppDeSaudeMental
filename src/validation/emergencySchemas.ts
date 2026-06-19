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

export const resolvePanicSchema = z.object({
    params: z.object({
        id: z.coerce.number({ message: "ID do incidente inválido." })
            .int("ID do incidente deve ser um inteiro.")
            .positive("ID do incidente deve ser positivo.")
    })
});
