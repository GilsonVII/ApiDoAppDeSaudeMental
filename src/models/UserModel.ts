export interface IUser {
    id_usuario: number;
    email: string;
    senha_hash: string;
    name: string;
    is_patient: boolean;
    is_emergency_contact: boolean;
    fcm_token?: string | null;
}