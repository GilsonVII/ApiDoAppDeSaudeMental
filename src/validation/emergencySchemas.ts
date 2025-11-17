import { z } from 'zod';

export const triggerPanicSchema = z.object({
    body: z.object({
        latitude: z.number(),
        longitude: z.number(),
    })
});