export type IotDeviceCategory = 'GAS' | 'LUMINOSIDADE' | 'RUIDO' | 'PORTA' | 'MOVIMENTO' | 'LUZ_RGB';

export interface IIotDevice {
    id_dispositivo: string;
    id_usuario: number;
    nome: string;
    categoria: IotDeviceCategory;
    status_ativo: boolean;
}
