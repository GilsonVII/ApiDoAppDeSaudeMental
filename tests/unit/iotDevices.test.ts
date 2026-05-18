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

describe('GET /v1/iot/devices - Integration', () => {

    it('deve retornar 200 com a lista de dispositivos', async () => {
        (iotBusiness.listDevices as jest.Mock).mockResolvedValue([
            { id_dispositivo: 'd1', nome: 'Sensor Gás', categoria: 'GAS', status_ativo: true },
        ]);

        const response = await request(app).get('/v1/iot/devices');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(iotBusiness.listDevices).toHaveBeenCalledWith(1);
    });

    it('deve retornar 500 em erro inesperado', async () => {
        (iotBusiness.listDevices as jest.Mock).mockRejectedValue(new Error('boom'));

        const response = await request(app).get('/v1/iot/devices');

        expect(response.status).toBe(500);
    });
});

describe('POST /v1/iot/devices - Integration', () => {

    it('deve retornar 201 ao cadastrar um dispositivo válido', async () => {
        (iotBusiness.registerDevice as jest.Mock).mockResolvedValue({
            deviceId: 'novo-1',
            status: 'created',
        });

        const response = await request(app)
            .post('/v1/iot/devices')
            .send({ id_dispositivo: 'novo-1', nome: 'Sensor Porta', categoria: 'PORTA' });

        expect(response.status).toBe(201);
        expect(response.body.deviceId).toBe('novo-1');
        expect(iotBusiness.registerDevice).toHaveBeenCalledWith(1, {
            id_dispositivo: 'novo-1',
            nome: 'Sensor Porta',
            categoria: 'PORTA',
        });
    });

    it('deve retornar 400 quando a categoria é inválida', async () => {
        const response = await request(app)
            .post('/v1/iot/devices')
            .send({ id_dispositivo: 'x', nome: 'Teste', categoria: 'CATEGORIA_ERRADA' });

        expect(response.status).toBe(400);
    });

    it('deve retornar 400 quando falta o nome', async () => {
        const response = await request(app)
            .post('/v1/iot/devices')
            .send({ id_dispositivo: 'x', categoria: 'GAS' });

        expect(response.status).toBe(400);
    });

    it('deve retornar 409 quando o dispositivo já existe (ConflictError)', async () => {
        const { ConflictError } = require('../../src/utils/errors');
        (iotBusiness.registerDevice as jest.Mock).mockRejectedValue(
            new ConflictError('Já existe um dispositivo cadastrado com este ID.')
        );

        const response = await request(app)
            .post('/v1/iot/devices')
            .send({ id_dispositivo: 'existente', nome: 'Teste', categoria: 'GAS' });

        expect(response.status).toBe(409);
    });
});

describe('PATCH /v1/iot/devices/:id_dispositivo - Integration', () => {

    it('deve retornar 200 ao atualizar o status do dispositivo', async () => {
        (iotBusiness.updateDevice as jest.Mock).mockResolvedValue({
            deviceId: 'd1',
            status: 'updated',
        });

        const response = await request(app)
            .patch('/v1/iot/devices/d1')
            .send({ status_ativo: false });

        expect(response.status).toBe(200);
        expect(iotBusiness.updateDevice).toHaveBeenCalledWith(1, 'd1', { status_ativo: false });
    });

    it('deve retornar 400 quando o body está vazio', async () => {
        const response = await request(app)
            .patch('/v1/iot/devices/d1')
            .send({});

        expect(response.status).toBe(400);
    });

    it('deve retornar 404 quando o dispositivo não existe', async () => {
        const { NotFoundError } = require('../../src/utils/errors');
        (iotBusiness.updateDevice as jest.Mock).mockRejectedValue(
            new NotFoundError('Dispositivo não encontrado.')
        );

        const response = await request(app)
            .patch('/v1/iot/devices/inexistente')
            .send({ status_ativo: true });

        expect(response.status).toBe(404);
    });

    it('deve retornar 403 quando o dispositivo é de outro usuário', async () => {
        const { ForbiddenError } = require('../../src/utils/errors');
        (iotBusiness.updateDevice as jest.Mock).mockRejectedValue(
            new ForbiddenError('Você não tem permissão para alterar este dispositivo.')
        );

        const response = await request(app)
            .patch('/v1/iot/devices/d1')
            .send({ nome: 'Tentando renomear' });

        expect(response.status).toBe(403);
    });
});
