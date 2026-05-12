import request from 'supertest';
import express from 'express';
import masterRouter from '../../src/routes';

const app = express();
app.use(express.json());
app.use('/', masterRouter);

describe('API End-to-End Test (SafeHome V2)', () => {

    it('GET / - deve retornar o status da API (200 OK)', async () => {
        const response = await request(app).get('/'); 
            
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status');
        expect(response.body).toHaveProperty('version');
    });

    it('GET /rota-que-nao-existe - deve retornar 404', async () => {
        const response = await request(app).get('/v1/rota-aleatoria');
            
        expect(response.status).toBe(404);
    });
});
