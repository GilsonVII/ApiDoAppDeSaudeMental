import * as agendaBusiness from '../../src/business/agendaBusiness';
import * as agendaRepository from '../../src/database/repositories/agendaRepository';
import * as contactRepository from '../../src/database/repositories/contactRepository';
import { ForbiddenError } from '../../src/utils/errors';

jest.mock('../../src/database/repositories/agendaRepository');
jest.mock('../../src/database/repositories/contactRepository');

describe('AgendaBusiness - listMonthlyNotes (Unitários)', () => {

    it('deve permitir o próprio paciente listar suas notas', async () => {
        (agendaRepository.findMonthlyNotes as jest.Mock).mockResolvedValue([
            { id_nota: 1, texto: 'Nota teste', id_autor: 5 },
        ]);

        const result = await agendaBusiness.listMonthlyNotes(5, 5, '2026-05');

        expect(result).toHaveLength(1);
        expect(agendaRepository.findMonthlyNotes).toHaveBeenCalledWith(5, '2026-05');
    });

    it('deve permitir um contato de emergência listar as notas do paciente', async () => {
        (contactRepository.findContactsByPatientId as jest.Mock).mockResolvedValue([
            { id_contato: 10, nivel_permissao: 'CONTROLE_TOTAL' },
        ]);
        (agendaRepository.findMonthlyNotes as jest.Mock).mockResolvedValue([]);

        const result = await agendaBusiness.listMonthlyNotes(10, 5, '2026-05');

        expect(result).toEqual([]);
        expect(agendaRepository.findMonthlyNotes).toHaveBeenCalledWith(5, '2026-05');
    });

    it('deve lançar ForbiddenError quando o usuário não tem vínculo com o paciente', async () => {
        (contactRepository.findContactsByPatientId as jest.Mock).mockResolvedValue([
            { id_contato: 10 },
        ]);

        await expect(
            agendaBusiness.listMonthlyNotes(99, 5, '2026-05')
        ).rejects.toThrow(ForbiddenError);

        expect(agendaRepository.findMonthlyNotes).not.toHaveBeenCalled();
    });
});
