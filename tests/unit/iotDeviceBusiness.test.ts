import * as iotBusiness from '../../src/business/iotBusiness';
import * as deviceRepository from '../../src/database/repositories/deviceRepository';
import { ConflictError, NotFoundError, ForbiddenError } from '../../src/utils/errors';

jest.mock('../../src/database/repositories/deviceRepository');

describe('IotBusiness - Gerenciamento de Dispositivos (Unitários)', () => {

    describe('listDevices', () => {
        it('deve retornar a lista de dispositivos do usuário', async () => {
            const fakeDevices = [
                { id_dispositivo: 'd1', id_usuario: 1, nome: 'Sensor Gás', categoria: 'GAS', status_ativo: true },
                { id_dispositivo: 'd2', id_usuario: 1, nome: 'Luz Sala', categoria: 'LUZ_RGB', status_ativo: false },
            ];
            (deviceRepository.findDevicesByUserId as jest.Mock).mockResolvedValue(fakeDevices);

            const result = await iotBusiness.listDevices(1);

            expect(result).toHaveLength(2);
            expect(deviceRepository.findDevicesByUserId).toHaveBeenCalledWith(1);
        });
    });

    describe('registerDevice', () => {
        it('deve cadastrar um novo dispositivo quando o ID ainda não existe', async () => {
            (deviceRepository.findDeviceById as jest.Mock).mockResolvedValue(null);
            (deviceRepository.createDevice as jest.Mock).mockResolvedValue('novo-device');

            const result = await iotBusiness.registerDevice(1, {
                id_dispositivo: 'novo-device',
                nome: 'Sensor de Porta',
                categoria: 'PORTA',
            });

            expect(result.status).toBe('created');
            expect(result.deviceId).toBe('novo-device');
            expect(deviceRepository.createDevice).toHaveBeenCalledWith(
                expect.objectContaining({
                    id_dispositivo: 'novo-device',
                    id_usuario: 1,
                    status_ativo: true, // default
                })
            );
        });

        it('deve respeitar status_ativo informado explicitamente', async () => {
            (deviceRepository.findDeviceById as jest.Mock).mockResolvedValue(null);
            (deviceRepository.createDevice as jest.Mock).mockResolvedValue('d3');

            await iotBusiness.registerDevice(1, {
                id_dispositivo: 'd3',
                nome: 'Luz Quarto',
                categoria: 'LUZ_RGB',
                status_ativo: false,
            });

            expect(deviceRepository.createDevice).toHaveBeenCalledWith(
                expect.objectContaining({ status_ativo: false })
            );
        });

        it('deve lançar ConflictError quando o ID do dispositivo já existe', async () => {
            (deviceRepository.findDeviceById as jest.Mock).mockResolvedValue({
                id_dispositivo: 'existente',
            });

            await expect(
                iotBusiness.registerDevice(1, {
                    id_dispositivo: 'existente',
                    nome: 'Qualquer',
                    categoria: 'GAS',
                })
            ).rejects.toThrow(ConflictError);

            expect(deviceRepository.createDevice).not.toHaveBeenCalled();
        });
    });

    describe('updateDevice', () => {
        it('deve atualizar um dispositivo que pertence ao usuário', async () => {
            (deviceRepository.findDeviceById as jest.Mock).mockResolvedValue({
                id_dispositivo: 'd1',
                id_usuario: 1,
            });
            (deviceRepository.updateDevice as jest.Mock).mockResolvedValue(true);

            const result = await iotBusiness.updateDevice(1, 'd1', { status_ativo: false });

            expect(result.status).toBe('updated');
            expect(deviceRepository.updateDevice).toHaveBeenCalledWith('d1', { status_ativo: false });
        });

        it('deve lançar NotFoundError quando o dispositivo não existe', async () => {
            (deviceRepository.findDeviceById as jest.Mock).mockResolvedValue(null);

            await expect(
                iotBusiness.updateDevice(1, 'inexistente', { nome: 'Novo nome' })
            ).rejects.toThrow(NotFoundError);
        });

        it('deve lançar ForbiddenError quando o dispositivo é de outro usuário', async () => {
            (deviceRepository.findDeviceById as jest.Mock).mockResolvedValue({
                id_dispositivo: 'd1',
                id_usuario: 999, // outro dono
            });

            await expect(
                iotBusiness.updateDevice(1, 'd1', { status_ativo: true })
            ).rejects.toThrow(ForbiddenError);

            expect(deviceRepository.updateDevice).not.toHaveBeenCalled();
        });
    });
});
