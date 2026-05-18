import request from 'supertest';
import express from 'express';

jest.mock('../../src/middlewares/authMiddleware', () => ({
    authMiddleware: (req: any, _res: any, next: any) => {
        req.user = { id: 1 };
        next();
    },
}));

import popupRouter from '../../src/routes/popupRoutes';

const app = express();
app.use(express.json());
app.use('/v1/pop-up', popupRouter);

describe('GET /v1/pop-up/:tipo - Integration', () => {

    it('deve retornar 200 com dados do pop-up para qualquer tipo', async () => {
        const response = await request(app).get('/v1/pop-up/medicamento');

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            tipo: 'medicamento',
            titulo: expect.stringContaining('MEDICAMENTO'),
            mensagem: expect.any(String),
        });
    });

    it('deve refletir o tipo enviado no parâmetro', async () => {
        const response = await request(app).get('/v1/pop-up/hidratacao');

        expect(response.status).toBe(200);
        expect(response.body.tipo).toBe('hidratacao');
        expect(response.body.titulo).toBe('Pop-up de HIDRATACAO');
    });

    it('deve aceitar tipo arbitrário (rota não restringe)', async () => {
        const response = await request(app).get('/v1/pop-up/qualquer-coisa-aqui');

        expect(response.status).toBe(200);
        expect(response.body.tipo).toBe('qualquer-coisa-aqui');
    });

    it('deve retornar 404 se o tipo não for fornecido na URL', async () => {
        // Sem :tipo, a rota não casa
        const response = await request(app).get('/v1/pop-up/');

        expect(response.status).toBe(404);
    });
});
