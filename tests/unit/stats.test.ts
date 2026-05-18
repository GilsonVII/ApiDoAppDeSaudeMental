import request from 'supertest';
import express from 'express';

jest.mock('../../src/middlewares/authMiddleware', () => ({
    authMiddleware: (req: any, _res: any, next: any) => {
        req.user = { id: 1 };
        next();
    },
}));
jest.mock('../../src/business/statsBusiness');

import statsRouter from '../../src/routes/statsRoutes';
import * as statsBusiness from '../../src/business/statsBusiness';

const app = express();
app.use(express.json());
app.use('/v1/stats', statsRouter);

describe('GET /v1/stats/:id_paciente - Integration', () => {

    it('deve retornar 200 com as estatísticas do paciente', async () => {
        (statsBusiness.getUserStats as jest.Mock).mockResolvedValue({
            consistencia_rotina: 65,
            metas_concluidas_semana: 13,
            metas_totais_semana: 20,
            dias_estabilidade: 62,
            ultimo_alerta_critico: null,
            mensagem_motivacional: 'Muito bem, mas ha muito trabalho pela frente.',
        });

        const response = await request(app).get('/v1/stats/5');

        expect(response.status).toBe(200);
        expect(response.body.consistencia_rotina).toBe(65);
        expect(response.body.dias_estabilidade).toBe(62);
        expect(statsBusiness.getUserStats).toHaveBeenCalledWith(1, 5);
    });

    it('deve retornar 400 quando o id_paciente não é um número', async () => {
        const response = await request(app).get('/v1/stats/abc');

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/inválido/i);
    });

    it('deve retornar 403 quando o business lança ForbiddenError', async () => {
        const { ForbiddenError } = require('../../src/utils/errors');
        (statsBusiness.getUserStats as jest.Mock).mockRejectedValue(
            new ForbiddenError('Permissao negada para ver as estatisticas deste usuario.')
        );

        const response = await request(app).get('/v1/stats/5');

        expect(response.status).toBe(403);
    });

    it('deve retornar 404 quando o paciente não existe', async () => {
        const { NotFoundError } = require('../../src/utils/errors');
        (statsBusiness.getUserStats as jest.Mock).mockRejectedValue(
            new NotFoundError('Paciente nao encontrado.')
        );

        const response = await request(app).get('/v1/stats/999');

        expect(response.status).toBe(404);
    });

    it('deve retornar 500 em erro inesperado', async () => {
        (statsBusiness.getUserStats as jest.Mock).mockRejectedValue(new Error('boom'));

        const response = await request(app).get('/v1/stats/5');

        expect(response.status).toBe(500);
    });
});
