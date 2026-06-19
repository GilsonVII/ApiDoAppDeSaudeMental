export type OrigemPanico = 'MANUAL' | 'SENSOR_GAS' | 'QUEDA_WATCH' | 'BPM_ALTO';

export interface IPanicEvent {
    id_panico?: number;
    usuario_id: number;
    latitude: number;
    longitude: number;
    origem: OrigemPanico;
    timestamp?: Date;
    status_resolvido?: boolean;
    resolvido_em?: Date | null;
    resolvido_por?: number | null;
}

export interface IIncomingPanic {
    id_panico: number;
    usuario_id: number;
    paciente_nome: string;
    latitude: number;
    longitude: number;
    origem: OrigemPanico;
    timestamp: Date;
    status_resolvido: boolean;
    resolvido_em: Date | null;
    resolvido_por: number | null;
}
