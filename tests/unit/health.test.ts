import request from 'supertest';
import express from 'express';

jest.mock('../../src/middlewares/authMiddleware', () => ({
    authMiddleware: (req: any, _res: any, next: any) => {
        req.user = { id: 1 };
        next();
    },
}));
jest.mock('../../src/business/healthBusiness');

import healthRouter from '../../src/routes/healthRoutes';
import * as healthBusiness from '../../src/business/healthBusiness';

const app = express();
app.use(express.json());
app.use('/v1/health', healthRouter);

describe('POST /v1/health/telemetry - Integration', () => {

    it('deve retornar 200 com dados de telemetria válidos', async () => {
        (healthBusiness.processHealthData as jest.Mock).mockResolvedValue({
            healthId: 11,
            status: 'processed',
        });

        const response = await request(app)
            .post('/v1/health/telemetry')
            .send({ type: 'BPM', value: 75, isEmergency: false });

        expect(response.status).toBe(200);
        expect(response.body.healthId).toBe(11);
        expect(healthBusiness.processHealthData).toHaveBeenCalledWith(1, {
            type: 'BPM',
            value: 75,
            isEmergency: false,
        });
    });

    it('deve aceitar value como string', async () => {
        (healthBusiness.processHealthData as jest.Mock).mockResolvedValue({
            healthId: 12,
            status: 'processed',
        });

        const response = await request(app)
            .post('/v1/health/telemetry')
            .send({ type: 'SLEEP_STATUS', value: 'DEEP', isEmergency: false });

        expect(response.status).toBe(200);
    });

    it('deve usar isEmergency como false por padrão', async () => {
        (healthBusiness.processHealthData as jest.Mock).mockResolvedValue({
            healthId: 13,
            status: 'processed',
        });

        const response = await request(app)
            .post('/v1/health/telemetry')
            .send({ type: 'STEP_COUNT', value: 1000 });

        expect(response.status).toBe(200);
        expect(healthBusiness.processHealthData).toHaveBeenCalledWith(
            1,
            expect.objectContaining({ isEmergency: false })
        );
    });

    it('deve retornar 400 quando type é inválido', async () => {
        const response = await request(app)
            .post('/v1/health/telemetry')
            .send({ type: 'TIPO_QUE_NAO_EXISTE', value: 100, isEmergency: false });

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/inválido/i);
    });

    it('deve retornar 400 quando value está faltando', async () => {
        const response = await request(app)
            .post('/v1/health/telemetry')
            .send({ type: 'BPM', isEmergency: false });

        expect(response.status).toBe(400);
    });

    it('deve retornar 500 em erro inesperado do business', async () => {
        (healthBusiness.processHealthData as jest.Mock).mockRejectedValue(new Error('boom'));

        const response = await request(app)
            .post('/v1/health/telemetry')
            .send({ type: 'BPM', value: 100, isEmergency: false });

        expect(response.status).toBe(500);
    });
});

describe('POST /v1/health/cancel-alert - Integration', () => {

    it('deve retornar 200 quando alerta foi cancelado com sucesso', async () => {
        (healthBusiness.cancelPendingAlert as jest.Mock).mockResolvedValue({
            success: true,
            message: 'Alerta cancelado com sucesso.',
        });

        const response = await request(app)
            .post('/v1/health/cancel-alert')
            .send({});

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(healthBusiness.cancelPendingAlert).toHaveBeenCalledWith(1);
    });

    it('deve retornar 404 quando não há alerta pendente para cancelar', async () => {
        (healthBusiness.cancelPendingAlert as jest.Mock).mockResolvedValue({
            success: false,
            message: 'Nenhum alerta pendente encontrado.',
        });

        const response = await request(app)
            .post('/v1/health/cancel-alert')
            .send({});

        expect(response.status).toBe(404);
        expect(response.body.success).toBe(false);
    });

    it('deve retornar 500 em erro inesperado', async () => {
        (healthBusiness.cancelPendingAlert as jest.Mock).mockRejectedValue(new Error('boom'));

        const response = await request(app)
            .post('/v1/health/cancel-alert')
            .send({});

        expect(response.status).toBe(500);
    });
});
