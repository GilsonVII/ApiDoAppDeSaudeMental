import request from 'supertest';
import express from 'express';

jest.mock('../../src/middlewares/authMiddleware', () => ({
    authMiddleware: (req: any, _res: any, next: any) => {
        req.user = { id: 1 };
        next();
    },
}));
jest.mock('../../src/business/iotBusiness');

import iotRouter from '../../src/routes/iotRoutes';
import * as iotBusiness from '../../src/business/iotBusiness';

const app = express();
app.use(express.json());
app.use('/v1/iot', iotRouter);

describe('POST /v1/iot/telemetry - Integration', () => {

    it('deve retornar 200 com telemetria válida', async () => {
        (iotBusiness.processTelemetry as jest.Mock).mockResolvedValue({
            telemetryId: 21,
            status: 'processed',
        });

        const response = await request(app)
            .post('/v1/iot/telemetry')
            .send({ deviceId: 'dev-1', sensorType: 'MOTION', value: 1 });

        expect(response.status).toBe(200);
        expect(response.body.telemetryId).toBe(21);
        expect(iotBusiness.processTelemetry).toHaveBeenCalledWith(1, {
            deviceId: 'dev-1',
            sensorType: 'MOTION',
            value: 1,
        });
    });

    it('deve aceitar value como string (ex: DOOR_STATUS = "OPEN")', async () => {
        (iotBusiness.processTelemetry as jest.Mock).mockResolvedValue({
            telemetryId: 22,
            status: 'processed',
        });

        const response = await request(app)
            .post('/v1/iot/telemetry')
            .send({ deviceId: 'porta-1', sensorType: 'DOOR_STATUS', value: 'OPEN' });

        expect(response.status).toBe(200);
    });

    it('deve aceitar campo unit opcional', async () => {
        (iotBusiness.processTelemetry as jest.Mock).mockResolvedValue({
            telemetryId: 23,
            status: 'processed',
        });

        const response = await request(app)
            .post('/v1/iot/telemetry')
            .send({ deviceId: 'gas-1', sensorType: 'GAS_LEVEL', value: 250, unit: 'ppm' });

        expect(response.status).toBe(200);
    });

    it('deve retornar 400 quando deviceId está faltando', async () => {
        const response = await request(app)
            .post('/v1/iot/telemetry')
            .send({ sensorType: 'MOTION', value: 1 });

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/inválido/i);
    });

    it('deve retornar 400 quando sensorType é inválido', async () => {
        const response = await request(app)
            .post('/v1/iot/telemetry')
            .send({ deviceId: 'dev-1', sensorType: 'SENSOR_INEXISTENTE', value: 1 });

        expect(response.status).toBe(400);
    });

    it('deve retornar 400 quando value está faltando', async () => {
        const response = await request(app)
            .post('/v1/iot/telemetry')
            .send({ deviceId: 'dev-1', sensorType: 'MOTION' });

        expect(response.status).toBe(400);
    });

    it('deve retornar 500 em erro inesperado do business', async () => {
        (iotBusiness.processTelemetry as jest.Mock).mockRejectedValue(new Error('boom'));

        const response = await request(app)
            .post('/v1/iot/telemetry')
            .send({ deviceId: 'dev-1', sensorType: 'MOTION', value: 1 });

        expect(response.status).toBe(500);
    });
});
