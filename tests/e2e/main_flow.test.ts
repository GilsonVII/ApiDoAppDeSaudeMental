import request from 'supertest';
import express from 'express';
import masterRouter from '../../src/routes'; 
import { db } from '../../src/database/connection';

const app = express();
app.use(express.json());
app.use('/', masterRouter);

let token: string;
let testUserId: number;
const testEmail = `jest_user_${Date.now()}@test.com`; 

beforeAll(async () => {
    try {
        await db('USUARIO').where('email', 'like', 'jest_user_%').delete();
    } catch (error) {
        console.error("Erro limpando o banco antes dos testes:", error);
    }
});

describe('Fluxo Chave da API (Linha 15 - Teste E2E)', () => {
    
    it('deve registrar um novo usuário (POST /v1/auth/register)', async () => {
        const response = await request(app)
            .post('/v1/auth/register')
            .send({
                email: testEmail,
                password: 'password123',
                name: 'Usuário de Teste Jest',
                is_patient: true
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('userId');
        testUserId = response.body.userId; 
    });

    it('deve autenticar o usuário e retornar um Token JWT (POST /v1/auth/login)', async () => {
        const response = await request(app)
            .post('/v1/auth/login')
            .send({
                email: testEmail,
                password: 'password123'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        token = response.body.token; 
    });

    it('deve falhar (401) ao acessar uma rota protegida sem token', async () => {
        const response = await request(app)
            .get('/v1/users/me'); 

        expect(response.status).toBe(401);
        expect(response.body.error).toContain('Token não fornecido');
    });

    it('deve acessar o perfil (200) com um token válido (GET /v1/users/me)', async () => {
        const response = await request(app)
            .get('/v1/users/me')
            .set('Authorization', `Bearer ${token}`); 

        expect(response.status).toBe(200);
        expect(response.body.email).toBe(testEmail);
    });

    it('deve acionar o pânico (201) com um token válido (POST /v1/panic/trigger)', async () => {
        const response = await request(app)
            .post('/v1/panic/trigger')
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -23.5505,
                longitude: -46.6333
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('eventId');
        expect(response.body.notifiedContactsCount).toBeDefined(); 
    });

    it('deve criar um template de agenda (201) (POST /v1/agenda/template)', async () => {
        const response = await request(app)
            .post('/v1/agenda/template')
            .set('Authorization', `Bearer ${token}`)
            .send({
                id_paciente: testUserId,
                titulo: "Teste de Template (Jest)",
                descricao: "Teste E2E da Linha 11",
                data_hora: "14:00:00",
                data_inicio: "2025-11-20",
                data_fim: "2025-11-30",
                tipo: "GERAL"
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('templateId');
    });
});