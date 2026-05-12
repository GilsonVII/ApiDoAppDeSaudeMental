export type OrigemPanico = 'MANUAL' | 'SENSOR_GAS' | 'QUEDA_WATCH' | 'BPM_ALTO';

export interface IPanicEvent {
    id_panico?: number;      
    usuario_id: number;     
    latitude: number;
    longitude: number;
    origem: OrigemPanico;
    timestamp?: Date;      
}
