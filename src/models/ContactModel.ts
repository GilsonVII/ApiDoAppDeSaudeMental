export type NivelPermissao = 'TOTAL' | 'MODERADO' | 'SOMENTE_EMERGENCIA';

export interface IContactRelation {
    id_relacao: number;
    id_paciente: number;
    id_contato: number;
    whatsapp_numero: string;
    nivel_permissao?: NivelPermissao;
}
