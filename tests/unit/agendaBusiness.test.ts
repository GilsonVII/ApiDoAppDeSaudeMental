import * as agendaBusiness from '../../src/business/agendaBusiness';
import * as contactRepository from '../../src/database/repositories/contactRepository';
import * as agendaRepository from '../../src/database/repositories/agendaRepository';
import { ForbiddenError } from '../../src/utils/errors';

jest.mock('../../src/database/repositories/agendaRepository');
jest.mock('../../src/database/repositories/contactRepository');

describe('AgendaBusiness - Testes Unitários', () => {

    it('deve lançar ForbiddenError se usuário não for contato do paciente', async () => {
        const creatorId = 1;
        const patientId = 2;
        const payload = {
            id_paciente: patientId,
            titulo: 'Teste',
            descricao: 'Teste',
            data_hora: '10:00',
            data_inicio: '2025-01-01',
            data_fim: null,
            tipo: 'GERAL' as any
        };

        (contactRepository.findContactsByPatientId as jest.Mock).mockResolvedValue([
            { id_contato: 99 }
        ]);

        await expect(agendaBusiness.createAgendaTemplate(creatorId, payload))
            .rejects
            .toThrow(ForbiddenError);
    });

    it('deve criar template e ocorrências se o criador for o próprio paciente', async () => {
        const creatorId = 1;
        const patientId = 1;
        const payload = {
            id_paciente: patientId,
            titulo: 'Meu Evento',
            descricao: 'Teste',
            data_hora: '10:00',
            data_inicio: '2025-01-01',
            data_fim: '2025-01-02',
            tipo: 'GERAL' as any
        };

        (agendaRepository.createAgendaTemplate as jest.Mock).mockResolvedValue(10);
        (agendaRepository.createOccurrencesBatch as jest.Mock).mockResolvedValue(true);

        const result = await agendaBusiness.createAgendaTemplate(creatorId, payload);
        
        expect(result).toBe(10);
        expect(agendaRepository.createOccurrencesBatch).toHaveBeenCalled();
    });
});