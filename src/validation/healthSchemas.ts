import { z } from 'zod';

export const healthTelemetrySchema = z.object({
    type: z.enum(['BPM', 'FALL_DETECTION', 'OXYGEN', 'SLEEP_STATUS', 'STEP_COUNT'], {
        message: "Tipo de telemetria de saúde inválido."
    }),
    value: z.union([z.number(), z.string()]),
    isEmergency: z.boolean().default(false)
});

export type HealthTelemetryInput = z.infer<typeof healthTelemetrySchema>;
