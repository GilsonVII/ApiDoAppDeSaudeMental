export type AgendaEventType = 'MEDICAMENTO' | 'CONSULTA' | 'SONO' | 'HIDRATACAO' | 'MEDITACAO' | 'EVENTO' | 'GERAL';

export interface IAgendaEvent {
    id_evento: number;
    titulo: string;
    descricao?: string | null;
    data_hora: string; 
    data_inicio: string; 
    data_fim?: string | null; 
    tipo: AgendaEventType;
    id_paciente: number; 
    id_criador: number; 
}

export interface IAgendaOccurrence {
    id_ocorrencia: number;
    id_evento: number; 
    usuario_id: number; 
    data_ocorrencia: string; 
    status_concluido: boolean;
}

export interface IMonthlyNote {
    id_nota: number;
    id_paciente: number;
    id_autor: number;
    mes_referencia: string;
    texto: string;
    data_criacao: Date;
}