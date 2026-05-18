import request from 'supertest';
import express from 'express';

jest.mock('../../src/middlewares/authMiddleware', () => ({
    authMiddleware: (req: any, _res: any, next: any) => {
        req.user = { id: 1 };
        next();
    },
}));
jest.mock('../../src/business/agendaBusiness');

import agendaRouter from '../../src/routes/agendaRoutes';
import * as agendaBusiness from '../../src/business/agendaBusiness';

const app = express();
app.use(express.json());
app.use('/v1/agenda', agendaRouter);

describe('Agenda - Rotas de Ocorrências (fix do conflito de path)', () => {

    it('GET /ocorrencias/paciente/:id deve chamar listOccurrences', async () => {
        (agendaBusiness.listOccurrences as jest.Mock).mockResolvedValue([{ id_ocorrencia: 1 }]);

        const response = await request(app).get('/v1/agenda/ocorrencias/paciente/5');

        expect(response.status).toBe(200);
        expect(agendaBusiness.listOccurrences).toHaveBeenCalledWith(1, 5);
    });

    it('GET /ocorrencias/detalhe/:id deve chamar getOccurrenceById (e NÃO listOccurrences)', async () => {
        (agendaBusiness.getOccurrenceById as jest.Mock).mockResolvedValue({ id_ocorrencia: 42 });

        const response = await request(app).get('/v1/agenda/ocorrencias/detalhe/42');

        expect(response.status).toBe(200);
        // A prova de que o bug foi corrigido: a rota de detalhe é alcançável
        expect(agendaBusiness.getOccurrenceById).toHaveBeenCalledWith(1, 42);
        expect(agendaBusiness.listOccurrences).not.toHaveBeenCalled();
    });

    it('GET /ocorrencias/paciente/:id/data/:data deve chamar listOccurrencesByDate', async () => {
        (agendaBusiness.listOccurrencesByDate as jest.Mock).mockResolvedValue([]);

        const response = await request(app).get('/v1/agenda/ocorrencias/paciente/5/data/2026-05-14');

        expect(response.status).toBe(200);
        expect(agendaBusiness.listOccurrencesByDate).toHaveBeenCalledWith(1, 5, '2026-05-14');
    });

    it('PATCH /ocorrencias/:id/status deve atualizar o status', async () => {
        (agendaBusiness.updateOccurrenceStatus as jest.Mock).mockResolvedValue({
            id_ocorrencia: 7,
            status_concluido: true,
        });

        const response = await request(app)
            .patch('/v1/agenda/ocorrencias/7/status')
            .send({ status_concluido: true });

        expect(response.status).toBe(200);
        expect(agendaBusiness.updateOccurrenceStatus).toHaveBeenCalledWith(1, 7, true);
    });
});

describe('Agenda - GET /template/paciente/:id (rota nova)', () => {

    it('deve retornar 200 com a lista de templates', async () => {
        (agendaBusiness.listTemplatesForPatient as jest.Mock).mockResolvedValue([
            { id_evento: 1, titulo: 'Tomar remédio' },
        ]);

        const response = await request(app).get('/v1/agenda/template/paciente/5');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1);
        expect(agendaBusiness.listTemplatesForPatient).toHaveBeenCalledWith(1, 5);
    });

    it('deve retornar 400 quando o id do paciente é inválido', async () => {
        const response = await request(app).get('/v1/agenda/template/paciente/abc');

        expect(response.status).toBe(400);
    });

    it('deve retornar 403 quando o business lança ForbiddenError', async () => {
        const { ForbiddenError } = require('../../src/utils/errors');
        (agendaBusiness.listTemplatesForPatient as jest.Mock).mockRejectedValue(
            new ForbiddenError('Permissão negada para listar os eventos base.')
        );

        const response = await request(app).get('/v1/agenda/template/paciente/5');

        expect(response.status).toBe(403);
    });
});

describe('Agenda - Notas Mensais (POST e GET novo)', () => {

    it('POST /notes deve criar uma nota mensal', async () => {
        (agendaBusiness.addMonthlyNote as jest.Mock).mockResolvedValue(100);

        const response = await request(app)
            .post('/v1/agenda/notes')
            .send({ id_paciente: 5, mes_referencia: '2026-05', texto: 'Boa evolução este mês.' });

        expect(response.status).toBe(201);
        expect(response.body.noteId).toBe(100);
        expect(agendaBusiness.addMonthlyNote).toHaveBeenCalledWith(1, 5, '2026-05', 'Boa evolução este mês.');
    });

    it('POST /notes deve retornar 400 quando o texto excede 500 caracteres', async () => {
        const textoLongo = 'a'.repeat(501);

        const response = await request(app)
            .post('/v1/agenda/notes')
            .send({ id_paciente: 5, mes_referencia: '2026-05', texto: textoLongo });

        expect(response.status).toBe(400);
    });

    it('POST /notes deve retornar 400 quando mes_referencia tem formato errado', async () => {
        const response = await request(app)
            .post('/v1/agenda/notes')
            .send({ id_paciente: 5, mes_referencia: '05-2026', texto: 'Nota' });

        expect(response.status).toBe(400);
    });

    it('GET /notes/:id_paciente/:mes deve listar as notas do mês', async () => {
        (agendaBusiness.listMonthlyNotes as jest.Mock).mockResolvedValue([
            { id_nota: 1, texto: 'Nota A', id_autor: 5 },
            { id_nota: 2, texto: 'Nota B', id_autor: 10 },
        ]);

        const response = await request(app).get('/v1/agenda/notes/5/2026-05');

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2);
        expect(agendaBusiness.listMonthlyNotes).toHaveBeenCalledWith(1, 5, '2026-05');
    });

    it('GET /notes deve retornar 400 quando o mês tem formato inválido', async () => {
        const response = await request(app).get('/v1/agenda/notes/5/2026');

        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/YYYY-MM/);
    });
});
