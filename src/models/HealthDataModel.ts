export interface IHealthData {
    id_saude?: number;
    id_usuario: number; 
    tipo_dado: 'BPM' | 'QUEDA' | 'OXIGENIO' | 'SONO';
    valor: string; 
    is_emergencia: boolean;    
    timestamp?: Date;
}
