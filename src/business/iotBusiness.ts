import * as iotRepository from '../database/repositories/iotRepository';
import * as deviceRepository from '../database/repositories/deviceRepository';
import * as userRepository from '../database/repositories/userRepository'; 
import * as panicBusiness from './panicBusiness'; 
import { sendPushNotification } from '../utils/notificationService'; 
import { Logger } from '../utils/logger';
import { TelemetryInput, CreateDeviceInput, UpdateDeviceInput } from '../validation/iotSchemas';
import { checkSensoryOverload } from './automationBusiness';
import { ForbiddenError, NotFoundError, ConflictError } from '../utils/errors';
import * as contactRepository from '../database/repositories/contactRepository';

export const processTelemetry = async (userId: number, data: TelemetryInput) => {
    
    const telemetryPayload = {
        id_usuario: userId,
        id_dispositivo: data.deviceId,
        tipo_sensor: data.sensorType,
        valor: String(data.value)
    };

    const telemetryId = await iotRepository.createTelemetryLog(telemetryPayload);
    Logger.info(`[iotBusiness] Telemetria registrada: ${data.sensorType} = ${data.value} (Usuário: ${userId})`);

    const patient = await userRepository.findUserById(userId);
    const fcmToken = patient?.fcm_token;

    await checkSensoryOverload(userId, data.sensorType, Number(data.value));

    switch (data.sensorType) {
        
        case 'GAS_LEVEL':
            if (Number(data.value) > 300) {
                Logger.warn(`[iotBusiness] ALERTA CRÍTICO: Gás detectado (User ${userId}). Acionando Pânico!`);

                const homeCoords: panicBusiness.Coord = { latitude: 0, longitude: 0 }; 
               
                await panicBusiness.triggerPanic(userId, homeCoords, 'SENSOR_GAS');
            }
            break;

        case 'DOOR_STATUS':
            if (data.value === 'OPEN') {
                Logger.info(`[iotBusiness] Porta/Janela aberta (User ${userId}).`); 
                
                if (fcmToken) {
                    await sendPushNotification(fcmToken, "Aviso de Segurança 🚪", "A porta/janela foi aberta.");
                }
            }
            break;

        case 'NOISE_DB':
            if (Number(data.value) > 85) {
                Logger.info(`[iotBusiness] Ruído alto detectado para o usuário ${userId}.`);
            
                if (fcmToken) {
                    await sendPushNotification(fcmToken, "Ambiente Barulhento 🎧", "Níveis de ruído altos. Que tal ir para um lugar calmo?");
                }
            }
            break;
    }

    return { telemetryId, status: 'processed' };
};



const checkPermission = async (loggedInUserId: number, patientId: number): Promise<boolean> => {
    if (loggedInUserId === patientId) return true;
    try {
        const contacts = await contactRepository.findContactsByPatientId(patientId);
        return contacts.some(c => c.id_contato === loggedInUserId);
    } catch (e) {
        Logger.error('[iotBusiness] Erro ao checar permissão de IoT:', e);
        return false;
    }
};



// ============================================================
// Gerenciamento de Dispositivos IoT
// ============================================================

/**
 * Lista todos os dispositivos IoT do usuario logado.
 */
export const listDevices = async (userId: number) => {
    return deviceRepository.findDevicesByUserId(userId);
};

export const listDevicesForPatient = async (loggedInUserId: number, patientId: number) => {
    const patient = await userRepository.findUserById(patientId);
    if (!patient) {
        throw new NotFoundError('Paciente não encontrado.');
    }

    const hasPermission = await checkPermission(loggedInUserId, patientId);
    if (!hasPermission) {
        throw new ForbiddenError('Permissão negada para ver os dispositivos deste usuário.');
    }

    return deviceRepository.findDevicesByUserId(patientId);
};

/**
 * Cadastra um novo dispositivo IoT para o usuario logado.
 */
export const registerDevice = async (userId: number, data: CreateDeviceInput) => {
    const existing = await deviceRepository.findDeviceById(data.id_dispositivo);
    if (existing) {
        throw new ConflictError('Já existe um dispositivo cadastrado com este ID.');
    }

    const deviceId = await deviceRepository.createDevice({
        id_dispositivo: data.id_dispositivo,
        id_usuario: userId,
        nome: data.nome,
        categoria: data.categoria,
        status_ativo: data.status_ativo ?? true,
    });

    Logger.info(`[iotBusiness] Dispositivo ${deviceId} cadastrado para o usuário ${userId}.`);
    return { deviceId, status: 'created' };
};

export const deleteDevice = async (userId: number, deviceId: string) => {
    const device = await deviceRepository.findDeviceById(deviceId);
    if (!device) {
        throw new NotFoundError('Dispositivo não encontrado.');
    }
    if (device.id_usuario !== userId) {
        throw new ForbiddenError('Você não tem permissão para remover este dispositivo.');
    }
 
    await deviceRepository.deleteDevice(deviceId);
    Logger.info(`[iotBusiness] Dispositivo ${deviceId} removido pelo usuário ${userId}.`);
    return { deviceId, status: 'deleted' };
};

/**
 * Atualiza um dispositivo (nome / status ativo). Garante que o dispositivo
 * pertence ao usuario logado antes de alterar.
 */
export const updateDevice = async (userId: number, deviceId: string, data: UpdateDeviceInput) => {
    const device = await deviceRepository.findDeviceById(deviceId);
    if (!device) {
        throw new NotFoundError('Dispositivo não encontrado.');
    }
    if (device.id_usuario !== userId) {
        throw new ForbiddenError('Você não tem permissão para alterar este dispositivo.');
    }

    await deviceRepository.updateDevice(deviceId, data);
    Logger.info(`[iotBusiness] Dispositivo ${deviceId} atualizado pelo usuário ${userId}.`);
    return { deviceId, status: 'updated' };
};
