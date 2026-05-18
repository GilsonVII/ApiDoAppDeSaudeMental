import * as iotBusiness from '../../src/business/iotBusiness';
import * as iotRepository from '../../src/database/repositories/iotRepository';
import * as userRepository from '../../src/database/repositories/userRepository';
import * as panicBusiness from '../../src/business/panicBusiness';
import * as automationBusiness from '../../src/business/automationBusiness';
import * as notificationService from '../../src/utils/notificationService';

jest.mock('../../src/database/repositories/iotRepository');
jest.mock('../../src/database/repositories/userRepository');
jest.mock('../../src/business/panicBusiness');
jest.mock('../../src/business/automationBusiness');
jest.mock('../../src/utils/notificationService');

describe('IotBusiness - Testes Unitários', () => {

    beforeEach(() => {
        (automationBusiness.checkSensoryOverload as jest.Mock).mockResolvedValue(undefined);
    });

    it('deve registrar a telemetria e retornar telemetryId', async () => {
        (iotRepository.createTelemetryLog as jest.Mock).mockResolvedValue(55);
        (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, fcm_token: 'tok' });

        const result = await iotBusiness.processTelemetry(1, {
            deviceId: 'dev-001',
            sensorType: 'MOTION',
            value: 1,
        });

        expect(result).toEqual({ telemetryId: 55, status: 'processed' });
        expect(iotRepository.createTelemetryLog).toHaveBeenCalledWith({
            id_usuario: 1,
            id_dispositivo: 'dev-001',
            tipo_sensor: 'MOTION',
            valor: '1',
        });
    });

    it('deve acionar pânico SENSOR_GAS quando GAS_LEVEL > 300', async () => {
        (iotRepository.createTelemetryLog as jest.Mock).mockResolvedValue(1);
        (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, fcm_token: 'tok' });
        (panicBusiness.triggerPanic as jest.Mock).mockResolvedValue({ eventId: 1, contacts: [] });

        await iotBusiness.processTelemetry(1, {
            deviceId: 'gas-1',
            sensorType: 'GAS_LEVEL',
            value: 400,
        });

        expect(panicBusiness.triggerPanic).toHaveBeenCalledWith(
            1,
            { latitude: 0, longitude: 0 },
            'SENSOR_GAS'
        );
    });

    it('NÃO deve acionar pânico quando GAS_LEVEL <= 300', async () => {
        (iotRepository.createTelemetryLog as jest.Mock).mockResolvedValue(1);
        (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, fcm_token: 'tok' });

        await iotBusiness.processTelemetry(1, {
            deviceId: 'gas-1',
            sensorType: 'GAS_LEVEL',
            value: 100,
        });

        expect(panicBusiness.triggerPanic).not.toHaveBeenCalled();
    });

    it('deve enviar push quando DOOR_STATUS é OPEN e usuário tem fcm_token', async () => {
        (iotRepository.createTelemetryLog as jest.Mock).mockResolvedValue(1);
        (userRepository.findUserById as jest.Mock).mockResolvedValue({
            id_usuario: 1,
            fcm_token: 'tok-porta',
        });
        (notificationService.sendPushNotification as jest.Mock).mockResolvedValue(undefined);

        await iotBusiness.processTelemetry(1, {
            deviceId: 'porta-1',
            sensorType: 'DOOR_STATUS',
            value: 'OPEN',
        });

        expect(notificationService.sendPushNotification).toHaveBeenCalledWith(
            'tok-porta',
            expect.stringContaining('Segurança'),
            expect.any(String)
        );
    });

    it('NÃO deve enviar push de porta quando o usuário não tem fcm_token', async () => {
        (iotRepository.createTelemetryLog as jest.Mock).mockResolvedValue(1);
        (userRepository.findUserById as jest.Mock).mockResolvedValue({
            id_usuario: 1,
            fcm_token: null,
        });

        await iotBusiness.processTelemetry(1, {
            deviceId: 'porta-1',
            sensorType: 'DOOR_STATUS',
            value: 'OPEN',
        });

        expect(notificationService.sendPushNotification).not.toHaveBeenCalled();
    });

    it('deve enviar push de ruído quando NOISE_DB > 85', async () => {
        (iotRepository.createTelemetryLog as jest.Mock).mockResolvedValue(1);
        (userRepository.findUserById as jest.Mock).mockResolvedValue({
            id_usuario: 1,
            fcm_token: 'tok',
        });
        (notificationService.sendPushNotification as jest.Mock).mockResolvedValue(undefined);

        await iotBusiness.processTelemetry(1, {
            deviceId: 'mic-1',
            sensorType: 'NOISE_DB',
            value: 90,
        });

        expect(notificationService.sendPushNotification).toHaveBeenCalledWith(
            'tok',
            expect.stringContaining('Barulhento'),
            expect.any(String)
        );
    });

    it('deve sempre chamar checkSensoryOverload (automação)', async () => {
        (iotRepository.createTelemetryLog as jest.Mock).mockResolvedValue(1);
        (userRepository.findUserById as jest.Mock).mockResolvedValue({ id_usuario: 1, fcm_token: 'tok' });

        await iotBusiness.processTelemetry(1, {
            deviceId: 'lum-1',
            sensorType: 'LUMINOSITY',
            value: 950,
        });

        expect(automationBusiness.checkSensoryOverload).toHaveBeenCalledWith(1, 'LUMINOSITY', 950);
    });
});
