import request from 'supertest';
import express from 'express';

jest.mock('../../src/middlewares/authMiddleware', () => ({
    authMiddleware: (req: any, _res: any, next: any) => {
        req.user = { id: 1 };
        next();
    },
}));
jest.mock('../../src/business/statsBusiness');
jest.mock('../../src/business/userBusiness');

import userRouter from '../../src/routes/userRoutes';
import * as statsBusiness from '../../src/business/statsBusiness';

const app = express();
app.use(express.json());
app.use('/v1/users', userRouter);

describe('GET /v1/users/me/status - Integration', () => {

    it('deve retornar 200 com o status do usuário logado', async () => {
        (statsBusiness.getUserStatus as jest.Mock).mockResolvedValue({
            status: 'Estável',
            consistencia_rotina: 80,
            dias_estabilidade: 62,
        });

        const response = await request(app).get('/v1/users/me/status');

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('Estável');
        // Usa o próprio id do usuário logado nas duas posições
        expect(statsBusiness.getUserStatus).toHaveBeenCalledWith(1, 1);
    });

    it('deve retornar 500 em erro inesperado', async () => {
        (statsBusiness.getUserStatus as jest.Mock).mockRejectedValue(new Error('boom'));

        const response = await request(app).get('/v1/users/me/status');

        expect(response.status).toBe(500);
    });
});
