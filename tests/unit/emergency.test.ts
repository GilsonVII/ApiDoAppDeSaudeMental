import request from 'supertest';
import express from 'express';

// IMPORTANTE: Mocks devem vir ANTES dos imports da app
jest.mock('../../src/middlewares/authMiddleware', () => ({
    authMiddleware: (req: any, _res: any, next: any) => {
        req.user = { id: 1 }; // simula usuário autenticado
        next();
    },
}));
jest.mock('../../src/business/panicBusiness');

import emergencyRouter from '../../src/routes/emergencyRoutes';
import * as panicBusiness from '../../src/business/panicBusiness';

const app = express();
app.use(express.json());
app.use('/v1', emergencyRouter);

describe('POST /v1/panic/trigger - Integration', () => {

    it('deve retornar 201 ao acionar pânico com dados válidos', async () => {
        (panicBusiness.triggerPanic as jest.Mock).mockResolvedValue({
            eventId: 99,
            contacts: [{ email: 'a@a.com' }, { email: 'b@b.com' }],
        });

        const response = await request(app)
            .post('/v1/panic/trigger')
            .send({ latitude: -20.5, longitude: -42.3, origem: 'MANUAL' });

        expect(response.status).toBe(201);
        expect(response.body.eventId).toBe(99);
        expect(response.body.notifiedContactsCount).toBe(2);
        expect(panicBusiness.triggerPanic).toHaveBeenCalledWith(
            1,
            { latitude: -20.5, longitude: -42.3 },
            'MANUAL'
        );
    });

    it('deve usar origem MANUAL como padrão se não informada', async () => {
        (panicBusiness.triggerPanic as jest.Mock).mockResolvedValue({
            eventId: 100,
            contacts: [],
        });

        const response = await request(app)
            .post('/v1/panic/trigger')
            .send({ latitude: 0, longitude: 0 });

        expect(response.status).toBe(201);
        expect(panicBusiness.triggerPanic).toHaveBeenCalledWith(
            1,
            { latitude: 0, longitude: 0 },
            'MANUAL'
        );
    });

    it('deve retornar 400 quando latitude está faltando', async () => {
        const response = await request(app)
            .post('/v1/panic/trigger')
            .send({ longitude: -42.3 });

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/inválidos/i);
    });

    it('deve retornar 400 quando origem é um valor inválido', async () => {
        const response = await request(app)
            .post('/v1/panic/trigger')
            .send({ latitude: 0, longitude: 0, origem: 'INVALIDO' });

        expect(response.status).toBe(400);
    });

    it('deve retornar 500 quando o business lança erro desconhecido', async () => {
        (panicBusiness.triggerPanic as jest.Mock).mockRejectedValue(new Error('Erro inesperado'));

        const response = await request(app)
            .post('/v1/panic/trigger')
            .send({ latitude: 0, longitude: 0 });

        expect(response.status).toBe(500);
    });

    it('deve retornar 404 quando o business lança NotFoundError', async () => {
        const { NotFoundError } = require('../../src/utils/errors');
        (panicBusiness.triggerPanic as jest.Mock).mockRejectedValue(
            new NotFoundError('Usuário não encontrado')
        );

        const response = await request(app)
            .post('/v1/panic/trigger')
            .send({ latitude: 0, longitude: 0 });

        expect(response.status).toBe(404);
        expect(response.body.error).toMatch(/não encontrado/i);
    });
});
