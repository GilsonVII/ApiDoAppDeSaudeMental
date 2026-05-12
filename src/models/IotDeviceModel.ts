export interface IIotDevice {
    id_dispositivo: string; 
    id_usuario: number;         
    nome: string;            
    categoria: 'GAS' | 'LUMINOSIDADE' | 'RUIDO' | 'PORTA' | 'MOVIMENTO' | 'LUZ_RGB';
}
