import * as userBusiness from '../../src/business/userBusiness';
import * as userRepository from '../../src/database/repositories/userRepository';

jest.mock('../../src/database/repositories/userRepository');
jest.mock('../../src/database/repositories/contactRepository');

describe('UserBusiness - Testes Unitários', () => {

    it('deve lançar erro ao buscar perfil de usuário inexistente', async () => {

        (userRepository.findUserById as jest.Mock).mockResolvedValue(null);

        await expect(userBusiness.getProfile(999))
            .rejects
            .toThrow('Usuário não encontrado');
    });

    it('deve lançar erro se tentar adicionar contato para outro usuário', async () => {
        const loggedUserId = 1;
        const payload = {
            id_paciente: 2,
            id_contato: 3,
            whatsapp_numero: '11999'
        };

        await expect(userBusiness.addContact(loggedUserId, payload))
            .rejects
            .toThrow('Permissão negada');
    });
    
    it('deve lançar erro ao tentar adicionar um contato que não existe no banco', async () => {
        const loggedUserId = 1;
        const payload = { id_paciente: 1, id_contato: 999, whatsapp_numero: '11999' };
        
        (userRepository.findUserById as jest.Mock).mockResolvedValue(null);

        await expect(userBusiness.addContact(loggedUserId, payload))
            .rejects
            .toThrow('Usuário de contato não encontrado');
    });
});