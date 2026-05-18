import * as statsBusiness from '../../src/business/statsBusiness';
import * as statsRepository from '../../src/database/repositories/statsRepository';
import * as contactRepository from '../../src/database/repositories/contactRepository';
import * as userRepository from '../../src/database/repositories/userRepository';
import { ForbiddenError, NotFoundError } from '../../src/utils/errors';

jest.mock('../../src/database/repositories/statsRepository');
jest.mock('../../src/database/repositories/contactRepository');
jest.mock('../../src/database/repositories/userRepository');

describe('StatsBusiness - Testes Unitários', () => {

    describe('buildMotivationalMessage', () => {
        it('deve retornar mensagem de excelência para consistência >= 80', () => {
            expect(statsBusiness.buildMotivationalMessage(85)).toMatch(/Excelente/i);
            expect(statsBusiness.buildMotivationalMessage(100)).toMatch(/Excelente/i);
        });

        it('deve retornar mensagem intermediária para consistência entre 50 e 79', () => {
            expect(statsBusiness.buildMotivationalMessage(65)).toMatch(/trabalho pela frente/i);
        });

        it('deve retornar mensagem de incentivo para consistência entre 1 e 49', () => {
            expect(statsBusiness.buildMotivationalMessage(20)).toMatch(/pequeno passo/i);
        });

        it('deve retornar mensagem de início para consistência 0', () => {
            expect(statsBusiness.buildMotivationalMessage(0)).toMatch(/comecar hoje/i);
        });
    });

    describe('deriveStatusLabel', () => {
        it('deve retornar Crítico quando houve alerta nos últimos 2 dias', () => {
            expect(statsBusiness.deriveStatusLabel(90, 0)).toBe('Crítico');
            expect(statsBusiness.deriveStatusLabel(90, 2)).toBe('Crítico');
        });

        it('deve retornar Atenção quando a consistência é baixa (< 40) e sem alerta recente', () => {
            expect(statsBusiness.deriveStatusLabel(30, 10)).toBe('Atenção');
        });

        it('deve retornar Estável quando consistência boa e sem alertas recentes', () => {
            expect(statsBusiness.deriveStatusLabel(75, 30)).toBe('Estável');
        });
    });

    describe('getUserStats', () => {
        it('deve lançar NotFoundError quando o paciente não existe', async () => {
            (userRepository.findUserById as jest.Mock).mockResolvedValue(null);

            await expect(statsBusiness.getUserStats(1, 999)).rejects.toThrow(NotFoundError);
        });

        it('deve lançar ForbiddenError quando o usuário não é o paciente nem contato', async () => {
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 5 });
            (contactRepository.findContactsByPatientId as jest.Mock).mockResolvedValue([
                { id_contato: 10 },
            ]);

            await expect(statsBusiness.getUserStats(99, 5)).rejects.toThrow(ForbiddenError);
        });

        it('deve permitir o próprio paciente e calcular consistência corretamente', async () => {
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 5 });
            (statsRepository.getOccurrenceStatsInRange as jest.Mock).mockResolvedValue({
                total: 10,
                concluidas: 7,
            });
            (statsRepository.getLastPanicTimestamp as jest.Mock).mockResolvedValue(null);
            (statsRepository.getUserCreationDate as jest.Mock).mockResolvedValue(
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 dias atrás
            );

            const stats = await statsBusiness.getUserStats(5, 5);

            expect(stats.consistencia_rotina).toBe(70); // 7/10
            expect(stats.metas_concluidas_semana).toBe(7);
            expect(stats.metas_totais_semana).toBe(10);
            expect(stats.ultimo_alerta_critico).toBeNull();
            expect(stats.dias_estabilidade).toBeGreaterThanOrEqual(29);
        });

        it('deve permitir um contato de emergência ver as estatísticas', async () => {
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 5 });
            (contactRepository.findContactsByPatientId as jest.Mock).mockResolvedValue([
                { id_contato: 10 },
            ]);
            (statsRepository.getOccurrenceStatsInRange as jest.Mock).mockResolvedValue({
                total: 0,
                concluidas: 0,
            });
            (statsRepository.getLastPanicTimestamp as jest.Mock).mockResolvedValue(null);
            (statsRepository.getUserCreationDate as jest.Mock).mockResolvedValue(new Date());

            const stats = await statsBusiness.getUserStats(10, 5);

            // total 0 => consistência 0, sem divisão por zero
            expect(stats.consistencia_rotina).toBe(0);
        });

        it('deve calcular dias_estabilidade a partir do último pânico quando existe', async () => {
            const tresDiasAtras = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 5 });
            (statsRepository.getOccurrenceStatsInRange as jest.Mock).mockResolvedValue({
                total: 4,
                concluidas: 2,
            });
            (statsRepository.getLastPanicTimestamp as jest.Mock).mockResolvedValue(tresDiasAtras);

            const stats = await statsBusiness.getUserStats(5, 5);

            expect(stats.dias_estabilidade).toBe(3);
            expect(stats.ultimo_alerta_critico).toBe(tresDiasAtras.toISOString());
            // getUserCreationDate não deve nem ser chamado quando há pânico
            expect(statsRepository.getUserCreationDate).not.toHaveBeenCalled();
        });
    });

    describe('getUserStatus', () => {
        it('deve retornar status derivado das estatísticas', async () => {
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 5 });
            (statsRepository.getOccurrenceStatsInRange as jest.Mock).mockResolvedValue({
                total: 10,
                concluidas: 8,
            });
            (statsRepository.getLastPanicTimestamp as jest.Mock).mockResolvedValue(null);
            (statsRepository.getUserCreationDate as jest.Mock).mockResolvedValue(
                new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
            );

            const result = await statsBusiness.getUserStatus(5, 5);

            expect(result.status).toBe('Estável'); // 80% e sem alertas
            expect(result.consistencia_rotina).toBe(80);
        });
    });
});
