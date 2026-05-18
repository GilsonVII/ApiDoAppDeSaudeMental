import * as panicBusiness from '../../src/business/panicBusiness';
import * as panicRepository from '../../src/database/repositories/panicRepository';
import * as userRepository from '../../src/database/repositories/userRepository';
import * as contactRepository from '../../src/database/repositories/contactRepository';
import * as notificationService from '../../src/utils/notificationService';
import { NotFoundError, ForbiddenError } from '../../src/utils/errors';

jest.mock('../../src/database/repositories/panicRepository');
jest.mock('../../src/database/repositories/userRepository');
jest.mock('../../src/database/repositories/contactRepository');
jest.mock('../../src/utils/notificationService');

describe('PanicBusiness - Testes Unitários', () => {

    describe('triggerPanic', () => {

        it('deve lançar NotFoundError quando o usuário não existe', async () => {
            (userRepository.findUserById as jest.Mock).mockResolvedValue(null);

            await expect(
                panicBusiness.triggerPanic(999, { latitude: -20, longitude: -42 })
            ).rejects.toThrow(NotFoundError);
        });

        it('deve criar o log de pânico e retornar eventId + lista de contatos', async () => {
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, nome: 'João' });
            (panicRepository.getEmergencyContactsData as jest.Mock).mockResolvedValue([
                { email: 'mae@ex.com', nome: 'Mãe', fcm_token: 'token-mae' },
                { email: 'pai@ex.com', nome: 'Pai', fcm_token: 'token-pai' },
            ]);
            (panicRepository.createPanicLog as jest.Mock).mockResolvedValue(42);
            (notificationService.sendPushNotification as jest.Mock).mockResolvedValue(undefined);

            const result = await panicBusiness.triggerPanic(
                1,
                { latitude: -20.123, longitude: -42.456 },
                'MANUAL'
            );

            expect(result.eventId).toBe(42);
            expect(result.contacts).toHaveLength(2);
            expect(panicRepository.createPanicLog).toHaveBeenCalledWith({
                usuario_id: 1,
                latitude: -20.123,
                longitude: -42.456,
                origem: 'MANUAL',
            });
        });

        it('deve enviar push notification para cada contato que tem fcm_token', async () => {
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, nome: 'João' });
            (panicRepository.getEmergencyContactsData as jest.Mock).mockResolvedValue([
                { email: 'a@a.com', nome: 'A', fcm_token: 'token-A' },
                { email: 'b@b.com', nome: 'B', fcm_token: null }, // sem token, não recebe
                { email: 'c@c.com', nome: 'C', fcm_token: 'token-C' },
            ]);
            (panicRepository.createPanicLog as jest.Mock).mockResolvedValue(1);
            (notificationService.sendPushNotification as jest.Mock).mockResolvedValue(undefined);

            await panicBusiness.triggerPanic(1, { latitude: 0, longitude: 0 });

            // Só 2 dos 3 contatos têm fcm_token
            expect(notificationService.sendPushNotification).toHaveBeenCalledTimes(2);
        });

        it('deve usar título específico quando origem for SENSOR_GAS', async () => {
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, nome: 'João' });
            (panicRepository.getEmergencyContactsData as jest.Mock).mockResolvedValue([
                { email: 'a@a.com', nome: 'A', fcm_token: 'token-A' },
            ]);
            (panicRepository.createPanicLog as jest.Mock).mockResolvedValue(1);
            (notificationService.sendPushNotification as jest.Mock).mockResolvedValue(undefined);

            await panicBusiness.triggerPanic(1, { latitude: 0, longitude: 0 }, 'SENSOR_GAS');

            const callArgs = (notificationService.sendPushNotification as jest.Mock).mock.calls[0];
            expect(callArgs[1]).toContain('GÁS');
        });

        it('deve usar título específico quando origem for QUEDA_WATCH', async () => {
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, nome: 'João' });
            (panicRepository.getEmergencyContactsData as jest.Mock).mockResolvedValue([
                { email: 'a@a.com', nome: 'A', fcm_token: 'token-A' },
            ]);
            (panicRepository.createPanicLog as jest.Mock).mockResolvedValue(1);
            (notificationService.sendPushNotification as jest.Mock).mockResolvedValue(undefined);

            await panicBusiness.triggerPanic(1, { latitude: 0, longitude: 0 }, 'QUEDA_WATCH');

            const callArgs = (notificationService.sendPushNotification as jest.Mock).mock.calls[0];
            expect(callArgs[1]).toContain('QUEDA');
        });

        it('deve usar título cardíaco quando origem for BPM_ALTO', async () => {
            (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, nome: 'João' });
            (panicRepository.getEmergencyContactsData as jest.Mock).mockResolvedValue([
                { email: 'a@a.com', nome: 'A', fcm_token: 'token-A' },
            ]);
            (panicRepository.createPanicLog as jest.Mock).mockResolvedValue(1);
            (notificationService.sendPushNotification as jest.Mock).mockResolvedValue(undefined);

            await panicBusiness.triggerPanic(1, { latitude: 0, longitude: 0 }, 'BPM_ALTO');

            const callArgs = (notificationService.sendPushNotification as jest.Mock).mock.calls[0];
            expect(callArgs[1]).toContain('CARDÍACO');
        });
    });

    describe('getPanicLogs', () => {

        it('deve permitir que o próprio paciente veja seus logs', async () => {
            (contactRepository.findContactsByPatientId as jest.Mock).mockResolvedValue([]);
            (panicRepository.getPanicLogsByUserId as jest.Mock).mockResolvedValue([{ id_panico: 1 }]);

            const result = await panicBusiness.getPanicLogs(5, 5);

            expect(result).toHaveLength(1);
            expect(panicRepository.getPanicLogsByUserId).toHaveBeenCalledWith(5);
        });

        it('deve permitir que um contato de emergência veja os logs', async () => {
            (contactRepository.findContactsByPatientId as jest.Mock).mockResolvedValue([
                { id_contato: 10 }, // usuário 10 é contato do paciente 5
            ]);
            (panicRepository.getPanicLogsByUserId as jest.Mock).mockResolvedValue([{ id_panico: 1 }]);

            const result = await panicBusiness.getPanicLogs(10, 5);

            expect(result).toHaveLength(1);
        });

        it('deve lançar ForbiddenError se usuário não for paciente nem contato', async () => {
            (contactRepository.findContactsByPatientId as jest.Mock).mockResolvedValue([
                { id_contato: 10 },
            ]);

            await expect(
                panicBusiness.getPanicLogs(99, 5) // 99 não é paciente nem contato
            ).rejects.toThrow(ForbiddenError);
        });
    });
});
