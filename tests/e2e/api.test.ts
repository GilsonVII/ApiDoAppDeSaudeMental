import request from 'supertest';
import express from 'express';
import masterRouter from '../../src/routes';

const app = express();
app.use(express.json());
app.use('/', masterRouter);

describe('API End-to-End Test (Linha 15)', () => {

    it('GET / - deve retornar o status da API (200 OK)', async () => {

        const response = await request(app)
            .get('/'); 
            
        expect(response.status).toBe(200);
        
        expect(response.body).toEqual({
            status: 'API AlertaMente Online',
            version: '1.0'
        });
    });

    it('GET /rota-que-nao-existe - deve retornar 404', async () => {
        const response = await request(app)
            .get('/api/v1/rota-aleatoria');
            
        expect(response.status).toBe(404);
    });
});