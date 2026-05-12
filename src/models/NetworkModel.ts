export interface INetwork {
    id: string;
    protetecId: string;    
    protectorId: string;     
    role: 'PRIMARY' | 'SECONDARY';
    inviteStatus: 'PENDING' | 'ACCEPTED';
}