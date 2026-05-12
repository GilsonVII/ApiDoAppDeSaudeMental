export interface ITelemetry {
    id_telemetria?: number;
    id_dispositivo: string;
    id_usuario: number;
    tipo_sensor: 'GAS_LEVEL' | 'LUMINOSITY' | 'NOISE_DB' | 'DOOR_STATUS' | 'MOTION';
    valor: string; 
    timestamp?: Date;
}
