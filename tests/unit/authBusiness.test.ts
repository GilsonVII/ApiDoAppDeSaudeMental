import * as authBusiness from '../../src/business/authBusiness';
import * as userRepository from '../../src/database/repositories/userRepository';
import * as bcryptUtils from '../../src/utils/bcrypt';
import * as jwtUtils from '../../src/utils/jwt';
import { ConflictError, UnauthorizedError } from '../../src/utils/errors';

jest.mock('../../src/database/repositories/userRepository');
jest.mock('../../src/utils/bcrypt');
jest.mock('../../src/utils/jwt');

describe('AuthBusiness - Testes Unitários', () => {

    it('deve lançar ConflictError ao tentar registrar com e-mail existente', async () => {
        (userRepository.findUserByEmail as jest.Mock).mockResolvedValue({ id_usuario: 1, email: 'teste@teste.com' });
        const payload = { email: 'teste@teste.com', password: '123', name: 'Teste' };
        
        await expect(authBusiness.registerNewUser(payload))
            .rejects
            .toThrow(ConflictError);
    });

    it('deve lançar UnauthorizedError ao tentar logar com e-mail não cadastrado', async () => {
        (userRepository.findUserByEmail as jest.Mock).mockResolvedValue(null);

        await expect(authBusiness.authenticateUser('naoexiste@email.com', '123456'))
            .rejects
            .toThrow('Credenciais inválidas.');
    });

    it('deve lançar UnauthorizedError ao tentar logar com senha incorreta', async () => {
        (userRepository.findUserByEmail as jest.Mock).mockResolvedValue({ 
            id_usuario: 1, email: 'a@a.com', senha_hash: 'hash' 
        });
        (bcryptUtils.comparePassword as jest.Mock).mockResolvedValue(false);

        await expect(authBusiness.authenticateUser('a@a.com', 'senha_errada'))
            .rejects
            .toThrow('Credenciais inválidas.');
    });

    it('deve retornar um token válido quando email e senha estão corretos', async () => {
        (userRepository.findUserByEmail as jest.Mock).mockResolvedValue({ 
            id_usuario: 1, email: 'a@a.com', senha_hash: 'hash' 
        });
        (bcryptUtils.comparePassword as jest.Mock).mockResolvedValue(true);
        (jwtUtils.generateToken as jest.Mock).mockReturnValue('TOKEN_VALIDO');

        const result = await authBusiness.authenticateUser('a@a.com', 'senha_certa');
        expect(result).toBe('TOKEN_VALIDO');
    });
});