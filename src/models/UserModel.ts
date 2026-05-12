export interface IUser {
    id_usuario: number;
    email: string;
    senha_hash: string;
    nome: string; 
    genero?: 'MASCULINO' | 'FEMININO' | 'OUTRO' | 'NAO_INFORMADO';
    is_paciente: boolean; 
    is_contato_emergencia: boolean; 
    fcm_token?: string | null;
    settings_json?: any; 
    data_criacao?: Date;
}
