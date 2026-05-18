import * as healthBusiness from '../../src/business/healthBusiness';
import * as healthRepository from '../../src/database/repositories/healthRepository';
import * as userRepository from '../../src/database/repositories/userRepository';
import * as panicBusiness from '../../src/business/panicBusiness';
import * as notificationService from '../../src/utils/notificationService';

jest.mock('../../src/database/repositories/healthRepository');
jest.mock('../../src/database/repositories/userRepository');
jest.mock('../../src/business/panicBusiness');
jest.mock('../../src/utils/notificationService');

describe('HealthBusiness - Testes Unitários', () => {

    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('processHealthData', () => {

        it('deve registrar log de saúde e retornar healthId', async () => {
            (healthRepository.createHealthLog as jest.Mock).mockResolvedValue(100);
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, fcm_token: 'tok' });

            const result = await healthBusiness.processHealthData(1, {
                type: 'STEP_COUNT',
                value: 5000,
                isEmergency: false,
            });

            expect(result).toEqual({ healthId: 100, status: 'processed' });
            expect(healthRepository.createHealthLog).toHaveBeenCalledWith({
                id_usuario: 1,
                tipo_dado: 'PASSOS',
                valor: '5000',
                is_emergencia: false,
            });
        });

        it('NÃO deve disparar pânico quando BPM é normal', async () => {
            (healthRepository.createHealthLog as jest.Mock).mockResolvedValue(1);
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, fcm_token: 'tok' });

            await healthBusiness.processHealthData(1, {
                type: 'BPM',
                value: 75, // normal
                isEmergency: false,
            });

            expect(panicBusiness.triggerPanic).not.toHaveBeenCalled();
            expect(notificationService.sendPushNotification).not.toHaveBeenCalled();
        });

        it('deve enviar push de confirmação quando BPM > 130 + isEmergency e usuário tem fcm_token', async () => {
            (healthRepository.createHealthLog as jest.Mock).mockResolvedValue(1);
            (userRepository.findUserById as jest.Mock).mockResolvedValue({
                id_usuario: 1,
                fcm_token: 'token-do-usuario',
            });
            (notificationService.sendPushNotification as jest.Mock).mockResolvedValue(undefined);

            await healthBusiness.processHealthData(1, {
                type: 'BPM',
                value: 150,
                isEmergency: true,
            });

            // Envia push perguntando se está tudo bem
            expect(notificationService.sendPushNotification).toHaveBeenCalledWith(
                'token-do-usuario',
                expect.stringContaining('Alerta Cardíaco'),
                expect.any(String)
            );
            // Não dispara pânico imediatamente, espera 2 minutos
            expect(panicBusiness.triggerPanic).not.toHaveBeenCalled();
        });

        it('deve acionar pânico após 2 minutos sem cancelamento (BPM alto)', async () => {
            (healthRepository.createHealthLog as jest.Mock).mockResolvedValue(1);
            (userRepository.findUserById as jest.Mock).mockResolvedValue({
                id_usuario: 1,
                fcm_token: 'token-do-usuario',
            });
            (notificationService.sendPushNotification as jest.Mock).mockResolvedValue(undefined);
            (panicBusiness.triggerPanic as jest.Mock).mockResolvedValue({ eventId: 1, contacts: [] });

            await healthBusiness.processHealthData(1, {
                type: 'BPM',
                value: 160,
                isEmergency: true,
            });

            // Avança 2 minutos no tempo
            jest.advanceTimersByTime(120000);
            // Permite que promises pendentes resolvam
            await Promise.resolve();

            expect(panicBusiness.triggerPanic).toHaveBeenCalledWith(
                1,
                { latitude: 0, longitude: 0 },
                'BPM_ALTO'
            );
        });

        it('deve acionar pânico imediatamente se BPM alto e usuário SEM fcm_token', async () => {
            (healthRepository.createHealthLog as jest.Mock).mockResolvedValue(1);
            (userRepository.findUserById as jest.Mock).mockResolvedValue({
                id_usuario: 1,
                fcm_token: null, // sem token
            });
            (panicBusiness.triggerPanic as jest.Mock).mockResolvedValue({ eventId: 1, contacts: [] });

            await healthBusiness.processHealthData(1, {
                type: 'BPM',
                value: 160,
                isEmergency: true,
            });

            expect(panicBusiness.triggerPanic).toHaveBeenCalledWith(
                1,
                { latitude: 0, longitude: 0 },
                'BPM_ALTO'
            );
        });

        it('deve acionar pânico imediatamente para FALL_DETECTION com isEmergency', async () => {
            (healthRepository.createHealthLog as jest.Mock).mockResolvedValue(1);
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, fcm_token: 'tok' });
            (panicBusiness.triggerPanic as jest.Mock).mockResolvedValue({ eventId: 1, contacts: [] });

            await healthBusiness.processHealthData(1, {
                type: 'FALL_DETECTION',
                value: 1,
                isEmergency: true,
            });

            expect(panicBusiness.triggerPanic).toHaveBeenCalledWith(
                1,
                { latitude: 0, longitude: 0 },
                'QUEDA_WATCH'
            );
        });

        it('NÃO deve acionar pânico para FALL_DETECTION sem isEmergency', async () => {
            (healthRepository.createHealthLog as jest.Mock).mockResolvedValue(1);
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, fcm_token: 'tok' });

            await healthBusiness.processHealthData(1, {
                type: 'FALL_DETECTION',
                value: 1,
                isEmergency: false,
            });

            expect(panicBusiness.triggerPanic).not.toHaveBeenCalled();
        });
    });

    describe('cancelPendingAlert', () => {

        it('deve retornar success: false quando não há alerta pendente', async () => {
            const result = await healthBusiness.cancelPendingAlert(999);

            expect(result.success).toBe(false);
            expect(result.message).toMatch(/Nenhum alerta/i);
        });

        it('deve cancelar o pânico se chamado dentro da janela de 2 minutos', async () => {
            (healthRepository.createHealthLog as jest.Mock).mockResolvedValue(1);
            (userRepository.findUserById as jest.Mock).mockResolvedValue({
                id_usuario: 7,
                fcm_token: 'token-7',
            });
            (notificationService.sendPushNotification as jest.Mock).mockResolvedValue(undefined);
            (panicBusiness.triggerPanic as jest.Mock).mockResolvedValue({ eventId: 1, contacts: [] });

            // Cria o alerta pendente
            await healthBusiness.processHealthData(7, {
                type: 'BPM',
                value: 145,
                isEmergency: true,
            });

            // Cancela antes dos 2 minutos
            const cancelResult = await healthBusiness.cancelPendingAlert(7);
            expect(cancelResult.success).toBe(true);

            // Avança 2 minutos - pânico NÃO deve ter sido acionado
            jest.advanceTimersByTime(120000);
            await Promise.resolve();

            expect(panicBusiness.triggerPanic).not.toHaveBeenCalled();
        });
    });
});
